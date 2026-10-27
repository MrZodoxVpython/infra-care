import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, CheckCircle2, Copy, Eye, FileText, Home } from 'lucide-react';
import { api, tgl } from '../api.js';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Sukses() {
  const { kode } = useParams();
  const [c, setC] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api('/complaints/' + kode).then(setC);
  }, [kode]);

  if (!c)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 dark:text-slate-400">Memuat...</p>
      </div>
    );

  const R = [
    ['Judul', c.judul],
    ['Kategori', c.kategori],
    ['Lokasi', c.lokasi],
    ['Deskripsi', c.deskripsi],
    ['Tanggal', tgl(c.created_at)],
  ];

  const copyKode = () => {
    navigator.clipboard?.writeText(c.kode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-4 sm:gap-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Pengaduan Berhasil Dikirim!
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
          Terima kasih telah melaporkan kerusakan infrastruktur.
          <br />
          Laporan Anda telah kami terima dan sedang diproses.
        </p>
        <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Nomor Pengaduan Anda
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-primary">{c.kode}</span>
            <button
              onClick={copyKode}
              className="p-2 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">Tanggal Pengaduan</div>
            <div className="font-semibold text-slate-800 dark:text-white">{tgl(c.created_at)}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">Prioritas</div>
            <div className="font-semibold text-slate-800 dark:text-white">{c.urgensi}</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <Link
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primaryDark transition-colors"
            to="/app"
          >
            <Home className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            to={'/app/tracking/' + c.kode}
          >
            <Eye className="w-4 h-4" />
            Lihat Detail Pengaduan
          </Link>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Ringkasan Pengaduan
        </h3>
        <div className="space-y-3">
          {R.map(([k, v]) => (
            <div key={k}>
              <div className="text-xs text-slate-500 dark:text-slate-400">{k}</div>
              <div className="text-sm text-slate-800 dark:text-white mt-0.5">{v}</div>
            </div>
          ))}
          {c.foto && (
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Foto Bukti</div>
              <img src={c.foto} className="w-full rounded-xl object-cover max-h-60" />
            </div>
          )}
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status</div>
            <StatusBadge s={c.urgensi} />
          </div>
        </div>
      </div>
    </div>
  );
}
