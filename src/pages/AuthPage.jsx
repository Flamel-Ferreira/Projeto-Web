import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard.jsx';
import LoginForm from '../components/auth/LoginForm.jsx';
import RegisterForm from '../components/auth/RegisterForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { APP, ROUTES } from '../utils/constants.js';

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  const redirectTo =
    typeof location.state?.from === 'string' &&
    location.state.from.startsWith('/')
      ? location.state.from
      : ROUTES.overview;

  function handleModeChange(nextMode) {
    if (nextMode === mode) return;
    navigate(nextMode === 'register' ? ROUTES.register : ROUTES.auth, {
      replace: true,
    });
  }

  async function handleLogin(credentials) {
    setLoading(true);
    try {
      const result = await login(credentials.email, credentials.password);
      if (result?.ok) navigate(redirectTo, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(data) {
    setLoading(true);
    try {
      const result = await register(data);
      if (result?.ok) navigate(redirectTo, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-4 py-14">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[110px]"
        aria-hidden="true"
      />

      <main className="relative z-10 w-full max-w-[440px]">
        <AuthCard mode={mode} onModeChange={handleModeChange}>
          {mode === 'register' ? (
            <RegisterForm onSubmit={handleRegister} loading={loading} />
          ) : (
            <LoginForm onSubmit={handleLogin} loading={loading} />
          )}
        </AuthCard>
      </main>

      <p className="pointer-events-none fixed bottom-4 left-0 right-0 px-4 text-center text-xs text-text-muted">
        {APP.footer}
      </p>
    </div>
  );
}
