---
name: UI Design System
description: Aturan visual INFRA-CARE — token warna, keluarga kelas rw/pf/ad/kl/pt/dm/lp/st, dark mode, breakpoint, dan pola tabel-ke-kartu. Gunakan sebelum membuat atau mengubah tampilan apa pun.
---

# UI Design System INFRA-CARE

## Kapan Dipakai

Muat skill ini setiap kali akan:
- membuat komponen, halaman, modal, kartu, tabel, atau form baru;
- mengubah CSS, warna, radius, bayangan, atau layout;
- memperbaiki tampilan mobile atau dark mode;
- memilih kelas untuk elemen baru.

## Prinsip

1. **Pakai yang sudah ada.** Cari kelas dan pola serupa di `frontend/src/styles.css` sebelum menulis CSS baru.
2. **Token, bukan hex baru.** Warna utama memakai `var(--b)`, gelap `var(--bd)`, latar `var(--bg)`, teks `var(--tx)`, muted `var(--mu)`, border `var(--bd2)`.
3. **Scope sempit.** Kelas halaman diberi prefiks yang sudah dipakai. Jangan menimpa `.card`, `.btn`, atau `table` global untuk satu halaman.
4. **Dua tema, dua lebar.** Setiap elemen baru diuji light/dark dan desktop/mobile.
5. **Sedikit tapi konsisten.** Lebih baik memakai ulang `rw-hero`, `rw-table`, `pf-card`, `lp-panel` daripada membuat varian baru.

## Token Inti

```css
:root{
  --b:#1565d8;   /* biru aksi */
  --bd:#0b2a6b;  /* biru gelap judul */
  --bg:#eef5fd;  /* latar aplikasi */
  --tx:#14306b;  /* teks utama */
  --mu:#6b7fa6;  /* teks sekunder */
  --bd2:#dce8f8; /* border */
}
```

Radius yang lazim: `10px` (badge kecil), `12px` (input/tombol), `14–16px` (kartu dalam), `18–24px` (kartu utama), `999px` (pill).

Bayangan: `0 4px 18px rgba(30,90,180,.08)` untuk kartu, `0 8px 24px rgba(30,90,180,.12)` untuk hover.

## Keluarga Kelas

| Prefiks | Area | Contoh |
| --- | --- | --- |
| `rw-` | Kerangka halaman admin, hero, tabel, filter, empty state | `rw-page`, `rw-hero`, `rw-table`, `rw-title`, `rw-action` |
| `pf-` | Profil & Pengaturan | `pf-layout`, `pf-card`, `pf-form`, `pf-field`, `pf-alert` |
| `st-` | Elemen Pengaturan | `st-page`, `st-switch`, `st-ident`, `st-avatar` |
| `ad-` | Toolbar/filter Data Masyarakat | `ad-page`, `ad-toolbar`, `ad-field`, `ad-alert` |
| `kl-` | Kelola Pengaduan | `kl-table`, `kl-select`, `kl-del`, `kl-urg` |
| `pt-` | Peta Pengaduan | `pt-layout`, `pt-map-card`, `pt-list`, `pt-popup` |
| `dm-` | Data Masyarakat & modal pengguna | `dm-table`, `dm-user`, `dm-modal`, `dm-role` |
| `lp-` | Laporan | `lp-kpis`, `lp-grid2`, `lp-panel`, `lp-bar`, `lp-sla` |
| `d-` | Dashboard | `d-banner`, `d-stats-grid`, `d-action-grid` |

Kelas global yang boleh dipakai ulang: `.card`, `.btn` (+ `.o`, `.s`, `.w`), `.in`, `.tag`, `.mu`, `.tabs`, `.err`, `.banner`.

Katalog lengkap: `references/class-catalog.md`.

## Pola Halaman Admin

```jsx
<div className="rw-page">
  <header className="rw-hero">
    <span className="rw-eyebrow">📋 Judul</span>
    <h2>Judul Halaman</h2>
    <p>Deskripsi singkat.</p>
    <div className="rw-hero-stats">
      <div className="rw-hero-stat"><span>Label</span><b>Nilai</b></div>
    </div>
  </header>
  {/* filter / konten */}
</div>
```

- Hero memakai `rw-hero`, bukan `banner` baru.
- Tabel memakai `rw-table` (atau `kl-table`/`dm-table` untuk halaman yang punya kartu mobile).
- Empty state memakai `rw-empty` + `rw-empty-ic`.
- Tombol aksi baris memakai `rw-action`; tombol hapus memakai `kl-del`.

## Pola Tabel → Kartu (≤820px)

```jsx
<td data-label="Status">...</td>
```

Aturan:
- Setiap `<td>` yang tampil di mobile **wajib** punya `data-label`.
- CSS kartu memakai `td::before{content:attr(data-label)}`.
- Jangan menghapus `data-label` saat mengubah tabel.
- Kolom nomor boleh disembunyikan (`.rw-cell-no`).
- Kolom aksi biasanya `grid-column:1/-1` dan tombolnya melebar.
- Uji juga baris kosong (`colspan`) agar tidak ikut jadi kartu.

## Dark Mode

- Toggle menambahkan kelas `dark` pada `<html>`, bukan pada body.
- Tulis override dengan `html.dark <selector>` dan scope sedekat mungkin:

```css
html.dark .kl-table tbody tr{background:#1e293b;border-color:#263449}
html.dark .pf-card .btn.s{background:#1e3a5f;color:#93c5fd}
```

- Warna permukaan gelap: `#0f172a` (paling gelap), `#1e293b` (kartu), `#334155` (border/hover).
- Teks gelap: `#e2e8f0` (utama), `#94a3b8` (sekunder).
- Jangan memakai `filter`, `invert`, atau `mix-blend-mode` untuk dark mode.
- Komponen dengan warna inline harus menerima prop `dark` atau membaca `document.documentElement.classList.contains('dark')` seperti `Dashboard`.

## Breakpoint

| Lebar | Perilaku |
| --- | --- |
| `>1150px` | Layout penuh, sidebar 240px |
| `≤1150px` | Grid laporan/peta mulai menyempit |
| `≤900px` | Sidebar hilang, grid dua kolom jadi satu |
| `≤820px` | **Tabel `kl-table`/`dm-table` menjadi kartu** |
| `≤640px` | Form, modal, dan filter menumpuk |
| `≤480px` | Padding mengecil, tombol kartu 2 kolom |

Aturan:
- Tambahkan breakpoint baru hanya jika yang ada tidak cukup.
- Jangan mengubah aturan global di `≤900px` untuk memperbaiki satu halaman.
- Uji minimal 1440, 1024, 768, 390 px.

## Tipografi & Spasi

- Font: `'Plus Jakarta Sans', system-ui, sans-serif` (sudah di body).
- Judul halaman: `h2` 22–26px, teks hero `p` 13–14px `var(--mu)`.
- Label form: 14px, bold, margin `14px 0 6px` (dari `label` global).
- Hint: `.mu` atau `pf-hint` 12px.
- Spasi section: 16–20px; gap kartu: 12–18px.

## Aksesibilitas

- Setiap input punya `<label>` (boleh visually hidden bila desain memaksa).
- Tombol ikon punya `aria-label` dan `title`.
- Tombol di dalam form non-submit memakai `type="button"`.
- Fokus terlihat: jangan `outline:none` tanpa pengganti.
- Kontras teks minimal 4.5:1; badge status harus tetap terbaca di dark mode.

## Checklist Sebelum Selesai

- [ ] Tidak ada kelas baru tanpa definisi CSS.
- [ ] Tidak ada hex baru di JSX untuk warna tema.
- [ ] Selector dark mode ter-scope dan tidak menimpa halaman lain.
- [ ] Tabel punya `data-label`; kartu mobile rapi.
- [ ] Tidak ada overflow horizontal di 390px.
- [ ] Light & dark, desktop & mobile sudah dilihat.
