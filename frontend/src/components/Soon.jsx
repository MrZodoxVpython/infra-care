import { Construction } from 'lucide-react';

export default function Soon() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
      <Construction className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
      <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-2">
        Halaman ini sedang disiapkan
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Fitur ini akan tersedia pada pembaruan berikutnya.
      </p>
    </div>
  );
}
