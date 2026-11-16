# PROGRESS.md — LifePulse

> Diário de implementação. Atualizar ao final de **cada fase**.
> Fonte da verdade funcional: `SPEC.md` (v1.1).

**Status atual:** Fases 0–10 concluídas ✅
**Última atualização:** 2026-11-14

---

## Ambiente

| Item | Versão / observação |
|---|---|
| Node | v24.22.0 |
| npm | 11.19.1 |
| Vite | 5.4.21 |
| React | 18.3.1 |
| Tailwind | 3.4.x |
| Dev server | `npm run dev` → http://127.0.0.1:5173 |
| Preview | `npm run preview` → http://127.0.0.1:4173 |
| Build | `npm run build` → `dist/` (validado na Fase 10) |

---

## Checklist de fases

- [x] **Fase 0 — Fundação**
  - Vite + React (JS), Tailwind 3.4, PostCSS, ESLint-free (sem lint configurado)
  - Tokens de cor/tipografia/sombra/raio no `tailwind.config.js`
  - `index.css` base (dark, scrollbar, foco, reduced motion)
  - `utils/constants.js`, `utils/cn.js`, `utils/ids.js`
  - `App.jsx` provisório com `HashRouter` e rota `*`
  - Build limpo e sem erros de console

- [x] **Fase 1 — Núcleo de dados**
  - `storage.js` (localStorage + fallback em memória, coleções versionadas)
  - `crypto.js` (`sha256$salt$digest`, salt por usuário, verificação em tempo constante)
  - `validators.js` (nome, e-mail, senha forte, confirmação e campos de entidades)
  - `date.js` (chaves de data, semana Seg→Dom, saudações, timestamps D9, timer)
  - `markdown.js` (strip, preview de 2 linhas, `countWords` RN-36)

- [x] **Fase 2 — Estado global e rotas**
  - `ToastContext`, `AuthContext`, `UIContext`, `AppProviders`
  - `routes/AppRoutes.jsx`, `routes/ProtectedRoute.jsx`
  - Login, cadastro, sessão, logout e proteção de rotas validados

- [x] **Fase 3 — UI kit + Autenticação**
  - UI: `Button`, `IconButton`, `Input`, `Select`, `FieldLabel`, `SegmentedControl`, `Modal`, `Badge`, `ProgressBar`, `EmptyState`, `PageHeader`, `ConfirmDialog`, `ToastViewport`
  - Auth: `AuthPage`, `AuthCard`, `LoginForm`, `RegisterForm`, `PasswordStrength`
  - Validação: cadastro com auto-login, logout, e-mail inválido inline, senha incorreta com toast, e-mail duplicado bloqueado, redirecionamento de rota protegida

- [x] **Fase 4 — Shell e navegação**
  - `AppShell`, `Sidebar` (itens somente texto, sem ícones), `NavItem`
  - `ProfileMenu` (popover com nome, plano e “Sair”), `MobileTopbar` + drawer
  - `AppWorkspace` aninhando Tasks → Habits → Notes → Pomodoro → Shell
  - Foco no `h1` da página após troca de rota; logout pausa o Pomodoro e fecha o drawer

- [x] **Fase 5 — Tarefas**
  - `TasksContext` (CRUD, `order` por coluna, contagens derivadas, `toggleComplete`, `moveTask`, prioridades)
  - `TaskBoard`, `TaskColumn`, `TaskCard`, `TaskBadges`, `TaskModal`
  - DnD kit com sensores ponteiro + teclado, overlay, colunas arrastáveis e reordenação
  - “+ Adicionar cartão” abre o modal na coluna correta; exclusão com confirmação

- [x] **Fase 6 — Foco**
  - `PomodoroContext` (persistência por usuário, `endsAt`, reconciliação no reload, virada do dia)
  - `sound.js` (WebAudio), `ModeTabs`, `PomodoroRing`, `TimerControls`, `CurrentTaskBar`, `TaskPicker`
  - Conclusão: bipe + toast + avanço automático (foco → pausa curta; 4º foco → longa; pausa → foco) sem auto-start
  - Troca de modo com confirmação apenas com timer rodando; vínculo de tarefa limpo ao concluir/excluir

- [x] **Fase 7 — Hábitos**
  - `HabitsContext` (semana Seg→Dom, hábitos do dia, consistência, streak RN-22, guarda de dias futuros)
  - `HabitTable`, `HabitRow`, `HabitDayCell`, `StreakBadge`, `ConsistencyBar`, `HabitModal` (criar/editar)
  - Dias não obrigatórios com `aria-disabled`; futuro bloqueado; exclusão com confirmação

- [x] **Fase 8 — Notas**
  - `NotesContext` (ordenação por `updatedAt`, seleção automática, CRUD, contagem de palavras)
  - `NotesPanel`, `NoteListItem`, `NoteReader`, `NoteEditorForm`, `NoteModal`, `MarkdownView`
  - Rodapé fixo “Excluir nota”, edição inline, empty states, lista/detalhe no mobile

- [x] **Fase 9 — Visão Geral**
  - `OverviewHeader`, `FocusSummaryCard`, `PriorityTasksCard`, `TodayHabitsCard`, `QuoteBar`
  - Timer operável no card, prioridades RN-11/RN-12, hábitos do dia e atualização em tempo real

- [x] **Fase 10 — QA e entrega**
  - QA funcional completo no preview de produção (origem isolada, porta 4173)
  - Build final limpo; `README.md` publicado
  - Ajustes de pluralização (contagens com 1 item) encontrados no QA

---

## Critérios de aceite

| # | Critério | Status |
|---|---|---|
| CA-01 | Login com e-mail validado | ✅ |
| CA-02 | Autenticação e-mail/senha | ✅ |
| CA-03 | Senha criptografada (SHA-256 + salt) | ✅ |
| CA-04 | Dados isolados por usuário | ✅ |
| CA-05 | Cadastro valida senha forte | ✅ |
| CA-06 | Toast de cadastro + login automático | ✅ |
| CA-07 | Sidebar navega e perfil desloga | ✅ |
| CA-08 | Overview com Pomodoro completo | ✅ |
| CA-09 | Overview lista tarefas priorizadas | ✅ |
| CA-10 | Contagem de tarefas | ✅ |
| CA-11 | Overview de hábitos/consistência | ✅ |
| CA-12 | Foco: relógio circular e modos | ✅ |
| CA-13 | Foco: seleção de tarefa | ✅ |
| CA-14 | Hábitos: modal de criação | ✅ |
| CA-15 | Sequência de hábitos | ✅ |
| CA-16 | Dias não obrigatórios | ✅ |
| CA-17 | Kanban: modal pré-preenchido | ✅ |
| CA-18 | Badges de classificação | ✅ |
| CA-19 | Drag & drop persistente | ✅ |
| CA-20 | Notas: resumo (título, 2 linhas, tempo) | ✅ |
| CA-21 | Notas: detalhes e Markdown | ✅ |
| CA-22 | Notas: contador no rodapé | ✅ |
| CA-23 | Persistência geral e retomada do timer | ✅ |
| CA-24 | `npm run build` limpo | ✅ |
| CA-25 | Fidelidade visual | ✅ |
| CA-26 | Conta nova vazia + empty states | ✅ |
| CA-27 | Nome obrigatório no cadastro | ✅ |
| CA-28 | Exclusão de nota com confirmação | ✅ |
| CA-29 | Rotas + proteção de sessão | ✅ |

---

## QA realizado (Fase 10)

Ambiente: build de produção servido por `npm run preview` em `http://127.0.0.1:4173`, conta criada pela UI.

- **Conta nova:** todas as telas vazias, timer 25:00 em Foco, sem tarefa vinculada, saudações e data corretas.
- **Tarefas:** modal por coluna, criação em todas as colunas/categorias/prioridades, contagens, badges, concluir/reabrir, exclusão com confirmação, DnD entre colunas e reordenação, persistência após reload.
- **Foco:** 3 modos, iniciar/pausar/reiniciar, confirmação de troca de modo rodando, retomada após reload via `endsAt`, conclusão de foco (4º → pausa longa) e de pausa (→ foco) com toast, vínculo de tarefa limpo ao concluir a tarefa.
- **Hábitos:** criação com frequência/meta, edição, consistência e streak (2 dias), bloqueio de dia futuro, dias não obrigatórios, exclusão com confirmação.
- **Notas:** criação com Markdown, seleção automática, preview de 2 linhas, tempos `23:18`/`Ontem`/`quarta-feira`/`4 Nov`, metadados e contagem de palavras, edição inline, rodapé singular/plural e exclusão com confirmação.
- **Visão Geral:** prioridades Alta→Média→Baixa, badge local e totais globais, atualização ao concluir tarefa/hábito, timer no card e troca de modo.
- **Rotas/sessão:** F5 preserva rota, rota privada deslogada redireciona para `/entrar`, login retorna à rota pretendida, logout limpa apenas a sessão.
- **Duas contas:** dados independentes por `userId`.
- **Console:** sem erros durante os fluxos testados.

---

## Decisões finais (SPEC v1.1)

- **D1:** conta vazia, sem seed.
- **D2:** nome obrigatório no cadastro.
- **D3:** sidebar sem ícones.
- **D4:** notas com área fixa “Excluir nota”; hábitos editáveis no hover.
- **D5:** hoje/passado clicáveis; futuro bloqueado.
- **D6:** timer para, bipa, avisa e troca de modo sem iniciar.
- **D7:** “Respiração Guiada” descartado; usar rótulo do modo.
- **D8:** `react-router-dom` + `HashRouter`.
- **D9:** datas `09:23` · `Ontem` · `quinta-feira` · `21 Out`.
- **D10:** badge local + totais globais no card de tarefas.

---

## Notas técnicas / riscos

- `crypto.subtle` exige contexto seguro → usar `npm run dev` ou `npm run preview`; evitar `file://`.
- `HashRouter` evita configurar fallback no host estático.
- Tailwind fixado em 3.4 (config JS), não v4.
- Sem seed: o QA deve criar dados pela UI.
- `StrictMode` está ativo; efeitos com `setInterval` precisam de cleanup.
- `npm audit` reportou 4 vulnerabilidades (3 moderadas, 1 alta) na árvore de desenvolvimento; não afetam o build nem o runtime da SPA.

---

## Pendências

- Nenhuma bloqueante.
- Dados de QA permanecem apenas na origem de preview (`127.0.0.1:4173`); a conta real do dev server (`5173`) não foi alterada.
