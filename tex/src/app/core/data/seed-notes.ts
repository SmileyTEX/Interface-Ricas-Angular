import { Note } from '../models/note.model';

const days = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const SEED_NOTES: Note[] = [
  {
    id: 'n-angular-21',
    title: 'Angular 21: sinais em tudo',
    content:
      'No Angular 21 a CLI gera componentes com signals, control flow @if/@for e standalone por padrão.\n\nTrês mudanças que mudaram minha rotina:\n- Zone-less change detection: menos overhead e melhor previsibilidade.\n- Forms tipados com signal forms.\n- Vitest como runner de testes padrão, mais rápido que Karma.',
    tags: ['angular', 'frontend', 'destaque'],
    color: 'blue',
    pinned: true,
    createdAt: days(2),
    updatedAt: days(0),
  },
  {
    id: 'n-clean-arch',
    title: 'Arquitetura limpa porfeature',
    content:
      'Organizar por feature verticalmente reduz o acoplamento: cada pasta traz seus componentes, rotas e serviços.\n\nA regra prática: se um arquivo muda junto com outro o tempo todo, eles provavelmente pertencem à mesma pasta.',
    tags: ['arquitetura', 'boas-praticas'],
    color: 'purple',
    pinned: true,
    createdAt: days(5),
    updatedAt: days(1),
  },
  {
    id: 'n-css',
    title: 'CSS moderno: container queries',
    content:
      'Container queries resolvem de vez a responsividade de componentes reutilizáveis.\n\nCom @container o componente reage ao espaço disponível, não ao viewport. Isso permite o mesmo card funcionar numa coluna estreita ou numa grade larga.',
    tags: ['css', 'ui', 'frontend'],
    color: 'green',
    pinned: false,
    createdAt: days(9),
    updatedAt: days(9),
  },
  {
    id: 'n-typescript',
    title: 'TypeScript: tipos discriminados',
    content:
      'União discriminada com campo literal permite narrowing exato no switch, sem type assertions.\n\nÚtil para modelar estados de uma requisição: idle | loading | success | error, cada um com seus dados.',
    tags: ['typescript', 'boas-praticas'],
    color: 'amber',
    pinned: false,
    createdAt: days(12),
    updatedAt: days(4),
  },
  {
    id: 'n-git',
    title: 'Fluxo de trabalho com Git',
    content:
      'Commits pequenos e focados facilitam o revert. Escreva a mensagem no formato:\n\ntipo(escopo): descrição curta\n\nCorpo explicando o porquê, quando o porquê não for óbvio.',
    tags: ['git', 'produtividade'],
    color: 'rose',
    pinned: false,
    createdAt: days(20),
    updatedAt: days(20),
  },
  {
    id: 'n-acessibilidade',
    title: 'Acessibilidade não é opcional',
    content:
      'Checklist antes de entregar:\n- Navegação completa por teclado\n- Contraste mínimo de 4.5:1 no texto\n- Foco visível em elementos interativos\n- aria-label em botões só com ícone\n- Landmarks semânticos na página',
    tags: ['acessibilidade', 'ui', 'destaque'],
    color: 'blue',
    pinned: false,
    createdAt: days(30),
    updatedAt: days(15),
  },
  {
    id: 'n-rxjs',
    title: 'RxJS: quando não usar',
    content:
      'Sinais resolvem a maioria dos casos de estado local. RxJS continua útil para eventos externos, debounce, cancelamento e orquestração de requisições.\n\nSe é estado que a UI só lê, prefira signal.',
    tags: ['rxjs', 'angular'],
    color: 'green',
    pinned: false,
    createdAt: days(34),
    updatedAt: days(34),
  },
  {
    id: 'n-node',
    title: 'Node: scripts que economizam tempo',
    content:
      'Um script de 10 linhas que gera changelog e roda lint vale mais que meia hora manual toda semana.',
    tags: ['node', 'produtividade'],
    color: 'amber',
    pinned: false,
    createdAt: days(45),
    updatedAt: days(45),
  },
  {
    id: 'n-performance',
    title: 'Core Web Vitals de campo',
    content:
      'LCP carrega a impressão visual, INP mede a resposta a interação e CLS mede o salto de layout.\n\nMetas: LCP até 2.5s, INP até 200ms, CLS até 0.1.',
    tags: ['performance', 'frontend'],
    color: 'purple',
    pinned: false,
    createdAt: days(50),
    updatedAt: days(50),
  },
  {
    id: 'n-reuniao',
    title: 'Padrão de reunião que funciona',
    content:
      'Toda reunião começa com: objetivo em uma frase, decisões esperadas e prazo de cada entrega.\n\nTermine com um resumo escrito no mesmo dia, enquanto as impressões ainda estão frescas.',
    tags: ['carreira', 'produtividade'],
    color: 'rose',
    pinned: false,
    createdAt: days(60),
    updatedAt: days(60),
  },
  {
    id: 'n-sql',
    title: 'SQL: índices compound',
    content:
      'A ordem das colunas em um índice composto importa. Coloque primeiro a coluna usada na cláusula WHERE e depois a usada no ORDER BY.',
    tags: ['sql', 'backend'],
    color: 'blue',
    pinned: false,
    createdAt: days(70),
    updatedAt: days(70),
  },
  {
    id: 'n-docker',
    title: 'Docker sem complicação',
    content:
      'Multi-stage build: a primeira etapa compila, a segunda executa com apenas o necessário em produção.',
    tags: ['devops', 'backend'],
    color: 'green',
    pinned: false,
    createdAt: days(80),
    updatedAt: days(80),
  },
];