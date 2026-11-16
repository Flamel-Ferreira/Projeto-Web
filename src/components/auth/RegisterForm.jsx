import { useState } from 'react';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import PasswordStrength from './PasswordStrength.jsx';
import {
  validateConfirm,
  validateEmail,
  validateName,
  validatePassword,
} from '../../utils/validators.js';

export default function RegisterForm({ onSubmit, loading = false }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});

  function clearError(field) {
    if (!errors[field]) return;
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nameCheck = validateName(name);
    const emailCheck = validateEmail(email);
    const passwordCheck = validatePassword(password);
    const confirmCheck = validateConfirm(password, confirm);

    const nextErrors = {};
    if (!nameCheck.valid) nextErrors.name = nameCheck.error;
    if (!emailCheck.valid) nextErrors.email = emailCheck.error;
    if (!passwordCheck.valid) nextErrors.password = passwordCheck.error;
    if (!confirmCheck.valid) nextErrors.confirm = confirmCheck.error;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit?.({
      name: nameCheck.value,
      email: emailCheck.value,
      password,
      confirm,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="register-name"
        label="Nome"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          clearError('name');
        }}
        placeholder="Como devemos te chamar?"
        icon={User}
        autoComplete="name"
        error={errors.name}
        required
      />

      <Input
        id="register-email"
        label="E-mail"
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          clearError('email');
        }}
        placeholder="voce@exemplo.com"
        icon={Mail}
        autoComplete="email"
        inputMode="email"
        error={errors.email}
        required
      />

      <div className="space-y-2">
        <Input
          id="register-password"
          label="Senha"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            clearError('password');
            clearError('confirm');
          }}
          placeholder="Crie uma senha forte"
          icon={Lock}
          autoComplete="new-password"
          error={errors.password}
          required
        />
        <PasswordStrength password={password} />
      </div>

      <Input
        id="register-confirm"
        label="Confirmar senha"
        type="password"
        value={confirm}
        onChange={(event) => {
          setConfirm(event.target.value);
          clearError('confirm');
        }}
        placeholder="Repita a senha"
        icon={Lock}
        autoComplete="new-password"
        error={errors.confirm}
        required
      />

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={loading}
        iconRight={ArrowRight}
        className="mt-2"
      >
        Criar conta
      </Button>
    </form>
  );
}
