---
name: Codebase Map
description: Peta arsitektur INFRA-CARE — file, halaman, rute, endpoint, model data, dan tempat yang tepat untuk perubahan. Gunakan saat baru mengenal area kode atau sebelum menjelajah manual.
---

# Codebase Map

## Arsitektur

```text
Browser
  └─ React SPA (Vite)  frontend/src
       ├─ App.jsx       semua halaman, komponen, route, state
       ├─ api.js        fetch wrapper + token + format tanggal
       └─ styles.css    design system + dark mode + responsif
  └─ /api/*  →  Express (backend/server.js)  →  PostgreSQL
```

Deploy: `vercel.json` mendefinisikan dua service (`frontend` Vite, `backend` Express) dan rewrite `/api/*` ke backend, sisanya ke frontend.

## File Inti

| File | Isi | Kapan disentuh |
| --- | --- | --- |
| `frontend/src/App.jsx` | Landing, Login, Layout, Dashboard, Buat, Tracking, Riwayat, Notif, Kelola, Profil, Peta, DataMasyarakat, Laporan, Pengaturan, route & guard | Hampir semua perubahan UI |
| `frontend/src/styles.css` | Token, global, landing, dashboard, admin (`rw/pf/ad/kl/pt/dm/lp/st`), dark, media query | Setiap perubahan visual |
| `frontend/src/api.js` | `api()`, `getUser()`, `tgl()`, `slug()` | Perubahan cara memanggil API/format |
| `backend/server.js` | Semua endpoint, auth JWT, RBAC, schema runtime, settings, reports | Perubahan data/API |
| `backend/schema.sql` | Schema dasar + seed-compatible | Perubahan model data |
| `backend/seed.js` | Akun & data demo | Menambah data demo |
| `vercel.json` | Service & rewrite | Mengubah routing/deploy |
| `AGENTS.md` | Aturan proyek | Menambah konvensi |

## Halaman & Rute

| Rute | Komponen | Peran | Catatan |
| --- | --- | --- | --- |
| `/` | `Landing` | publik | statistik publik |
| `/login` | `Login` | publik | login/register |
| `/app` | `Home` → `Dashboard` | semua | konten beda per peran |
| `/app/buat` | `Buat` | masyarakat | form + peta + foto |
| `/app/sukses/:kode` | `Sukses` | masyarakat | konfirmasi |
| `/app/tracking` | `Tracking` | semua | cari kode |
| `/app/tracking/:kode` | `Tracking` | semua | detail + log |
| `/app/riwayat` | `Riwayat` | semua | daftar laporan |
| `/app/notifikasi` | `Notif` | semua | tandai dibaca |
| `/app/kelola` | `Kelola` | admin, petugas | tabel, assign, status, hapus |
| `/app/peta` | `Peta` | admin, petugas | Leaflet |
| `/app/data-masyarakat` | `DataMasyarakat` | admin | CRUD pengguna, modal |
| `/app/laporan` | `Laporan` | admin, petugas | KPI, chart, SLA |
| `/app/pengaturan` | `Pengaturan` | admin, petugas | akun, keamanan, sistem |
| `/app/profil` | `Profil` | semua | profil pengguna |
| `/app/*` | `Soon` | semua | fallback |

Menu sidebar didefinisikan di `MENU` berdasarkan `role`; label peran di `ROLE`.

## Endpoint

| Method | Path | Akses | Fungsi |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | publik | login, cek `aktif` |
| POST | `/api/auth/register` | publik | daftar masyarakat |
| GET/PUT | `/api/auth/me` | login | profil sendiri |
| PUT | `/api/auth/password` | login | ganti password |
| GET | `/api/public/stats` | publik | statistik landing |
| GET | `/api/stats` | login | statistik dashboard (filter per peran) |
| GET | `/api/complaints` | login | daftar (masyarakat hanya miliknya) |
| GET | `/api/complaints/:kode` | login | detail + log (cek pemilik) |
| POST | `/api/complaints` | masyarakat | buat + auto-assign opsional |
| PATCH | `/api/complaints/:id/status` | admin, petugas | ubah status (petugas hanya miliknya/claim) |
| PATCH | `/api/complaints/:id/assign` | admin | tugaskan/lepas petugas |
| DELETE | `/api/complaints/:id` | admin | hapus |
| GET/POST | `/api/users` | admin | daftar/filter & buat pengguna |
| PATCH | `/api/users/:id` | admin | ubah nama/email/role/aktif |
| POST | `/api/users/:id/reset-password` | admin | reset password |
| GET | `/api/reports` | admin, petugas | agregat laporan + SLA |
| GET | `/api/settings` | admin, petugas | baca pengaturan |
| PUT | `/api/settings` | admin | simpan pengaturan |
| GET | `/api/notifications` | login | notifikasi sendiri |
| POST | `/api/notifications/read-all` | login | tandai semua dibaca |

## Model Data

```text
users(id, nama, email, password, role, aktif, foto, created_at)
complaints(id, kode, judul, kategori, deskripsi, foto, lokasi, lat, lng,
           urgensi, status, user_id, petugas_id, created_at, updated_at)
complaint_logs(id, complaint_id, status, catatan, created_at)
notifications(id, user_id, tipe, judul, isi, dibaca, created_at)
app_settings(key, value, updated_at)
```

- `role`: `masyarakat` | `admin` | `petugas`.
- `status`: `Diterima`, `Diverifikasi`, `Diprioritaskan`, `Ditugaskan`, `Dalam Perbaikan`, `Selesai`, `Ditolak`.
- `urgensi`: `Tinggi`, `Sedang`, `Rendah`.
- `users.aktif` dan tabel `app_settings` dibuat runtime oleh `schemaReady` (tetap ada di `schema.sql`).

## Tempat Perubahan Umum

| Kebutuhan | Sentuh |
| --- | --- |
| Menu/route baru | `MENU`, `ROLE`, `<Routes>` di `App.jsx` |
| Endpoint baru | `backend/server.js` + `api.js` bila perlu |
| Kolom/tabel baru | `schemaReady` di `server.js` + `schema.sql` |
| Warna/komponen | `styles.css` + `ui-design-system` |
| Filter/pencarian | komponen halaman terkait (`Kelola`, `DataMasyarakat`, `Laporan`) |
| Format tanggal/kode | `api.js` (`tgl`, `slug`) |
| Aturan deploy | `vercel.json`, README |

## Cara Recon Cepat

```bash
grep -n "function Kelola\|function Laporan\|function Pengaturan" frontend/src/App.jsx
grep -n "app.get\|app.post\|app.patch\|app.delete" backend/server.js
grep -n "rw-hero\|pf-card\|lp-panel" frontend/src/styles.css
```

## Jebakan

- `App.jsx` adalah file besar; jangan mengasumsikan satu komponen = satu file.
- Banyak style inline untuk dark mode di `Table`/`Dashboard`. Saat mengubah tema, cek keduanya.
- `data-label` wajib untuk tabel yang berubah jadi kartu.
- `sign()` tidak mengirim `foto`; jangan menambah data besar ke JWT.
- `users.aktif` hanya dicek saat login, bukan setiap request.
- Schema runtime dan `schema.sql` harus tetap sinkron.

Detail endpoint & halaman: `references/api-map.md`, `references/page-map.md`.
