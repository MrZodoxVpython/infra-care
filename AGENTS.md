# INFRA-CARE — Aturan Proyek

Sistem Pengaduan Infrastruktur Publik. Frontend React + Vite, backend Express + PostgreSQL, deploy di Vercel.

## Bahasa

- Berkomunikasi dengan pengguna memakai Bahasa Indonesia yang jelas dan ringkas.
- Istilah teknis boleh tetap bahasa Inggris (build, deploy, commit, endpoint).
- Pesan UI, label, validasi, dan notifikasi memakai Bahasa Indonesia.

## Peta Cepat

| Bagian | Lokasi |
| --- | --- |
| Seluruh halaman & komponen | `frontend/src/App.jsx` |
| Design system & seluruh CSS | `frontend/src/styles.css` |
| API client, sesi, format tanggal | `frontend/src/api.js` |
| API, auth, RBAC, schema runtime | `backend/server.js` |
| Schema dasar & seed | `backend/schema.sql`, `backend/seed.js` |
| Konfigurasi service Vercel | `vercel.json` |
| Panduan gaya UI (referensi desain) | `docs/panduan-gaya-ui-infra-care.html` |

Gunakan skill `codebase-map` sebelum menjelajah manual.

## Aturan Wajib

1. **Jangan merusak yang sudah ada.** Perubahan responsif atau dark mode untuk satu halaman tidak boleh mengubah tampilan desktop atau halaman lain. Utamakan selector yang sempit (`.kl-*`, `.dm-*`, `.pf-*`) daripada selector global.
2. **Ikuti design system.** Pakai token `var(--b)`, `var(--bd)`, `var(--bg)`, `var(--tx)`, `var(--mu)`, `var(--bd2)` dan kelas yang sudah ada (`rw-*`, `pf-*`, `ad-*`, `kl-*`, `pt-*`, `dm-*`, `lp-*`, `st-*`). Jangan menambah library UI atau CSS framework baru.
3. **Dark mode wajib diuji.** Semua elemen baru harus punya padanan `html.dark ...` bila memakai warna terang hardcoded. Jangan mengandalkan `filter: invert`.
4. **Responsif wajib diuji.** Minimal pada 1440, 1024, 768, 390 px. Tabel berubah menjadi kartu pada `≤820px` memakai `data-label`; jangan menghapus `data-label` dari `<td>`.
5. **Auth & RBAC di backend.** Menyembunyikan menu di frontend bukan keamanan. Setiap endpoint baru wajib memakai `auth([...roles])` dan memvalidasi kepemilikan data (`user_id` / `petugas_id`).
6. **Jangan commit rahasia.** `.env`, `DATABASE_URL`, `JWT_SECRET`, token, dan kredensial produksi tidak boleh masuk repo. Gunakan `{env:...}` atau Environment Variables Vercel.
7. **JWT tetap kecil.** `sign()` sengaja tidak memasukkan `foto`. Jangan menambahkan base64/foto ke payload token.
8. **Hormati scope.** Jangan refactor besar, ganti nama kelas, atau mengubah copy di luar permintaan. Jika menemukan masalah lain, laporkan, jangan langsung perbaiki.
9. **Verifikasi sebelum klaim selesai.** Jalankan build, cek kelas CSS, dan smoke test API. Untuk perubahan UI, ambil bukti visual bila browser tersedia.
10. **Commit atomik & pesan Indonesia.** Satu commit = satu tujuan. Format: `tambah ...`, `perbaiki ...`, `rapikan ...`, `buat ... responsif`.

## Perintah Penting

```bash
# frontend
cd frontend && npm run dev            # http://localhost:5173
cd frontend && npm run build          # wajib lolos sebelum commit

# backend
cd backend && npm start               # http://localhost:4000
cd backend && npm run seed

# verifikasi paket ini
node .opencode/skills/ui-verify/scripts/check-ui.mjs .
bash .opencode/skills/deploy-verify/scripts/verify-deploy.sh
bash .opencode/skills/performance-audit/scripts/bundle-report.sh
```

## Definition of Done

- [ ] `npm run build` lolos tanpa error.
- [ ] `check-ui.mjs` tidak menemukan kelas hilang / camelCase.
- [ ] Perubahan UI terlihat benar di light & dark, desktop & mobile.
- [ ] Endpoint baru: auth + role + validasi input + pesan error JSON.
- [ ] Smoke test API produksi (bila deploy) mengembalikan status yang diharapkan.
- [ ] Tidak ada secret, `console.log` debug, atau file build yang ikut ter-commit.
- [ ] Ringkasan perubahan menyebut file, perilaku, dan bukti verifikasi.

## Akun Demo (lokal/seed)

| Peran | Email | Password |
| --- | --- | --- |
| Admin Pemerintah | `budi@infracare.id` | `password123` |
| Petugas Lapangan | `andi@infracare.id` | `password123` |
| Masyarakat | `yeni@infracare.id` | `password123` |

Jangan memakai akun demo ini untuk menguji data produksi yang sensitif.

## Skill & Agent

Muat skill sesuai tugas: `ui-design-system`, `feature-delivery`, `ui-verify`, `deploy-verify`, `security-baseline`, `codebase-map`, `auth-rbac`, `form-ux`, `performance-audit`, `e2e-playwright`.

Gunakan subagent `qa` untuk verifikasi dan `reviewer` untuk review read-only. Agent `designer` untuk implementasi UI yang konsisten dengan design system.
