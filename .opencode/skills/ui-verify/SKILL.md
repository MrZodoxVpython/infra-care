---
name: UI Verify
description: Verifikasi UI INFRA-CARE — build Vite, cross-check kelas JSX vs CSS, deteksi camelCase, cek breakpoint, dan checklist visual responsif/dark mode. Gunakan sebelum commit perubahan tampilan.
---

# UI Verify

## Tujuan

Membuktikan perubahan UI tidak meninggalkan kelas tanpa CSS, tidak memakai penamaan yang salah, dan tetap berjalan di build produksi.

## Urutan

1. **Build**
   ```bash
   npm --prefix frontend run build
   ```
   Build harus lolos. Jangan lanjut jika gagal.

2. **Cross-check kelas**
   ```bash
   node .opencode/skills/ui-verify/scripts/check-ui.mjs .
   ```
   Exit code `1` berarti ada kelas JSX tanpa definisi CSS atau camelCase. Perbaiki dulu.

3. **Verifikasi visual** (bila browser/Playwright tersedia)
   - 1440×900, 1024×768, 768×1024, 390×844.
   - Light dan dark (tombol tema di topbar).
   - Halaman sesuai peran yang berubah.
   - Cek overflow horizontal: `document.documentElement.scrollWidth <= window.innerWidth`.
   - Tabel berubah menjadi kartu di ≤820px dan label `data-label` terlihat.
   - Tidak ada teks/tombol yang terpotong atau kontras hilang.

4. **Bukti**
   Simpan screenshot di `.playwright-mcp/ui-<halaman>-<lebar>-<tema>.png` bila perlu. Folder ini di-`.gitignore`; jangan commit screenshot.

## Script

`scripts/check-ui.mjs` memeriksa:
- semua token `className` literal di `frontend/src/**/*.jsx` punya selektor di CSS;
- tidak ada kelas camelCase (mis. `.fooBar`);
- tidak ada properti CSS camelCase (mis. `alignItems:`), yang tidak dikenali browser;
- tidak ada atribut `class=` (harus `className=`);
- breakpoint yang dipakai CSS;
- jumlah aturan `html.dark`;
- jumlah warna hex inline di JSX (indikasi styling yang menyimpang);
- tabel `kl-table`/`dm-table` memakai `data-label`.

Opsi:

```bash
node scripts/check-ui.mjs .            # laporan normal
node scripts/check-ui.mjs . --strict   # warning dianggap gagal
node scripts/check-ui.mjs . --json     # keluaran JSON
```

`rw-page`, `tr-page`, dan `tr-progress-card` adalah layout hook lama yang sengaja tanpa CSS; script memasukkannya ke allowlist. Jika menambah hook serupa, tambahkan ke `LAYOUT_HOOKS` di script — jangan mendefinisikan CSS kosong.

## Checklist Manual

- [ ] Build lolos.
- [ ] Script exit 0.
- [ ] Tidak ada kelas baru tanpa CSS.
- [ ] Dark mode: kartu, input, tombol, badge, modal, dan tabel terbaca.
- [ ] Mobile 390px: tidak ada scroll horizontal.
- [ ] Tabel ≤820px menjadi kartu; `data-label` tampil.
- [ ] Halaman lain tidak berubah (bandingkan screenshot bila perlu).
- [ ] Tidak ada `!important` baru tanpa alasan.
- [ ] Tidak ada `console.log` debug.

## Jebakan Umum

- Kelas dari template string tidak terdeteksi bila dirakit aneh (`'rw-'+'x'`). Tulis literal utuh.
- `className={cond && 'foo'}` aman; `className={styles.foo}` tidak terdeteksi — proyek ini tidak memakai CSS modules.
- Kelas status dihasilkan `slug()`; pastikan selektor status ada di CSS.
- Menambah aturan global `@media` bisa merusak halaman lain. Scope dengan prefiks halaman.
- Dark mode memakai `html.dark`, bukan `body.dark`.
