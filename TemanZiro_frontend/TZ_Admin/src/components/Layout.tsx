import { useState, useEffect } from 'react';
import miniziro from '@/assets/images/mini-ziro.svg';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useThemeStore } from '../store/themeStore';
import { db } from '../lib/firebase_config';
import { doc, getDoc } from 'firebase/firestore';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { cn } from '../lib/utils';
import miniZiro from '../assets/images/mini-ziro.svg';

const PAGE_TITLES: Record<string, string> = {
  '/':           'Dashboard Overview',
  '/users':      'Users',
  '/companions': 'Companions',
  '/topups':     'Top Ups',
  '/withdraws':  'Withdrawals',
};

const navItems = [
  { name: 'Dashboard',  path: '/',          icon: LayoutDashboard },
  { name: 'Users',      path: '/users',      icon: Users },
  { name: 'Companions', path: '/companions', icon: UserSquare2 },
  { name: 'Top Ups',    path: '/topups',     icon: ArrowDownToLine },
  { name: 'Withdraws',  path: '/withdraws',  icon: ArrowUpFromLine },
];

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020617]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Memuat sesi...</p>
      </div>
    </div>
  );
}

export default function Layout() {
  const { currentUser: user, isAdmin, loading, logOut } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!user?.uid) return;
    getDoc(doc(db, 'profile_admin', user.uid))
      .then((snap) => {
        const url = snap.exists() ? (snap.data()?.url_photoprofile_admin ?? miniziro) : miniziro;
        setPhotoUrl(typeof url === 'string' && url.length > 0 ? url : null);
      })
      .catch(() => setPhotoUrl(null));
  }, [user?.uid]);

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020617]">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-red-500 mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Akun ini tidak memiliki hak akses admin panel.
          </p>
          <button
            onClick={logOut}
            className="px-5 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'TemanZiro Admin';
  const initial = user.displayName?.charAt(0) || user.email?.charAt(0) || 'A';

  function Avatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
    const cls = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm';
    if (photoUrl) {
      return (
        <img
          src={photoUrl}
          alt="Admin"
          className={cn(cls, 'rounded-full object-cover flex-shrink-0 ring-2 ring-primary-500/30')}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = miniZiro; }}
        />
      );
    }
    return (
      <div className={cn(cls, 'rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold flex-shrink-0 ring-2 ring-primary-500/30')}>
        {initial}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-[#020617] text-slate-800 dark:text-slate-200 transition-colors">

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
          <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">T</div>
          Teman<span className="text-primary-500">Ziro</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-60 flex flex-col',
        'bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800',
        'transform transition-transform duration-200 ease-in-out',
        'md:relative md:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="h-16 px-5 hidden md:flex items-center border-b border-gray-200 dark:border-slate-800">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-white mr-2">T</div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Teman<span className="text-primary-500">Ziro</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <p className="px-5 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Menu</p>
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-3 py-2.5 sidebar-item text-sm',
                  isActive
                    ? 'active-nav'
                    : 'text-slate-700 dark:text-slate-400'
                )}
              >
                <item.icon size={17} />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 space-y-3">
          {/* User info (mobile only) */}
          <div className="flex items-center gap-2 md:hidden">
            <Avatar size="sm" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                {user.displayName || 'Admin'}
              </p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-slate-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark'
              ? <Moon size={17} className="text-slate-600 flex-shrink-0" />
              : <Sun size={17} className="text-amber-400 flex-shrink-0" />
            }
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={logOut}
            className="w-full py-2 rounded-lg text-xs flex items-center justify-center gap-2 font-medium transition-colors bg-red-500 text-white hover:bg-red-600 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 dark:border dark:border-red-500/30"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen z-10">
        {/* Topbar */}
        <header className="h-16 px-6 hidden md:flex items-center justify-between bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
          <h1 className="text-base font-semibold text-slate-800 dark:text-white">{pageTitle}</h1>
          <div className="flex items-center gap-3 pl-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800 dark:text-white leading-tight">
                {user.displayName || 'Admin'}
              </p>
              <p className="text-xs text-slate-400">Superadmin</p>
            </div>
            <Avatar />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}