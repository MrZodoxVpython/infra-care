import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CloudUpload, FileText } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { api } from '../api.js';
import { KAT } from '../constants.js';
import { customIcon, MapClicker } from '../lib/map.jsx';

export default function Buat() {
  const nav = useNavigate();
  const [f, setF] = useState({
    judul: '',
    kategori: '',
    deskripsi: '',
    lokasi: '',
    lat: -6.2088,
    lng: 106.8456,
    urgensi: 'Tinggi',
  });
  const [foto, setFoto] = useState(null);
  const [e, setE] = useState('');
  const [busy, setBusy] = useState(false);
  const [mapCenter, setMapCenter] = useState([-7.0292, 112.7461]);
  const [markerPos, setMarkerPos] = useState([-7.0292, 112.7461]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const set = (k) => (v) => setF({ ...f, [k]: v.target.value });

  const compressImage = (file, maxSide = 1280, quality = 0.75) =>
    new Promise((res, rej) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const s = Math.min(1, maxSide / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        res(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        rej(new Error('Gambar tidak dapat dibaca'));
      };
      img.src = url;
    });

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          searchQuery,
        )}+Indonesia`,
        { headers: { 'User-Agent': 'INFRA-CARE/1.0' } },
      );
      const d = await r.json();
      setSearchResults(
        d.map((x) => ({
          label: x.display_name,
          lat: parseFloat(x.lat),
          lng: parseFloat(x.lon),
        })),
      );
    } catch {
      setSearchResults([]);
    }
  };

  const selectLoc = (loc) => {
    setSearchQuery(loc.label);
    setF({ ...f, lokasi: loc.label, lat: loc.lat, lng: loc.lng });
    setMapCenter([loc.lat, loc.lng]);
    setMarkerPos([loc.lat, loc.lng]);
    setSearchResults([]);
  };

  const onMapClick = (e) => {
    setMarkerPos([e.latlng.lat, e.latlng.lng]);
    setMapCenter([e.latlng.lat, e.latlng.lng]);
    setF({
      ...f,
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      lokasi: `Titik di peta (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`,
    });
  };

  const submit = async () => {
    setE('');
    if (!foto) return setE('Foto / bukti kerusakan wajib diunggah');
    if (foto.size > 5 * 1024 * 1024) return setE('Ukuran foto maksimal 5MB');
    if (!f.lokasi) return setE('Lokasi wajib dipilih dari peta');
    setBusy(true);
    try {
      const foto64 = await compressImage(foto);
      if (!foto64 || foto64.length < 100) return setE('Gagal memproses foto, coba upload ulang');
      const c = await api('/complaints', { method: 'POST', body: { ...f, foto: foto64 } });
      window.dispatchEvent(new Event('notif:refresh'));
      nav('/app/sukses/' + c.kode);
    } catch (x) {
      setE(x.message);
    }
    setBusy(false);
  };

  return (
    <div className="grid xl:grid-cols-[1fr_340px] gap-4 sm:gap-6 items-start">
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <Link
          to="/app"
          className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="flex items-center gap-2 mt-2 mb-1">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
            Form Pengaduan
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 sm:mb-6">
          Sampaikan laporan kerusakan infrastruktur dengan lengkap dan jelas.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Judul Pengaduan *
            </label>
            <input
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="Contoh: Jalan Berlubang di Jl. Melati"
              value={f.judul}
              onChange={set('judul')}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kategori *
            </label>
            <select
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              value={f.kategori}
              onChange={set('kategori')}
            >
              <option value="">Pilih kategori</option>
              {KAT.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 mt-4">
          Deskripsi *
        </label>
        <textarea
          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          rows="4"
          maxLength="500"
          placeholder="Jelaskan kondisi kerusakan secara detail..."
          value={f.deskripsi}
          onChange={set('deskripsi')}
        />
        <div className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">
          {f.deskripsi.length}/500
        </div>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Foto / Bukti Kerusakan *
            </label>
            <label className="w-full border border-dashed border-slate-300 dark:border-slate-600 rounded-xl px-4 py-6 sm:py-8 bg-slate-50 dark:bg-slate-800 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex flex-col items-center gap-2">
              <CloudUpload className="w-8 h-8 text-slate-400" />
              {foto ? (
                <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-full">
                  {foto.name}
                </span>
              ) : (
                <>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Klik untuk mengunggah foto
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Format: JPG, PNG (Maks. 5MB)
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg"
                hidden
                onChange={(x) => setFoto(x.target.files[0])}
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Lokasi Kerusakan *
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="in"
                style={{ flex: 1 }}
                placeholder="Cari desa, jalan, atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchLocation()}
              />
              <button className="btn s" onClick={searchLocation}>
                Cari
              </button>
            </div>
            {searchResults.length > 0 && (
              <div
                style={{
                  border: '1px solid #edf3fb',
                  borderRadius: 8,
                  background: '#fff',
                  maxHeight: 200,
                  overflowY: 'auto',
                  marginBottom: 8,
                }}
              >
                {searchResults.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 8,
                      cursor: 'pointer',
                      borderBottom: i < searchResults.length - 1 ? '1px solid #f1f5f9' : 'none',
                      fontSize: 13,
                    }}
                    onClick={() => selectLoc(r)}
                  >
                    <b>{r.label}</b>
                    <br />
                    <span className="mu" style={{ fontSize: 11 }}>
                      Lat: {r.lat.toFixed(4)}, Lng: {r.lng.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div
              style={{
                height: '12.5vh',
                border: '1px solid #edf3fb',
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
                marginBottom: 8,
              }}
            >
              <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }}>
                <MapClicker onClick={onMapClick} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker
                  position={markerPos}
                  icon={customIcon}
                  draggable
                  onDragEnd={(e) => {
                    const p = e.target.getLatLng();
                    setMarkerPos([p.lat, p.lng]);
                    setMapCenter([p.lat, p.lng]);
                    setF({ ...f, lat: p.lat, lng: p.lng });
                  }}
                >
                  <Popup>Titik lokasi pengaduan</Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="mu" style={{ textAlign: 'center', fontSize: 12 }}>
              Titik terpilih: {markerPos[0].toFixed(6)}, {markerPos[1].toFixed(6)}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label>Tingkat Urgensi *</label>
            <div className="urg">
              {[
                ['Tinggi', 'Butuh penanganan segera'],
                ['Sedang', 'Mengganggu aktivitas masyarakat'],
                ['Rendah', 'Kerusakan ringan'],
              ].map(([u, d]) => (
                <div
                  key={u}
                  className={'tag ' + u.toLowerCase() + (f.urgensi === u ? ' on' : '')}
                  onClick={() => setF({ ...f, urgensi: u })}
                >
                  <b>{u}</b>
                  {d}
                </div>
              ))}
            </div>
          </div>
          {e && <div className="err">{e}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 18, alignItems: 'center' }}>
            <span className="mu" style={{ flex: 1 }}>
              ℹ Pastikan data yang Anda isi sudah benar agar pengaduan dapat diproses dengan cepat.
            </span>
            <button className="btn" disabled={busy} onClick={submit}>
              ✈ {busy ? 'Mengirim...' : 'Kirim Pengaduan'}
            </button>
          </div>
        </div>
      </div>
      <div className="stk">
        <img src="/stk-img.jpg" alt="Infrastruktur" className="stk-img" />
        <div className="card">
          <h3>Contoh Infrastruktur yang Dapat Dilaporkan</h3>
          <div className="row2" style={{ marginTop: 12 }}>
            {KAT.map((k) => (
              <span className="tag" key={k}>
                {k}
              </span>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>💡 Tips Pengaduan</h3>
          {[
            'Gunakan judul yang jelas dan spesifik.',
            'Lengkapi deskripsi dengan detail kondisi kerusakan.',
            'Lampirkan foto yang menunjukkan lokasi kerusakan.',
            'Pastikan lokasi sudah sesuai dengan titik kejadian.',
            'Pilih tingkat urgensi yang sesuai.',
          ].map((t) => (
            <p key={t}>✅ {t}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
