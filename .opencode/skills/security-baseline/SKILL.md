---
name: Security Baseline
description: Baseline keamanan INFRA-CARE — JWT, RBAC, kepemilikan data, validasi input, XSS, upload/base64, secret, CORS, dan rate limit. Gunakan setiap menyentuh auth, API, data pengguna, atau sebelum rilis.
---

# Security Baseline

## Model Ancaman Singkat

- Aplikasi publik dengan registrasi mandiri (masyarakat).
- Tiga peran: `masyarakat`, `petugas`, `admin`.
- Token JWT disimpan di `localStorage` (rentan bila ada XSS).
- Foto dikirim sebagai base64 di JSON (bukan multipart).
- Admin dapat mengelola pengguna, menugaskan petugas, dan mengubah pengaturan.
- Database berisi data pribadi (nama, email, lokasi, foto).

## Checklist Wajib

### 1. Autentikasi
- [ ] Endpoint non-publik memakai `auth()`.
- [ ] Password di-hash bcrypt; tidak pernah dikembalikan di respons.
- [ ] Login memeriksa `aktif`; akun nonaktif → 403.
- [ ] `JWT_SECRET` di produksi tidak memakai fallback `infra-care-dev`.
- [ ] Token tidak memuat data besar (`foto` sengaja dikecualikan).
- [ ] Perubahan password memverifikasi password lama.

### 2. Otorisasi (RBAC)
- [ ] Endpoint memakai `auth([...roles])` yang tepat.
- [ ] Cek kepemilikan: masyarakat hanya data sendiri; petugas hanya tugasnya.
- [ ] Admin tidak bisa menonaktifkan/menurunkan dirinya sendiri.
- [ ] Minimal satu admin aktif dipertahankan.
- [ ] Frontend `Guard` hanya UX, bukan pengganti backend.

### 3. Validasi Input
- [ ] Field wajib, tipe, panjang, dan enum divalidasi.
- [ ] `id` diparse/divalidasi; 404 bila tidak ada.
- [ ] `sla_hari` dibatasi 1–365.
- [ ] `role` hanya dari daftar; `status` hanya dari `STATUS`.
- [ ] Body besar ditolak (limit 10mb sudah ada; jangan dinaikkan).

### 4. SQL
- [ ] Semua nilai memakai parameter `$1..$n`.
- [ ] Tidak ada interpolasi input ke SQL.
- [ ] `ORDER BY`/nama kolom dinamis memakai allowlist.
- [ ] Query baru tidak membocorkan `password`.

### 5. XSS & Konten
- [ ] Tidak memakai `dangerouslySetInnerHTML`.
- [ ] React meng-escape teks; jangan menonaktifkannya.
- [ ] `foto` sebaiknya divalidasi: `https?://` atau `data:image/(jpeg|png);base64,...`.
- [ ] Jangan menampilkan HTML dari input pengguna.

### 6. Upload / Base64
- [ ] Kompresi klien membatasi dimensi (1280px pengaduan, 512px profil).
- [ ] Ukuran file dicek (≤5 MB).
- [ ] Tipe file dibatasi `image/jpeg,image/png`.
- [ ] Base64 tidak masuk JWT atau log.
- [ ] Data URL divalidasi sebelum disimpan bila menerima dari klien.

### 7. Secret & Konfigurasi
- [ ] `.env` tidak ter-commit (`.gitignore` sudah mencakup).
- [ ] `DATABASE_URL`/`JWT_SECRET` hanya dari Environment Variables.
- [ ] Jangan mencetak isi `.env` atau token di log/chat.
- [ ] `service.json`/config MCP tidak memuat kredensial.

### 8. Transport & Header
- [ ] Produksi HTTPS (Vercel sudah).
- [ ] CORS `*` saat ini; batasi bila ada domain tetap.
- [ ] Pertimbangkan `helmet`, rate limit login, dan `express.json` limit lebih ketat.
- [ ] Error 500 tidak membocorkan detail internal ke pengguna.

### 9. Rate Limit & Abuse
- [ ] Login/registrasi rentan brute force; pertimbangkan rate limit per IP/email.
- [ ] Pembuatan pengaduan dapat spam; pertimbangkan limit per user.
- [ ] Upload base64 besar dapat membebani DB; pantau ukuran.

## Temuan yang Sudah Diketahui (jangan dianggap regresi baru)

| Risiko | Dampak | Rekomendasi |
| --- | --- | --- |
| `JWT_SECRET` fallback `infra-care-dev` | token bisa dipalsukan bila env lupa | wajib set env produksi, hapus fallback saat siap |
| `aktif` hanya dicek saat login | user nonaktif masih bisa pakai token ≤7 hari | cek `aktif` di middleware atau per request sensitif |
| Token di `localStorage` | XSS dapat mencuri sesi | pertimbangkan httpOnly cookie, sanitasi ketat |
| CORS `*` | API dapat dipanggil dari origin mana pun | batasi origin produksi |
| Tanpa rate limit | brute force/spam | tambah rate limiter |
| Pesan error 500 memuat `e.message` | bocor detail DB | log internal, kirim pesan generik |
| `foto` menerima string apa pun | URL berbahaya/placeholder rusak | validasi skema URL/data image |
| Base64 di kolom teks | DB membengkak | pertimbangkan object storage |

Jangan memperbaiki temuan ini diam-diam di tengah tugas lain; laporkan dan tawarkan perubahan terpisah.

## Uji Cepat

```bash
# scan secret sederhana
bash .opencode/skills/security-baseline/scripts/check-secrets.sh

# verifikasi produksi + RBAC (jika kredensial tersedia)
bash .opencode/skills/deploy-verify/scripts/verify-deploy.sh
```

Uji manual RBAC minimal:

```bash
# sebagai petugas, /api/users harus 403
# sebagai masyarakat, /api/complaints/:kode milik orang lain harus 403
# tanpa token, endpoint privat harus 401
# admin menonaktifkan akun -> login akun itu harus 403
```

## Pola Aman

```js
// RBAC + kepemilikan
app.patch('/api/contoh/:id', auth(['petugas']), wrap(async (req, res) => {
  const [row] = await q('select * from complaints where id=$1', [req.params.id]);
  if (!row) return res.status(404).json({ message: 'Data tidak ditemukan' });
  if (row.petugas_id && row.petugas_id !== req.user.id)
    return res.status(403).json({ message: 'Bukan tugas Anda' });
  // lanjutkan
}));
```

## Pelaporan

Format temuan: `[P0/P1/P2/P3] file:baris — risiko — dampak — bukti — saran`.
P0: bypass auth/RBAC, kebocoran data, SQL injection, secret produksi. Jangan mengeksploitasi data nyata.
