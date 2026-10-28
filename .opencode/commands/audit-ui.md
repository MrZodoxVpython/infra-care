---
description: Audit UI menyeluruh untuk konsistensi design system, responsif, dan dark mode
---

Audit UI INFRA-CARE secara menyeluruh. **Jangan mengubah kode** kecuali pengguna memintanya setelah laporan.

Langkah:
1. Muat skill `ui-design-system`, `ui-verify`, dan `e2e-playwright`.
2. Jalankan `node .opencode/skills/ui-verify/scripts/check-ui.mjs .` dan `npm --prefix frontend run build`.
3. Telusuri halaman sesuai peran:
   - admin: Dashboard, Kelola, Peta, Data Masyarakat, Laporan, Pengaturan
   - petugas: Dashboard, Tugas, Peta, Laporan, Pengaturan
   - masyarakat: Dashboard, Buat, Tracking, Riwayat, Notifikasi, Profil
4. Untuk setiap halaman, cek 1440/1024/768/390 px dan light/dark:
   - tidak ada overflow horizontal
   - tabel berubah jadi kartu di ≤820px dan `data-label` tampil
   - kontras teks, tombol, badge, dan input tetap terbaca
   - tidak ada kelas tanpa CSS atau styling hardcoded yang menyimpang
5. Hasil: tabel temuan berprioritas (P0–P3) dengan file:baris, bukti, dan saran perbaikan. Akhiri dengan 3 perbaikan berdampak terbesar.

$ARGUMENTS
