import {
  Bell,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileBarChart,
  FileText,
  LayoutDashboard,
  Map,
  MapPin,
  PlusCircle,
  Settings,
  UserCircle,
  Users,
} from 'lucide-react';

export const KAT = ['Jalan', 'Jembatan', 'Drainase', 'Penerangan', 'Fasilitas Umum', 'Lainnya'];

export const STATUS = [
  'Diterima',
  'Diverifikasi',
  'Diprioritaskan',
  'Ditugaskan',
  'Dalam Perbaikan',
  'Selesai',
  'Ditolak',
];

export const MENU = {
  masyarakat: [
    ['/app', 'Dashboard', LayoutDashboard],
    ['/app/buat', 'Buat Pengaduan', PlusCircle],
    ['/app/tracking', 'Tracking', MapPin],
    ['/app/riwayat', 'Riwayat', Clock],
    ['/app/notifikasi', 'Notifikasi', Bell],
    ['/app/profil', 'Profil', UserCircle],
  ],
  admin: [
    ['/app', 'Dashboard', LayoutDashboard],
    ['/app/kelola', 'Kelola Pengaduan', ClipboardList],
    ['/app/peta', 'Peta Pengaduan', Map],
    ['/app/data-masyarakat', 'Data Masyarakat', Users],
    ['/app/laporan', 'Laporan', FileBarChart],
    ['/app/pengaturan', 'Pengaturan', Settings],
  ],
  petugas: [
    ['/app', 'Dashboard', LayoutDashboard],
    ['/app/kelola', 'Tugas Pengaduan', ClipboardCheck],
    ['/app/peta', 'Peta Lokasi', Map],
    ['/app/laporan', 'Laporan', FileText],
    ['/app/profil', 'Profil', UserCircle],
    ['/app/pengaturan', 'Pengaturan', Settings],
  ],
};

export const ROLE = {
  masyarakat: 'Masyarakat',
  admin: 'Admin Pemerintah',
  petugas: 'Petugas Lapangan',
};
