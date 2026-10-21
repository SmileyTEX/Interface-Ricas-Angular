import { computed, inject, Injectable, signal } from '@angular/core';
import { Note, NoteDraft } from '../models/note.model';
import { SEED_NOTES } from '../data/seed-notes';
import { StorageService } from './storage.service';
import { SettingsService } from './settings.service';

const KEY = 'tex.notes';

export type SortKey = 'updated' | 'created' | 'title';
export type LayoutFilter = 'all' | 'pinned' | 'favorites';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly storage = inject(StorageService);
  private readonly settings = inject(SettingsService);

  private readonly items = signal<Note[]>(this.storage.read<Note[]>(KEY, SEED_NOTES));

  readonly notes = this.items.asReadonly();

  // --- filtros controlled from UI ---
  readonly query = signal('');
  readonly activeTag = signal<string | null>(null);
  readonly layout = signal<LayoutFilter>('all');
  readonly sortKey = signal<SortKey>('updated');
  readonly page = signal(1);

  // --- resultados derivados ---
  readonly allTags = computed(() => {
    const counts = new Map<string, number>();
    for (const note of this.items()) {
      for (const tag of note.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  });

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const tag = this.activeTag();
    const layout = this.layout();

    let result = this.items().filter((note) => {
      if (layout === 'pinned' && !note.pinned) return false;
      if (layout === 'favorites' && !note.tags.includes('favorito')) return false;
      if (tag && !note.tags.includes(tag)) return false;
      if (!q) return true;
      const haystack = `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });

    const sort = this.sortKey();
    result = [...result].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title, 'pt-BR');
      if (sort === 'created') return b.createdAt.localeCompare(a.createdAt);
      return b.updatedAt.localeCompare(a.updatedAt);
    });

    return result;
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.settings.pageSize())));

  readonly paged = computed(() => {
    const size = this.settings.pageSize();
    const current = Math.min(this.page(), this.totalPages());
    const start = (current - 1) * size;
    return this.filtered().slice(start, start + size);
  });

  readonly stats = computed(() => {
    const notes = this.items();
    const words = notes.reduce((acc, n) => acc + n.content.split(/\s+/).filter(Boolean).length, 0);
    return {
      total: notes.length,
      pinned: notes.filter((n) => n.pinned).length,
      tags: new Set(notes.flatMap((n) => n.tags)).size,
      words,
    };
  });

  readonly recent = computed(() =>
    [...this.items()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
  );

  // --- comandos ---
  setQuery(value: string): void {
    this.query.set(value);
    this.page.set(1);
  }

  setTag(tag: string | null): void {
    this.activeTag.set(tag);
    this.page.set(1);
  }

  setLayout(layout: LayoutFilter): void {
    this.layout.set(layout);
    this.page.set(1);
  }

  setSort(key: SortKey): void {
    this.sortKey.set(key);
    this.page.set(1);
  }

  goToPage(page: number): void {
    this.page.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  getById(id: string): Note | undefined {
    return this.items().find((n) => n.id === id);
  }

  create(draft: NoteDraft): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: draft.title.trim() || 'Sem título',
      content: draft.content,
      tags: draft.tags,
      color: draft.color,
      pinned: draft.pinned,
      createdAt: now,
      updatedAt: now,
    };
    this.items.update((list) => [note, ...list]);
    this.persist();
    return note;
  }

  update(id: string, draft: NoteDraft): void {
    this.items.update((list) =>
      list.map((note) =>
        note.id === id
          ? {
              ...note,
              title: draft.title.trim() || note.title,
              content: draft.content,
              tags: draft.tags,
              color: draft.color,
              pinned: draft.pinned,
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    );
    this.persist();
  }

  togglePinned(id: string): void {
    this.items.update((list) =>
      list.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)),
    );
    this.persist();
  }

  toggleFavorite(id: string): void {
    this.items.update((list) =>
      list.map((note) => {
        if (note.id !== id) return note;
        const has = note.tags.includes('favorito');
        return {
          ...note,
          tags: has ? note.tags.filter((t) => t !== 'favorito') : [...note.tags, 'favorito'],
          updatedAt: new Date().toISOString(),
        };
      }),
    );
    this.persist();
  }

  remove(id: string): void {
    this.items.update((list) => list.filter((note) => note.id !== id));
    this.persist();
  }

  restoreAll(): void {
    this.items.set([...SEED_NOTES]);
    this.persist();
  }

  clearAll(): void {
    this.items.set([]);
    this.persist();
  }

  private persist(): void {
    this.storage.write(KEY, this.items());
  }
}