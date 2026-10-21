import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotesService } from '../../core/services/notes.service';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <div>
        <p class="hero__eyebrow">Painel</p>
        <h1 class="hero__title">{{ greeting() }}</h1>
        <p class="hero__sub">
          Você tem {{ stats().total }} notas guardadas, {{ stats().pinned }} fixadas e
          {{ stats().tags }} tags em uso.
        </p>
      </div>
      <a class="btn btn--primary" routerLink="/notas">Abrir minhas notas →</a>
    </section>

    <div class="stats">
      @for (card of statCards(); track card.label) {
        <article class="stat">
          <span class="stat__icon" aria-hidden="true">{{ card.icon }}</span>
          <div>
            <strong class="stat__value">{{ card.value }}</strong>
            <span class="stat__label">{{ card.label }}</span>
          </div>
        </article>
      }
    </div>

    <div class="grid">
      <section class="panel">
        <header class="panel__head">
          <h2>Atualizadas recentemente</h2>
          <a routerLink="/notas" class="link">ver todas</a>
        </header>
        <ul class="list">
          @for (note of notes.recent(); track note.id) {
            <li class="list__item">
              <span class="dot" [attr.data-color]="note.color" aria-hidden="true"></span>
              <div class="list__text">
                <strong>{{ note.title }}</strong>
                <small>{{ note.updatedAt | date: 'dd MMM yyyy, HH:mm' }}</small>
              </div>
              @if (note.pinned) {
                <span class="badge" title="Fixada">📌</span>
              }
            </li>
          } @empty {
            <li class="list__empty">Nenhuma nota ainda.</li>
          }
        </ul>
      </section>

      <section class="panel">
        <header class="panel__head">
          <h2>Tags mais usadas</h2>
        </header>
        <div class="tags">
          @for (item of notes.allTags().slice(0, 12); track item.tag) {
            <span class="tag-chip">
              #{{ item.tag }}
              <small>{{ item.count }}</small>
            </span>
          } @empty {
            <p class="list__empty">Crie notas para ver as tags.</p>
          }
        </div>
      </section>
    </div>

    <section class="tips">
      <h2>Dicas rápidas</h2>
      <div class="tips__grid">
        <article class="tip">
          <span class="tip__emoji" aria-hidden="true">🔍</span>
          <h3>Busque em tempo real</h3>
          <p>A busca no topo filtra por título, conteúdo e tags ao mesmo tempo.</p>
        </article>
        <article class="tip">
          <span class="tip__emoji" aria-hidden="true">🏷️</span>
          <h3>Organize por tags</h3>
          <p>Clique em uma tag no card ou na lista de tags para filtrar instantly.</p>
        </article>
        <article class="tip">
          <span class="tip__emoji" aria-hidden="true">⭐</span>
          <h3>Favorite o que importa</h3>
          <p>A estrela adiciona a tag <code>favorito</code> e cria um filtro dedicado.</p>
        </article>
        <article class="tip">
          <span class="tip__emoji" aria-hidden="true">💾</span>
          <h3>Tudo salvo no navegador</h3>
          <p>Suas notas ficam em <code>localStorage</code> — sem servidor, sem cadastro.</p>
        </article>
      </div>
    </section>
  `,
  styles: `
    .hero {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
      padding: 1.75rem;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--purple) 70%, var(--primary)));
      color: #fff;
      box-shadow: var(--shadow);
    }

    .hero__eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 0.72rem;
      opacity: 0.85;
    }

    .hero__title {
      font-size: clamp(1.6rem, 3.4vw, 2.2rem);
      margin-top: 0.25rem;
    }

    .hero__sub {
      margin-top: 0.4rem;
      font-size: 0.95rem;
      opacity: 0.92;
      max-width: 52ch;
    }

    .btn {
      display: inline-block;
      padding: 0.65rem 1.15rem;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 0.92rem;
      white-space: nowrap;
    }

    .btn--primary {
      background: #fff;
      color: var(--primary);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 1rem;
      margin-top: 1.25rem;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1.05rem 1.15rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-sm);
    }

    .stat__icon {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      flex: none;
      font-size: 1.2rem;
      border-radius: var(--radius-sm);
      background: var(--primary-soft);
    }

    .stat__value {
      display: block;
      font-size: 1.35rem;
      line-height: 1.1;
    }

    .stat__label {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .grid {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 1rem;
      margin-top: 1.25rem;
    }

    .panel {
      padding: 1.15rem 1.25rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-sm);
    }

    .panel__head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.85rem;
    }

    .panel__head h2 {
      font-size: 1rem;
    }

    .link {
      font-size: 0.82rem;
      color: var(--primary);
    }

    .list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .list__item {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.55rem 0;
      border-bottom: 1px solid var(--border);
    }

    .list__item:last-child {
      border-bottom: 0;
    }

    .list__text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .list__text strong {
      font-size: 0.9rem;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .list__text small {
      font-size: 0.75rem;
      color: var(--text-soft);
    }

    .list__empty {
      color: var(--text-soft);
      font-size: 0.88rem;
      padding: 0.6rem 0;
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex: none;
      background: var(--primary);
    }

    .dot[data-color='amber'] {
      background: var(--amber);
    }
    .dot[data-color='blue'] {
      background: var(--blue);
    }
    .dot[data-color='green'] {
      background: var(--green);
    }
    .dot[data-color='purple'] {
      background: var(--purple);
    }
    .dot[data-color='rose'] {
      background: var(--rose);
    }

    .badge {
      font-size: 0.85rem;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .tag-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.28rem 0.6rem;
      font-size: 0.8rem;
      border-radius: 999px;
      background: var(--surface-3);
      color: var(--text-muted);
    }

    .tag-chip small {
      font-size: 0.7rem;
      color: var(--text-soft);
    }

    .tips {
      margin-top: 1.5rem;
    }

    .tips h2 {
      font-size: 1rem;
      margin-bottom: 0.75rem;
    }

    .tips__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 1rem;
    }

    .tip {
      padding: 1.1rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
    }

    .tip__emoji {
      font-size: 1.35rem;
    }

    .tip h3 {
      font-size: 0.95rem;
      margin: 0.45rem 0 0.3rem;
    }

    .tip p {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    code {
      background: var(--surface-3);
      padding: 0.05rem 0.3rem;
      border-radius: 4px;
      font-size: 0.85em;
    }

    @media (max-width: 860px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class DashboardComponent {
  protected readonly notes = inject(NotesService);
  protected readonly settings = inject(SettingsService);

  protected readonly stats = this.notes.stats;

  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia!';
    if (hour < 18) return 'Boa tarde!';
    return 'Boa noite!';
  });

  protected readonly statCards = computed(() => {
    const s = this.stats();
    return [
      { icon: '📄', label: 'Notas guardadas', value: s.total },
      { icon: '📌', label: 'Fixadas', value: s.pinned },
      { icon: '🏷️', label: 'Tags distintas', value: s.tags },
      { icon: '📝', label: 'Palavras escritas', value: s.words },
    ];
  });
}