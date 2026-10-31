---
description: Verifikasi build, kelas UI, dan smoke test API tanpa deploy
---

Verifikasi pekerjaan saat ini untuk INFRA-CARE. Jangan mengubah kode.

Langkah:
1. Jalankan `git status --short` dan `git diff --stat`.
2. Muat skill `ui-verify`, lalu jalankan:
   - `npm --prefix frontend run build`
   - `node .opencode/skills/ui-verify/scripts/check-ui.mjs .`
3. Jika perubahan menyentuh API/auth, muat skill `security-baseline` dan `auth-rbac`, lalu cek endpoint yang terdampak.
4. Jika browser tersedia, muat skill `e2e-playwright` dan uji tampilan di 1440/768/390 px, light dan dark.
5. Laporkan tabel: pemeriksaan | perintah | hasil | catatan.

$ARGUMENTS

Jangan menyatakan lulus tanpa bukti. Sebutkan keterbatasan bila ada alat yang tidak tersedia.
