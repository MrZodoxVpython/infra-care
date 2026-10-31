---
name: Feature Delivery
description: Alur kerja end-to-end INFRA-CARE — dari permintaan menjadi perubahan kecil yang terverifikasi, tanpa merusak fitur lain. Gunakan untuk fitur baru, perbaikan bug, atau perubahan UI/API multi-langkah.
---

# Feature Delivery

## Tujuan

Mengubah permintaan menjadi perubahan yang **kecil, konsisten, terverifikasi, dan mudah di-review** — bukan refactor besar.

## 0. Intake (sebelum menyentuh kode)

Tulis 4 hal:
1. **Tujuan** — satu kalimat.
2. **Scope** — halaman/file yang boleh berubah.
3. **Non-scope** — halaman/perilaku yang harus tetap sama.
4. **Kriteria selesai** — bisa diuji, mis. "tabel jadi kartu di 390px, desktop tidak berubah".

Jika permintaan ambigu, tanyakan satu pertanyaan yang paling berdampak. Jangan menebak data bisnis.

## 1. Recon

```bash
git status --short
git log --oneline -5
```

Lalu:
- Muat `codebase-map` untuk peta file/endpoint.
- Cari pola yang sudah ada: `grep` nama kelas/endpoint/fungsi.
- Baca komponen serupa **sampai paham**, bukan seluruh file.
- Cek apakah perubahan menyentuh auth, schema, atau data pengguna.

## 2. Rencana

Untuk pekerjaan ≥3 langkah, buat todo. Rencana minimal:

```text
- [ ] Backend: endpoint/validasi (jika perlu)
- [ ] Frontend: state, handler, markup
- [ ] CSS: light/dark, desktop/mobile
- [ ] Verifikasi: build, check-ui, API/visual
- [ ] Commit & laporan
```

Tentukan urutan: **schema → API → UI → CSS → verifikasi**. Untuk UI-only, langsung ke komponen.

## 3. Implementasi

### Backend
- Tambah endpoint di `backend/server.js` dekat area serupa.
- Wajib: `auth([...])`, validasi input, pesan error JSON, parameterized query.
- Perubahan schema: tambahkan `ALTER TABLE ... IF NOT EXISTS` yang idempoten di blok `schemaReady` **dan** perbarui `backend/schema.sql`.
- Jangan mengubah bentuk respons endpoint lama tanpa menyesuaikan frontend.

### Frontend
- Komponen tinggal di `frontend/src/App.jsx`; ikuti pola komponen sekitarnya.
- Gunakan `api()` dari `api.js`; tangani error dengan `setErr(x.message)`.
- State: `busy` untuk mencegah double submit, `msg`/`err` untuk umpan balik.
- Jangan menyimpan token/foto besar di tempat baru.
- Gunakan `getUser()` untuk data sesi, tetapi sumber kebenaran tetap `/auth/me`.

### CSS
- Muat `ui-design-system`.
- Pakai kelas yang ada; jika perlu baru, prefiks halaman.
- Tambah dark mode dan aturan mobile yang ter-scope.
- Jangan mengubah aturan global untuk satu halaman.

## 4. Verifikasi

Wajib:

```bash
npm --prefix frontend run build
node .opencode/skills/ui-verify/scripts/check-ui.mjs .
```

Bila menyentuh API/auth:
- login sesuai peran, cek endpoint yang berubah;
- cek peran lain mendapat 401/403 yang benar;
- cek validasi input (kosong, tipe salah, ID tidak ada).

Bila menyentuh UI:
- 1440/1024/768/390 px, light & dark;
- halaman lain yang memakai kelas sama;
- tidak ada overflow horizontal.

Bila menyentuh deploy: jalankan `deploy-verify`.

## 5. Commit

- Minta persetujuan sebelum commit/push.
- Satu commit = satu tujuan.
- Pesan Bahasa Indonesia: `tambah ...`, `perbaiki ...`, `rapikan ...`, `buat ... responsif`.
- Jangan commit `.env`, `dist/`, screenshot, atau file sementara.

## 6. Laporan

Gunakan format di `references/report-template.md`:
- ringkasan perilaku baru;
- file yang berubah;
- bukti verifikasi (perintah + hasil);
- risiko/keterbatasan;
- langkah berikutnya (jika ada).

## Aturan Scope

| Situasi | Tindakan |
| --- | --- |
| Menemukan bug lain | Catat di laporan, jangan perbaiki tanpa izin |
| Butuh dependency baru | Tanya dulu, jelaskan alasan dan ukuran |
| Perlu refactor besar | Tawarkan sebagai pekerjaan terpisah |
| Perubahan mengubah data | Konfirmasi, siapkan backup/idempoten |
| Perubahan memengaruhi auth | Perlakukan sebagai P0, uji semua peran |

## Anti-pola

- Menyalin seluruh halaman untuk membuat variasi kecil.
- Menambah `!important` untuk menutupi konflik selector.
- Menyembunyikan elemen di frontend sebagai pengganti RBAC.
- Menyatakan selesai hanya karena build lolos.
- Mengubah copy/label yang tidak diminta.
- Menghapus `data-label`, `aria-label`, atau `type="button"` saat merapikan.
