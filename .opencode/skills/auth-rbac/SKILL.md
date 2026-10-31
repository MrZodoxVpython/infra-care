---
name: Auth & RBAC
description: Aturan autentikasi dan otorisasi INFRA-CARE — matriks peran, JWT, Guard frontend, cek kepemilikan, dan pola endpoint aman. Gunakan saat menambah/mengubah login, pengguna, penugasan, atau akses data.
---

# Auth & RBAC

## Peran

| Peran | Kode | Kemampuan |
| --- | --- | --- |
| Masyarakat | `masyarakat` | buat pengaduan, lihat/ tracking miliknya, notifikasi, profil |
| Petugas Lapangan | `petugas` | lihat pengaduan, ubah status tugas sendiri/claim, peta, laporan, pengaturan akun |
| Admin Pemerintah | `admin` | semua pengaduan, assign/hapus, kelola pengguna, laporan, pengaturan sistem |

## Matriks Endpoint

| Endpoint | publik | masyarakat | petugas | admin |
| --- | --- | --- | --- | --- |
| `POST /auth/login`, `/auth/register` | ✅ | – | – | – |
| `GET /public/stats` | ✅ | – | – | – |
| `GET /auth/me`, `PUT /auth/me`, `PUT /auth/password` | – | ✅ | ✅ | ✅ |
| `GET /stats` | – | ✅ (miliknya) | ✅ | ✅ |
| `GET /complaints` | – | ✅ (miliknya) | ✅ | ✅ |
| `GET /complaints/:kode` | – | ✅ (miliknya) | ✅ | ✅ |
| `POST /complaints` | – | ✅ | – | – |
| `PATCH /complaints/:id/status` | – | – | ✅ (tugasnya/claim) | ✅ |
| `PATCH /complaints/:id/assign` | – | – | – | ✅ |
| `DELETE /complaints/:id` | – | – | – | ✅ |
| `GET/POST/PATCH /users*` | – | – | – | ✅ |
| `GET /reports` | – | – | ✅ | ✅ |
| `GET /settings` | – | – | ✅ | ✅ |
| `PUT /settings` | – | – | – | ✅ |
| `GET /notifications`, `POST /notifications/read-all` | – | ✅ | ✅ | ✅ |

## JWT

- Dibuat `sign(u)` dengan payload `{id,nama,email,role}`, berlaku 7 hari.
- **Tidak** memuat `foto` (cegah header 494 di Vercel).
- Disimpan di `localStorage` (`token`), user di `localStorage` (`user`).
- `api()` membuang token >4000 karakter dan menangani 431/494 dengan logout paksa.
- `getUser()` hanya untuk UI; backend tetap sumber kebenaran.

## Middleware

```js
const auth = roles => (req, res, next) => {
  try {
    req.user = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), SECRET);
  } catch {
    return res.status(401).json({ message: 'Belum login' });
  }
  if (roles && !roles.includes(req.user.role))
    return res.status(403).json({ message: 'Tidak diizinkan' });
  next();
};
```

- `auth()` = hanya butuh login.
- `auth(['admin'])` = hanya admin.
- `auth(['admin','petugas'])` = admin/petugas.

## Aturan Kepemilikan

| Aksi | Aturan |
| --- | --- |
| Masyarakat lihat detail | `complaint.user_id === req.user.id`, else 403 |
| Masyarakat daftar | query otomatis `where user_id=$1` |
| Petugas ubah status | jika `petugas_id` ada dan ≠ dirinya → 403; jika null → claim otomatis |
| Petugas daftar | saat ini melihat semua (untuk koordinasi); jangan mengubah tanpa keputusan produk |
| Admin assign | hanya `petugas` aktif; lepas assign mengembalikan status |
| Admin kelola user | tidak bisa menonaktifkan/menurunkan diri sendiri; minimal 1 admin aktif |
| Notifikasi | hanya `user_id = req.user.id` |

## Frontend

- `Guard roles={[...]}` membungkus route; jika tidak berhak → `/app`.
- Menu `MENU[role]` menentukan navigasi, bukan keamanan.
- Setelah login: simpan token + user, `navigate('/app')`.
- Setelah logout: `localStorage.clear()`, ke `/`.
- `Layout` memanggil `/auth/me` setiap perubahan path; jika gagal dan token tidak ada → login.
- Perubahan profil memicu event `user:refresh` agar topbar/sidebar ikut.

## Skenario Uji

| Skenario | Harapan |
| --- | --- |
| Tanpa token ke `/api/users` | 401 |
| Masyarakat ke `/api/users` | 403 |
| Petugas ke `/api/users` | 403 |
| Petugas ke `/api/reports` | 200 |
| Petugas ubah tugas orang lain | 403 |
| Petugas ubah tugas tanpa petugas | 200 + `petugas_id` terisi |
| Masyarakat buka tracking orang lain | 403 |
| Admin nonaktifkan akun | login berikutnya 403 |
| Admin nonaktifkan diri sendiri | 400 |
| Admin terakhir dinonaktifkan | 400 |

Gunakan `deploy-verify` untuk uji produksi read-only.

## Jebakan

1. **`aktif` hanya dicek saat login.** Token lama tetap bisa dipakai sampai 7 hari. Jika menambah endpoint sensitif, pertimbangkan cek status user.
2. **Jangan percaya `req.user.role` dari frontend.** Payload JWT ditandatangani; tetap validasi di server.
3. **Jangan mengandalkan `Guard`.** Endpoint tetap wajib `auth([...])`.
4. **Jangan menaruh `foto` di JWT.** Header bisa membengkak dan ditolak Vercel.
5. **Jangan mengembalikan `password`.** Pilih kolom eksplisit.
6. **Jangan menambah role baru** tanpa memperbarui `ROLE`, `MENU`, `Guard`, schema check, dan matriks ini.

## Menambah Endpoint Berperan

```js
app.get('/api/contoh', auth(['admin','petugas']), wrap(async (req, res) => {
  await schemaReady;
  const rows = await q('select id,judul,status from complaints order by created_at desc');
  res.json(rows);
}));
```

Checklist:
- [ ] `auth([...])` sesuai matriks.
- [ ] Filter kepemilikan bila perlu.
- [ ] Validasi input.
- [ ] 401/403/404 konsisten.
- [ ] Uji semua peran.
- [ ] Perbarui `references`/dokumen bila aturan berubah.
