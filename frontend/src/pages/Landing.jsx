import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Construction,
  FileText,
  HelpCircle,
  Mail,
  Phone,
  Search,
  Send,
  User,
} from 'lucide-react';
import { api, getUser } from '../api.js';
import Logo from '../components/Logo.jsx';

export default function Landing() {
  const [s, setS] = useState({ total: 0, selesai: 0, proses: 0 });

  useEffect(() => {
    api('/public/stats')
      .then(setS)
      .catch(() => {});
  }, []);

  const u = getUser();
  const to = u ? '/app' : '/login';

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('/bg-landing.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/10 -z-10"></div>
      <header className="flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full mx-3 sm:mx-4 md:mx-10 my-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 shadow-lg">
        <Logo />
        <nav className="hidden lg:flex gap-6 xl:gap-8 font-semibold">
          <a className="text-primary border-b-2 border-primary pb-1.5">Beranda</a>
          <a
            href="#cara"
            className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
          >
            Cara Kerja
          </a>
          <a
            href="#tentang"
            className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
          >
            Tentang
          </a>
          <a
            href="#bantuan"
            className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
          >
            Bantuan
          </a>
        </nav>
        <Link
          className="inline-flex items-center gap-2 bg-primary text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold hover:bg-primaryDark transition-colors text-sm sm:text-base"
          to={to}
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{u ? 'Dashboard' : 'Login'}</span>
          <span className="sm:hidden">{u ? 'App' : 'Masuk'}</span>
        </Link>
      </header>
      <section className="flex flex-col justify-center items-start gap-5 px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-24 max-w-5xl">
        <div>
          <span className="inline-flex items-center gap-2 bg-blue-100/90 dark:bg-slate-800 text-primary rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold">
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Sistem Pengaduan Infrastruktur Publik
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0b2a6b] dark:text-white leading-tight mt-4 mb-4">
            Laporkan Infrastruktur Rusak,{' '}
            <span className="text-primary">Wujudkan Lingkungan Lebih Baik</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl">
            Sampaikan pengaduan kerusakan infrastruktur publik dengan mudah, cepat, dan transparan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primaryDark transition-colors"
              to={u ? '/app/buat' : '/login'}
            >
              <Send className="w-4 h-4" />
              Buat Pengaduan
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 text-primary border-2 border-primary px-6 py-3 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              to={u ? '/app/tracking' : '/login'}
            >
              <Search className="w-4 h-4" />
              Lacak Pengaduan
            </Link>
          </div>
        </div>
      </section>

      <section
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mx-3 sm:mx-4 md:mx-12 lg:mx-20 mb-12 sm:mb-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg"
        id="stats"
      >
        <div className="p-2">
          <b className="text-xl sm:text-2xl md:text-3xl text-primary block">
            {s.total.toLocaleString('id-ID')}+
          </b>
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm sm:text-base">
            Total Pengaduan
          </span>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Laporan dari seluruh masyarakat
          </p>
        </div>
        <div className="p-2">
          <b className="text-xl sm:text-2xl md:text-3xl text-green-600 block">{s.selesai}</b>
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm sm:text-base">
            Selesai
          </span>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pengaduan yang telah ditangani
          </p>
        </div>
        <div className="p-2">
          <b className="text-xl sm:text-2xl md:text-3xl text-amber-500 block">{s.proses}</b>
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm sm:text-base">
            Sedang Diproses
          </span>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dalam tahap penanganan
          </p>
        </div>
        <div className="p-2">
          <b className="text-xl sm:text-2xl md:text-3xl text-primary block">95%</b>
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm sm:text-base">
            Tingkat Kepuasan
          </span>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dari masyarakat pengguna
          </p>
        </div>
      </section>

      <section id="cara" className="py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2a6b] dark:text-white mb-2 sm:mb-3">
            Cara Kerja
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 sm:mb-10">
            Laporan Anda diproses secara transparan dari mulai hingga selesai.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2">
                Buat Pengaduan
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Isi formulir laporan dengan judul, kategori, lokasi, dan foto bukti kerusakan.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2">
                Verifikasi &amp; Diproses
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tim admin memverifikasi laporan dan menugaskan petugas lapangan.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 text-center hover:shadow-lg transition-shadow sm:col-span-2 md:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2">
                Selesai &amp; Diobservasi
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pekerjaan perbaikan diselesaikan dan status diperbarui menjadi Selesai.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="tentang" className="py-12 sm:py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-10 items-center">
          <div className="flex-1 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2a6b] dark:text-white mb-3 sm:mb-4">
              Tentang INFRA-CARE
            </h2>
            <p className="mb-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              INFRA-CARE adalah sistem pengaduan infrastruktur publik yang memudahkan masyarakat
              melaporkan kerusakan jalan, drainase, penerangan, dan fasilitas umum secara digital.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Dengan INFRA-CARE, setiap laporan dapat dipantau secara real-time, dan pemerintah
              dapat menindaklanjuti kerusakan infrastruktur dengan lebih cepat dan terstruktur.
            </p>
          </div>
          <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
            <Construction className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Bersama Jaga Infrastruktur untuk Masa Depan
            </p>
          </div>
        </div>
      </section>
      <section id="bantuan" className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2a6b] dark:text-white mb-2 sm:mb-3">
            Bantuan
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 sm:mb-10">
            Butuh bantuan? Kami siap membantu Anda.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow">
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-primary mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-1">Email Support</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">support@infracare.id</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow">
              <Phone className="w-7 h-7 sm:w-8 sm:h-8 text-primary mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-1">Telepon</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">0800-123-4567</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
              <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-primary mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-1">FAQ</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pertanyaan seputar pengaduan bisa diakses di menu Notifikasi &amp; Riwayat.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
