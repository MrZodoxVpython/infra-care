import { useEffect, useState } from 'react';
import { BarChart3, Clock } from 'lucide-react';
import { api } from '../api.js';
import Table from '../components/Table.jsx';

export default function Riwayat() {
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState('Semua');
  const [sort, setSort] = useState('desc');

  useEffect(() => {
    api('/complaints')
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  const G = {
    Semua: () => true,
    Diproses: (r) =>
      ['Diterima', 'Diverifikasi', 'Diprioritaskan', 'Ditugaskan'].includes(r.status),
    Ditanggapi: (r) => r.status === 'Dalam Perbaikan',
    Selesai: (r) => r.status === 'Selesai',
  };

  const v = rows
    .filter(G[tab])
    .sort((a, b) => (new Date(a.created_at) - new Date(b.created_at)) * (sort === 'asc' ? 1 : -1));

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4 sm:gap-6">
      <div className="flex flex-col gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-white dark:from-slate-900 dark:to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Riwayat Pengaduan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Berikut adalah daftar pengaduan yang pernah Anda buat.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
            <button
              onClick={() => setTab('Semua')}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                tab === 'Semua'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua ({rows.length})
            </button>
            <button
              onClick={() => setTab('Diproses')}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                tab === 'Diproses'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Diproses ({rows.filter(G.Diproses).length})
            </button>
            <button
              onClick={() => setTab('Ditanggapi')}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                tab === 'Ditanggapi'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Ditanggapi ({rows.filter(G.Ditanggapi).length})
            </button>
            <button
              onClick={() => setTab('Selesai')}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                tab === 'Selesai'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Selesai ({rows.filter(G.Selesai).length})
            </button>
            <select
              className="ml-auto px-3 py-1.5 rounded-full text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>
          </div>
          <Table rows={v} />
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700 h-fit">
        <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Ringkasan Pengaduan
        </h3>
        <div className="space-y-2">
          {Object.entries(G)
            .filter(([k]) => k !== 'Semua')
            .map(([t, fn]) => (
              <div
                key={t}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <span className="text-sm text-slate-700 dark:text-slate-300">{t}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">
                  {rows.filter(fn).length}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
