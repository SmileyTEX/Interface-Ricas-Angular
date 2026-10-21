import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';
import { NotesService } from '../../core/services/notes.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="head">
      <h1>Preferências</h1>
      <p>Tune a aparência e o comportamento do seu repositório de notas.</p>
    </header>

    <section class="panel">
      <h2>Aparência</h2>

      <div class="row">
        <div class="row__text">
          <strong>Tema</strong>
          <span>Escolha entre o modo claro e escuro.</span>
        </div>
        <div class="segment" role="radiogroup" aria-label="Tema">
          <button
            type="button"
            role="radio"
            class="segment__btn"
            [class.is-active]="settings.theme() === 'light'"
            [attr.aria-checked]="settings.theme() === 'light'"
            (click)="settings.setTheme('light')"
          >
            ☀️ Claro
          </button>
          <button
            type="button"
            role="radio"
            class="segment__btn"
            [class.is-active]="settings.theme() === 'dark'"
            [attr.aria-checked]="settings.theme() === 'dark'"
            (click)="settings.setTheme('dark')"
          >
            🌙 Escuro
          </button>
        </div>
      </div>

      <div class="row">
        <div class="row__text">
          <strong>Visualização compacta</strong>
          <span>Reduz o espaçamento e mostra menos texto em cada card.</span>
        </div>
        <label class="switch">
          <input
            type="checkbox"
            [checked]="settings.compactView()"
            (change)="settings.setCompactView($any($event.target).checked)"
          />
          <span class="switch__track"><span class="switch__thumb"></span></span>
        </label>
      </div>

      <div class="row">
        <div class="row__text">
          <strong>Pré-visualização do conteúdo</strong>
          <span>Mostra o texto da nota dentro do card.</span>
        </div>
        <label class="switch">
          <input
            type="checkbox"
            [checked]="settings.showPreview()"
            (change)="settings.setShowPreview($any($event.target).checked)"
          />
          <span class="switch__track"><span class="switch__thumb"></span></span>
        </label>
      </div>
    </section>

    <section class="panel">
      <h2>Listagem</h2>
      <div class="row">
        <div class="row__text">
          <strong>Notas por página</strong>
          <span>De 3 a 12 cards por página.</span>
        </div>
        <div class="segment" role="radiogroup" aria-label="Notas por página">
          @for (size of pageSizes; track size) {
            <button
              type="button"
              role="radio"
              class="segment__btn"
              [class.is-active]="settings.pageSize() === size"
              [attr.aria-checked]="settings.pageSize() === size"
              (click)="settings.setPageSize(size)"
            >
              {{ size }}
            </button>
          }
        </div>
      </div>
    </section>

    <section class="panel">
      <h2>Dados</h2>
      <p class="muted">
        As notas ficam salvas apenas neste navegador (<code>localStorage</code>). Limpar os dados
        restaura o conteúdo de exemplo.
      </p>
      <div class="actions">
        <button class="btn btn--ghost" type="button" (click)="restore()">Restaurar exemplos</button>
        <button class="btn btn--danger" type="button" (click)="clear()">Apagar todas as notas</button>
        <button class="btn btn--ghost" type="button" (click)="resetSettings()">Restaurar preferências</button>
      </div>
    </section>
  `,
  styles: `
    .head {
      margin-bottom: 1.25rem;
    }

    .head h1 {
      font-size: 1.5rem;
    }

    .head p {
      color: var(--text-muted);
      font-size: 0.92rem;
      margin-top: 0.3rem;
    }

    .panel {
      padding: 1.25rem 1.4rem;
      margin-bottom: 1rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-sm);
    }

    .panel h2 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 0.9rem 0;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
    }

    .row:last-child {
      border-bottom: 0;
    }

    .row__text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .row__text strong {
      font-size: 0.92rem;
    }

    .row__text span {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .segment {
      display: inline-flex;
      background: var(--surface-3);
      border-radius: var(--radius-sm);
      padding: 0.2rem;
      gap: 0.15rem;
    }

    .segment__btn {
      padding: 0.35rem 0.75rem;
      font-size: 0.83rem;
      font-weight: 500;
      color: var(--text-muted);
      background: transparent;
      border: 0;
      border-radius: calc(var(--radius-sm) - 2px);
      cursor: pointer;
    }

    .segment__btn.is-active {
      background: var(--surface);
      color: var(--text);
      box-shadow: var(--shadow-sm);
    }

    .switch input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .switch__track {
      display: block;
      width: 42px;
      height: 24px;
      border-radius: 999px;
      background: var(--border-strong);
      position: relative;
      transition: background 0.18s ease;
      cursor: pointer;
    }

    .switch__thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.18s ease;
      box-shadow: var(--shadow-sm);
    }

    .switch input:checked + .switch__track {
      background: var(--primary);
    }

    .switch input:checked + .switch__track .switch__thumb {
      transform: translateX(18px);
    }

    .switch input:focus-visible + .switch__track {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    .muted {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.55;
    }

    code {
      background: var(--surface-3);
      padding: 0.05rem 0.3rem;
      border-radius: 4px;
      font-size: 0.85em;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .btn {
      padding: 0.55rem 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid transparent;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn--ghost {
      background: var(--surface-2);
      border-color: var(--border-strong);
      color: var(--text-muted);
    }

    .btn--ghost:hover {
      color: var(--text);
    }

    .btn--danger {
      background: var(--danger-soft);
      color: var(--danger);
    }

    .btn--danger:hover {
      background: var(--danger);
      color: #fff;
    }
  `,
})
export class SettingsComponent {
  protected readonly settings = inject(SettingsService);
  private readonly notes = inject(NotesService);
  private readonly toast = inject(ToastService);

  protected readonly pageSizes = [3, 6, 9, 12];

  protected restore(): void {
    if (confirm('Restaurar as notas de exemplo? Suas notas atuais serão substituídas.')) {
      this.notes.restoreAll();
      this.toast.show('Notas de exemplo restauradas.');
    }
  }

  protected clear(): void {
    if (confirm('Apagar todas as notas? Essa ação não pode ser desfeita.')) {
      this.notes.clearAll();
      this.toast.show('Todas as notas foram apagadas.', 'error');
    }
  }

  protected resetSettings(): void {
    this.settings.reset();
    this.toast.show('Preferências restauradas.');
  }
}