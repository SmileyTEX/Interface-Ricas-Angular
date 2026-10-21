import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <div class="empty__icon" aria-hidden="true">{{ icon() }}</div>
      <h3 class="empty__title">{{ title() }}</h3>
      @if (description()) {
        <p class="empty__desc">{{ description() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 3rem 1.5rem;
      text-align: center;
      color: var(--text-muted);
    }

    .empty__icon {
      font-size: 2.4rem;
      line-height: 1;
      margin-bottom: 0.35rem;
      filter: grayscale(0.15);
    }

    .empty__title {
      font-size: 1.05rem;
      color: var(--text);
    }

    .empty__desc {
      font-size: 0.9rem;
      max-width: 42ch;
    }
  `,
})
export class EmptyStateComponent {
  readonly icon = input('📭');
  readonly title = input.required<string>();
  readonly description = input('');
}