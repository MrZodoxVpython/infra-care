import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  Construction,
  Eye,
  FileBarChart,
  FileText,
  Map,
  MapPin,
  PlusCircle,
  Settings,
  Users,
  Wrench,
  XCircle,
  Zap,
} from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { api, getUser } from '../api.js';
import { customIcon } from '../lib/map.jsx';
import Table from '../components/Table.jsx';

export default function Dashboard() {
  const u = getUser();
  const m = u.role === 'masyarakat';
  const [s, setS] = useState(null);
  const [rows, setRows] = useState([]);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [mapCenter, setMapCenter] = useState([-7.0292, 112.7461]);

  useEffect(() => {
    const ck = () => setDark(document.documentElement.classList.contains('dark'));
    ck();
    const ob = new MutationObserver(ck);
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => ob.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    api('/stats').then(setS);
    api('/complaints').then(setRows);
  }, []);

  if (!s)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 dark:text-slate-400">Memuat...</p>
      </div>
    );

  const tot = s.total || 1;
  const STATS = m
    ? [
        ['Total Pengaduan', s.total, 'Dari semua laporan Anda', FileText, '#1565d8'],
        ['Diproses', s.diproses, 'Sedang diverifikasi / diproses', Clock, '#f59e0b'],
        ['Dalam Perbaikan', s.perbaikan, 'Sedang ditangani petugas', Wrench, '#ef4444'],
        ['Selesai', s.selesai, 'Telah ditangani', CheckCircle2, '#22c55e'],
      ]
    : [
        ['Total Pengaduan', s.total, 'Seluruh pengaduan masuk', FileText, '#1565d8'],
        ['Dalam Proses', s.diproses + s.perbaikan, 'Sedang ditangani', Clock, '#f59e0b'],
        ['Selesai', s.selesai, 'Telah ditangani', CheckCircle2, '#22c55e'],
        ['Ditolak', s.ditolak, 'Tidak memenuhi syarat', XCircle, '#ef4444'],
      ];

  const quickActions = m
    ? [
        ['/app/buat', PlusCircle, 'Buat Pengaduan', 'Laporkan kerusakan'],
        ['/app/tracking', MapPin, 'Tracking', 'Cek status laporan'],
        ['/app/riwayat', Clock, 'Riwayat', 'Lihat riwayat'],
        ['/app/notifikasi', Bell, 'Notifikasi', 'Informasi terbaru'],
      ]
    : [
        ['/app/kelola', ClipboardList, 'Kelola', 'Pengaduan masyarakat'],
        ['/app/peta', Map, 'Peta', 'Lokasi pengaduan'],
        ['/app/laporan', FileBarChart, 'Laporan', 'Laporan infrastruktur'],
        ['/app/pengaturan', Settings, 'Pengaturan', 'Pengaturan akun'],
      ];

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col md:flex-row gap-4 sm:gap-6 items-center bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: "url('/banner-bg.jpg')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 to-white/70 dark:from-slate-900/95 dark:to-slate-900/70"></div>
            <div className="relative z-10 flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0b2a6b] dark:text-white mb-2">
                Selamat Datang, {u.nama}!
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 max-w-md">
                {m
                  ? 'Mari bersama kita jaga infrastruktur publik agar lingkungan kita semakin baik.'
                  : 'Kelola pengaduan masyarakat dan pantau kondisi infrastruktur di wilayah Anda.'}
              </p>
              {m && (
                <Link
                  className="inline-flex items-center gap-2 bg-primary text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold hover:bg-primaryDark transition-colors text-sm sm:text-base"
                  to="/app/buat"
                >
                  <PlusCircle className="w-4 h-4" />
                  Buat Pengaduan
                </Link>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2 sm:mb-3">
              Aksi Cepat
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {quickActions.map(([to, Icon, l, d]) => (
                <Link
                  key={to}
                  to={to}
                  className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center gap-1.5 sm:gap-2 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-white text-xs sm:text-sm">
                      {l}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {d}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">
                Pengaduan Terbaru
              </h3>
              <Link
                to={m ? '/app/riwayat' : '/app/kelola'}
                className="text-xs sm:text-sm text-primary hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>
            <Table rows={rows.slice(0, 5)} admin={!m} compact dark={dark} />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {STATS.map(([l, v, d, Icon, color]) => (
              <div
                key={l}
                className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                    style={{ background: color + '15' }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{l}</div>
                <div className="text-xl sm:text-2xl font-bold" style={{ color }}>
                  {v}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {d}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">
                Sebaran Pengaduan
              </h3>
              <Link to="/app/peta" className="text-xs sm:text-sm text-primary hover:underline">
                Lihat Semua →
              </Link>
            </div>
            <div
              className="rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-3 sm:mb-4"
              style={{ height: '160px' }}
            >
              <MapContainer center={mapCenter} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {rows
                  .filter((r) => r.lat && r.lng)
                  .map((r) => (
                    <Marker key={r.id} position={[r.lat, r.lng]} icon={customIcon}>
                      <Popup>{r.judul}</Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
            <div className="space-y-2">
              {s.kategori.slice(0, 4).map((k) => (
                <div
                  key={k.kategori}
                  className="border-b border-slate-100 dark:border-slate-700 pb-1.5 sm:pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300 truncate">
                      {k.kategori}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{k.n}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: Math.min((k.n / tot) * 100, 100) + '%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white mb-1.5 sm:mb-2 text-sm sm:text-base">
              Bersama Kita Wujudkan Infrastruktur yang Lebih Baik!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3 sm:mb-4">
              Laporkan kerusakan infrastruktur publik secara mudah, cepat, dan transparan melalui
              INFRA-CARE.
            </p>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <div className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-50/50 dark:bg-slate-800">
                <Construction className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
                    Mudah Digunakan
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Laporan dalam 2 menit
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-50/50 dark:bg-slate-800">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
                    Cepat Ditangani
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Respon petugas lapangan
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-50/50 dark:bg-slate-800">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
                    Transparan
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Pantau status real-time
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-50/50 dark:bg-slate-800">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
                    Untuk Semua
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Infrastruktur lebih baik
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
