import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { APP, ROUTES } from '../utils/constants.js';

function BootScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        {APP.name}
      </div>
    </div>
  );
}

/**
 * Guarda de rota.
 * - guestOnly: visitante autenticado vai para a Visão Geral.
 * - padrão: visitante sem sessão vai para /entrar.
 */
export default function ProtectedRoute({ children, guestOnly = false }) {
  const { user, isBooting } = useAuth();
  const location = useLocation();

  if (isBooting) return <BootScreen />;

  if (guestOnly) {
    return user ? <Navigate to={ROUTES.overview} replace /> : children ?? <Outlet />;
  }

  if (!user) {
    return (
      <Navigate
        to={ROUTES.auth}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children ?? <Outlet />;
}
