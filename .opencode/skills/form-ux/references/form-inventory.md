# Inventaris Form INFRA-CARE

| Form | Lokasi | Field | Catatan |
| --- | --- | --- | --- |
| Login | `Login` | email, password, (nama saat register) | show/hide password; error dari API |
| Register | `Login` (mode reg) | nama, email, password | role otomatis masyarakat |
| Buat Pengaduan | `Buat` | judul, kategori, deskripsi, urgensi, foto, lokasi (peta) | stepper; foto wajib; kompres 1280px |
| Profil | `Profil` | nama, email, foto | dirty state; preview foto |
| Pengaturan — Akun | `Pengaturan` | nama, email, foto/URL | tab; simpan hanya jika berubah |
| Pengaturan — Keamanan | `Pengaturan` | password lama, baru, konfirmasi | strength meter; tombol aktif jika valid |
| Pengaturan — Sistem | `Pengaturan` (admin) | nama instansi, kontak, SLA, auto-assign | SLA 1–365; switch |
| Tambah/Edit Pengguna | `DataMasyarakat` modal | nama, email, password, role, aktif | reset password terpisah |
| Filter | `Kelola`, `Laporan`, `DataMasyarakat` | status, kategori, urgensi, tanggal, q | bukan form submit; reset filter |

## Aturan Per Form

### Login/Register
- Enter mengirim.
- Error API ditampilkan di `.err`/`pf-alert`.
- Jangan mengosongkan email saat password salah.
- Tombol daftar/masuk berganti tanpa reload.

### Buat Pengaduan
- Lokasi wajib dari peta (bukan teks bebas).
- Foto wajib; pratinjau dan nama file.
- Deskripsi minimal wajar; tampilkan hitungan karakter bila ada.
- Setelah sukses → `/app/sukses/:kode`, bukan reset diam-diam.

### Pengaturan
- Tab tidak mengirim form lain.
- Ganti tab menghapus `msg`/`err`.
- Tombol Batal mengembalikan nilai awal.
- Perubahan foto belum tersimpan sampai "Simpan".

### Data Masyarakat
- Modal tidak menutup saat `busy`.
- Email unik divalidasi server; tampilkan pesan.
- Nonaktifkan akun sendiri dicegah server (400).
- Reset password meminta konfirmasi dan minimal 6 karakter.

## Selector untuk E2E

```text
Login       : input[type=email], input[type=password], button:has-text("MASUK")
Sidebar     : a:has-text("Kelola Pengaduan")
Kelola      : .kl-table, .kl-select, .kl-del
Pengaturan  : .pf-tabs button, .pf-form, .pf-alert
Data user   : .dm-table, .dm-btn, .dm-modal
Tema        : .theme-toggle
```
