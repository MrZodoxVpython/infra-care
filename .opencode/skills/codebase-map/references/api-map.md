# Peta Endpoint

Sumber kebenaran: `backend/server.js`. Semua respons error berupa JSON `{message}`.

## Autentikasi

| Endpoint | Body / Query | Sukses | Error penting |
| --- | --- | --- | --- |
| `POST /api/auth/login` | `{email,password}` | `{token,user}` | 400 kredensial salah, 403 akun nonaktif |
| `POST /api/auth/register` | `{nama,email,password}` | `{token,user}` | 400 validasi/email duplikat |
| `GET /api/auth/me` | – | `{id,nama,email,role,foto,aktif}` | 401 |
| `PUT /api/auth/me` | `{nama,email,foto}` | user terbaru | 400 email dipakai |
| `PUT /api/auth/password` | `{oldPassword,newPassword}` | `{ok:true}` | 400 password lama salah / <6 |

Catatan: login hanya memeriksa `aktif` saat itu. Token lama tetap berlaku sampai 7 hari.

## Pengaduan

| Endpoint | Akses | Catatan |
| --- | --- | --- |
| `GET /api/complaints` | login | query: `status,kategori,urgensi,q,from,to`; masyarakat otomatis `user_id` sendiri |
| `GET /api/complaints/:kode` | login | masyarakat hanya miliknya; menyertakan `logs` |
| `POST /api/complaints` | masyarakat | wajib judul/kategori/deskripsi/lokasi/urgensi/foto; kode `INF-YYYY-00001` |
| `PATCH /api/complaints/:id/status` | admin, petugas | status harus dari `STATUS`; petugas hanya tugasnya, boleh claim jika belum ada |
| `PATCH /api/complaints/:id/assign` | admin | `petugas_id` null = lepas; validasi petugas aktif |
| `DELETE /api/complaints/:id` | admin | hapus permanen |

## Pengguna (admin)

| Endpoint | Query/Body | Catatan |
| --- | --- | --- |
| `GET /api/users` | `role,q,status` | agregat laporan/tugas per user |
| `POST /api/users` | `{nama,email,password,role}` | password ≥6, email unik |
| `PATCH /api/users/:id` | `{nama,email,role,aktif}` | tidak bisa menurunkan/menonaktifkan diri sendiri; minimal 1 admin aktif |
| `POST /api/users/:id/reset-password` | `{newPassword}` | ≥6 |

## Laporan & Pengaturan

| Endpoint | Akses | Catatan |
| --- | --- | --- |
| `GET /api/reports` | admin, petugas | query `from,to`; summary, byStatus, byKategori, byUrgensi, byMonth, petugas, settings |
| `GET /api/settings` | admin, petugas | key: `instansi_nama`, `instansi_kontak`, `sla_hari`, `auto_assign` |
| `PUT /api/settings` | admin | `sla_hari` 1–365; `auto_assign` `'true'/'false'` |

## Notifikasi & Statistik

| Endpoint | Akses | Catatan |
| --- | --- | --- |
| `GET /api/notifications` | login | hanya milik sendiri, terbaru dulu |
| `POST /api/notifications/read-all` | login | set `dibaca=true` |
| `GET /api/public/stats` | publik | total, selesai, proses |
| `GET /api/stats` | login | dashboard; masyarakat difilter `user_id` |

## Pola Implementasi Endpoint Baru

```js
app.get('/api/contoh', auth(['admin']), wrap(async (req, res) => {
  await schemaReady;
  const { q: search } = req.query;
  const rows = await q(
    'select id, nama from users where role=$1 and ($2::text is null or nama ilike $2)',
    ['petugas', search ? `%${search}%` : null]
  );
  res.json(rows);
}));
```

Aturan:
- Jangan menyusun SQL dengan interpolasi input pengguna.
- Untuk `ORDER BY` dinamis, pakai allowlist kolom.
- Cek kepemilikan data sebelum update/delete.
- Kembalikan 404 untuk data tidak ada, 403 untuk bukan haknya.
- Jangan mengirim `password` di respons.
