import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Search, UserCircle, XCircle } from 'lucide-react';
import { api, getUser } from '../api.js';
import { MENU, ROLE } from '../constants.js';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Layout() {
  const u = getUser();
  const nav = useNavigate();
  const loc = useLocation();
  const [n, setN] = useState(0);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const d = await api('/notifications');
        setN(d.filter((x) => !x.dibaca).length);
      } catch (_) {}
    };
    fetchNotif();
    const onRefresh = () => fetchNotif();
    window.addEventListener('notif:refresh', onRefresh);
    return () => window.removeEventListener('notif:refresh', onRefresh);
  }, [loc]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMenuOpen(false);
  }, [loc]);

  if (!u) return <Navigate to="/login" />;

  const out = () => {
    localStorage.clear();
    nav('/');
  };

  return (
    <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
      <aside className="hidden lg:flex flex-col bg-gradient-to-b from-primary to-primaryDark text-white p-4 sticky top-0 h-screen">
        <div className="mb-6">
          <Logo />
        </div>
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/25">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold flex-shrink-0">
            {u.nama[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">Halo, {u.nama}</div>
            <div className="text-xs opacity-80">{ROLE[u.role]}</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {MENU[u.role].map(([to, l, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white/25 shadow-sm'
                    : 'hover:bg-white/10 opacity-90 hover:opacity-100'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" /> <span className="truncate">{l}</span>
              {l === 'Notifikasi' && n > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                  {n}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="text-xs italic opacity-90 mt-auto pt-4">
          Infrastruktur baik untuk masa depan kita bersama
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="w-72 h-full bg-gradient-to-b from-primary to-primaryDark text-white p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <Logo />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/25">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold flex-shrink-0">
                {u.nama[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">Halo, {u.nama}</div>
                <div className="text-xs opacity-80">{ROLE[u.role]}</div>
              </div>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {MENU[u.role].map(([to, l, Icon]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/app'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? 'bg-white/25' : 'hover:bg-white/10 opacity-90 hover:opacity-100'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" /> <span className="truncate">{l}</span>
                  {l === 'Notifikasi' && n > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                      {n}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="text-xs italic opacity-90 mt-auto pt-4">
              Infrastruktur baik untuk masa depan kita bersama
            </div>
          </aside>
        </div>
      )}

      <div className="flex flex-col min-h-0">
        <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
          <div className="hidden sm:block">
            <Logo />
          </div>
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Cari..."
              />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} />
            <Link
              to="/app/notifikasi"
              className="relative hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              {n > 0 && (
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {n}
                </span>
              )}
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {u.nama[0]}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">
                    {u.nama}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{ROLE[u.role]}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <Link
                    to="/app/profil"
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <UserCircle className="w-4 h-4" /> Profil
                  </Link>
                  <button
                    onClick={out}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
