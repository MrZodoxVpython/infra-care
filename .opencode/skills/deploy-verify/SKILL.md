---
name: Deploy Verify
description: Verifikasi hasil deploy Vercel INFRA-CARE — bandingkan asset build lokal vs HTML produksi, cek status halaman, dan smoke test API untuk admin/petugas. Gunakan setelah push atau saat memastikan produksi sehat.
---

# Deploy Verify

## Tujuan

Memastikan yang tampil di produksi benar-benar build dari commit terbaru, bukan cache/deploy lama, dan API utama masih sehat.

## Prasyarat

- `frontend/node_modules` sudah terpasang.
- Akses jaringan ke `https://infra-care-pi.vercel.app` (atau `DEPLOY_URL`).
- Akun demo tersedia di database produksi (hanya untuk smoke test read-only). Jika password produksi sudah diganti, set `DEMO_PASSWORD`. Login `400` akan ditandai **dilewati**, bukan gagal.

## Jalankan

```bash
# build ulang lalu bandingkan dengan produksi
bash .opencode/skills/deploy-verify/scripts/verify-deploy.sh

# tanpa build (pakai frontend/dist yang sudah ada)
bash .opencode/skills/deploy-verify/scripts/verify-deploy.sh --no-build

# target lain
DEPLOY_URL=https://preview-xxx.vercel.app bash .opencode/skills/deploy-verify/scripts/verify-deploy.sh
```

Opsi lain: `--url=https://...`, `--help`.

## Yang Diperiksa

1. **Build lokal** — `vite build` sukses.
2. **Asset hash** — nama file `assets/index-*.js` dan `assets/index-*.css` di HTML lokal harus muncul di HTML produksi.
3. **Aset dapat diakses** — setiap asset mengembalikan HTTP 200.
4. **Halaman utama** — `/` mengembalikan 200 dan HTML berisi root React.
5. **API publik** — `/api/public/stats` 200 dan JSON memiliki `total`.
6. **Admin** — login 200, `/api/auth/me` 200, `/api/users` 200, `/api/reports` 200, `/api/settings` 200.
7. **RBAC petugas** — login 200, `/api/users` harus 403.

Smoke test tidak membuat, mengubah, atau menghapus data. Password demo dapat diganti lewat `DEMO_PASSWORD`. Jika login demo `400` (kredensial tidak berlaku), pemeriksaan auth/RBAC dilewati dan status menjadi **LULUS SEBAGIAN** — jalankan ulang dengan `DEMO_PASSWORD` yang benar agar cakupan penuh.

## Setelah Push

1. Push ke `origin main` memicu deploy Vercel (± 85–95 detik).
2. Tunggu, lalu jalankan script.
3. Jika asset masih lama, tunggu 15–30 detik dan ulangi. Jika tetap lama, cek dashboard Vercel (build gagal / deployment tidak dipromosikan).
4. Laporkan commit hash (`git rev-parse --short HEAD`), URL, pasangan asset, dan status smoke test.

## Jika Gagal

| Gejala | Kemungkinan | Tindakan |
| --- | --- | --- |
| Asset lokal tidak ada di HTML | deploy lama / build gagal | cek Vercel deployment, tunggu, redeploy |
| Asset 404 | cache/edge belum siap | tunggu, curl ulang dengan `?v=hash` |
| `/api/*` 404 | rewrite/service backend gagal | cek `vercel.json` dan log service |
| `/api/*` 500 | env DB/JWT hilang | cek Environment Variables Vercel |
| Login 200 tapi `/auth/me` 401 | `JWT_SECRET` berubah antar instance | samakan env, redeploy |
| Petugas dapat 200 di `/api/users` | RBAC bocor | **P0**, perbaiki `auth(['admin'])` dan redeploy |

Jangan rollback dengan `git reset --hard` di branch bersama. Gunakan `git revert <commit>` lalu push.

## Batasan

- Script tidak menguji data yang dimutasi, upload, atau pembayaran.
- Untuk verifikasi visual produksi, gunakan skill `e2e-playwright`.
- Jangan menjalankan smoke test login berulang tanpa jeda pada akun yang sama; tidak ada rate limit, tetapi tetap bijak.
