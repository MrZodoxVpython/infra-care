import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { api, tgl } from '../api.js';

export default function Notifikasi() {
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState('Semua');

  const load = () => api('/notifications').then(setRows);

  useEffect(() => {
    load();
  }, []);

  const T = ['Semua', 'Sistem', 'Pengaduan', 'Update'];
  const v = rows.filter((r) => tab === 'Semua' || r.tipe === tab);
  const un = rows.filter((r) => !r.dibaca).length;

  const markAll = () =>
    api('/notifications/read-all', { method: 'POST' }).then(() => {
      load();
      window.dispatchEvent(new Event('notif:refresh'));
    });

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4 sm:gap-6">
      <div className="flex flex-col gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-white dark:from-slate-900 dark:to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifikasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Pantau informasi terbaru seputar pengaduan Anda.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex flex-wrap gap-2 p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700">
            {T.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                  tab === t
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t}
                {t === 'Semua' && un > 0 ? ` (${un})` : ''}
              </button>
            ))}
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {v.map((r) => (
              <div
                key={r.id}
                className={`flex items-start gap-3 p-3 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                  r.dibaca ? '' : 'bg-blue-50/50 dark:bg-slate-800/30'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    r.dibaca ? 'bg-slate-300 dark:bg-slate-600' : 'bg-primary'
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 dark:text-white text-sm mb-1">
                    {r.judul}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {r.isi}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {tgl(r.created_at)}
                  </div>
                </div>
              </div>
            ))}
            {!v.length && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                Tidak ada notifikasi.
              </div>
            )}
          </div>
          {v.length > 0 && (
            <div className="flex items-center justify-between p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Menampilkan {v.length} dari {rows.length} notifikasi
              </span>
              <button
                className="text-xs sm:text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                onClick={markAll}
              >
                <CheckCheck className="w-4 h-4" />
                Tandai Semua Dibaca
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700 h-fit">
        <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <Inbox className="w-5 h-5 text-primary" />
          Ringkasan Notifikasi
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span className="text-sm text-slate-700 dark:text-slate-300">Belum Dibaca</span>
            <span className="text-sm font-bold text-slate-800 dark:text-white">{un}</span>
          </div>
          {T.slice(1).map((t) => (
            <div
              key={t}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800"
            >
              <span className="text-sm text-slate-700 dark:text-slate-300">{t}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                {rows.filter((r) => r.tipe === t).length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
