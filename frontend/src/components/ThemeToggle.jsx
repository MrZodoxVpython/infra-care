import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
      onClick={onToggle}
      title={dark ? 'Mode Terang' : 'Mode Gelap'}
    >
      {dark ? (
        <Sun className="w-4 h-4 text-slate-200" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700" />
      )}
    </button>
  );
}
