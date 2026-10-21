import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Note, NoteColor, NOTE_COLORS } from '../../core/models/note.model';
import { NotesService } from '../../core/services/notes.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-note-editor',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="onBackdrop($event)">
      <section class="modal" role="dialog" aria-modal="true" [attr.aria-label]="editing() ? 'Editar nota' : 'Nova nota'">
        <header class="modal__head">
          <h2>{{ editing() ? 'Editar nota' : 'Nova nota' }}</h2>
          <button type="button" class="icon-btn" aria-label="Fechar" (click)="closed.emit()">&times;</button>
        </header>

        <form class="modal__body" (ngSubmit)="submit()">
          <label class="field">
            <span class="field__label">Título</span>
            <input
              name="title"
              class="input"
              type="text"
              placeholder="Um título claro e específico"
              [ngModel]="title()" (ngModelChange)="title.set($event)"
              maxlength="120"
              autofocus
            />
          </label>

          <label class="field">
            <span class="field__label">Conteúdo</span>
            <textarea
              name="content"
              class="input input--area"
              rows="8"
              placeholder="Escreva o que quiser lembrar..."
              [ngModel]="content()" (ngModelChange)="content.set($event)"
            ></textarea>
          </label>

          <div class="field">
            <span class="field__label">Tags <small>(separe por vírgula)</small></span>
            <input
              name="tags"
              class="input"
              type="text"
              placeholder="angular, boas-praticas"
              [ngModel]="tagsInput()" (ngModelChange)="tagsInput.set($event)"
            />
          </div>

          <div class="field">
            <span class="field__label">Cor</span>
            <div class="swatches" role="radiogroup" aria-label="Cor da nota">
              @for (color of colors; track color) {
                <button
                  type="button"
                  class="swatch"
                  role="radio"
                  [attr.aria-checked]="color === selectedColor()"
                  [class.is-active]="color === selectedColor()"
                  [attr.data-color]="color"
                  [attr.aria-label]="'Cor ' + color"
                  (click)="selectedColor.set(color)"
                ></button>
              }
            </div>
          </div>

          <label class="check">
            <input type="checkbox" name="pinned" [ngModel]="pinned()" (ngModelChange)="pinned.set($event)" />
            <span>Fixar no topo da lista</span>
          </label>

          <footer class="modal__foot">
            <span class="hint">{{ wordCount() }} palavras</span>
            <div class="modal__foot-actions">
              <button type="button" class="btn btn--ghost" (click)="closed.emit()">Cancelar</button>
              <button type="submit" class="btn btn--primary">{{ editing() ? 'Salvar' : 'Criar nota' }}</button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  `,
  styles: `
    .overlay {
      position: fixed;
      inset: 0;
      z-index: 900;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: rgb(10 12 20 / 0.55);
      backdrop-filter: blur(3px);
      animation: fade-in-up 0.15s ease;
    }

    .modal {
      width: min(620px, 100%);
      max-height: 90dvh;
      overflow: auto;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
    }

    .modal__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.1rem 1.25rem;
      border-bottom: 1px solid var(--border);
    }

    .modal__head h2 {
      font-size: 1.1rem;
    }

    .icon-btn {
      border: 0;
      background: transparent;
      color: var(--text-soft);
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
      border-radius: var(--radius-sm);
      padding: 0 0.3rem;
    }

    .icon-btn:hover {
      background: var(--surface-3);
      color: var(--text);
    }

    .modal__body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.25rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .field__label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .field__label small {
      text-transform: none;
      letter-spacing: 0;
      font-weight: 400;
    }

    .input {
      width: 100%;
      padding: 0.6rem 0.75rem;
      font: inherit;
      font-size: 0.92rem;
      color: var(--text);
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sm);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent);
    }

    .input--area {
      resize: vertical;
      min-height: 140px;
      font-family: inherit;
      line-height: 1.55;
    }

    .swatches {
      display: flex;
      gap: 0.5rem;
    }

    .swatch {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      background: var(--amber);
    }

    .swatch[data-color='blue'] {
      background: var(--blue);
    }
    .swatch[data-color='green'] {
      background: var(--green);
    }
    .swatch[data-color='purple'] {
      background: var(--purple);
    }
    .swatch[data-color='rose'] {
      background: var(--rose);
    }

    .swatch.is-active {
      border-color: var(--text);
      transform: scale(1.08);
    }

    .check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-muted);
      cursor: pointer;
    }

    .modal__foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border);
    }

    .hint {
      font-size: 0.78rem;
      color: var(--text-soft);
    }

    .modal__foot-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.55rem 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid transparent;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }

    .btn--primary {
      background: var(--primary);
      color: var(--on-primary);
    }

    .btn--primary:hover {
      background: var(--primary-hover);
    }

    .btn--ghost {
      background: transparent;
      border-color: var(--border-strong);
      color: var(--text-muted);
    }

    .btn--ghost:hover {
      background: var(--surface-3);
      color: var(--text);
    }
  `,
})
export class NoteEditorComponent {
  private readonly notes = inject(NotesService);
  private readonly toast = inject(ToastService);

  readonly note = input<Note | null>(null);
  readonly closed = output<void>();
  readonly saved = output<void>();

  protected readonly colors = NOTE_COLORS;

  protected readonly title = signal('');
  protected readonly content = signal('');
  protected readonly tagsInput = signal('');
  protected readonly pinned = signal(false);
  protected readonly selectedColor = signal<NoteColor>('blue');

  constructor() {
    queueMicrotask(() => this.prefill());
  }

  protected readonly editing = computed(() => this.note() !== null);

  protected readonly wordCount = computed(
    () => this.content().split(/\s+/).filter(Boolean).length,
  );

  private prefill(): void {
    const note = this.note();
    if (!note) return;
    this.title.set(note.title);
    this.content.set(note.content);
    this.tagsInput.set(note.tags.join(', '));
    this.pinned.set(note.pinned);
    this.selectedColor.set(note.color);
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closed.emit();
  }

  protected submit(): void {
    const tags = [
      ...new Set(
        this.tagsInput()
          .split(',')
          .map((t) => t.trim().replace(/^#/, '').toLowerCase())
          .filter(Boolean),
      ),
    ];

    const draft = {
      title: this.title(),
      content: this.content(),
      tags,
      color: this.selectedColor(),
      pinned: this.pinned(),
    };

    const note = this.note();
    if (note) {
      this.notes.update(note.id, draft);
      this.toast.show('Nota atualizada.');
    } else {
      this.notes.create(draft);
      this.toast.show('Nota criada.');
    }
    this.saved.emit();
  }
}