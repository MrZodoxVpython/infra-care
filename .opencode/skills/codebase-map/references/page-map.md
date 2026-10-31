# Peta Halaman & Komponen

Semua komponen berada di `frontend/src/App.jsx`.

## Publik

| Komponen | Isi | Kelas utama |
| --- | --- | --- |
| `Landing` | hero, stats publik, cara kerja, CTA | `sky`, `nav`, `hero`, `stats4` |
| `Login` | form login/register, fitur | `login`, `lcard`, `feat` |

## Shell

| Komponen | Isi |
| --- | --- |
| `Layout` | sidebar `MENU[role]`, topbar, tema, notifikasi, dropdown logout |
| `Guard` | cek `getUser().role`; redirect `/app` bila tidak berhak |
| `Table` | 3 varian: compact, `rw-table`, dan inline-style lama |

## Per Peran

| Peran | Menu |
| --- | --- |
| masyarakat | Dashboard, Buat, Tracking, Riwayat, Notifikasi, Profil |
| admin | Dashboard, Kelola, Peta, Data Masyarakat, Laporan, Pengaturan |
| petugas | Dashboard, Tugas (Kelola), Peta, Laporan, Profil, Pengaturan |

## Halaman Detail

| Komponen | Pola UI | Catatan |
| --- | --- | --- |
| `Dashboard` | `d-*` | statistik, aksi cepat, peta mini, aktivitas |
| `Buat` | `bp-*` | stepper, peta klik, upload foto (base64 dikompres) |
| `Tracking` | `tr-*` | timeline status, log, peta |
| `Riwayat` | `grid2 rw-page`, `tabs` | daftar laporan + filter |
| `Notif` | `nt*` | daftar notifikasi, tandai dibaca |
| `Kelola` | `rw-hero`, `rw-toolbar`, `kl-table` | filter, assign, status, hapus, kartu ≤820px |
| `Peta` | `pt-*` | Leaflet, list lokasi, popup |
| `DataMasyarakat` | `rw-hero`, `ad-toolbar`, `dm-table` | modal tambah/edit/reset, kartu ≤820px |
| `Laporan` | `lp-*` | KPI, chart, SLA, tabel petugas |
| `Pengaturan` | `st-page`, `pf-*` | tab akun/keamanan/sistem, upload foto |
| `Profil` | `pf-*` | profil pengguna |

## Pola State Umum

- `busy` — cegah double submit; tombol `disabled`.
- `msg` / `err` — umpan balik sukses/error.
- `dirty` — aktifkan tombol simpan hanya jika berubah.
- `dark` — dibaca dari `document.documentElement.classList.contains('dark')` atau MutationObserver.
- `useEffect` — fetch awal, listener `notif:refresh` / `user:refresh`.

## Navigasi

- `NavLink` untuk menu; `end` pada `/app` agar tidak selalu aktif.
- `useParams` untuk `:kode` (tracking) dan `:id` (modal).
- Redirect setelah aksi memakai `useNavigate`.

## Saat Menambah Halaman

1. Tambah komponen di `App.jsx`.
2. Tambah `<Route>` di blok `/app` dengan `Guard` bila perlu.
3. Tambah menu di `MENU[role]`.
4. Pilih kelas halaman yang ada (`rw-hero`, `pf-layout`, `lp-*`) — jangan mulai dari nol.
5. Tambah CSS ter-scope + dark mode + responsif.
6. Verifikasi build, kelas, dan tampilan.
