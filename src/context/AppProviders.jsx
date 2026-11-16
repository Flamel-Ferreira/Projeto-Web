import ToastViewport from '../components/ui/ToastViewport.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { ToastProvider } from './ToastContext.jsx';
import { UIProvider } from './UIContext.jsx';

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <UIProvider>
          {children}
          <ToastViewport />
        </UIProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default AppProviders;
