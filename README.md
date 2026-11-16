# LifePulse

SPA de produtividade **front-end only** que reúne quatro pilares — **Foco (Pomodoro)**, **Hábitos**, **Tarefas (Kanban)** e **Anotações (Markdown)** — sob uma **Visão Geral** que resume o dia.

Interface dark em pt-BR, construída com React + Vite + Tailwind CSS e persistência em `localStorage`, com dados isolados por conta.

---

## Funcionalidades

- **Autenticação** — cadastro com nome obrigatório, login, logout, sessão persistente, senha forte e hash `sha256$salt$digest`.
- **Visão Geral** — saudação por horário, data por extenso, timer Pomodoro operável, tarefas prioritárias e hábitos do dia em tempo real.
- **Tarefas** — Kanban com três colunas, criação por coluna, categorias/prioridades, conclusão, exclusão confirmada e **drag & drop** (ponteiro e teclado).
- **Foco** — Pomodoro 25/5/15 min, anel de progresso, pausa/retomada, troca de modo com confirmação, tarefa vinculada, bipe e toast ao concluir, avanço automático de ciclo.
- **Hábitos** — tabela semanal Seg→Dom, frequência por dia, meta diária, consistência do dia, sequência (streak), bloqueio de dias futuros e dias não obrigatórios.
- **Notas** — Markdown renderizado, busca visual por lista, resumo de 2 linhas, edição inline, contagem de palavras, tempo relativo e área fixa “Excluir nota”.

Todas as contas começam **vazias** (sem seed/demo), com empty states em todas as telas.

---

## Stack

| Camada | Tecnologia |
|---|---|
| UI | React 18 (JavaScript) |
| Build/dev | Vite 5 |
| Estilos | Tailwind CSS 3.4 |
| Rotas | `react-router-dom` com `HashRouter` |
| Ícones | `lucide-react` |
| Markdown | `react-markdown` |
| DnD | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |

---

## Como executar

Requisitos: Node.js 18+ e npm.

```bash
npm install
npm run dev
```

Abra **http://127.0.0.1:5173**.

> **Importante:** a senha usa `crypto.subtle`, que exige contexto seguro. Use `localhost`/`127.0.0.1` via `npm run dev` ou `npm run preview`; abrir o `index.html` direto (`file://`) não funciona.

### Produção

```bash
npm run build
npm run preview
```

O build fica em `dist/`. O `HashRouter` evita a necessidade de fallback de rotas no host estático.

---

## Rotas

| Rota | Tela |
|---|---|
| `/entrar` | Login |
| `/cadastro` | Criar conta |
| `/` | Visão Geral |
| `/foco` | Pomodoro |
| `/tarefas` | Kanban |
| `/habitos` | Hábitos |
| `/notas` | Anotações |

Rotas privadas redirecionam para `/entrar` sem sessão; `/entrar` e `/cadastro` redirecionam para `/` com sessão ativa.

---

## Persistência

Chaves em `localStorage`, sempre com `userId` nos dados por usuário:

```
lifepulse:v1:users
lifepulse:v1:session
lifepulse:v1:profile:<userId>
lifepulse:v1:tasks:<userId>
lifepulse:v1:habits:<userId>
lifepulse:v1:notes:<userId>
lifepulse:v1:pomodoro:<userId>
```

- Leituras passam por parse seguro com fallback tipado.
- `schemaVersion` identifica a versão de cada coleção.
- Logout remove apenas a sessão; os dados permanecem.
- O Pomodoro persiste `endsAt`, então o timer continua corretamente após reload.

---

## Estrutura

```
src/
├─ components/
│  ├─ auth/        # card, formulários e força de senha
│  ├─ focus/       # anel, controles, seletor de tarefa
│  ├─ habits/      # tabela, células, streak, modal
│  ├─ layout/      # shell, sidebar, topbar, perfil
│  ├─ notes/       # lista, leitor, editor, Markdown
│  ├─ overview/    # header, cards, citação
│  ├─ tasks/       # board, coluna, card, modal, badges
│  └─ ui/          # kit base (botões, inputs, modal etc.)
├─ context/        # Auth, Toast, UI, Tasks, Habits, Notes, Pomodoro
├─ pages/          # AuthPage, Overview, Focus, Tasks, Habits, Notes
├─ routes/         # AppRoutes e ProtectedRoute
├─ utils/          # constants, storage, crypto, validators, date, markdown, sound
├─ App.jsx
└─ main.jsx
```

Documentos de apoio: `SPEC.md` (regras e contratos) e `PROGRESS.md` (diário de fases e QA).

---

## Decisões de produto

- Conta nova vazia, sem dados de exemplo.
- Sidebar **sem ícones**, apenas texto, com alvo de clique de 40px.
- Notas com rodapé fixo de exclusão sempre visível.
- Hábitos: hoje e dias passados da semana são clicáveis; futuro fica bloqueado.
- Pomodoro conclui com bipe + toast e avança de modo **sem iniciar automaticamente**.
- Tempo relativo das notas: `09:23` → `Ontem` → `quinta-feira` → `21 Out`.
- Card de prioridades mostra apenas pendentes, com badge local e totais globais.

---

## QA

O fluxo completo foi validado em build de produção (`npm run preview`) com conta criada pela UI: tarefas e DnD, timer e retomada, hábitos e streak, notas e Markdown, overview em tempo real, rotas protegidas, persistência e isolamento entre duas contas.

Build final:

```bash
npm run build
# ✓ built — dist/ gerado sem erros
```

O `npm audit` reporta vulnerabilidades na árvore de desenvolvimento; elas não afetam o build nem a execução da SPA.

---

## Observações

- Projeto acadêmico (Seminário — Desenvolvimento de Software para Web/UFC).
- Não há backend: autenticação e dados vivem no navegador do usuário.
- Limpar os dados do site remove contas e conteúdo daquele navegador.
