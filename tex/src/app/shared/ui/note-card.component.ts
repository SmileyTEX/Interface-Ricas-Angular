import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Note } from '../../core/models/note.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-note-card',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card" [class.card--compact]="compact()" [attr.data-color]="note().color">
      <span class="card__bar" aria-hidden="true"></span>

      <header class="card__head">
        <h3 class="card__title">{{ note().title }}</h3>
        <div class="card__actions">
          <button
            type="button"
            class="icon-btn"
            [class.is-on]="note().pinned"
            [attr.aria-pressed]="note().pinned"
            [attr.aria-label]="note().pinned ? 'Desafixar nota' : 'Fixar nota'"
            (click)="pin.emit(note().id)"
          >
            📌
          </button>
          <button
            type="button"
            class="icon-btn"
            [class.is-on]="isFavorite()"
            [attr.aria-pressed]="isFavorite()"
            [attr.aria-label]="isFavorite() ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
            (click)="favorite.emit(note().id)"
          >
            {{ isFavorite() ? '★' : '☆' }}
          </button>
          <button
            type="button"
            class="icon-btn"
            aria-label="Editar nota"
            (click)="edit.emit(note().id)"
          >
            ✎
          </button>
          <button
            type="button"
            class="icon-btn icon-btn--danger"
            aria-label="Excluir nota"
            (click)="remove.emit(note().id)"
          >
            🗑
          </button>
        </div>
      </header>

      @if (preview()) {
        <p class="card__content">{{ note().content }}</p>
      }

      <footer class="card__foot">
        <div class="card__tags">
          @for (tag of note().tags.slice(0, 4); track tag) {
            <button type="button" class="tag" (click)="tagSelected.emit(tag)">#{{ tag }}</button>
          }
          @if (note().tags.length > 4) {
            <span class="tag tag--more">+{{ note().tags.length - 4 }}</span>
          }
        </div>
        <time class="card__date" [attr.datetime]="note().updatedAt">
          {{ note().updatedAt | date: 'dd MMM, HH:mm' }}
        </time>
      </footer>
    </article>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }

    .card {
      position: relative;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding: 1rem 1.1rem 0.9rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
      animation: fade-in-up 0.25s ease both;
    }

    .card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow);
      border-color: var(--border-strong);
    }

    .card__bar {
      position: absolute;
      inset: 0 auto 0 0;
      width: 4px;
      background: var(--accent, var(--primary));
    }

    .card[data-color='amber'] {
      --accent: var(--amber);
    }
    .card[data-color='blue'] {
      --accent: var(--blue);
    }
    .card[data-color='green'] {
      --accent: var(--green);
    }
    .card[data-color='purple'] {
      --accent: var(--purple);
    }
    .card[data-color='rose'] {
      --accent: var(--rose);
    }

    .card__head {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .card__title {
      font-size: 1.02rem;
      line-height: 1.35;
      word-break: break-word;
      padding-right: 0.25rem;
    }

    .card__actions {
      position: absolute;
      top: 0.55rem;
      right: 0.55rem;
      display: flex;
      gap: 0.15rem;
      padding: 0.15rem;
      border-radius: var(--radius-sm);
      background: color-mix(in srgb, var(--surface) 92%, transparent);
      backdrop-filter: blur(6px);
      box-shadow: var(--shadow-sm);
      opacity: 0;
      transform: translateY(-3px);
      transition: opacity 0.15s ease, transform 0.15s ease;
    }

    .card:hover .card__actions,
    .card:focus-within .card__actions {
      opacity: 1;
      transform: none;
    }

    .icon-btn {
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--text-soft);
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .icon-btn:hover {
      background: var(--surface-3);
      color: var(--text);
    }

    .icon-btn.is-on {
      color: var(--amber);
    }

    .icon-btn--danger:hover {
      background: var(--danger-soft);
      color: var(--danger);
    }

    .card__content {
      min-width: 0;
      overflow-wrap: anywhere;
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.55;
      white-space: pre-line;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card--compact {
      padding-block: 0.7rem;
    }

    .card--compact .card__content {
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }

    .card__foot {
      display: flex;
      flex-wrap: wrap;
      min-width: 0;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-top: auto;
      padding-top: 0.4rem;
      border-top: 1px dashed var(--border);
    }

    .card__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      min-width: 0;
    }

    .tag {
      border: 0;
      background: var(--surface-3);
      color: var(--text-muted);
      font-size: 0.72rem;
      padding: 0.15rem 0.45rem;
      border-radius: 999px;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .tag:hover {
      background: var(--primary-soft);
      color: var(--primary);
    }

    .tag--more {
      cursor: default;
    }

    .card__date {
      font-size: 0.72rem;
      color: var(--text-soft);
      white-space: nowrap;
    }
  `,
})
export class NoteCardComponent {
  readonly note = input.required<Note>();
  readonly preview = input(true);
  readonly compact = input(false);

  readonly pin = output<string>();
  readonly favorite = output<string>();
  readonly edit = output<string>();
  readonly remove = output<string>();
  readonly tagSelected = output<string>();

  protected readonly isFavorite = computed(() => this.note().tags.includes('favorito'));
}