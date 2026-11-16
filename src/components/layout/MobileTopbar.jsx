import { Menu } from 'lucide-react';
import Brand from './Brand.jsx';
import IconButton from '../ui/IconButton.jsx';

export default function MobileTopbar({ onOpenMenu }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/90 px-4 backdrop-blur lg:hidden">
      <Brand size="sm" />
      <IconButton
        icon={Menu}
        label="Abrir menu"
        variant="outline"
        onClick={onOpenMenu}
      />
    </header>
  );
}
