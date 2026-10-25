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
