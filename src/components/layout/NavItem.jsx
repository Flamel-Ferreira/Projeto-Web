import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn.js';

export default function NavItem({ to, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex h-10 items-center rounded-lg px-3 text-sm font-medium transition duration-150',
          isActive
            ? 'bg-surface-3 text-text'
            : 'text-text-secondary hover:bg-white/5 hover:text-text',
        )
      }
    >
      {label}
    </NavLink>
  );
}
