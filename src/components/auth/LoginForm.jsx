import { useState } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import { validateEmail } from '../../utils/validators.js';

export default function LoginForm({ onSubmit, loading = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const emailCheck = validateEmail(email);
    const nextErrors = {};

    if (!emailCheck.valid) nextErrors.email = emailCheck.error;
    if (!password) nextErrors.password = 'Informe sua senha.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit?.({ email: emailCheck.value, password });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="login-email"
        label="E-mail"
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (errors.email) setErrors((current) => ({ ...current, email: '' }));
        }}
        placeholder="voce@exemplo.com"
        icon={Mail}
        autoComplete="email"
        inputMode="email"
        error={errors.email}
        required
      />

      <Input
        id="login-password"
        label="Senha"
        type="password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          if (errors.password) {
            setErrors((current) => ({ ...current, password: '' }));
          }
        }}
        placeholder="Sua senha"
        icon={Lock}
        autoComplete="current-password"
        error={errors.password}
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
        Entrar
      </Button>
    </form>
  );
}
