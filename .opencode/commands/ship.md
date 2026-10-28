---
description: Verifikasi, commit, push, lalu cek hasil deploy produksi
---

Siapkan rilis INFRA-CARE untuk perubahan saat ini.

Langkah:
1. Muat skill `feature-delivery`, `ui-verify`, dan `deploy-verify`.
2. Jalankan verifikasi lokal: build + `check-ui.mjs` + smoke test yang relevan.
3. Tampilkan `git diff --stat` dan ringkasan perubahan. **Minta persetujuan sebelum commit/push.**
4. Setelah disetujui: commit dengan pesan Bahasa Indonesia yang spesifik, lalu push ke `origin main`.
5. Tunggu deploy Vercel selesai (± 85–95 detik), lalu jalankan `bash .opencode/skills/deploy-verify/scripts/verify-deploy.sh`.
6. Laporkan commit hash, URL, asset hash lokal vs produksi, dan hasil smoke test.

$ARGUMENTS

Jangan pernah commit `.env`, secret, `dist/`, atau file build. Jika verifikasi gagal, jangan push.
