import { useEffect, useState } from 'react';
import { ClipboardList, Search } from 'lucide-react';
import { api, getUser } from '../api.js';
import { KAT, STATUS } from '../constants.js';
import Table from '../components/Table.jsx';

export default function Kelola() {
  const u = getUser();
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ q: '', kategori: '', status: '' });
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const ck = () => setDark(document.documentElement.classList.contains('dark'));
    ck();
    const ob = new MutationObserver(ck);
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => ob.disconnect();
  }, []);

  const load = () =>
    api(
      '/complaints?' +
        new URLSearchParams(Object.fromEntries(Object.entries(f).filter(([, v]) => v))),
    ).then(setRows);

  useEffect(() => {
    load();
  }, [f]);

  const change = async (r, status) => {
    await api(`/complaints/${r.id}/status`, {
      method: 'PATCH',
      body: { status, catatan: `Status diubah oleh ${u.nama}` },
    });
    load();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-r from-blue-50 to-white dark:from-slate-900 dark:to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          {u.role === 'admin' ? 'Kelola Pengaduan' : 'Tugas Pengaduan'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Pantau, verifikasi, dan tindak lanjuti semua pengaduan masyarakat.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="Cari ID, judul, atau kategori..."
              value={f.q}
              onChange={(e) => setF({ ...f, q: e.target.value })}
            />
          </div>
          <select
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm"
            value={f.kategori}
            onChange={(e) => setF({ ...f, kategori: e.target.value })}
          >
            <option value="">Semua Kategori</option>
            {KAT.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm"
            value={f.status}
            onChange={(e) => setF({ ...f, status: e.target.value })}
          >
            <option value="">Semua Status</option>
            {STATUS.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
        <Table rows={rows} admin onChange={change} dark={dark} />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          Menampilkan {rows.length} data pengaduan
        </p>
      </div>
    </div>
  );
}
