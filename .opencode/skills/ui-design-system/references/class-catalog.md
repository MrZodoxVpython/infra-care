# Katalog Kelas INFRA-CARE

Sumber kebenaran tetap `frontend/src/styles.css`. Gunakan tabel ini untuk memilih kelas, bukan untuk menduplikasi CSS.

## Global

| Kelas | Fungsi |
| --- | --- |
| `.card` | Kartu putih dengan radius 18px dan shadow |
| `.btn`, `.btn.o`, `.btn.s`, `.btn.w` | Tombol utama, outline, kecil, lebar penuh |
| `.in` | Input/select/textarea |
| `.tag` | Badge status dasar |
| `.mu` | Teks sekunder |
| `.err` | Kotak error |
| `.banner` | Banner informasi |
| `.tabs`, `.tabs .on` | Tab sederhana |
| `.theme-toggle` | Tombol tema di topbar |

## `rw-` — Kerangka Admin

`rw-hero`, `rw-eyebrow`, `rw-hero-stats`, `rw-hero-stat`, `rw-toolbar`, `rw-filter-badge`, `rw-tabs`, `rw-tab`, `rw-tab-ic`, `rw-tab-count`, `rw-sort`, `rw-table`, `rw-title`, `rw-code`, `rw-chip`, `rw-loc`, `rw-cell-no`, `rw-cell-sub`, `rw-cell-date`, `rw-action`, `rw-row-hot`, `rw-empty`, `rw-empty-ic`, `rw-info`, `rw-info-tip`, `rw-bar`, `rw-stats`, `rw-stat`, `rw-stat-top`, `rw-stat-ic`, `rw-stat-label`, `rw-stat-val`, `rw-panel`, `rw-panel-head`, `rw-panel-body`, `rw-side`, `rw-side-head`, `rw-side-total`.

## `pf-` — Profil & Pengaturan

`pf-page`, `pf-hero`, `pf-hero-meta`, `pf-layout`, `pf-col`, `pf-card`, `pf-cover`, `pf-avatar-wrap`, `pf-avatar`, `pf-cam`, `pf-badges`, `pf-badge`, `pf-eyebrow`, `pf-tabs`, `pf-form`, `pf-form-head`, `pf-grid2`, `pf-field`, `pf-hint`, `pf-opt`, `pf-pass`, `pf-meter`, `pf-actions`, `pf-alert` (`.ok`, `.bad`), `pf-foto-row`, `pf-foto-thumb`, `pf-foto-input`, `pf-upload`, `pf-preview`, `pf-preview-close`, `pf-sidecard`, `pf-side-head`, `pf-side-tag`, `pf-ident`, `pf-info`, `pf-info-row`, `pf-green`, `pf-tips`, `pf-check`, `pf-bar`, `pf-pct`, `pf-meta-chip`.

## `st-` — Pengaturan

`st-page`, `st-ident`, `st-avatar`, `st-switch`, `st-policy`.

## `ad-` — Data Masyarakat (toolbar)

`ad-page`, `ad-toolbar`, `ad-field`, `ad-grow`, `ad-actions`, `ad-alert`, `ad-note`, `ad-loading`.

## `kl-` — Kelola Pengaduan

`kl-table`, `kl-select`, `kl-del`, `kl-urg` (+ status slug: `.rendah`, `.sedang`, `.tinggi`).

## `pt-` — Peta

`pt-layout`, `pt-toolbar`, `pt-map-card`, `pt-map`, `pt-st`, `pt-pin`, `pt-side`, `pt-side-head`, `pt-list`, `pt-item`, `pt-item-body`, `pt-item-ic`, `pt-item-loc`, `pt-foot`, `pt-legend`, `pt-legend-item`, `pt-popup`, `pt-popup-code`, `pt-popup-link`, `pt-popup-loc`, `pt-popup-meta`, `pt-popup-officer`.

## `dm-` — Data Masyarakat

`dm-table`, `dm-user`, `dm-av`, `dm-role`, `dm-status` (`.on`, `.off`), `dm-act`, `dm-email`, `dm-btn`, `dm-modal`, `dm-backdrop`, `dm-modal-head`, `dm-modal-body`, `dm-modal-foot`, `dm-close`, `dm-check`.

## `lp-` — Laporan

`lp-kpis`, `lp-kpi`, `lp-grid2`, `lp-grid-wide`, `lp-panel`, `lp-panel-head`, `lp-period`, `lp-dates`, `lp-label`, `lp-pill`, `lp-bar`, `lp-cats`, `lp-cat`, `lp-rows`, `lp-row`, `lp-row-top`, `lp-sla`, `lp-sla-info`, `lp-sla-ring`, `lp-table-panel`, `lp-table`, `lp-trend`, `lp-trend-col`, `lp-trend-bar`, `lp-trend-val`, `lp-val`, `lp-empty`.

## `d-` — Dashboard

`d-banner`, `d-banner-img`, `d-btn`, `d-stats`, `d-stats-grid`, `d-stat-card`, `d-stat-head`, `d-stat-ic`, `d-stat-body`, `d-actions`, `d-action-grid`, `d-action`, `d-action-ic`, `d-layout`, `d-col-left`, `d-col-right`, `d-together`, `d-together-grid`, `d-tog-item`, `d-section-head`, `d-recent`, `d-map`, `d-map-placeholder`, `d-categories`, `d-cat`, `d-cat-bar`.

## Status & Prioritas

Status pengaduan: `diterima`, `diverifikasi`, `diprioritaskan`, `ditugaskan`, `dalam-perbaikan`, `selesai`, `ditolak`.
Prioritas: `rendah`, `sedang`, `tinggi`.
Peran: `admin`, `petugas`, `masyarakat`.
Gunakan `slug()` dari `frontend/src/api.js` untuk menghasilkan nama kelas.

## Aturan Penamaan

- Kelas baru: kebab-case, berprefiks halaman (`kl-`, `dm-`, `pt-`, `lp-`, `pf-`, `st-`, `rw-`).
- Jangan memakai camelCase di CSS (`.fooBar`).
- Jangan membuat kelas generik baru seperti `.box`, `.wrapper`, `.content` — risiko tabrakan global.
- Jangan memakai ID untuk styling; ID hanya untuk anchor/form.
