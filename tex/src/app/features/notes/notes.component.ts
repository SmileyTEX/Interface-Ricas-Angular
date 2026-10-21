import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NotesService, SortKey, LayoutFilter } from '../../core/services/notes.service';
import { SettingsService } from '../../core/services/settings.service';
import { ToastService } from '../../core/services/toast.service';
import { Note } from '../../core/models/note.model';
import { NoteCardComponent } from '../../shared/ui/note-card.component';
import { NoteEditorComponent } from '../../shared/ui/note-editor.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';

@Component({
  selector: 'app-notes',
  imports: [NoteCardComponent, NoteEditorComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="toolbar">
      <div class="toolbar__search">
        <span class="toolbar__icon" aria-hidden="true">🔍</span>
        <input
          class="toolbar__input"
          type="search"
          placeholder="Buscar por título, conteúdo ou tag..."
          aria-label="Buscar notas"
          [value]="notes.query()"
          (input)="notes.setQuery($any($event.target).value)"
        />
        @if (notes.query()) {
          <button class="toolbar__clear" type="button" aria-label="Limpar busca" (click)="notes.setQuery('')">
            &times;
          </button>
        }
      </div>

      <div class="toolbar__actions">
        <label class="select">
          <span class="sr-only">Ordenar por</span>
          <select [value]="notes.sortKey()" (change)="notes.setSort($any($event.target).value)">
            <option value="updated">Modificação</option>
            <option value="created">Criação</option>
            <option value="title">Título</option>
          </select>
        </label>
        <button class="btn btn--primary" type="button" (click)="openCreate()">+ Nova nota</button>
      </div>
    </header>

    <nav class="tabs" aria-label="Filtros">
      @for (item of layouts; track item.value) {
        <button
          type="button"
          class="tab"
          [class.is-active]="notes.layout() === item.value"
          [attr.aria-pressed]="notes.layout() === item.value"
          (click)="notes.setLayout(item.value)"
        >
          {{ item.label }}
        </button>
      }
      <span class="tabs__spacer"></span>
      @if (notes.activeTag()) {
        <button class="tab tab--tag" type="button" (click)="notes.setTag(null)">
          #{{ notes.activeTag() }} &times;
        </button>
      }
    </nav>

    @if (notes.allTags().length) {
      <div class="tagbar">
        @for (item of notes.allTags(); track item.tag) {
          <button
            type="button"
            class="tagbar__item"
            [class.is-active]="notes.activeTag() === item.tag"
            (click)="notes.setTag(notes.activeTag() === item.tag ? null : item.tag)"
          >
            #{{ item.tag }} <small>{{ item.count }}</small>
          </button>
        }
      </div>
    }

    <p class="result-count">
      {{ notes.filtered().length }} {{ notes.filtered().length === 1 ? 'nota encontrada' : 'notas encontradas' }}
      @if (notes.totalPages() > 1) {
        · página {{ notes.page() }} de {{ notes.totalPages() }}
      }
    </p>

    @if (notes.paged().length) {
      <div class="cards" [class.cards--compact]="settings.compactView()">
        @for (note of notes.paged(); track note.id) {
          <app-note-card
            [note]="note"
            [preview]="settings.showPreview()"
            [compact]="settings.compactView()"
            (pin)="togglePin($event)"
            (favorite)="toggleFavorite($event)"
            (edit)="openEdit($event)"
            (remove)="confirmRemove($event)"
            (tagSelected)="notes.setTag($event)"
          />
        }
      </div>

      @if (notes.totalPages() > 1) {
        <nav class="pager" aria-label="Paginação">
          <button class="pager__btn" type="button" [disabled]="notes.page() === 1" (click)="notes.goToPage(notes.page() - 1)">
            ← Anterior
          </button>
          @for (p of pageNumbers(); track p) {
            <button
              class="pager__btn pager__btn--num"
              type="button"
              [class.is-active]="notes.page() === p"
              (click)="notes.goToPage(p)"
            >
              {{ p }}
            </button>
          }
          <button
            class="pager__btn"
            type="button"
            [disabled]="notes.page() === notes.totalPages()"
            (click)="notes.goToPage(notes.page() + 1)"
          >
            Próxima →
          </button>
        </nav>
      }
    } @else {
      <app-empty-state
        icon="🗂️"
        title="Nada por aqui"
        [description]="emptyDescription()"
      >
        <button class="btn btn--primary" type="button" (click)="openCreate()">Criar a primeira nota</button>
      </app-empty-state>
    }

    @if (editorOpen()) {
      <app-note-editor [note]="editingNote()" (closed)="closeEditor()" (saved)="closeEditor()" />
    }
  `,
  styles: `
    .toolbar {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .toolbar__search {
      position: relative;
      min-width: 0;
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 220px;
    }

    .toolbar__icon {
      position: absolute;
      left: 0.75rem;
      font-size: 0.9rem;
      pointer-events: none;
    }

    .toolbar__input {
      width: 100%;
      padding: 0.65rem 2.2rem 0.65rem 2.2rem;
      font: inherit;
      font-size: 0.92rem;
      color: var(--text);
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sm);
    }

    .toolbar__input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent);
    }

    .toolbar__clear {
      position: absolute;
      right: 0.5rem;
      border: 0;
      background: transparent;
      color: var(--text-soft);
      font-size: 1.2rem;
      cursor: pointer;
      line-height: 1;
    }

    .toolbar__actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .select select {
      font: inherit;
      font-size: 0.88rem;
      padding: 0.6rem 0.7rem;
      color: var(--text);
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sm);
      cursor: pointer;
    }

    .btn {
      padding: 0.6rem 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid transparent;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .btn--primary {
      background: var(--primary);
      color: var(--on-primary);
    }

    .btn--primary:hover {
      background: var(--primary-hover);
    }

    .tabs {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .tabs__spacer {
      flex: 1;
    }

    .tab {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-muted);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 999px;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    }

    .tab:hover {
      color: var(--text);
      border-color: var(--border-strong);
    }

    .tab.is-active {
      background: var(--primary);
      border-color: var(--primary);
      color: var(--on-primary);
    }

    .tab--tag {
      background: var(--primary-soft);
      color: var(--primary);
      border-color: color-mix(in srgb, var(--primary) 35%, transparent);
    }

    .tagbar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.75rem;
    }

    .tagbar__item {
      padding: 0.25rem 0.6rem;
      font-size: 0.78rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      color: var(--text-muted);
      cursor: pointer;
    }

    .tagbar__item small {
      color: var(--text-soft);
      margin-left: 0.2rem;
    }

    .tagbar__item:hover {
      border-color: var(--border-strong);
      color: var(--text);
    }

    .tagbar__item.is-active {
      background: var(--primary-soft);
      border-color: color-mix(in srgb, var(--primary) 40%, transparent);
      color: var(--primary);
    }

    .result-count {
      margin-top: 0.9rem;
      font-size: 0.8rem;
      color: var(--text-soft);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
      gap: 1rem;
      margin-top: 0.75rem;
      align-items: start;
    }

    .pager {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.3rem;
      margin-top: 1.5rem;
      flex-wrap: wrap;
    }

    .pager__btn {
      padding: 0.4rem 0.75rem;
      font-size: 0.84rem;
      font-weight: 500;
      color: var(--text-muted);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
    }

    .pager__btn:hover:not(:disabled) {
      color: var(--text);
      border-color: var(--border-strong);
    }

    .pager__btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .pager__btn.is-active {
      background: var(--primary);
      border-color: var(--primary);
      color: var(--on-primary);
    }
  `,
})
export class NotesComponent {
  protected readonly notes = inject(NotesService);
  protected readonly settings = inject(SettingsService);
  private readonly toast = inject(ToastService);

  protected readonly layouts: { value: LayoutFilter; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'pinned', label: '📌 Fixadas' },
    { value: 'favorites', label: '★ Favoritas' },
  ];

  protected readonly editorOpen = signal(false);
  protected readonly editingNote = signal<Note | null>(null);

  constructor() {
    // Atalho: /notas?nova=1 abre o editor de nova nota direto.
    if (new URLSearchParams(window.location.search).get('nova') === '1') {
      this.openCreate();
    }
  }

  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.notes.totalPages() }, (_, i) => i + 1),
  );

  protected readonly emptyDescription = computed(() =>
    this.notes.query() || this.notes.activeTag()
      ? 'Nenhuma nota corresponde aos filtros atuais. Tente outra busca ou limpe os filtros.'
      : 'Você ainda não tem notas. Comece criando a primeira.',
  );


  protected openCreate(): void {
    this.editingNote.set(null);
    this.editorOpen.set(true);
  }

  protected openEdit(id: string): void {
    this.editingNote.set(this.notes.getById(id) ?? null);
    this.editorOpen.set(true);
  }

  protected closeEditor(): void {
    this.editorOpen.set(false);
    this.editingNote.set(null);
  }

  protected togglePin(id: string): void {
    const note = this.notes.getById(id);
    this.notes.togglePinned(id);
    this.toast.show(note?.pinned ? 'Nota desafixada.' : 'Nota fixada.');
  }

  protected toggleFavorite(id: string): void {
    const note = this.notes.getById(id);
    this.notes.toggleFavorite(id);
    this.toast.show(
      note?.tags.includes('favorito') ? 'Removida dos favoritos.' : 'Adicionada aos favoritos.',
      'info',
    );
  }

  protected confirmRemove(id: string): void {
    const note = this.notes.getById(id);
    if (!note) return;
    if (confirm(`Excluir a nota "${note.title}"? Essa ação não pode ser desfeita.`)) {
      this.notes.remove(id);
      this.toast.show('Nota excluída.', 'error');
    }
  }
}