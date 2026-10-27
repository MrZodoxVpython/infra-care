import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, CheckCircle2, Eye, Home, Send, Users, Zap } from 'lucide-react';
import { api } from '../api.js';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const nav = useNavigate();
  const [reg, setReg] = useState(false);
  const [f, setF] = useState({ nama: '', email: '', password: '' });
  const [e, setE] = useState('');
  const [show, setShow] = useState(false);

  const set = (k) => (v) => setF({ ...f, [k]: v.target.value });

  const go = async (ev) => {
    ev.preventDefault();
    setE('');
    try {
      const d = await api(reg ? '/auth/register' : '/auth/login', { method: 'POST', body: f });
      localStorage.setItem('token', d.token);
      localStorage.setItem('user', JSON.stringify(d.user));
      nav('/app');
    } catch (x) {
      setE(x.message);
    }
  };

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2 gap-4 lg:gap-8 p-3 sm:p-4 md:p-6 lg:p-10 items-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bg-landing.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/10 -z-10"></div>
      <div className="hidden lg:block">
        <Logo />
        <div className="mt-10 lg:mt-12">
          <h3 className="text-xl lg:text-2xl text-slate-700 dark:text-slate-200">
            Selamat Datang di
          </h3>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0b2a6b] dark:text-white mb-3">
            INFRA-CARE
          </h1>
          <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300">
            Masuk untuk membuat dan memantau
            <br />
            pengaduan infrastruktur.
          </p>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl p-3 lg:p-4 mt-6 lg:mt-8 shadow-lg">
          <div className="text-center text-xs">
            <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-primary mx-auto mb-1" />
            <b className="block text-xs lg:text-sm">Cepat</b>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs">
              Laporan langsung diproses
            </span>
          </div>
          <div className="text-center text-xs">
            <Eye className="w-4 h-4 lg:w-5 lg:h-5 text-primary mx-auto mb-1" />
            <b className="block text-xs lg:text-sm">Transparan</b>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs">
              Pantau perkembangan
            </span>
          </div>
          <div className="text-center text-xs">
            <Users className="w-4 h-4 lg:w-5 lg:h-5 text-primary mx-auto mb-1" />
            <b className="block text-xs lg:text-sm">Terpercaya</b>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs">
              Bersama membangun
            </span>
          </div>
          <div className="text-center text-xs">
            <Building2 className="w-4 h-4 lg:w-5 lg:h-5 text-primary mx-auto mb-1" />
            <b className="block text-xs lg:text-sm">Untuk Semua</b>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs">
              Layanan bagi masyarakat
            </span>
          </div>
        </div>
      </div>
      <form
        className="bg-white/98 dark:bg-slate-900/98 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl max-w-md w-full mx-auto"
        onSubmit={go}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            className="inline-flex items-center gap-1 text-sm text-primary font-semibold"
            to="/"
          >
            <Home className="w-4 h-4" />{' '}
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </Link>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mt-4 mb-2">
          {reg ? 'Buat Akun Baru' : 'Selamat Datang!'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-5 sm:mb-6 text-sm sm:text-base">
          {reg ? 'Daftar sebagai masyarakat.' : 'Masuk untuk melanjutkan ke akun Anda.'}
        </p>
        {reg && (
          <>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap
            </label>
            <input
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Masukkan nama Anda"
              value={f.nama}
              onChange={set('nama')}
            />
          </>
        )}
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 mt-4">
          Email
        </label>
        <input
          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          type="email"
          placeholder="Masukkan email Anda"
          value={f.email}
          onChange={set('email')}
        />
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 mt-4">
          Password
        </label>
        <div className="relative">
          <input
            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            type={show ? 'text' : 'password'}
            placeholder="Masukkan password"
            value={f.password}
            onChange={set('password')}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
        {!reg && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <input type="checkbox" className="rounded" /> Ingat saya
            </label>
            <button type="button" className="text-primary font-semibold">
              Lupa password?
            </button>
          </div>
        )}
        {e && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl mt-4 text-sm">
            {e}
          </div>
        )}
        <button className="w-full bg-primary text-white py-3 rounded-xl font-bold mt-6 hover:bg-primaryDark transition-colors flex items-center justify-center gap-2">
          {reg ? 'DAFTAR' : 'MASUK'}
          <Send className="w-4 h-4" />
        </button>
        <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-sm">
          {reg ? 'Sudah punya akun?' : 'Belum memiliki akun?'}{' '}
          <button type="button" className="text-primary font-bold" onClick={() => setReg(!reg)}>
            {reg ? 'Masuk' : 'Daftar sekarang'}
          </button>
        </p>
        <div className="bg-blue-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs sm:text-sm rounded-xl px-4 py-3 mt-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
          Layanan ini tersedia untuk seluruh masyarakat demi infrastruktur yang lebih baik.
        </div>
      </form>
    </div>
  );
}
