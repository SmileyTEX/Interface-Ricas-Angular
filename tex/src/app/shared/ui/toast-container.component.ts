import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-stack" role="status" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast toast--' + toast.type">
          <span class="toast__icon" aria-hidden="true">
            @if (toast.type === 'success') {
              &#10003;
            } @else if (toast.type === 'error') {
              !
            } @else {
              i
            }
          </span>
          <span class="toast__msg">{{ toast.message }}</span>
          <button class="toast__close" type="button" aria-label="Fechar aviso" (click)="toastService.dismiss(toast.id)">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-stack {
      position: fixed;
      right: 1.25rem;
      bottom: 1.25rem;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      max-width: min(360px, calc(100vw - 2rem));
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.75rem 0.9rem;
      border-radius: var(--radius);
      background: var(--surface);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
      animation: fade-in-up 0.2s ease;
    }

    .toast__icon {
      display: grid;
      place-items: center;
      width: 22px;
      height: 22px;
      flex: none;
      border-radius: 50%;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--on-primary);
      background: var(--success);
    }

    .toast--error .toast__icon {
      background: var(--danger);
    }

    .toast--info .toast__icon {
      background: var(--primary);
    }

    .toast__msg {
      flex: 1;
      font-size: 0.9rem;
      color: var(--text);
    }

    .toast__close {
      border: 0;
      background: transparent;
      color: var(--text-soft);
      font-size: 1.15rem;
      line-height: 1;
      cursor: pointer;
      padding: 0 0.15rem;
    }

    .toast__close:hover {
      color: var(--text);
    }
  `,
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
}