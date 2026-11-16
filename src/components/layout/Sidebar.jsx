import Brand from './Brand.jsx';
import NavItem from './NavItem.jsx';
import ProfileMenu from './ProfileMenu.jsx';
import { APP, NAV_ITEMS } from '../../utils/constants.js';

export default function Sidebar({ user, onLogout, onNavigate }) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-sidebar px-4 py-5">
      <div className="px-2">
        <Brand size="sm" />
      </div>

      <nav aria-label="Navegação principal" className="mt-8 flex-1 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted">
          Navegação
        </p>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mt-6 border-t border-border pt-4">
        <ProfileMenu user={user} onLogout={onLogout} />
        <p className="mt-3 px-2 text-[10px] text-text-muted">
          {APP.name} {APP.version}
        </p>
      </div>
    </aside>
  );
}
