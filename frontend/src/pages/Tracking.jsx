import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, FileText, HardHat, MapPin } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { api, tgl } from '../api.js';
import { customIcon } from '../lib/map.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Tracking() {
  const { kode } = useParams();
  const nav = useNavigate();
  const [c, setC] = useState(null);
  const [list, setList] = useState([]);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const ck = () => setDark(document.documentElement.classList.contains('dark'));
    ck();
    const ob = new MutationObserver(ck);
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => ob.disconnect();
  }, []);

  useEffect(() => {
    if (kode) {
      api('/complaints/' + kode).then(setC);
    } else {
      api('/complaints').then((l) => {
        setList(l);
        if (l[0]) nav('/app/tracking/' + l[0].kode, { replace: true });
      });
    }
  }, [kode]);

  if (!kode)
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Tracking Pengaduan
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {list.length ? 'Memuat...' : 'Anda belum memiliki pengaduan.'}
        </p>
      </div>
    );

  if (!c)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 dark:text-slate-400">Memuat...</p>
      </div>
    );

  const flow = [
    'Diterima',
    'Diverifikasi',
    'Diprioritaskan',
    'Ditugaskan',
    'Dalam Perbaikan',
    'Selesai',
  ];
  const idx = flow.indexOf(c.status);
  const when = (s) => {
    const l = c.logs && c.logs.find((x) => x.status === s);
    return l ? tgl(l.created_at) : '-';
  };

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-4 sm:gap-6">
      <div className="flex flex-col gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <Link
            to="/app/riwayat"
            className="inline-flex items-center gap-1 text-primary hover:underline text-sm mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
              Tracking Pengaduan
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
            Pantau perkembangan pengaduan infrastruktur Anda secara real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center mb-6">
            {c.foto && <img src={c.foto} className="w-full sm:w-40 h-32 object-cover rounded-xl" />}
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 dark:text-white mb-1">{c.judul}</h3>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-primary dark:bg-slate-800 dark:text-blue-400 mb-2">
                {c.kategori}
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {c.lokasi}
                <br />
                {tgl(c.created_at)} · {c.kode}
              </p>
            </div>
            <StatusBadge s={c.status} dark={dark} />
          </div>
          <div className="relative">
            <div className="flex justify-between items-start overflow-x-auto pb-2">
              {flow.map((s, i) => (
                <div key={s} className="flex flex-col items-center flex-1 min-w-[80px]">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                      i <= idx
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {i < idx ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-xs font-semibold ${
                        i <= idx
                          ? 'text-slate-800 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {s}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      {when(s)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -z-10 hidden sm:block"
              style={{ margin: '0 40px' }}
            ></div>
          </div>
          {c.status === 'Ditolak' && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl mt-4 text-sm">
              Pengaduan ini ditolak.
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Peta Lokasi Pengaduan
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3">
            {c.lokasi}
            <br />
            Koordinat: {c.lat && c.lng ? `${c.lat}, ${c.lng}` : '-'}
          </p>
          {c.lat && c.lng ? (
            <>
              <div
                className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-3"
                style={{ height: '200px' }}
              >
                <MapContainer
                  center={[c.lat, c.lng]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <Marker position={[c.lat, c.lng]} icon={customIcon}>
                    <Popup>{c.judul}</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <a
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps?q=${c.lat},${c.lng}`}
              >
                Lihat di Google Maps <ChevronRight className="w-4 h-4" />
              </a>
            </>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">Lokasi tidak tersedia</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Detail Pengaduan
          </h3>
          <div className="space-y-2.5">
            {[
              ['ID Pengaduan', c.kode],
              ['Kategori', c.kategori],
              ['Judul', c.judul],
              ['Deskripsi', c.deskripsi],
              ['Tanggal', tgl(c.created_at)],
              ['Lokasi', c.lokasi],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-slate-500 dark:text-slate-400">{k}</div>
                <div className="text-sm text-slate-800 dark:text-white mt-0.5">{v}</div>
              </div>
            ))}
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tingkat Urgensi</div>
              <StatusBadge s={c.urgensi} dark={dark} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
            <HardHat className="w-5 h-5 text-primary" />
            Petugas yang Menangani
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {c.petugas_nama
              ? `${c.petugas_nama} — Petugas Lapangan`
              : 'Belum ada petugas ditugaskan.'}
          </p>
        </div>
      </div>
    </div>
  );
}
