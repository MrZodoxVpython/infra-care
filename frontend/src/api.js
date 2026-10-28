export const getUser=()=>{try{return JSON.parse(localStorage.getItem('user'))}catch{return null}};
export async function api(path,{method='GET',body,form}={}){
  const h={};let t=localStorage.getItem('token');
  // Token lama (sebelum perbaikan JWT) bisa membawa foto profil base64 dan
  // membengkak puluhan KB. Header sebesar itu ditolak Vercel dengan 494,
  // jadi token yang tidak wajar dibuang agar pengguna login ulang.
  if(t&&t.length>4000){localStorage.removeItem('token');localStorage.removeItem('user');t=null}
  if(t)h.Authorization='Bearer '+t;
  if(body)h['Content-Type']='application/json';
  const r=await fetch('/api'+path,{method,headers:h,body:form||(body?JSON.stringify(body):undefined)});
  if(r.status===431||r.status===494){localStorage.removeItem('token');localStorage.removeItem('user');throw new Error('Sesi kedaluwarsa. Silakan login ulang.')}
  const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||'Terjadi kesalahan');return d;
}
export const tgl=d=>{const x=new Date(d);return x.toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})+' '+x.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}).replace('.',':')+' WIB'};
export const slug=s=>(s||'').toLowerCase().replace(/\s+/g,'-');
