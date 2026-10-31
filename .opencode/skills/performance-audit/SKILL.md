---
name: Performance Audit
description: Audit performa INFRA-CARE — ukuran bundle Vite, aset terbesar, gzip, source map, gambar berat, serta checklist query database dan render React. Gunakan sebelum rilis besar atau saat halaman terasa lambat.
---

# Performance Audit

## Kapan Dipakai

- Sebelum rilis fitur besar.
- Saat halaman terasa lambat, terutama Peta, Laporan, atau Data Masyarakat.
- Setelah menambah dependency, gambar, atau query baru.

## Langkah Cepat

```bash
# build + laporan ukuran
bash .opencode/skills/performance-audit/scripts/bundle-report.sh

# tanpa build ulang
bash .opencode/skills/performance-audit/scripts/bundle-report.sh --no-build

# anggap pelanggaran budget sebagai exit 1
bash .opencode/skills/performance-audit/scripts/bundle-report.sh --strict
```

Budget default dapat diubah lewat environment: `MAX_JS_KB`, `MAX_CSS_KB`, `MAX_TOTAL_KB`, `MAX_IMAGE_KB`.

## Yang Diperiksa Script

- total ukuran `dist/`, jumlah file;
- ukuran mentah dan gzip setiap JS/CSS;
- 15 aset terbesar;
- pelanggaran budget per jenis;
- source map yang ikut ter-build (tidak boleh ikut deploy publik);
- gambar > `MAX_IMAGE_KB`.

## Checklist Frontend

1. **Bundle**
   - Tidak ada dependency baru tanpa alasan kuat.
   - Import Leaflet hanya di halaman yang membutuhkan (saat ini App.jsx monolit; jangan menambah library besar).
   - Tidak mengimpor seluruh lodash/moment; gunakan fungsi native atau `date-fns` bila perlu.
2. **Render**
   - Daftar panjang memakai key stabil (`r.id`, bukan index) dan filter yang sudah ada.
   - Hindari membuat objek/array baru di dependency `useEffect` tanpa perlu.
   - Jangan memanggil API di dalam loop render.
   - Debounce input pencarian bila menembak API.
3. **Gambar**
   - Foto pengaduan sudah dikompres di server/klien? Cek alur upload.
   - Avatar memakai URL/kompresi, bukan base64 raksasa di state.
   - `loading="lazy"` untuk gambar di luar viewport.
4. **Peta**
   - Marker banyak: pertimbangkan cluster, tetapi jangan menambah dependency tanpa persetujuan.
   - Jangan membuat ulang `MapContainer` setiap render.
5. **Font**
   - `Plus Jakarta Sans` dimuat dari mana? Jika dari Google Fonts, pertimbangkan `display=swap` dan `preconnect`.

## Checklist Backend

1. **Query**
   - Tidak ada N+1: gunakan subquery/join seperti `/api/users` dan `/api/reports`.
   - Endpoint list memakai `LIMIT`/pagination bila data bisa besar.
   - Index untuk kolom filter: `complaints.user_id`, `complaints.petugas_id`, `complaints.status`, `complaints.created_at`.
   - Hindari `select *` untuk respons besar; pilih kolom yang dipakai.
2. **Payload**
   - Jangan mengirim base64 foto di list; kirim URL.
   - `express.json({limit:'10mb'})` sudah ada; jangan dinaikkan tanpa alasan.
3. **Auth**
   - Verifikasi JWT murah; jangan query user di setiap request bila tidak perlu.
4. **Cold start**
   - Pool `max:5`; jangan membuat pool baru per request.

## Cara Membaca Hasil

| Temuan | Tindakan |
| --- | --- |
| JS > 300 KB gzip | cari import besar, code-splitting |
| CSS > 100 KB | hapus aturan mati, hindari duplikasi |
| Total > 1.5 MB | audit gambar/font |
| Source map ada | pastikan tidak di-deploy atau matikan `sourcemap` |
| Gambar > 200 KB | kompres/resize |
| Query > 200 ms | `EXPLAIN ANALYZE`, tambah index |

## Aturan

- Jangan melakukan optimasi yang mengubah perilaku tanpa persetujuan.
- Ukur sebelum dan sesudah; sertakan angka.
- Jangan menambah dependency untuk optimasi kecil.
- Jangan mengorbankan keterbacaan kode demi micro-optimization.
