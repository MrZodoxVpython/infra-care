import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export default function Logo() {
  return (
    <Link to="/" className="logo flex items-center gap-2 flex-shrink-0">
      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
        <Building2 className="w-5 h-5 text-white" />
      </div>
      <div className="leading-tight">
        <b className="text-lg text-[#0b2a6b] dark:text-white block">INFRA-CARE</b>
        <small className="text-[9px] text-[#6b7fa6] dark:text-slate-400">
          Bersama Jaga Infrastruktur
          <br />
          Untuk Masa Depan
        </small>
      </div>
    </Link>
  );
}
