# INFRA-CARE
Sistem Pengaduan Infrastruktur Publik — Node.js (Express) + React (Vite) + PostgreSQL.

## Menjalankan
1. Buat database: `createdb infracare`
2. Backend:
   ```
   cd backend && cp .env.example .env   # sesuaikan DATABASE_URL
   npm install && npm run seed && npm start      # http://localhost:4000
   ```
3. Frontend (terminal lain):
   ```
   cd frontend && npm install && npm run dev      # http://localhost:5173
   ```

## Akun demo (password: `password123`)
- Masyarakat: yeni@infracare.id
- Admin Pemerintah: budi@infracare.id
- Petugas Lapangan: andi@infracare.id

## Alat bantu AI (OpenCode)

Paket instruksi ada di `.opencode/` dan `AGENTS.md`:

- Skill: `ui-design-system`, `feature-delivery`, `ui-verify`, `deploy-verify`, `security-baseline`, `codebase-map`, `auth-rbac`, `form-ux`, `performance-audit`, `e2e-playwright`.
- Agent: `designer` (implementasi), `qa` (verifikasi read-only), `reviewer` (review read-only).
- Command: `/verify`, `/ship`, `/audit-ui`.
- MCP Playwright untuk verifikasi visual. Sekali saja:
  ```
  npx --yes @playwright/mcp install-browser chrome-for-testing
  ```

Verifikasi tanpa AI:

```
npm --prefix frontend run build
node .opencode/skills/ui-verify/scripts/check-ui.mjs .
bash .opencode/skills/security-baseline/scripts/check-secrets.sh
bash .opencode/skills/performance-audit/scripts/bundle-report.sh
bash .opencode/skills/deploy-verify/scripts/verify-deploy.sh
```
