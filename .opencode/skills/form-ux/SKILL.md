---
name: Form UX
description: Pola form INFRA-CARE — validasi, pesan error, state simpan, password, upload foto, modal, dan aksesibilitas. Gunakan saat membuat atau mengubah form login, pengaduan, profil, pengaturan, atau data pengguna.
---

# Form UX

## Prinsip

1. **Satu tugas, satu form.** Jangan mencampur pengaturan akun, keamanan, dan sistem dalam satu submit.
2. **Jangan hilangkan input saat error.** Pengguna harus bisa memperbaiki, bukan mengisi ulang.
3. **Beri umpan balik segera.** Tombol berubah saat `busy`, sukses/error muncul dekat aksi.
4. **Validasi di klien untuk UX, di server untuk keamanan.** Keduanya wajib.
5. **Label selalu terlihat.** Placeholder bukan pengganti label.

## Struktur Dasar

```jsx
<form onSubmit={save}>
  <div className="pf-field">
    <label htmlFor="nama">Nama Lengkap</label>
    <input id="nama" className="in" value={f.nama}
      onChange={e => setF({ ...f, nama: e.target.value })}
      autoComplete="name" required />
    <span className="pf-hint">Sesuai identitas resmi.</span>
  </div>

  {err && <div className="pf-alert bad" role="alert">⚠ {err}</div>}
  {msg && <div className="pf-alert ok" role="status">✓ {msg}</div>}

  <div className="pf-actions">
    <button type="button" className="btn s" onClick={reset} disabled={busy || !dirty}>Batal</button>
    <button className="btn" disabled={busy || !dirty}>{busy ? 'Menyimpan...' : 'Simpan'}</button>
  </div>
</form>
```

## Validasi

| Aturan | Pesan |
| --- | --- |
| Wajib | `«Field» wajib diisi` |
| Email | `Format email tidak valid` |
| Password <6 | `Password minimal 6 karakter` |
| Konfirmasi beda | `Konfirmasi password tidak cocok` |
| Angka di luar rentang | `Nilai harus antara X–Y` |
| File >5MB | `Ukuran foto maksimal 5MB` |
| Tipe file salah | `Gunakan JPG atau PNG` |

- Validasi saat submit; setelah field disentuh, boleh validasi saat blur.
- Hapus error field saat nilainya berubah.
- Fokuskan field pertama yang error (`ref.focus()`).
- Jangan memakai `alert()` untuk validasi.

## State

- `busy` — nonaktifkan tombol dan input yang memicu request.
- `msg` — sukses, hilang saat input berubah atau tab berganti.
- `err` — error, tetap sampai diperbaiki.
- `dirty` — bandingkan dengan nilai awal; tombol simpan nonaktif jika tidak ada perubahan.
- `show` — visibilitas password per field, bukan satu global.

## Password

- `autoComplete="current-password"` / `"new-password"`.
- Tombol show/hide `type="button"`, `aria-label`.
- Indikator kekuatan (4 bar seperti `pf-meter`) + label tekstual.
- Jangan memaksa aturan rumit tanpa kebutuhan; minimal 6 karakter (sesuai backend).
- Jangan mengirim password ke state global/localStorage.

## Upload Foto

Alur yang sudah dipakai:
1. `accept="image/png,image/jpeg"`.
2. Cek `file.size <= 5MB`.
3. Kompres via canvas (`maxSide` 1280 pengaduan, 512 profil, kualitas 0.75–0.8).
4. Tampilkan pratinjau + nama/ukuran.
5. Simpan base64 hanya di state form sampai submit.
6. Sediakan cara mengganti/menghapus.
7. Jangan menaruh base64 di JWT atau localStorage.

## Modal (Data Masyarakat)

- Fokus otomatis ke field pertama saat dibuka.
- `Esc` menutup; klik backdrop menutup (kecuali sedang `busy`).
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
- Kunci scroll body saat terbuka.
- Tombol destruktif (nonaktifkan/hapus/reset) memakai konfirmasi.
- Setelah sukses: tutup modal, refresh daftar, tampilkan pesan.

## Aksesibilitas

- Setiap input punya `label` (atau `aria-label`).
- Error memakai `role="alert"`; sukses `role="status"`.
- Tombol ikon punya `aria-label` + `title`.
- Urutan tab logis; jangan `tabIndex` positif.
- Fokus terlihat; jangan hilangkan outline tanpa pengganti.
- Kontras label/hint minimal 4.5:1.

## Checklist

- [ ] Semua field wajib ditandai dan divalidasi.
- [ ] Error spesifik, bukan "Terjadi kesalahan" untuk validasi.
- [ ] Input tidak hilang saat error.
- [ ] Tombol disabled saat `busy`; teks berubah.
- [ ] Sukses/error terlihat dan dibacakan (`role`).
- [ ] `autoComplete` benar untuk email/password/nama.
- [ ] Upload: tipe, ukuran, kompresi, pratinjau, ganti/hapus.
- [ ] Modal: fokus, Esc, backdrop, scroll lock.
- [ ] Form berfungsi di 390px dan dark mode.
- [ ] Submit ganda tidak membuat data ganda.

## Anti-pola

- `onChange` yang langsung menembak API tanpa debounce.
- `disabled` pada tombol simpan tanpa alasan yang terlihat.
- Menghapus form setelah error.
- `window.alert` / `window.confirm` untuk hal yang bisa ditampilkan inline.
- Menyimpan password atau token di state yang di-log.
- Validasi hanya di klien.
- Placeholder sebagai satu-satunya label.

Detail per form: `references/form-inventory.md`.
