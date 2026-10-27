import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { STATUS } from '../constants.js';
import { tgl } from '../api.js';
import StatusBadge from './StatusBadge.jsx';

export default function Table({ rows, admin, onChange, compact, dark }) {
  if (compact) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">
                Judul Pengaduan
              </th>
              <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">
                Tanggal
              </th>
              <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              >
                <td className="py-2.5 sm:py-3 px-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={
                        r.foto ||
                        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=80&h=80&fit=crop'
                      }
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 dark:text-white truncate text-sm">
                        {r.judul}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {r.kategori} · {r.lokasi}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 sm:py-3 px-2 text-right text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {tgl(r.created_at)}
                </td>
                <td className="py-2.5 sm:py-3 px-2 text-right">
                  <StatusBadge s={r.status} dark={dark} />
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="3" className="text-center py-6 text-slate-500 dark:text-slate-400">
                  Belum ada data pengaduan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50">
            <th className="text-left py-3 px-2 sm:px-3 font-semibold text-slate-600 dark:text-slate-400">
              No.
            </th>
            <th className="text-left py-3 px-2 sm:px-3 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
              Tanggal
            </th>
            <th className="text-left py-3 px-2 sm:px-3 font-semibold text-slate-600 dark:text-slate-400">
              Judul Pengaduan
            </th>
            <th className="text-left py-3 px-2 sm:px-3 font-semibold text-slate-600 dark:text-slate-400">
              Kategori
            </th>
            <th className="text-left py-3 px-2 sm:px-3 font-semibold text-slate-600 dark:text-slate-400">
              Lokasi
            </th>
            {admin && (
              <th className="text-left py-3 px-2 sm:px-3 font-semibold text-slate-600 dark:text-slate-400">
                Pelapor
              </th>
            )}
            <th className="text-left py-3 px-2 sm:px-3 font-semibold text-slate-600 dark:text-slate-400">
              Status
            </th>
            <th className="text-left py-3 px-2 sm:px-3 font-semibold text-slate-600 dark:text-slate-400">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.id}
              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
            >
              <td className="py-3 px-2 sm:px-3 text-slate-700 dark:text-slate-300">{i + 1}</td>
              <td className="py-3 px-2 sm:px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                {tgl(r.created_at)}
              </td>
              <td className="py-3 px-2 sm:px-3">
                <div className="font-semibold text-slate-800 dark:text-white">{r.judul}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{r.kode}</div>
              </td>
              <td className="py-3 px-2 sm:px-3 text-slate-600 dark:text-slate-300">{r.kategori}</td>
              <td className="py-3 px-2 sm:px-3 text-slate-600 dark:text-slate-300 max-w-[150px] truncate">
                {r.lokasi}
              </td>
              {admin && (
                <td className="py-3 px-2 sm:px-3 text-slate-600 dark:text-slate-300">
                  {r.pelapor}
                </td>
              )}
              <td className="py-3 px-2 sm:px-3">
                {onChange ? (
                  <select
                    className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                    value={r.status}
                    onChange={(e) => onChange(r, e.target.value)}
                  >
                    {STATUS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge s={r.status} />
                )}
              </td>
              <td className="py-3 px-2 sm:px-3">
                <Link
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-primary dark:bg-slate-800 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                  to={'/app/tracking/' + r.kode}
                >
                  <Eye className="w-3 h-3" />
                  Detail
                </Link>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td
                colSpan={admin ? 8 : 7}
                className="text-center py-6 text-slate-500 dark:text-slate-400"
              >
                Belum ada data pengaduan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
