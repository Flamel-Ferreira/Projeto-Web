import Brand from '../layout/Brand.jsx';
import SegmentedControl from '../ui/SegmentedControl.jsx';

const MODES = [
  { value: 'login', label: 'Entrar' },
  { value: 'register', label: 'Criar Conta' },
];

export default function AuthCard({ mode = 'login', onModeChange, children }) {
  return (
    <section className="relative flex max-h-[calc(100vh-9rem)] w-full max-w-[440px] flex-col overflow-hidden rounded-card border border-border bg-[#101011] p-8 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.9)]">
      <div className="flex justify-center">
        <Brand size="lg" stacked />
      </div>

      <SegmentedControl
        options={MODES}
        value={mode}
        onChange={onModeChange}
        columns={2}
        name="auth-mode"
        ariaLabel="Modo de autenticação"
        className="mt-7"
      />

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        {children}
      </div>
    </section>
  );
}
