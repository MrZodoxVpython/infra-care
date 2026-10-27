import { getUser } from '../api.js';
import { ROLE } from '../constants.js';

export default function Profil() {
  const u = getUser();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-white dark:from-slate-900 dark:to-slate-900 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
              {u.nama[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{u.nama}</h2>
              <p className="text-slate-600 dark:text-slate-400">{ROLE[u.role]}</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400">Email</label>
            <p className="text-slate-800 dark:text-white mt-1">{u.email}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400">Role</label>
            <p className="text-slate-800 dark:text-white mt-1">{ROLE[u.role]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
