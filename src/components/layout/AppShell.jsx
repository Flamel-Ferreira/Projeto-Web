import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MobileTopbar from './MobileTopbar.jsx';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePomodoro } from '../../context/PomodoroContext.jsx';
import { useUI } from '../../context/UIContext.jsx';

export default function AppShell() {
  const { user, logout } = useAuth();
  const { pause } = usePomodoro();
  const { isSidebarOpen, openSidebar, closeSidebar } = useUI();
  const location = useLocation();

  useEffect(() => {
    closeSidebar();
    window.scrollTo({ top: 0 });

    const heading = document.querySelector('main h1');
    heading?.focus?.();
  }, [location.pathname, closeSidebar]);

  function handleLogout() {
    pause();
    closeSidebar();
    logout();
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64">
        <Sidebar user={user} onLogout={handleLogout} />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-black/60"
            onClick={closeSidebar}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[280px] animate-drawer-in shadow-2xl">
            <Sidebar user={user} onLogout={handleLogout} onNavigate={closeSidebar} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <MobileTopbar onOpenMenu={openSidebar} />

        <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
