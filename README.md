# Tex — Repositório de Notas

> Aplicação web em Angular 21 usada como **repertório pessoal de notas**: um lugar único para guardar aprendizados, referências de código e trechos de texto, com busca instantânea, tags, favoritos e painel de estatísticas.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Licença](https://img.shields.io/badge/licença-MIT-green)

---

## Índice

1. [O que é o Tex](#o-que-é-o-tex)
2. [Funcionalidades](#funcionalidades)
3. [Tecnologias](#tecnologias)
4. [Como executar](#como-executar)
5. [Guia de uso](#guia-de-uso)
6. [Estrutura do projeto](#estrutura-do-projeto)
7. [Arquitetura e decisões técnicas](#arquitetura-e-decisões-técnicas)
8. [Testes](#testes)
9. [Personalização](#personalização)
10. [FAQ](#faq)

---

## O que é o Tex

O **Tex** nasceu como um projeto da disciplina *Interface Ricas* (TADS). A ideia central é
transformar um "repositório de notas" — algo que muita gente mantém espalhado em arquivos
`.md`, bloco de notas do celular ou mensageiros — em uma aplicação real, navegável e
persistente.

Cada nota tem:

| Campo | Descrição |
| --- | --- |
| **Título** | Identificação curta e direta do assunto |
| **Conteúdo** | Texto livre, com quebras de linha preservadas |
| **Tags** | Classificação livre (ex.: `angular`, `boas-praticas`, `css`) |
| **Cor** | Identidade visual rápida (5 cores) |
| **Fixada** | Nota que sobe para o topo e aparece no filtro "Fixadas" |
| **Datas** | Criação e última modificação |

O app já vem com **12 notas de exemplo** reais sobre Angular, arquitetura, CSS, TypeScript,
Git, acessibilidade, performance e produtividade — assim dá para testar tudo sem digitar nada.

---

## Funcionalidades

### 🔍 Busca instantânea
Filtro por título, conteúdo **e** tags enquanto você digita. Combina com todos os outros filtros.

### 🏷️ Tags com contagem
As tags são extraídas automaticamente de todas as notas e ordenadas por frequência. Clique em
uma tag para filtrar; clique de novo para desmarcar.

### ⭐ Favoritos
A estrela no card adiciona/remove a tag `favorito`, que alimenta o filtro "Favoritas".

### 📌 Fixar notas
O alfinete marca notas importantes. Notas fixadas ganham destaque e viram filtro próprio.

### 🎨 Cores por nota
Cada nota pode ter uma cor de identificação, aplicada como barra lateral no card.

### 🧭 Painel (Dashboard)
Saudação por período do dia, estatísticas (total de notas, fixadas, tags, palavras escritas),
lista das notas atualizadas recentemente, tags mais usadas e dicas de uso.

### ⚙️ Preferências
- Tema **claro** e **escuro** (também alternável pelo botão no topo)
- Visualização **compacta** dos cards
- **Pré-visualização** do conteúdo on/off
- **Notas por página** (3, 6, 9 ou 12)
- Gerenciamento de dados: restaurar exemplos, apagar tudo, restaurar preferências

### 🔔 Notificações (toasts)
Cada ação importante confirma o resultado: "Nota criada", "Nota fixada", "Nota excluída"…

### 🧭 Paginação
Com contador de resultados e navegação entre páginas, respeitando o tamanho de página escolhido.

### 💾 Persistência local
Tudo é salvo em `localStorage` — sem servidor, sem cadastro, sem rede. As notas continuam lá
quando você fecha o navegador.

### ♿ Acessibilidade
Navegação por teclado, `aria-label` em botões só com ícone, `aria-pressed` em alternadores,
foco visível, `prefers-reduced-motion` respeitado e estados semânticos (`role`, `aria-live`).

---

## Tecnologias

- **Angular 21** — components standalone, signals, `provideZonelessChangeDetection`
- **TypeScript 5.9** — modo strict
- **RxJS 7.8** — não é usado diretamente: todo estado é reativo por signals
- **Vitest** — runner de testes
- **CSS puro** — design tokens com custom properties, sem frameworks externos

---

## Como executar

### Pré-requisitos
- Node.js 20+ (testado com Node 24)
- npm 10+

### Instalação e execução

```bash
# dentro da pasta do projeto
npm install
npm start
```

Abra **http://localhost:4200**.

### Outros comandos

```bash
npm run build   # build de produção em dist/
npm run watch   # build contínuo em modo desenvolvimento
npm test        # testes unitários (Vitest)
```

> O projeto fica na subpasta `tex/` do repositório. Todos os comandos acima são executados a
> partir dela.

---

## Guia de uso

### Criar uma nota
1. Clique em **+ Nova nota** (canto superior direito da tela de notas).
2. Preencha título e conteúdo.
3. Digite as tags separadas por vírgula: `angular, tipografia, css` viram as tags `angular`, `tipografia` e `css`.
4. Escolha uma cor e, se quiser, marque "Fixar no topo da lista".
5. Clique em **Criar nota**.

### Editar
Passe o mouse sobre o card e clique no ícone de lápis (✎). Só o título pode ficar vazio — nesse
caso o título anterior é mantido.

### Fixar e favoritar
- 📌 fixa a nota (filtro "Fixadas")
- ★ adiciona a tag `favorito` (filtro "Favoritas")

### Filtrar
- **Busca**: digite no campo superior.
- **Abas**: `Todas`, `📌 Fixadas`, `★ Favoritas`.
- **Tags**: clique em uma tag na barra de tags ou diretamente em uma tag dentro do card.

Os filtros se combinam: buscar "css" dentro da aba "Fixadas" mostra apenas notas fixadas
que mencionam CSS.

### Excluir
Passe o mouse sobre o card e clique em 🗑. Há uma confirmação antes.

### Temas
Use o botão 🌙/☀️ no topo do canto direito, ou vá em **Preferências → Tema**.
Você também pode forçar um tema pela URL: `http://localhost:4200/notas?theme=dark`.

### Atalhos de URL

| URL | Efeito |
| --- | --- |
| `/notas?theme=dark` | Abre já no tema escuro |
| `/notas?theme=light` | Abre no tema claro |
| `/notas?nova=1` | Abre direto o editor de nova nota |

### Painel
Clique em **Painel** no menu superior para ver as estatísticas gerais e as notas recentes.

---

## Estrutura do projeto

```
Interface-Ricas-Angular/
├── README.md                  ← este arquivo
└── tex/                      ← a aplicação Angular
    ├── angular.json
    ├── package.json
    └── src/
        ├── index.html
        ├── main.ts
        ├── styles.css         ← design tokens (variáveis CSS) + estilos globais
        └── app/
            ├── app.ts / app.html / app.css   ← shell: topbar, navegação, footer
            ├── app.routes.ts                 ← rotas com lazy loading
            ├── app.config.ts                 ← providers (router, zoneless)
            ├── core/
            │   ├── models/
            │   │   ├── note.model.ts
            │   │   └── settings.model.ts
            │   ├── data/
            │   │   └── seed-notes.ts         ← as 12 notas de exemplo
            │   └── services/
            │       ├── storage.service.ts     ← wrapper de localStorage
            │       ├── notes.service.ts       ← estado + filtros + CRUD
            │       ├── settings.service.ts    ← tema e preferências
            │       └── toast.service.ts        ← notificações
            ├── features/                       ← uma pasta por feature
            │   ├── dashboard/dashboard.component.ts
            │   ├── notes/notes.component.ts
            │   └── settings/settings.component.ts
            └── shared/ui/                      ← componentes reutilizáveis
                ├── note-card.component.ts
                ├── note-editor.component.ts
                ├── empty-state.component.ts
                └── toast-container.component.ts
```

### Rotas

| Rota | Tela | Título da aba |
| --- | --- | --- |
| `/` | Painel | Tex — Painel |
| `/notas` | Repositório de notas | Tex — Minhas notas |
| `/preferencias` | Preferências | Tex — Preferências |
| `**` | Redireciona para `/` | — |

---

## Arquitetura e decisões técnicas

### Estado com signals
Todo o estado é reativo por `signal`/`computed`, sem `BehaviorSubject` e sem `zone.js`.
Exemplo do encadeamento usado na listagem:

```
notes (signal)  ──►  filtered (computed)  ──►  paged (computed)  ──►  template
     │                    ▲
     │                    │
  query / activeTag /  sortKey / layout
        (signals)
```

Como `filtered` e `paged` são `computed`, o Angular só recalcula o que mudou — e não há
`markForCheck` manual em lugar nenhum.

### Zona-less
`provideZonelessChangeDetection()` elimina o `zone.js`. A detecção de mudança acontece por
componentes marcados como *dirty* pelos signals, o que reduz o custo de execução.

### Separação por feature
Cada pasta em `features/` é uma unidade vertical: componente, template e estilos da própria
tela. `shared/ui/` guarda apenas o que é reutilizado por mais de uma feature.

### Persistência
`StorageService` encapsula o `localStorage` com `try/catch` — assim o app continua funcionando
em modo anônimo/privado, onde o acesso ao storage pode lançar erro.

Chaves usadas:

| Chave | Conteúdo |
| --- | --- |
| `tex.notes` | Array de notas |
| `tex.settings` | Preferências e tema |

### Lazy loading
Cada rota carrega seu componente sob demanda (`loadComponent`), generating chunks separados —
o `main.js` inicial fica pequeno (~8 kB).

---

## Testes

```bash
npm test
```

Cobertura atual — **10 testes** em 2 arquivos:

- `app.spec.ts` — criação do app e renderização da marca
- `notes.service.spec.ts` — carga inicial, busca por texto, filtro por tag, criação de nota,
  fixação, favoritos, remoção e paginação

---

## Personalização

### Trocar as cores do tema
Edite as custom properties no topo de `src/styles.css`:

```css
:root {
  --primary: #4f46e5;   /* cor de destaque */
  --bg: #f5f6fa;        /* fundo da página */
  --surface: #ffffff;   /* fundo dos cards */
  --text: #171b28;      /* texto principal */
}
```

O tema escuro redefine as mesmas variáveis dentro de `:root[data-theme='dark']`.

### Trocar as notas de exemplo
Edite `src/app/core/data/seed-notes.ts`. Cada item segue a interface `Note`:

```ts
{
  id: 'n-minha-nota',
  title: 'Minha nota',
  content: 'Conteúdo...',
  tags: ['exemplo'],
  color: 'blue',   // amber | blue | green | purple | rose
  pinned: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
```

### Adicionar uma rota nova
1. Crie `src/app/features/minha-feature/minha-feature.component.ts`.
2. Registre em `src/app/app.routes.ts`:

```ts
{
  path: 'minha-feature',
  title: 'Tex — Minha feature',
  loadComponent: () =>
    import('./features/minha-feature/minha-feature.component').then((m) => m.MinhaFeatureComponent),
}
```

### Trocar o armazenamento por uma API
Implemente a mesma interface do `StorageService` (ou crie um `NotesApiService`) e troque a
injeção em `NotesService`. O restante do app não precisa mudar.

---

## FAQ

**Onde os dados ficam salvos?**
No `localStorage` do navegador, nas chaves `tex.notes` e `tex.settings`. Limpar os dados do
navegador apaga as notas — use **Preferências → Restaurar exemplos** para voltar ao conteúdo
inicial.

**Preciso de servidor?**
Não. Tudo roda no navegador, inclusive o `npm start`.

**As notas aparecem em outro dispositivo?**
Não. Como a persistência é local, cada navegador tem o seu próprio conjunto de notas.

**Como faço deploy?**
`npm run build` gera a pasta `dist/tex/`. É uma SPA estática — pode ser publicada em GitHub
Pages, Netlify, Vercel ou qualquer servidor de arquivos estáticos. Para usar em subpasta,
ajuste o `<base href="/">` em `src/index.html`.

**Posso trocar a cor de cada card?**
Sim — a cor faz parte da nota e é editável no modal de criação/edição.

---

## Licença

MIT. Use livremente para estudo, trabalho ou portfólio.