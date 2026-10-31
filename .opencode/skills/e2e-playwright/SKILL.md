---
name: E2E Playwright
description: Uji alur nyata INFRA-CARE dengan Playwright MCP — login per peran, navigasi menu, tabel responsif, dark mode, dan screenshot bukti. Gunakan untuk verifikasi visual atau regresi end-to-end.
---

# E2E Playwright

## Prasyarat

- MCP `playwright` aktif (lihat `opencode.jsonc`, memakai `--browser chromium`).
- Browser untuk MCP terpasang (versi harus cocok dengan MCP):
  ```bash
  npx --yes @playwright/mcp install-browser chrome-for-testing
  ```
  Jika muncul error path `chromium-12xx`, jalankan perintah di atas — jangan hanya `npx playwright install chromium` karena versinya bisa berbeda.
- Target lokal lebih aman untuk uji yang mengubah data:
  ```bash
  cd backend && npm start          # :4000
  cd frontend && npm run dev       # :5173
  ```

## Aturan

1. **Jangan menguji alur destruktif di produksi** (hapus pengaduan, nonaktifkan akun, reset password).
2. **Jangan mencetak password/token** di laporan.
3. Gunakan akun dari environment (`E2E_EMAIL`, `E2E_PASSWORD`) bila tersedia; jangan menebak kredensial produksi.
4. Simpan screenshot di `.playwright-mcp/` (sudah di-`.gitignore`). MCP menolak path di luar workspace.
5. Setelah selesai, tutup browser dan hapus screenshot bila tidak diperlukan.

## Alur Dasar

1. `browser_navigate` ke `http://localhost:5173/login`.
2. `browser_snapshot` untuk mendapatkan ref elemen.
3. `browser_fill_form` / `browser_type` untuk email & password.
4. `browser_click` tombol **MASUK**.
5. `browser_wait_for` teks `Dashboard` atau `Halo,`.
6. `browser_snapshot` halaman tujuan.
7. `browser_take_screenshot` dengan `filename` absolut.
8. Ulangi pada ukuran & tema berbeda.

## Matriks Verifikasi

| Peran | Halaman | Yang dicek |
| --- | --- | --- |
| admin | `/app/kelola` | filter, assign, status, tombol hapus, kartu ≤820px |
| admin | `/app/data-masyarakat` | tabel, modal tambah/edit, status aktif |
| admin | `/app/laporan` | KPI, chart, filter tanggal, tabel petugas |
| admin | `/app/pengaturan` | 3 tab, simpan, SLA, switch |
| petugas | `/app/kelola` | hanya tugas sendiri dapat diubah; yang lain disabled |
| petugas | `/app/peta` | marker, popup, list |
| masyarakat | `/app/buat` | validasi, peta, upload foto, submit |
| masyarakat | `/app/tracking/:kode` | timeline & detail |

## Ukuran & Tema

| Ukuran | Fokus |
| --- | --- |
| 1440×900 | layout penuh, sidebar |
| 1024×768 | grid menyempit |
| 768×1024 | sidebar hilang, tabel kartu |
| 390×844 | mobile, tanpa overflow |

Untuk tema: klik `.theme-toggle`, atau `browser_evaluate`:

```js
() => { document.documentElement.classList.add('dark'); localStorage.setItem('theme','dark'); return true; }
```

Cek overflow:

```js
() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  overflow: document.documentElement.scrollWidth > window.innerWidth,
})
```

## Screenshot

```text
.playwright-mcp/ui-admin-kelola-1440-light.png
.playwright-mcp/ui-admin-kelola-390-dark.png
```

Gunakan nama `ui-<peran>-<halaman>-<lebar>-<tema>.png` agar mudah dibandingkan.

## Uji Regresi Cepat

1. Login admin → semua menu admin terbuka tanpa error console.
2. Buka `/app/kelola`, ubah lebar ke 390px → tabel menjadi kartu, label muncul.
3. Aktifkan dark mode → teks, badge, input, tombol tetap terbaca.
4. Buka `/app/pengaturan` → unggah foto (lokal), simpan, pastikan preview berubah.
5. Logout → login petugas → `/app/kelola` hanya tugas sendiri yang bisa diubah.
6. Login masyarakat → buat pengaduan (lokal) → kode muncul di halaman sukses.

## Console & Network

- `browser_console_messages` untuk error JS.
- `browser_network_requests` untuk request gagal (4xx/5xx).
- Jangan menganggap warning Leaflet tentang marker icon sebagai kegagalan bila marker tampil.

## Jika Browser Gagal

| Gejala | Tindakan |
| --- | --- |
| `Executable doesn't exist` / `chromium-12xx` | `npx --yes @playwright/mcp install-browser chrome-for-testing` |
| Screenshot ditolak `outside allowed roots` | simpan di `.playwright-mcp/` |
| MCP tidak muncul | restart OpenCode, cek `opencode.jsonc` |
| Halaman kosong | cek dev server & console |
| Login gagal | gunakan kredensial lokal dari seed, jangan menebak produksi |
| Screenshot hitam | tunggu `browser_wait_for` sebelum capture |

## Batasan

- Uji ini bukan pengganti unit test backend.
- Jangan menguji pembayaran/email (tidak ada).
- Data produksi nyata tidak boleh dimutasi.
