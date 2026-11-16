/**
 * Constantes globais do LifePulse.
 * Centraliza enums, labels pt-BR, rotas, chaves de storage e limites de validação.
 */

export const APP = {
  name: 'LifePulse',
  tagline: 'PRODUTIVIDADE',
  description: 'Seu painel pessoal de foco e produtividade',
  version: 'v2.4',
  year: 2025,
  footer: 'LifePulse © 2025 • Produtividade e foco consciente.',
};

export const ROUTES = {
  auth: '/entrar',
  register: '/cadastro',
  overview: '/',
  focus: '/foco',
  habits: '/habitos',
  tasks: '/tarefas',
  notes: '/notas',
};

export const NAV_ITEMS = [
  { to: ROUTES.overview, label: 'Visão Geral' },
  { to: ROUTES.focus, label: 'Foco' },
  { to: ROUTES.habits, label: 'Hábitos' },
  { to: ROUTES.tasks, label: 'Tarefas' },
  { to: ROUTES.notes, label: 'Notas' },
];

/* ------------------------------------------------------------------ */
/* Tarefas                                                             */
/* ------------------------------------------------------------------ */

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

export const TASK_STATUS_ORDER = [
  TASK_STATUS.TODO,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.DONE,
];

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'A Fazer',
  [TASK_STATUS.IN_PROGRESS]: 'Em Andamento',
  [TASK_STATUS.DONE]: 'Concluído',
};

export const TASK_STATUS_DOTS = {
  [TASK_STATUS.TODO]: '#8B7CF7',
  [TASK_STATUS.IN_PROGRESS]: '#60A5FA',
  [TASK_STATUS.DONE]: '#22C55E',
};

export const TASK_CATEGORIES = {
  WORK: 'work',
  PERSONAL: 'personal',
  STUDIES: 'studies',
};

export const TASK_CATEGORY_ORDER = [
  TASK_CATEGORIES.WORK,
  TASK_CATEGORIES.PERSONAL,
  TASK_CATEGORIES.STUDIES,
];

export const TASK_CATEGORY_LABELS = {
  [TASK_CATEGORIES.WORK]: 'Trabalho',
  [TASK_CATEGORIES.PERSONAL]: 'Pessoal',
  [TASK_CATEGORIES.STUDIES]: 'Estudos',
};

export const TASK_CATEGORY_TONES = {
  [TASK_CATEGORIES.WORK]: 'purple',
  [TASK_CATEGORIES.PERSONAL]: 'pink',
  [TASK_CATEGORIES.STUDIES]: 'green',
};

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const TASK_PRIORITY_ORDER = [
  TASK_PRIORITIES.LOW,
  TASK_PRIORITIES.MEDIUM,
  TASK_PRIORITIES.HIGH,
];

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITIES.LOW]: 'Baixa',
  [TASK_PRIORITIES.MEDIUM]: 'Média',
  [TASK_PRIORITIES.HIGH]: 'Alta',
};

/** Menor rank = maior prioridade (usado no sort). */
export const TASK_PRIORITY_RANK = {
  [TASK_PRIORITIES.HIGH]: 0,
  [TASK_PRIORITIES.MEDIUM]: 1,
  [TASK_PRIORITIES.LOW]: 2,
};

export const TASK_PRIORITY_TONES = {
  [TASK_PRIORITIES.LOW]: 'slate',
  [TASK_PRIORITIES.MEDIUM]: 'purple',
  [TASK_PRIORITIES.HIGH]: 'pink',
};

export const PRIORITY_TASK_LIMIT = 3;

/* ------------------------------------------------------------------ */
/* Hábitos                                                             */
/* ------------------------------------------------------------------ */

export const HABIT_CATEGORIES = {
  HEALTH: 'health',
  STUDIES: 'studies',
  PRODUCTIVITY: 'productivity',
  MIND: 'mind',
};

export const HABIT_CATEGORY_ORDER = [
  HABIT_CATEGORIES.HEALTH,
  HABIT_CATEGORIES.STUDIES,
  HABIT_CATEGORIES.PRODUCTIVITY,
  HABIT_CATEGORIES.MIND,
];

export const HABIT_CATEGORY_LABELS = {
  [HABIT_CATEGORIES.HEALTH]: 'Saúde',
  [HABIT_CATEGORIES.STUDIES]: 'Estudos',
  [HABIT_CATEGORIES.PRODUCTIVITY]: 'Produtividade',
  [HABIT_CATEGORIES.MIND]: 'Mente',
};

export const HABIT_CATEGORY_SUBTITLES = {
  [HABIT_CATEGORIES.HEALTH]: 'Saúde e Vitalidade',
  [HABIT_CATEGORIES.STUDIES]: 'Crescimento Intelectual',
  [HABIT_CATEGORIES.PRODUCTIVITY]: 'Desenvolvimento Técnico',
  [HABIT_CATEGORIES.MIND]: 'Equilíbrio Mental',
};

export const HABIT_GOALS = [1, 2, 3, 4, 5].map((value) => ({
  value,
  label: value === 1 ? '1 vez ao dia' : `${value} vezes ao dia`,
}));

/** Semana exibida sempre Seg → Dom (0 = domingo, padrão JS). */
export const WEEK_DAYS = [
  { value: 1, short: 'Seg', long: 'segunda-feira' },
  { value: 2, short: 'Ter', long: 'terça-feira' },
  { value: 3, short: 'Qua', long: 'quarta-feira' },
  { value: 4, short: 'Qui', long: 'quinta-feira' },
  { value: 5, short: 'Sex', long: 'sexta-feira' },
  { value: 6, short: 'Sáb', long: 'sábado' },
  { value: 0, short: 'Dom', long: 'domingo' },
];

export const ALL_WEEK_DAYS = WEEK_DAYS.map((day) => day.value);

/* ------------------------------------------------------------------ */
/* Notas                                                               */
/* ------------------------------------------------------------------ */

export const NOTEBOOKS = {
  FOCUS: 'focus',
  IDEAS: 'ideas',
  PERSONAL: 'personal',
};

export const NOTEBOOK_ORDER = [
  NOTEBOOKS.FOCUS,
  NOTEBOOKS.IDEAS,
  NOTEBOOKS.PERSONAL,
];

export const NOTEBOOK_LABELS = {
  [NOTEBOOKS.FOCUS]: 'Foco & Arq.',
  [NOTEBOOKS.IDEAS]: 'Ideias & Insights',
  [NOTEBOOKS.PERSONAL]: 'Pessoal',
};

export const NOTEBOOK_DETAIL_LABELS = {
  [NOTEBOOKS.FOCUS]: 'Foco & Arquitetura',
  [NOTEBOOKS.IDEAS]: 'Ideias & Insights',
  [NOTEBOOKS.PERSONAL]: 'Pessoal',
};

/* ------------------------------------------------------------------ */
/* Pomodoro                                                            */
/* ------------------------------------------------------------------ */

export const POMODORO_MODES = {
  FOCUS: 'focus',
  SHORT: 'short',
  LONG: 'long',
};

export const POMODORO_MODE_ORDER = [
  POMODORO_MODES.FOCUS,
  POMODORO_MODES.SHORT,
  POMODORO_MODES.LONG,
];

export const POMODORO_DURATIONS = {
  [POMODORO_MODES.FOCUS]: 25 * 60,
  [POMODORO_MODES.SHORT]: 5 * 60,
  [POMODORO_MODES.LONG]: 15 * 60,
};

export const POMODORO_MODE_LABELS = {
  [POMODORO_MODES.FOCUS]: 'Foco',
  [POMODORO_MODES.SHORT]: 'Pausa Curta',
  [POMODORO_MODES.LONG]: 'Pausa Longa',
};

export const POMODORO_MODE_TAB_LABELS = {
  [POMODORO_MODES.FOCUS]: 'Foco 25m',
  [POMODORO_MODES.SHORT]: 'Pausa Curta 5m',
  [POMODORO_MODES.LONG]: 'Pausa Longa 15m',
};

export const POMODORO_STATUS_LABELS = {
  [POMODORO_MODES.FOCUS]: 'Sessão focada',
  [POMODORO_MODES.SHORT]: 'Pausa curta',
  [POMODORO_MODES.LONG]: 'Pausa longa',
};

export const POMODORO_CYCLE_LENGTH = 4;

/* ------------------------------------------------------------------ */
/* Datas e textos                                                      */
/* ------------------------------------------------------------------ */

export const MONTHS_SHORT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export const MONTHS_LONG = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const GREETINGS = {
  morning: 'Bom dia',
  afternoon: 'Boa tarde',
  evening: 'Boa noite',
};

export const PERIOD_MESSAGES = {
  morning: 'Concentração otimizada para o período matutino',
  afternoon: 'Concentração otimizada para o período vespertino',
  evening: 'Concentração otimizada para o período noturno',
};

export const QUOTE = {
  text: 'A simplicidade é o último grau da sofisticação.',
  author: 'Leonardo da Vinci',
};

/* ------------------------------------------------------------------ */
/* Persistência                                                        */
/* ------------------------------------------------------------------ */

export const STORAGE_PREFIX = 'lifepulse:v1';
export const SCHEMA_VERSION = 1;

export const STORAGE_KEYS = {
  users: `${STORAGE_PREFIX}:users`,
  session: `${STORAGE_PREFIX}:session`,
  profile: (userId) => `${STORAGE_PREFIX}:profile:${userId}`,
  tasks: (userId) => `${STORAGE_PREFIX}:tasks:${userId}`,
  habits: (userId) => `${STORAGE_PREFIX}:habits:${userId}`,
  notes: (userId) => `${STORAGE_PREFIX}:notes:${userId}`,
  pomodoro: (userId) => `${STORAGE_PREFIX}:pomodoro:${userId}`,
};

/* ------------------------------------------------------------------ */
/* Validação                                                           */
/* ------------------------------------------------------------------ */

export const LIMITS = {
  nameMin: 2,
  nameMax: 40,
  passwordMin: 8,
  taskTitleMax: 120,
  habitNameMax: 60,
  noteTitleMax: 80,
  notePreviewLines: 2,
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
