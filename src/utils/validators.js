import { EMAIL_REGEX, LIMITS } from './constants.js';

export const PASSWORD_RULES = [
  { key: 'minLength', label: 'Pelo menos 8 caracteres' },
  { key: 'uppercase', label: 'Uma letra maiúscula' },
  { key: 'lowercase', label: 'Uma letra minúscula' },
  { key: 'number', label: 'Um número' },
];

export function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

export function isValidEmail(value = '') {
  return EMAIL_REGEX.test(normalizeEmail(value));
}

export function validateEmail(value) {
  const email = normalizeEmail(value);
  if (!email) return { valid: false, value: email, error: 'Informe seu e-mail.' };
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, value: email, error: 'Informe um e-mail válido.' };
  }
  return { valid: true, value: email, error: '' };
}

export function validateName(value) {
  const name = String(value ?? '').trim().replace(/\s+/g, ' ');

  if (!name) return { valid: false, value: name, error: 'Informe seu nome.' };
  if (name.length < LIMITS.nameMin) {
    return {
      valid: false,
      value: name,
      error: `O nome deve ter pelo menos ${LIMITS.nameMin} caracteres.`,
    };
  }
  if (name.length > LIMITS.nameMax) {
    return {
      valid: false,
      value: name,
      error: `O nome deve ter no máximo ${LIMITS.nameMax} caracteres.`,
    };
  }

  return { valid: true, value: name, error: '' };
}

export function evaluatePassword(password = '') {
  const value = String(password);
  const rules = {
    minLength: value.length >= LIMITS.passwordMin,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
  };

  const score = Object.values(rules).filter(Boolean).length;
  const valid = score === PASSWORD_RULES.length;

  let strength = 'weak';
  let label = 'Fraca';
  if (score === 3) {
    strength = 'medium';
    label = 'Média';
  } else if (score === 4) {
    strength = 'strong';
    label = 'Forte';
  }

  return { valid, score, rules, strength, label };
}

export function validatePassword(password) {
  const evaluation = evaluatePassword(password);

  if (!password) {
    return { ...evaluation, error: 'Informe uma senha.' };
  }
  if (!evaluation.valid) {
    return {
      ...evaluation,
      error: 'A senha precisa ter 8+ caracteres, maiúscula, minúscula e número.',
    };
  }

  return { ...evaluation, error: '' };
}

export function validateConfirm(password, confirm) {
  if (!confirm) return { valid: false, error: 'Confirme sua senha.' };
  if (password !== confirm) return { valid: false, error: 'As senhas não coincidem.' };
  return { valid: true, error: '' };
}

export function validateTaskTitle(value) {
  const title = String(value ?? '').trim();
  if (!title) return { valid: false, value: title, error: 'Informe o título da tarefa.' };
  if (title.length > LIMITS.taskTitleMax) {
    return {
      valid: false,
      value: title,
      error: `O título deve ter no máximo ${LIMITS.taskTitleMax} caracteres.`,
    };
  }
  return { valid: true, value: title, error: '' };
}

export function validateHabitName(value) {
  const name = String(value ?? '').trim();
  if (!name) return { valid: false, value: name, error: 'Informe o nome do hábito.' };
  if (name.length > LIMITS.habitNameMax) {
    return {
      valid: false,
      value: name,
      error: `O nome deve ter no máximo ${LIMITS.habitNameMax} caracteres.`,
    };
  }
  return { valid: true, value: name, error: '' };
}

export function validateNoteTitle(value) {
  const title = String(value ?? '').trim();
  if (!title) return { valid: false, value: title, error: 'Informe o título da nota.' };
  if (title.length > LIMITS.noteTitleMax) {
    return {
      valid: false,
      value: title,
      error: `O título deve ter no máximo ${LIMITS.noteTitleMax} caracteres.`,
    };
  }
  return { valid: true, value: title, error: '' };
}
