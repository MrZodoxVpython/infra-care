# Template Laporan Perubahan

```markdown
## Ringkasan
<1–3 kalimat: perilaku baru/perbaikan dan dampaknya bagi pengguna>

## File
- `frontend/src/App.jsx` — <perubahan>
- `frontend/src/styles.css` — <perubahan>
- `backend/server.js` — <perubahan>

## Bukti Verifikasi
| Pemeriksaan | Perintah | Hasil |
| --- | --- | --- |
| Build | `npm --prefix frontend run build` | lolos, asset `index-xxxx.js` |
| Kelas UI | `node .opencode/skills/ui-verify/scripts/check-ui.mjs .` | exit 0, 0 kelas hilang |
| API | `curl ...` | 200 / 403 sesuai peran |
| Visual | 1440/768/390, light/dark | tidak ada overflow |

## Risiko / Keterbatasan
- <mis. belum diuji dengan data >1000 baris>
- <mis. browser otomatis tidak tersedia>

## Catatan
- <temuan di luar scope yang sengaja tidak diubah>
```

## Contoh Singkat

```markdown
## Ringkasan
Menu Kelola Pengaduan kini menampilkan kartu di layar ≤820px; desktop tetap memakai tabel.

## File
- `frontend/src/App.jsx` — tambah `data-label` pada sel tabel.
- `frontend/src/styles.css` — aturan kartu `≤820px`, dark mode, tweak `≤480px`.

## Bukti
- build: lolos (`index-BPM6UhNB.js`)
- check-ui: exit 0, 372 kelas, 0 hilang
- visual: 390px tanpa scroll horizontal; 1440px tidak berubah

## Risiko
- Diuji dengan 12 baris; belum diuji dengan 500+ baris.
```
