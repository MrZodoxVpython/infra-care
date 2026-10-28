import React,{useEffect,useState} from 'react';
import {Routes,Route,Navigate,Link,NavLink,useNavigate,useParams,Outlet,useLocation} from 'react-router-dom';
import {api,getUser,tgl,slug} from './api.js';
import L from 'leaflet';
import {MapContainer,TileLayer,Marker,Popup,useMap} from 'react-leaflet';
const MapClicker = ({onClick}) => {
  const map = useMap();
  useEffect(() => {
    const handler = e => onClick(e);
    map.on('click', handler);
    return () => map.off('click', handler);
  }, [map, onClick]);
  return null;
};
const FitBounds = ({forceCenter=[-7.0292, 112.7461], forceZoom=12}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(forceCenter, forceZoom, {animate: false});
  }, [map, forceCenter, forceZoom]);
  return null;
};
const FlyTo=({pos,zoom=16})=>{const map=useMap();useEffect(()=>{if(pos)map.flyTo(pos,zoom,{duration:.6})},[pos,zoom,map]);return null};
const customIcon = L.icon({
   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
   iconSize: [25, 41],
   iconAnchor: [12, 41],
   popupAnchor: [1, -34]
});
import 'leaflet/dist/leaflet.css';

const KAT=['Jalan','Jembatan','Drainase','Penerangan','Fasilitas Umum','Lainnya'];
const STATUS=['Diterima','Diverifikasi','Diprioritaskan','Ditugaskan','Dalam Perbaikan','Selesai','Ditolak'];
const Logo=()=><Link to="/" className="logo"><i>🏢</i><div><b>Lapor </b><small>Bersama Jaga Infrastruktur,<br/>Untuk Masa Depan</small></div></Link>;
const St=({s,dark})=><span className={'tag '+slug(s)} style={{background:dark?'#334155':'#f2f8ff',color:dark?'#e2e8f0':'#14306b',border:'1px solid '+(dark?'#334155':'#edf3fb'),padding:'2px 8px',borderRadius:12,fontSize:12}}>{s}</span>;
const ThemeToggle=({dark,onToggle})=><button className="theme-toggle" onClick={onToggle} title={dark?'Mode Terang':'Mode Gelap'}>{dark?'☀️':'🌙'}</button>;

const MENU={
 masyarakat:[['/app','Dashboard','🏠'],['/app/buat','Buat Pengaduan','➕'],['/app/tracking','Tracking','📍'],['/app/riwayat','Riwayat','🕘'],['/app/notifikasi','Notifikasi','🔔'],['/app/profil','Profil','👤']],
 admin:[['/app','Dashboard','🏠'],['/app/kelola','Kelola Pengaduan','📋'],['/app/peta','Peta Pengaduan','📍'],['/app/data-masyarakat','Data Masyarakat','👥'],['/app/laporan','Laporan','📊'],['/app/pengaturan','Pengaturan','⚙️']],
 petugas:[['/app','Dashboard','🏠'],['/app/kelola','Tugas Pengaduan','📋'],['/app/peta','Peta Lokasi','📍'],['/app/laporan','Laporan','📄'],['/app/profil','Profil','👤'],['/app/pengaturan','Pengaturan','⚙️']]};
const ROLE={masyarakat:'Masyarakat',admin:'Admin Pemerintah',petugas:'Petugas Lapangan'};

function Landing(){
 const[s,setS]=useState({total:0,selesai:0,proses:0});useEffect(()=>{api('/public/stats').then(setS).catch(()=>{})},[]);
 const u=getUser(),to=u?'/app':'/login';
 return<div className="sky" style={{minHeight:'100vh'}}>
  <div className="nav"><Logo/><nav><a className="on">Beranda</a><a href="#cara">Cara Kerja</a><a href="#tentang">Tentang</a><a href="#bantuan">Bantuan</a></nav><Link className="btn" to={to}>👤 {u?'Dashboard':'Login'}</Link></div>
  <div className="hero"><div><span className="pill">📢 Sistem Pengaduan Infrastruktur Publik</span>
   <h1>Laporkan Infrastruktur Rusak, <span>Wujudkan Lingkungan Lebih Baik</span></h1>
   <p>Sampaikan pengaduan kerusakan infrastruktur publik dengan mudah, cepat, dan transparan.</p>
   <div style={{display:'flex',gap:14,marginTop:22}}><Link className="btn" to={u?'/app/buat':'/login'}>✈ Buat Pengaduan</Link><Link className="btn o" to={u?'/app/tracking':'/login'}>🔍 Lacak Pengaduan</Link></div></div></div>

   <div className="stats4" id="stats">
    <div><b>{s.total.toLocaleString('id-ID')}+</b>Total Pengaduan<p className="mu">Laporan dari seluruh masyarakat</p></div>
    <div><b>{s.selesai}</b>Selesai<p className="mu">Pengaduan yang telah ditangani</p></div>
    <div><b>{s.proses}</b>Sedang Diproses<p className="mu">Dalam tahap penanganan</p></div>
    <div><b>95%</b>Tingkat Kepuasan<p className="mu">Dari masyarakat pengguna</p></div>
   </div>

  <section id="cara" style={{padding:'40px 20px'}} className="full-screen">
   <div style={{maxWidth:1000,margin:'0 auto',textAlign:'center'}}>
    <h2 style={{marginBottom:10}}>Cara Kerja</h2>
    <p style={{marginBottom:30,fontSize:14,opacity:0.8}}>Laporan Anda diproses secara transparan dari mulai hingga selesai.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:20}}>
     <div style={{border:'1px solid #edf3fb',borderRadius:16,padding:24,textAlign:'center'}}>
      <div style={{fontSize:32,marginBottom:12}}>📝</div>
      <h3 style={{marginBottom:8}}>Buat Pengaduan</h3>
      <p style={{fontSize:14,opacity:0.8}}>Isi formulir laporan dengan judul, kategori, lokasi, dan foto bukti kerusakan.</p>
     </div>
     <div style={{border:'1px solid #edf3fb',borderRadius:16,padding:24,textAlign:'center'}}>
      <div style={{fontSize:32,marginBottom:12}}>🔍</div>
      <h3 style={{marginBottom:8}}>Verifikasi &amp; Diproses</h3>
      <p style={{fontSize:14,opacity:0.8}}>Tim admin memverifikasi laporan dan menugaskan petugas lapangan.</p>
     </div>
     <div style={{border:'1px solid #edf3fb',borderRadius:16,padding:24,textAlign:'center'}}>
      <div style={{fontSize:32,marginBottom:12}}>✅</div>
      <h3 style={{marginBottom:8}}>Selesai &amp; Diobservasi</h3>
      <p style={{fontSize:14,opacity:0.8}}>Pekerjaan perbaikan diselesaikan dan status diperbarui menjadi Selesai.</p>
     </div>
    </div>
   </div>
  </section>
  <section id="tentang" style={{padding:'40px 20px'}} className="full-screen">
   <div style={{maxWidth:1000,margin:'0 auto',display:'flex',gap:40,flexWrap:'wrap',alignItems:'center'}}>
    <div style={{flex:1,minWidth:280}}>
     <h2 style={{marginBottom:12}}>Tentang INFRA-CARE</h2>
     <p style={{marginBottom:16,fontSize:14,lineHeight:1.6,opacity:0.8}}>INFRA-CARE adalah sistem pengaduan infrastruktur publik yang memudahkan masyarakat melaporkan kerusakan jalan, drainase, penerangan, dan fasilitas umum secara digital.</p>
     <p style={{marginBottom:16,fontSize:14,lineHeight:1.6,opacity:0.8}}>Dengan INFRA-CARE, setiap laporan dapat dipantau secara real-time, dan pemerintah dapat menindaklanjuti kerusakan infrastruktur dengan lebih cepat dan terstruktur.</p>
    </div>
    <div className="land-about-card" style={{flex:1,minWidth:280}}>
     <div style={{fontSize:48}}>🏗</div>
     <p style={{fontSize:14,opacity:0.8,marginTop:12}}>Bersama Jaga Infrastruktur untuk Masa Depan</p>
    </div>
   </div>
  </section>
  <section id="bantuan" style={{padding:'40px 20px'}} className="full-screen">
   <div style={{maxWidth:800,margin:'0 auto',textAlign:'center'}}>
    <h2 style={{marginBottom:10}}>Bantuan</h2>
    <p style={{marginBottom:30,fontSize:14,opacity:0.8}}>Butuh bantuan? Kami siap membantu Anda.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:20,textAlign:'left'}}>
     <div style={{border:'1px solid #edf3fb',borderRadius:16,padding:20}}>
      <div style={{fontSize:28,marginBottom:10}}>📧</div>
      <h3 style={{marginBottom:6}}>Email Support</h3>
      <p style={{fontSize:14,opacity:0.8}}>support@infracare.id</p>
     </div>
     <div style={{border:'1px solid #edf3fb',borderRadius:16,padding:20}}>
      <div style={{fontSize:28,marginBottom:10}}>📞</div>
      <h3 style={{marginBottom:6}}>Telepon</h3>
      <p style={{fontSize:14,opacity:0.8}}>0800-123-4567</p>
     </div>
     <div style={{border:'1px solid #edf3fb',borderRadius:16,padding:20}}>
      <div style={{fontSize:28,marginBottom:10}}>❓</div>
      <h3 style={{marginBottom:6}}>FAQ</h3>
      <p style={{fontSize:14,opacity:0.8}}>Pertanyaan seputar pengaduan bisa diakses di menu Notifikasi &amp; Riwayat.</p>
     </div>
    </div>
   </div>
  </section>
 </div>}

function Login(){
 const nav=useNavigate(),[reg,setReg]=useState(false),[f,setF]=useState({nama:'',email:'',password:''}),[e,setE]=useState(''),[show,setShow]=useState(false);
 const set=k=>v=>setF({...f,[k]:v.target.value});
 const go=async ev=>{ev.preventDefault();setE('');try{const d=await api(reg?'/auth/register':'/auth/login',{method:'POST',body:f});localStorage.setItem('token',d.token);localStorage.setItem('user',JSON.stringify(d.user));nav('/app')}catch(x){setE(x.message)}};
 return<div className="login sky"><div><Logo/><div style={{marginTop:60}}><h3>Selamat Datang di</h3><h1>INFRA-CARE</h1><p>Masuk untuk membuat dan memantau<br/>pengaduan infrastruktur.</p></div>
  <div className="feat"><div>🛡<b>Cepat</b>Laporan langsung diproses</div><div>👁<b>Transparan</b>Pantau perkembangan pengaduan</div><div>👥<b>Terpercaya</b>Bersama membangun infrastruktur</div><div>🏛<b>Untuk Semua</b>Layanan bagi masyarakat</div></div></div>
  <form className="lcard" onSubmit={go}><div style={{textAlign:'right'}}><Link className="tag" to="/">🏠 Kembali ke Beranda</Link></div><Logo/>
   <h2 style={{marginTop:20}}>{reg?'Buat Akun Baru':'Selamat Datang! 👋'}</h2><p className="mu">{reg?'Daftar sebagai masyarakat.':'Masuk untuk melanjutkan ke akun Anda.'}</p>
   {reg&&<><label>Nama Lengkap</label><input className="in" placeholder="Masukkan nama Anda" value={f.nama} onChange={set('nama')}/></>}
   <label>Email</label><input className="in" type="email" placeholder="Masukkan email Anda" value={f.email} onChange={set('email')}/>
   <label>Password</label><div style={{position:'relative'}}><input className="in" type={show?'text':'password'} placeholder="Masukkan password" value={f.password} onChange={set('password')}/><span onClick={()=>setShow(!show)} style={{position:'absolute',right:14,top:12,cursor:'pointer'}}>👁</span></div>
   {!reg&&<div style={{display:'flex',justifyContent:'space-between',margin:'14px 0',fontSize:14}}><span><input type="checkbox"/> Ingat saya</span><a className="auth-link">Lupa password?</a></div>}
   {e&&<div className="err">{e}</div>}
   <button className="btn w" style={{marginTop:14}}>{reg?'DAFTAR':'MASUK'} →</button>
   <p className="mu" style={{textAlign:'center'}}>{reg?'Sudah punya akun?':'Belum memiliki akun?'} <a className="auth-link" style={{fontWeight:700,cursor:'pointer'}} onClick={()=>setReg(!reg)}>{reg?'Masuk':'Daftar sekarang'}</a></p>
   <div className="banner" style={{fontSize:13,marginBottom:0}}>🛡 Layanan ini tersedia untuk seluruh masyarakat demi infrastruktur yang lebih baik.</div></form></div>}

function Layout(){
 const [u,setU]=useState(getUser()||{}),nav=useNavigate(),loc=useLocation(),[n,setN]=useState(0),[dark,setDark]=useState(()=>localStorage.getItem('theme')==='dark');
 useEffect(()=>{document.documentElement.classList.toggle('dark',dark);localStorage.setItem('theme',dark?'dark':'light')},[dark]);
 useEffect(()=>{
   const fetchNotif=async()=>{
     try{const d=await api('/notifications');setN(d.filter(x=>!x.dibaca).length)}catch(_){}
   };
   fetchNotif();
   const onRefresh=()=>fetchNotif();
   window.addEventListener('notif:refresh',onRefresh);
   const syncUser=()=>{const cu=getUser();if(cu)setU(cu);};
   window.addEventListener('user:refresh',syncUser);
   return()=>{window.removeEventListener('notif:refresh',onRefresh);window.removeEventListener('user:refresh',syncUser);};
 },[loc]);
 useEffect(()=>{(async()=>{try{const me=await api('/auth/me');setU(me);localStorage.setItem('user',JSON.stringify(me));}catch(_){if(!localStorage.getItem('token')){localStorage.removeItem('user');nav('/login')}}})();},[loc.pathname]);
 if(!u?.id)return<Navigate to="/login"/>;
 const out=()=>{localStorage.clear();nav('/')};
  const [menuOpen,setMenuOpen]=useState(false);
 const initials=(u.nama||'U').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();
 const Avatar=({small})=>(u.foto?<img src={u.foto} className="av" style={{objectFit:'cover',width:small?34:38,height:small?34:38,borderRadius:'50%'}}/>:<div className="av" style={{width:small?34:38,height:small?34:38}}>{initials}</div>);
 return<div className="app"><aside className="side"><div className="s-logo"><Logo/></div><div className="s-user"><Avatar/><div><b>Halo, {u.nama}</b><br/><span className="mu" style={{fontSize:12,opacity:0.8}}>{ROLE[u.role]}</span></div></div>
  {MENU[u.role].map(([to,l,ic])=><NavLink key={to} to={to} end={to==='/app'} className={({isActive})=>isActive?'s-item on':'s-item'}>{ic} {l}{l==='Notifikasi'&&n>0&&<span className="s-badge">{n}</span>}</NavLink>)}
   <div className="s-quote">Infrastruktur baik untuk masa depan kita bersama ♡</div></aside>
  <div className="app-body"><div className="top"><input className="in" placeholder="Cari pengaduan, nomor laporan, atau kategori..."/><div className="r"><ThemeToggle dark={dark} onToggle={()=>setDark(!dark)}/><span className="notif">🔔 {n}</span><div className="u-prof" onClick={()=>setMenuOpen(!menuOpen)} style={{cursor:'pointer'}}><Avatar small/><div><b>{u.nama}</b><br/><span className="mu" style={{fontSize:12,opacity:0.8}}>{ROLE[u.role]}</span></div><span>▾</span>{menuOpen&&<div className="top-dropdown"><a onClick={out} className="top-dropdown-item">🚪 Keluar</a></div>}</div></div></div><div className="main" style={{flex:1,overflow:'auto',padding:'20px 26px'}}><Outlet/></div></div></div>}

function Table({rows,admin,onChange,compact,dark,highlightFn,variant}){
 const tBg=dark?'#1e293b':'#fff';const tTxt=dark?'#e2e8f0':'#14306b';const tSub=dark?'#94a3b8':'#6b7fa6';const tBorder=dark?'#334155':'#edf3fb';const headBg=dark?'#0f172a':'#f9fbfd';
 if(compact){
  return<table className="t-compact"><thead><tr><th>Judul Pengaduan</th><th style={{textAlign:'right'}}>Tanggal</th><th style={{textAlign:'right'}}>Status</th></tr></thead><tbody>
  {rows.map((r,i)=><tr key={r.id} style={highlightFn&&highlightFn(r)?{background:'rgba(59,130,246,0.12)'}:{}}><td className="t-img"><img src={r.foto||'https://via.placeholder.com/40x40?color=ddd'} style={{borderRadius:8,objectFit:'contain',width:50,height:'auto',maxHeight:60,display:'block'}}/><div><b style={{fontSize:13,display:'block'}}>{r.judul}</b><span className="mu" style={{fontSize:12,display:'block'}}>{r.kategori} · {r.lokasi}</span></div></td><td style={{textAlign:'right'}}><span className="mu" style={{fontSize:12}}>{tgl(r.created_at)}</span></td><td style={{textAlign:'right'}}><St s={r.status} dark={dark}/></td></tr>)}
  {!rows.length&&<tr><td colSpan="3" className="mu" style={{textAlign:'center'}}>Belum ada data pengaduan.</td></tr>}
  </tbody></table>}
 if(variant==='rw'){
  return<table className="rw-table"><thead><tr><th>No.</th><th>Pengaduan</th><th>Kategori</th><th>Lokasi</th>{admin&&<th>Pelapor</th>}<th>Tanggal</th><th style={{textAlign:'center'}}>Status</th><th style={{textAlign:'right'}}>Aksi</th></tr></thead><tbody>
  {rows.map((r,i)=><tr key={r.id} className={highlightFn&&highlightFn(r)?'rw-row-hot':undefined}>
    <td className="rw-cell-no">{String(i+1).padStart(2,'0')}</td>
    <td><b className="rw-title">{r.judul}</b><span className="rw-code">{r.kode}</span></td>
    <td><span className="rw-chip">{r.kategori}</span></td>
    <td><span className="rw-loc" title={r.lokasi}>{r.lokasi}</span></td>
    {admin&&<td className="rw-cell-sub">{r.pelapor}</td>}
    <td className="rw-cell-date">{tgl(r.created_at)}</td>
    <td style={{textAlign:'center'}}>{onChange?<select className="in" style={{padding:'6px 8px',fontSize:12}} value={r.status} onChange={e=>onChange(r,e.target.value)}>{STATUS.map(s=><option key={s}>{s}</option>)}</select>:<St s={r.status}/>}</td>
    <td style={{textAlign:'right'}}><Link className="rw-action" to={'/app/tracking/'+r.kode} title="Lihat detail">👁 Lihat Detail</Link></td>
  </tr>)}
  {!rows.length&&<tr><td colSpan={admin?8:7}><div className="rw-empty"><div className="rw-empty-ic">📭</div><p>Belum ada data pengaduan.</p></div></td></tr>}
  </tbody></table>}
 return<table style={{width:'100%',background:tBg,color:tTxt,borderCollapse:'separate',borderSpacing:0}}><thead><tr><th style={{background:headBg,color:tSub,fontWeight:600,fontSize:12,textTransform:'uppercase',letterSpacing:0.5,padding:'12px 24px',textAlign:'left',borderBottom:'1px solid '+tBorder}}>No.</th><th style={{background:headBg,color:tSub,fontWeight:600,fontSize:12,textTransform:'uppercase',letterSpacing:0.5,padding:'12px 16px',textAlign:'left',borderBottom:'1px solid '+tBorder}}>Pengaduan</th><th style={{background:headBg,color:tSub,fontWeight:600,fontSize:12,textTransform:'uppercase',letterSpacing:0.5,padding:'12px 16px',textAlign:'left',borderBottom:'1px solid '+tBorder}}>Kategori</th><th style={{background:headBg,color:tSub,fontWeight:600,fontSize:12,textTransform:'uppercase',letterSpacing:0.5,padding:'12px 16px',textAlign:'left',borderBottom:'1px solid '+tBorder}}>Lokasi</th>{admin&&<th style={{background:headBg,color:tSub,fontWeight:600,fontSize:12,textTransform:'uppercase',letterSpacing:0.5,padding:'12px 16px',textAlign:'left',borderBottom:'1px solid '+tBorder}}>Pelapor</th>}<th style={{background:headBg,color:tSub,fontWeight:600,fontSize:12,textTransform:'uppercase',letterSpacing:0.5,padding:'12px 16px',textAlign:'left',borderBottom:'1px solid '+tBorder}}>Tanggal</th><th style={{background:headBg,color:tSub,fontWeight:600,fontSize:12,textTransform:'uppercase',letterSpacing:0.5,padding:'12px 16px',textAlign:'center',borderBottom:'1px solid '+tBorder}}>Status</th><th style={{background:headBg,color:tSub,fontWeight:600,fontSize:12,textTransform:'uppercase',letterSpacing:0.5,padding:'12px 24px',textAlign:'right',borderBottom:'1px solid '+tBorder}}>Aksi</th></tr></thead><tbody>
 {rows.map((r,i)=><tr key={r.id} style={{...(highlightFn&&highlightFn(r)?{background:dark?'rgba(59,130,246,0.18)':'rgba(59,130,246,0.1)',transition:'background 0.5s'}:{})}}>
   <td style={{padding:'14px 24px',color:tSub,fontSize:13,borderBottom:'1px solid '+tBorder}}>{i+1}</td>
   <td style={{padding:'14px 16px',borderBottom:'1px solid '+tBorder}}><div><b style={{color:tTxt,fontSize:14,display:'block'}}>{r.judul}</b><span style={{color:tSub,fontSize:12}}>{r.kode}</span></div></td>
   <td style={{padding:'14px 16px',borderBottom:'1px solid '+tBorder}}><span style={{padding:'4px 10px',borderRadius:10,background:dark?'#334155':'#f1f5f9',color:tSub,fontSize:12}}>{r.kategori}</span></td>
   <td style={{padding:'14px 16px',color:tSub,fontSize:13,borderBottom:'1px solid '+tBorder,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={r.lokasi}>{r.lokasi}</td>
   {admin&&<td style={{padding:'14px 16px',color:tSub,fontSize:13,borderBottom:'1px solid '+tBorder}}>{r.pelapor}</td>}
   <td style={{padding:'14px 16px',color:tSub,fontSize:13,borderBottom:'1px solid '+tBorder}}>{tgl(r.created_at)}</td>
   <td style={{padding:'14px 16px',textAlign:'center',borderBottom:'1px solid '+tBorder}}>{onChange?<select className="in" style={{padding:6,background:dark?'#0f172a':'#fff',color:tTxt,borderColor:tBorder,fontSize:12}} value={r.status} onChange={e=>onChange(r,e.target.value)}>{STATUS.map(s=><option key={s}>{s}</option>)}</select>:<St s={r.status}/>}</td>
   <td style={{padding:'14px 24px',textAlign:'right',borderBottom:'1px solid '+tBorder}}><Link to={'/app/tracking/'+r.kode} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:10,background:dark?'#1e3a5f':'#eef6ff',color:dark?'#60a5fa':'#2563eb',fontSize:13,fontWeight:600,textDecoration:'none'}} title="Lihat detail">👁 Lihat Detail</Link></td></tr>)}
 {!rows.length&&<tr><td colSpan={admin?8:7} style={{padding:'60px 20px',textAlign:'center'}}><div style={{fontSize:40,marginBottom:12,opacity:0.5}}>📭</div><p style={{color:tSub,margin:0}}>Belum ada data pengaduan.</p></td></tr>}</tbody></table>}

function Dashboard(){
 const u=getUser(),m=u.role==='masyarakat',[s,setS]=useState(null),[rows,setRows]=useState([]),[err,setErr]=useState(''),[dark,setDark]=useState(()=>document.documentElement.classList.contains('dark')),[mapCenter,setMapCenter]=useState([-7.0292,112.7461]),nav=useNavigate();
 useEffect(()=>{const ck=()=>setDark(document.documentElement.classList.contains('dark'));ck();const ob=new MutationObserver(ck);ob.observe(document.documentElement,{attributes:true,attributeFilter:['class']});return()=>ob.disconnect();},[]);
 useEffect(()=>{document.documentElement.classList.toggle('dark',dark)},[dark]);
 useEffect(()=>{api('/stats').then(setS).catch(e=>setErr(e.message));api('/complaints').then(setRows).catch(()=>{})},[]);
 if(err)return<div className="card" style={{textAlign:'center',padding:'56px 24px',maxWidth:520,margin:'40px auto'}}><div style={{fontSize:44,marginBottom:12}}>⚠️</div><h2 style={{color:dark?'#e2e8f0':'#14306b',margin:'0 0 8px'}}>Data dashboard gagal dimuat</h2><p className="mu" style={{marginBottom:20}}>{err}</p><button className="btn" onClick={()=>window.location.reload()}>🔄 Muat Ulang</button></div>;
 if(!s)return<p>Memuat...</p>;
 const tot=s.total||1;
 const cardBg=dark?'#1e293b':'#fff';
 const cardText=dark?'#e2e8f0':'#14306b';
 const cardSub=dark?'#94a3b8':'#6b7fa6';
 const borderCol=dark?'#334155':'#edf3fb';
 const progBg=dark?'#334155':'#e8f0fb';
 const goToRiwayat=(tab)=>{nav(m?'/app/riwayat':'/app/kelola',{state:{focusTab:tab}})};
 const STATS=m?[
  ['Total Pengaduan',s.total,'Dari semua laporan Anda','📄','#1565d8','Semua'],
  ['Diproses',s.diproses,'Sedang diverifikasi / diproses','⏳','#f59e0b','Diproses'],
  ['Dalam Perbaikan',s.perbaikan,'Sedang ditangani petugas','🔧','#ef4444','Ditanggapi'],
  ['Selesai',s.selesai,'Telah ditangani','✅','#22c55e','Selesai']
 ]:[
  ['Total Pengaduan',s.total,'Seluruh pengaduan masuk','📄','#1565d8','Semua'],
  ['Dalam Proses',s.diproses+s.perbaikan,'Sedang ditangani','⏳','#f59e0b','Diproses'],
  ['Selesai',s.selesai,'Telah ditangani','✅','#22c55e','Selesai'],
  ['Ditolak',s.ditolak,'Tidak memenuhi syarat','❌','#ef4444','Ditolak']
 ];
 return<>
  <div className="d-layout">
   <div className="d-col-left">
    <div className="d-banner">
     <div>
      <h2>Selamat Datang, {u.nama}! 👋</h2>
      <p>{m?'Mari bersama kita jaga infrastruktur publik agar lingkungan kita semakin baik.':'Kelola pengaduan masyarakat dan pantau kondisi infrastruktur di wilayah Anda.'}</p>
      {m&&<Link className="d-btn" to="/app/buat">➕ Buat Pengaduan</Link>}
     </div>
     <div className="d-banner-img">👩‍💼📱🏗️</div>
    </div>

    <div className="d-actions">
     <h3>Aksi Cepat</h3>
     <div className="d-action-grid">
      {(m?[['/app/buat','➕','Buat Pengaduan','Laporkan kerusakan infrastruktur'],['/app/tracking','📍','Tracking','Cek status laporan Anda'],['/app/riwayat','🕘','Riwayat','Lihat riwayat pengaduan'],['/app/notifikasi','🔔','Notifikasi','Informasi terbaru pengaduan']]:[['/app/kelola','📋','Kelola','Pengaduan masyarakat'],['/app/peta','🗺','Peta','Lokasi pengaduan'],['/app/laporan','📄','Laporan','Laporan infrastruktur'],['/app/pengaturan','⚙️','Pengaturan','Pengaturan akun']]).map(([to,ic,l,d])=>(<Link key={to} to={to} className="d-action"><div className="d-action-ic">{ic}</div><div><b>{l}</b><br/><span className="mu" style={{fontSize:12}}>{d}</span></div></Link>))}
     </div>
    </div>

    <div className="d-recent" style={{background:cardBg}}>
     <div className="d-section-head"><h3 style={{color:cardText}}>Pengaduan Terbaru</h3><Link to={m?'/app/riwayat':'/app/kelola'} style={{color:'var(--b)',fontSize:13}}>Lihat Semua →</Link></div>
     <Table rows={rows.slice(0,5)} admin={!m} compact dark={dark}/>
    </div>
   </div>

   <div className="d-col-right">
    <div className="d-stats-grid">
     {STATS.map(([l,v,d,ic,color,tab])=>(<div key={l} className="d-stat-card" style={{cursor:'pointer'}} onClick={()=>goToRiwayat(tab)}><div className="d-stat-head"><div className="d-stat-ic" style={{background:color+'15',color:color}}>{ic}</div><div style={{marginLeft:'auto'}}>→</div></div><div className="d-stat-body"><span className="mu" style={{fontSize:12}}>{l}</span><b style={{fontSize:24,color:color}}>{v}</b><span className="mu" style={{fontSize:12,opacity:0.8}}>{d}</span></div></div>))}
    </div>

    <div className="d-map" style={{background:cardBg}}>
     <div className="d-section-head"><h3 style={{color:cardText}}>Sebaran Pengaduan</h3><Link to="/app/peta" style={{color:'var(--b)',fontSize:13}}>Lihat Semua →</Link></div>
      <div className="d-map-placeholder" style={{height:'200px',border:'1px solid #edf3fb',borderRadius:12,overflow:'hidden',marginTop:8}}>
        <MapContainer center={[-7.0292, 112.7461]} zoom={12} style={{height:'100%',width:'100%'}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors'/>
          {rows.filter(r=>r.lat&&r.lng).map((r)=>(
            <Marker key={r.id} position={[parseFloat(r.lat), parseFloat(r.lng)]} icon={customIcon}>
              <Popup>
                <div style={{minWidth:150}}>
                  <b>{r.judul}</b><br/>
                  <small>{r.kode} • {r.kategori}</small><br/>
                  <small>Status: {r.status}</small><br/>
                  <small>{r.lokasi}</small>
                </div>
              </Popup>
            </Marker>
          ))}
          <FitBounds forceCenter={[-7.0292, 112.7461]} forceZoom={12}/>
        </MapContainer>
      </div>
     <div className="d-categories">
      {s.kategori.map(k=>(<div key={k.kategori} className="d-cat" style={{color:cardText,borderBottomColor:borderCol}}><div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:cardText}}>{k.kategori}</span><span className="mu" style={{fontSize:12,color:cardSub}}>{k.n}</span></div><div className="d-cat-bar" style={{background:progBg}}><i style={{width:k.n/tot*100+'%'}} /></div></div>))}
     </div>
    </div>

    <div className="d-together" style={{background:cardBg}}>
     <h3 style={{color:cardText}}>Bersama Kita Wujudkan Infrastruktur yang Lebih Baik!</h3>
     <p className="mu" style={{color:cardSub}}>Laporkan kerusakan infrastruktur publik secara mudah, cepat, dan transparan melalui INFRA-CARE.</p>
     <div className="d-together-grid">
      <div className="d-tog-item" style={{background:dark?'#1e293b':'#f5f9ff'}}><span className="ic">🏗️</span><div><b style={{color:cardText}}>Mudah Digunakan</b><span className="mu" style={{color:cardSub}}>Laporan dalam 2 menit</span></div></div>
      <div className="d-tog-item" style={{background:dark?'#1e293b':'#f5f9ff'}}><span className="ic">⚡</span><div><b style={{color:cardText}}>Cepat Ditangani</b><span className="mu" style={{color:cardSub}}>Respon petugas lapangan</span></div></div>
      <div className="d-tog-item" style={{background:dark?'#1e293b':'#f5f9ff'}}><span className="ic">🔍</span><div><b style={{color:cardText}}>Transparan</b><span className="mu" style={{color:cardSub}}>Pantau status real-time</span></div></div>
      <div className="d-tog-item" style={{background:dark?'#1e293b':'#f5f9ff'}}><span className="ic">👥</span><div><b style={{color:cardText}}>Untuk Semua</b><span className="mu" style={{color:cardSub}}>Infrastruktur lebih baik</span></div></div>
     </div>
    </div>
   </div>
  </div>
 </>}

function Buat(){
 const nav=useNavigate(),[f,setF]=useState({judul:'',kategori:'',deskripsi:'',lokasi:'',lat:-6.2088,lng:106.8456,urgensi:'Tinggi'}),[foto,setFoto]=useState(null),[fotoUrl,setFotoUrl]=useState(''),[e,setE]=useState(''),[busy,setBusy]=useState(false);
 const [mapCenter,setMapCenter]=useState([-7.0292,112.7461]);
 const [markerPos,setMarkerPos]=useState([-7.0292,112.7461]);
 const [searchResults,setSearchResults]=useState([]);
 const [searchQuery,setSearchQuery]=useState('');
 const set=k=>v=>setF({...f,[k]:v.target.value});
 useEffect(()=>()=>{if(fotoUrl)URL.revokeObjectURL(fotoUrl)},[fotoUrl]);
 const compressImage=(file,maxSide=1280,quality=0.75)=>new Promise((res,rej)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{const s=Math.min(1,maxSide/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);res(c.toDataURL('image/jpeg',quality))};img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('Gambar tidak dapat dibaca'))};img.src=url});
 const pickFoto=file=>{if(!file)return;if(file.size>5*1024*1024)return setE('Ukuran foto maksimal 5MB');setE('');setFoto(file);setFotoUrl(URL.createObjectURL(file))};
 const searchLocation=async()=>{if(!searchQuery.trim())return;try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(searchQuery)}+Indonesia`,{headers:{'User-Agent':'INFRA-CARE/1.0'}});const d=await r.json();setSearchResults(d.map(x=>({label:x.display_name,lat:parseFloat(x.lat),lng:parseFloat(x.lon)})));}catch{setSearchResults([])}};
 const selectLoc=loc=>{setSearchQuery(loc.label);setF({...f,lokasi:loc.label});setMapCenter([loc.lat,loc.lng]);setMarkerPos([loc.lat,loc.lng]);setF({...f,lat:loc.lat,lng:loc.lng});setSearchResults([])};
 const onMapClick=e=>{setMarkerPos([e.latlng.lat,e.latlng.lng]);setMapCenter([e.latlng.lat,e.latlng.lng]);setF({...f,lat:e.latlng.lat,lng:e.latlng.lng,lokasi:`Titik di peta (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`})};
 const submit=async()=>{setE('');if(!foto)return setE('Foto / bukti kerusakan wajib diunggah');if(foto.size>5*1024*1024)return setE('Ukuran foto maksimal 5MB');if(!f.lokasi)return setE('Lokasi wajib dipilih dari peta');setBusy(true);try{const foto64=await compressImage(foto);if(!foto64||foto64.length<100)return setE('Gagal memproses foto, coba upload ulang');const c=await api('/complaints',{method:'POST',body:{...f,foto:foto64}});window.dispatchEvent(new Event('notif:refresh'));nav('/app/sukses/'+c.kode)}catch(x){setE(x.message)}setBusy(false)};
 const filled=[f.judul,f.kategori,f.deskripsi,foto,f.lokasi].filter(Boolean).length;
 const pct=Math.round(filled/5*100);
 const rekap=[['Judul',f.judul],['Kategori',f.kategori],['Deskripsi',f.deskripsi],['Foto bukti',foto?foto.name:''],['Lokasi',f.lokasi]];
 return<div className="bp-page">
  <section className="bp-hero">
   <div className="bp-hero-main">
    <span className="bp-eyebrow">📢 Pengaduan Baru</span>
    <h2>Laporkan Kerusakan Infrastruktur</h2>
    <p>Isi data dengan lengkap dan jelas agar laporan Anda cepat diverifikasi dan ditindaklanjuti petugas.</p>
    <div className="bp-hero-meta"><span className="bp-chip">1 · Isi data</span><span className="bp-chip">2 · Tandai lokasi</span><span className="bp-chip">3 · Kirim laporan</span></div>
   </div>
   <div className="bp-hero-progress">
    <div className="bp-hero-progress-top"><span>Kelengkapan</span><b>{pct}%</b></div>
    <div className="bp-bar"><i style={{width:pct+'%'}}/></div>
    <small>{filled} dari 5 bagian terisi</small>
   </div>
  </section>
  <div className="bp-layout">
   <div className="bp-card">
    <Link className="bp-back" to="/app">← Kembali ke Dashboard</Link>
    <form className="bp-form" onSubmit={ev=>{ev.preventDefault();submit()}}>
     <fieldset className="bp-sec">
      <div className="bp-sec-head"><span className="bp-sec-num">1</span><div><h3>Informasi Pengaduan</h3><p>Judul dan kategori memudahkan petugas memilah laporan.</p></div></div>
      <div className="bp-grid2">
       <div className="bp-field"><label>Judul Pengaduan <em>*</em></label><input className="in" placeholder="Contoh: Jalan Berlubang di Jl. Melati" value={f.judul} onChange={set('judul')}/><span className="bp-hint">Tulis singkat dan spesifik, maksimal 100 karakter.</span></div>
       <div className="bp-field"><label>Kategori <em>*</em></label><select className="in" value={f.kategori} onChange={set('kategori')}><option value="">Pilih kategori</option>{KAT.map(k=><option key={k}>{k}</option>)}</select><span className="bp-hint">Pilih jenis infrastruktur yang rusak.</span></div>
      </div>
      <div className="bp-field">
       <label>Deskripsi Kerusakan <em>*</em></label>
       <textarea className="in bp-textarea" rows="5" maxLength="500" placeholder="Jelaskan kondisi kerusakan secara detail: ukuran, dampak, dan sejak kapan terjadi..." value={f.deskripsi} onChange={set('deskripsi')}/>
       <div className="bp-field-foot"><span className="bp-hint">Semakin detail deskripsi, semakin cepat laporan diproses.</span><span className="bp-count">{f.deskripsi.length}/500</span></div>
      </div>
     </fieldset>
     <fieldset className="bp-sec">
      <div className="bp-sec-head"><span className="bp-sec-num">2</span><div><h3>Foto Bukti</h3><p>Satu foto yang jelas membantu proses verifikasi.</p></div></div>
      <div className="bp-upload-row">
       <label className={'bp-drop'+(foto?' has-file':'')}>
        <input type="file" accept="image/png,image/jpeg" hidden onChange={x=>pickFoto(x.target.files[0])}/>
        {fotoUrl?<img src={fotoUrl} alt="Pratinjau foto bukti"/>:<span className="bp-drop-ic">☁</span>}
        <b>{foto?foto.name:'Klik untuk mengunggah foto'}</b>
        <small>{foto?((foto.size/1024/1024).toFixed(2)+' MB · klik untuk mengganti'):'JPG atau PNG, maksimal 5 MB'}</small>
       </label>
       <div className="bp-upload-tips">
        <b>Tips foto yang baik</b>
        <ul><li>Ambil dari jarak yang menunjukkan lokasi.</li><li>Pastikan pencahayaan cukup dan tidak buram.</li><li>Hindari foto terpotong atau terlalu close-up.</li></ul>
       </div>
      </div>
     </fieldset>
     <fieldset className="bp-sec">
      <div className="bp-sec-head"><span className="bp-sec-num">3</span><div><h3>Lokasi Kerusakan</h3><p>Cari alamat, atau klik/geser pin pada peta.</p></div></div>
      <div className="bp-search"><input className="in" placeholder="Cari desa, jalan, atau alamat..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();searchLocation()}}}/><button type="button" className="btn s" onClick={searchLocation}>Cari</button></div>
      {searchResults.length>0&&<div className="bp-results">{searchResults.map((r,i)=><div key={i} className="bp-result" onClick={()=>selectLoc(r)}><b>{r.label}</b><span>Lat {r.lat.toFixed(4)} · Lng {r.lng.toFixed(4)}</span></div>)}</div>}
      <div className="bp-map"><MapContainer center={mapCenter} zoom={15} style={{height:'100%',width:'100%'}}><MapClicker onClick={onMapClick}/><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors'/><Marker position={markerPos} icon={customIcon} draggable onDragEnd={e=>{const p=e.target.getLatLng();setMarkerPos([p.lat,p.lng]);setMapCenter([p.lat,p.lng]);setF({...f,lat:p.lat,lng:p.lng})}}><Popup>Titik lokasi pengaduan</Popup></Marker></MapContainer></div>
      <div className="bp-coord"><span>📍 {f.lokasi||'Belum ada lokasi dipilih'}</span><b>{markerPos[0].toFixed(6)}, {markerPos[1].toFixed(6)}</b></div>
     </fieldset>
     <fieldset className="bp-sec">
      <div className="bp-sec-head"><span className="bp-sec-num">4</span><div><h3>Tingkat Urgensi</h3><p>Pilih sesuai dampak kerusakan terhadap masyarakat.</p></div></div>
      <div className="bp-urg">{['Tinggi','Sedang','Rendah'].map(u=><button type="button" key={u} className={'bp-urg-card '+u.toLowerCase()+(f.urgensi===u?' on':'')} onClick={()=>setF({...f,urgensi:u})}><b>{u}</b><span>{u==='Tinggi'?'Butuh penanganan segera':u==='Sedang'?'Mengganggu aktivitas masyarakat':'Kerusakan ringan'}</span></button>)}</div>
     </fieldset>
     {e&&<div className="bp-alert">⚠ {e}</div>}
     <div className="bp-submit"><span>ℹ Pastikan data yang Anda isi sudah benar agar pengaduan dapat diproses dengan cepat.</span><button className="btn" type="submit" disabled={busy}>✈ {busy?'Mengirim...':'Kirim Pengaduan'}</button></div>
    </form>
   </div>
   <aside className="bp-side">
    <div className="bp-card bp-sidecard">
     <div className="bp-side-head"><h3>Ringkasan Laporan</h3><span className="bp-side-tag">{pct}%</span></div>
     <div className="bp-sum">{rekap.map(([k,v])=><div key={k} className="bp-sum-row"><span>{k}</span><b className={v?'ok':''}>{v?(v.length>26?v.slice(0,26)+'…':v):'Belum diisi'}</b></div>)}</div>
    </div>
    <div className="bp-card bp-sidecard">
     <div className="bp-side-head"><h3>Kategori yang Dapat Dilaporkan</h3></div>
     <div className="bp-cats">{KAT.map(k=><span key={k} className="bp-cat">{k}</span>)}</div>
    </div>
    <div className="bp-card bp-sidecard">
     <div className="bp-side-head"><h3>Tips Pengaduan</h3></div>
     <ul className="bp-tips">
      {['Gunakan judul yang jelas dan spesifik.','Lengkapi deskripsi dengan detail kondisi kerusakan.','Lampirkan foto yang menunjukkan lokasi kerusakan.','Pastikan titik lokasi sesuai kejadian.','Pilih tingkat urgensi yang sesuai.'].map((t,i)=><li key={t}><span>{i+1}</span><p>{t}</p></li>)}
     </ul>
    </div>
   </aside>
  </div>
 </div>}

function Sukses(){
 const{kode}=useParams(),[c,setC]=useState(null);useEffect(()=>{api('/complaints/'+kode).then(setC)},[kode]);if(!c)return<p>Memuat...</p>;
 const R=[['Judul',c.judul],['Kategori',c.kategori],['Lokasi',c.lokasi],['Deskripsi',c.deskripsi],['Tanggal',tgl(c.created_at)]];
 return<div className="grid2"><div className="card" style={{textAlign:'center'}}><div className="ok-ic">✓</div><h1>Pengaduan Berhasil Dikirim!</h1><p className="mu">Terima kasih telah melaporkan kerusakan infrastruktur.<br/>Laporan Anda telah kami terima dan sedang diproses.</p>
  <div className="kode"><small className="mu" style={{display:'block',fontSize:13}}>Nomor Pengaduan Anda</small>{c.kode} <span style={{cursor:'pointer'}} onClick={()=>navigator.clipboard?.writeText(c.kode)}>📋</span></div>
  <div className="row2"><div className="card">Tanggal Pengaduan<br/><b>{tgl(c.created_at)}</b></div><div className="card">Prioritas<br/><b>{c.urgensi}</b></div></div>
  <p><Link className="btn" to="/app">🏠 Kembali ke Dashboard</Link></p><Link to={'/app/tracking/'+c.kode} style={{color:'var(--b)'}}>Lihat Detail Pengaduan ›</Link></div>
  <div className="card"><h3>Ringkasan Pengaduan</h3>{R.map(([k,v])=><p key={k}><span className="mu">{k}</span><br/>{v}</p>)}{c.foto&&<img src={c.foto} style={{borderRadius:10,maxWidth:'100%',height:'auto',objectFit:'contain',maxHeight:'450px',display:'block'}}/>}<p><St s={c.urgensi}/></p></div></div>}

function Tracking(){
 const{kode}=useParams(),nav=useNavigate(),[c,setC]=useState(null),[list,setList]=useState([]),[dark,setDark]=useState(()=>document.documentElement.classList.contains('dark'));
 useEffect(()=>{const ck=()=>setDark(document.documentElement.classList.contains('dark'));ck();const ob=new MutationObserver(ck);ob.observe(document.documentElement,{attributes:true,attributeFilter:['class']});return()=>ob.disconnect();},[]);
 useEffect(()=>{if(kode)api('/complaints/'+kode).then(setC);else api('/complaints').then(l=>{setList(l);if(l[0])nav('/app/tracking/'+l[0].kode,{replace:true})})},[kode]);
 if(!kode)return<div className="card tr-empty"><div className="tr-empty-ic">📍</div><h2>Tracking Pengaduan</h2><p className="mu">{list.length?'Memuat...':'Anda belum memiliki pengaduan untuk dilacak.'}</p><Link className="btn s" to="/app/buat">➕ Buat Pengaduan</Link></div>;
 if(!c)return<p>Memuat...</p>;
 const flow=['Diterima','Diverifikasi','Diprioritaskan','Ditugaskan','Dalam Perbaikan','Selesai'],rejected=c.status==='Ditolak',idx=flow.indexOf(c.status);
 const when=s=>{const l=(c.logs||[]).find(x=>x.status===s);return l?tgl(l.created_at):'-'};
 const progress=rejected?0:Math.round(((idx+1)/flow.length)*100);
 const rejectNote=(c.logs||[]).find(x=>x.status==='Ditolak')?.catatan;
 return<div className="grid2 tr-page">
  <div className="stk">
   <header className="tr-hero">
    <Link to="/app/riwayat" className="tr-back">← Kembali ke Riwayat</Link>
    <span className="tr-eyebrow">📍 Tracking Pengaduan</span>
    <h2>Pantau Progres Pengaduan Anda</h2>
    <p>Ikuti setiap tahap penanganan laporan secara transparan dan real-time.</p>
    <div className="tr-hero-meta">
     <span className="tr-meta-item">Kode <b>{c.kode}</b></span>
     <span className="tr-meta-item">Dibuat <b>{tgl(c.created_at)}</b></span>
     <span className={'tr-status '+slug(c.status)}><i/>{c.status}</span>
    </div>
   </header>

   <section className="card tr-card tr-summary">
    {c.foto?<img src={c.foto} alt={c.judul} className="tr-photo"/>:<div className="tr-photo tr-photo-ph">🏗️</div>}
    <div className="tr-summary-body">
     <span className="tr-kode">{c.kode}</span>
     <h3 className="tr-title">{c.judul}</h3>
     <div className="tr-meta"><span>🏷️ {c.kategori}</span><span>📍 {c.lokasi}</span><span>🗓️ {tgl(c.created_at)}</span></div>
     <div className="tr-badges"><St s={c.urgensi} dark={dark}/></div>
    </div>
   </section>

   <section className="card tr-card tr-progress-card">
    <div className="tr-progress-head">
     <div><h3>Progres Penanganan</h3><p>Tahapan yang sudah dan sedang berlangsung</p></div>
     <span className="tr-progress-pct">{progress}%</span>
    </div>
    <div className="tr-progress-bar"><i style={{width:progress+'%'}}/></div>
    <ol className="tr-steps">
     {flow.map((s,i)=>{const done=!rejected&&i<idx,active=!rejected&&i===idx,date=when(s);return<li key={s} className={'tr-step'+(done?' done':'')+(active?' active':'')}><span className="tr-step-dot">{done?'✓':i+1}</span><span className="tr-step-text"><b>{s}</b>{date!=='-'&&<small>{date}</small>}</span></li>})}
    </ol>
   </section>

   {rejected&&<div className="tr-alert"><span className="tr-alert-ic">⚠️</span><div><b>Pengaduan ditolak</b><p>{rejectNote||'Pengaduan ini ditolak. Silakan hubungi petugas atau buat pengaduan baru dengan informasi yang lebih lengkap.'}</p></div></div>}

   <section className="card tr-card">
    <div className="tr-card-head"><div><h3>Lokasi Pengaduan</h3><p>Titik lokasi yang Anda laporkan</p></div><span className="tr-card-ic">🗺️</span></div>
    <p className="tr-loc">📍 {c.lokasi}</p>
    <p className="tr-coord">Koordinat: {c.lat&&c.lng?`${c.lat}, ${c.lng}`:'Belum tersedia'}</p>
    {c.lat&&c.lng&&<a className="tr-action" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${c.lat},${c.lng}`}>Buka di Google Maps <span>↗</span></a>}
   </section>
  </div>

  <div className="stk">
   <section className="card tr-side">
    <div className="tr-card-head"><div><h3>Detail Pengaduan</h3><p>Informasi laporan Anda</p></div></div>
    <div className="tr-detail">
     {[['ID Pengaduan',c.kode],['Kategori',c.kategori],['Tanggal',tgl(c.created_at)],['Lokasi',c.lokasi]].map(([k,v])=><div className="tr-detail-row" key={k}><span>{k}</span><b>{v}</b></div>)}
     <div className="tr-detail-row"><span>Urgensi</span><St s={c.urgensi} dark={dark}/></div>
    </div>
    <div className="tr-desc"><span>Deskripsi</span><p>{c.deskripsi}</p></div>
   </section>

   <section className="card tr-side">
    <h3>Petugas yang Menangani</h3>
    <div className="tr-officer"><div className="tr-officer-av">👷</div><div>{c.petugas_nama?<><b>{c.petugas_nama}</b><span>Petugas Lapangan</span></>:<><b>Belum ditugaskan</b><span>Menunggu penugasan dari admin</span></>}</div></div>
   </section>

   <section className="card tr-side">
    <h3>Bantuan</h3>
    <p className="tr-help">Status diperbarui oleh petugas setiap kali ada tindak lanjut. Simpan kode pengaduan Anda untuk memudahkan pengecekan.</p>
   </section>
  </div>
 </div>}

function Riwayat(){
 const loc=useLocation();
 const[rows,setRows]=useState([]),[tab,setTab]=useState(loc.state?.focusTab||'Semua'),[sort,setSort]=useState('desc'),[highlight,setHighlight]=useState(false),[dark,setDark]=useState(()=>document.documentElement.classList.contains('dark'));
 useEffect(()=>{const ck=()=>setDark(document.documentElement.classList.contains('dark'));ck();const ob=new MutationObserver(ck);ob.observe(document.documentElement,{attributes:true,attributeFilter:['class']});return()=>ob.disconnect();},[]);
 useEffect(()=>{api('/complaints').then(setRows).catch(()=>setRows([]))},[]);
 useEffect(()=>{
   if(loc.state?.focusTab){
     setTab(loc.state.focusTab);
     setHighlight(true);
     const t=setTimeout(()=>setHighlight(false),10000);
     return()=>clearTimeout(t);
   }
 },[loc.state]);
 const G={Semua:()=>true,Diproses:r=>['Diterima','Diverifikasi','Diprioritaskan','Ditugaskan'].includes(r.status),Ditanggapi:r=>r.status==='Dalam Perbaikan',Selesai:r=>r.status==='Selesai',Ditolak:r=>r.status==='Ditolak'};
 const v=rows.filter(G[tab]).sort((a,b)=>(new Date(a.created_at)-new Date(b.created_at))*(sort==='asc'?1:-1));
 const getHighlight=(r)=>{
   if(!highlight) return false;
   if(tab==='Selesai') return r.status==='Selesai';
   if(tab==='Ditanggapi') return r.status==='Dalam Perbaikan';
   if(tab==='Diproses') return ['Diterima','Diverifikasi','Diprioritaskan','Ditugaskan'].includes(r.status);
   if(tab==='Ditolak') return r.status==='Ditolak';
   return false;
 };
 const tabIcons={Semua:'📋',Diproses:'⏳',Ditanggapi:'🔧',Selesai:'✅',Ditolak:'❌'};
 const meta={
  Diproses:{ic:'⏳',col:'#3b82f6',bg:'#e8f1ff'},
  Ditanggapi:{ic:'🔧',col:'#f59e0b',bg:'#fff4e2'},
  Selesai:{ic:'✅',col:'#22c55e',bg:'#e6f8ee'},
  Ditolak:{ic:'❌',col:'#ef4444',bg:'#fdeaea'}
 };
 const total=rows.length,done=rows.filter(G.Selesai).length,active=rows.filter(G.Diproses).length+rows.filter(G.Ditanggapi).length;
 const pctDone=total?Math.round(done/total*100):0;
 return<div className="grid2 rw-page">
  <div className="stk">
   <header className="rw-hero">
    <span className="rw-eyebrow">🕘 Riwayat Pengaduan</span>
    <h2>Riwayat Pengaduan Anda</h2>
    <p>Pantau seluruh pengaduan yang pernah Anda buat beserta status penanganan terbarunya.</p>
    <div className="rw-hero-stats">
     <div className="rw-hero-stat"><span>Total</span><b>{total}</b></div>
     <div className="rw-hero-stat"><span>Selesai</span><b>{done}</b></div>
     <div className="rw-hero-stat"><span>Dalam Proses</span><b>{active}</b></div>
     <div className="rw-hero-stat"><span>Penyelesaian</span><b>{pctDone}%</b></div>
    </div>
   </header>
   <section className="card rw-toolbar">
    <div className="rw-tabs">
     {Object.keys(G).map(t=><button key={t} className={'rw-tab'+(tab===t?' on':'')} onClick={()=>setTab(t)}><span className="rw-tab-ic">{tabIcons[t]}</span><span>{t}</span><span className="rw-tab-count">{rows.filter(G[t]).length}</span></button>)}
    </div>
    <div className="rw-sort">
     <label htmlFor="rw-sort">Urutkan</label>
     <select id="rw-sort" className="in" value={sort} onChange={e=>setSort(e.target.value)}><option value="desc">Terbaru</option><option value="asc">Terlama</option></select>
    </div>
   </section>
   <section className="card rw-panel">
    <div className="rw-panel-head">
     <div><h3>Daftar Pengaduan</h3><p>Menampilkan {v.length} pengaduan</p></div>
     <span className="rw-filter-badge">{tabIcons[tab]} {tab}</span>
    </div>
    <div className="rw-panel-body"><Table rows={v} highlightFn={getHighlight} variant="rw"/></div>
   </section>
  </div>
  <div className="stk">
   <section className="card rw-side">
    <div className="rw-side-head"><div><h3>Ringkasan Status</h3><p>Distribusi pengaduan Anda</p></div><span className="rw-side-total">{total} total</span></div>
    <div className="rw-stats">
     {Object.keys(G).filter(k=>k!=='Semua').map(t=>{const c=rows.filter(G[t]).length;const pct=total?Math.round(c/total*100):0;const m=meta[t];return<div key={t} className="rw-stat">
      <div className="rw-stat-top"><span className="rw-stat-label"><span className="rw-stat-ic" style={{background:dark?m.col+'26':m.bg,color:m.col}}>{m.ic}</span>{t}</span><span className="rw-stat-val">{c}<small>{pct}%</small></span></div>
      <div className="rw-bar"><i style={{width:pct+'%',background:m.col}}/></div>
     </div>})}
    </div>
   </section>
   <section className="card rw-side rw-info">
    <h3>Informasi</h3>
    <div className="rw-info-tip"><span>💡</span><p>Klik salah satu status di atas untuk memfilter daftar pengaduan. Gunakan menu urutkan untuk mengubah pengurutan berdasarkan tanggal.</p></div>
   </section>
  </div>
 </div>}
function Notif(){
 const[rows,setRows]=useState([]),[tab,setTab]=useState('Semua');
 const load=()=>api('/notifications').then(setRows);
 useEffect(()=>{load()},[]);
 const T=['Semua','Sistem','Pengaduan','Update'],v=rows.filter(r=>tab==='Semua'||r.tipe===tab),un=rows.filter(r=>!r.dibaca).length;
 const counts={};T.forEach(t=>counts[t]=t==='Semua'?rows.length:rows.filter(r=>r.tipe===t).length);
 const pctRead=rows.length?Math.round((rows.length-un)/rows.length*100):0;
 const icon=(t,dib)=>{if(t==='Pengaduan')return dib?'📋':'📢';if(t==='Update')return dib?'🔄':'⚡';if(t==='Sistem')return dib?'ℹ️':'🛎️';return '🔔'};
 const markAll=()=>{if(!un)return;api('/notifications/read-all',{method:'POST'}).then(()=>{load();window.dispatchEvent(new Event('notif:refresh'));})};
 return<div className="nt-page">
  <section className="nt-hero">
   <div className="nt-hero-main">
    <span className="nt-eyebrow">🔔 Pusat Notifikasi</span>
    <h2>Notifikasi Anda</h2>
    <p>Semua informasi terbaru seputar pengaduan dan pembaruan sistem INFRA-CARE ada di sini.</p>
    <div className="nt-hero-meta">
     <span className="nt-chip">📥 {rows.length} total notifikasi</span>
     <span className="nt-chip">● {un} belum dibaca</span>
     <span className="nt-chip">✓ {rows.length-un} sudah dibaca</span>
    </div>
   </div>
   <div className="nt-hero-progress">
    <div className="nt-hero-progress-top"><span>Sudah dibaca</span><b>{pctRead}%</b></div>
    <div className="nt-bar"><i style={{width:pctRead+'%'}}/></div>
    <small>{rows.length-un} dari {rows.length} notifikasi</small>
   </div>
  </section>

  <div className="nt-toolbar">
   <div className="nt-tabs">{T.map(t=><button key={t} className={'nt-tab'+(tab===t?' on':'')} onClick={()=>setTab(t)}>{t}<span>{counts[t]}</span></button>)}</div>
   <button className="btn s nt-readall" disabled={!un} onClick={markAll}>✔ Tandai Semua Dibaca</button>
  </div>

  <div className="nt-layout">
   <div className="nt-card">
    <div className="nt-card-head">
     <div><h3>{tab==='Semua'?'Semua Notifikasi':`Notifikasi ${tab}`}</h3><p>{tab==='Semua'?'Informasi terbaru dari sistem dan pengaduan Anda.':`Menampilkan notifikasi bertipe ${tab.toLowerCase()}.`}</p></div>
     <span className="nt-card-count">{v.length} item</span>
    </div>
    <div className="nt-list">
     {v.map(r=><article key={r.id} className={'nt-item'+(r.dibaca?'':' unread')}>
      <div className={'nt-ic '+slug(r.tipe)}>{icon(r.tipe,r.dibaca)}</div>
      <div className="nt-body">
       <div className="nt-body-top"><b>{r.judul}</b>{!r.dibaca&&<span className="nt-dot" title="Belum dibaca"/>}</div>
       <p>{r.isi}</p>
       <div className="nt-meta">
        <span>🕘 {tgl(r.created_at)}</span>
        <span className={'nt-type '+slug(r.tipe)}>{r.tipe}</span>
        <span className={'nt-status '+(r.dibaca?'read':'new')}><i/>{r.dibaca?'Sudah dibaca':'Belum dibaca'}</span>
       </div>
      </div>
     </article>)}
     {!v.length&&<div className="nt-empty"><span>🔕</span><b>Belum ada notifikasi</b><p>Tidak ada notifikasi untuk kategori ini saat ini.</p></div>}
    </div>
    {v.length>0&&<div className="nt-foot"><span>Menampilkan {v.length} dari {rows.length} notifikasi</span><span>Diperbarui otomatis saat ada aktivitas baru</span></div>}
   </div>

   <aside className="nt-side">
    <div className="nt-sidecard">
     <div className="nt-side-head"><h3>Ringkasan Notifikasi</h3><span className="nt-side-tag">{un} baru</span></div>
     <div className="nt-unread-box"><span>Belum Dibaca</span><b>{un}</b><small>dari {rows.length} notifikasi</small></div>
     <div className="nt-break">{T.slice(1).map(t=><div key={t} className="nt-break-row"><div className="nt-break-top"><span>{t}</span><b>{counts[t]}</b></div><div className="nt-break-bar"><i className={slug(t)} style={{width:(rows.length?counts[t]/rows.length*100:0)+'%'}}/></div></div>)}</div>
    </div>
    <div className="nt-sidecard">
     <div className="nt-side-head"><h3>Jenis Notifikasi</h3></div>
     <ul className="nt-legend">
      <li><span className="nt-ic pengaduan">📋</span><div><b>Pengaduan</b><p>Konfirmasi bahwa laporan Anda diterima sistem.</p></div></li>
      <li><span className="nt-ic update">⚡</span><div><b>Update</b><p>Perubahan status penanganan pengaduan Anda.</p></div></li>
      <li><span className="nt-ic sistem">🛎️</span><div><b>Sistem</b><p>Informasi dan pengumuman dari INFRA-CARE.</p></div></li>
     </ul>
    </div>
    <div className="nt-sidecard nt-tip">
     <div className="nt-side-head"><h3>Tips</h3></div>
     <p>Tekan <b>Tandai Semua Dibaca</b> setelah meninjau notifikasi agar badge di sidebar kembali bersih.</p>
    </div>
   </aside>
  </div>
 </div>}

function Kelola(){
 const u=getUser(),isAdmin=u.role==='admin';
 const [rows,setRows]=useState([]),[petugas,setPetugas]=useState([]),[f,setF]=useState({q:'',kategori:'',status:'',urgensi:'',petugas_id:''});
 const [msg,setMsg]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(null);
 const load=()=>api('/complaints').then(d=>{setRows(d);setErr('')}).catch(e=>setErr(e.message));
 useEffect(()=>{load()},[]);
 useEffect(()=>{if(isAdmin)api('/users?role=petugas').then(setPetugas).catch(()=>{})},[isAdmin]);
 const change=async(r,status)=>{setBusy(r.id);setErr('');setMsg('');try{const d=await api(`/complaints/${r.id}/status`,{method:'PATCH',body:{status,catatan:`Status diubah oleh ${u.nama}`}});setRows(x=>x.map(y=>y.id===d.id?{...y,...d,petugas_nama:d.petugas_id?(y.petugas_nama||(String(d.petugas_id)===String(u.id)?u.nama:null)):null}:y));setMsg(`Status ${r.kode} diperbarui menjadi ${status}.`)}catch(x){setErr(x.message)}setBusy(null)};
 const assign=async(r,pid)=>{setBusy(r.id);setErr('');setMsg('');try{const d=await api(`/complaints/${r.id}/assign`,{method:'PATCH',body:{petugas_id:pid?Number(pid):null}});const p=petugas.find(x=>String(x.id)===String(pid));setRows(x=>x.map(y=>y.id===d.id?{...y,...d,petugas_nama:pid?(p?p.nama:y.petugas_nama):null}:y));setMsg(pid?`${r.kode} ditugaskan kepada ${p?p.nama:'petugas'}.`:`Penugasan ${r.kode} dilepas.`)}catch(x){setErr(x.message)}setBusy(null)};
 const del=async r=>{if(!window.confirm(`Hapus pengaduan ${r.kode}? Seluruh riwayat statusnya akan hilang permanen.`))return;setBusy(r.id);setErr('');setMsg('');try{await api(`/complaints/${r.id}`,{method:'DELETE'});setRows(x=>x.filter(y=>y.id!==r.id));setMsg(`Pengaduan ${r.kode} dihapus.`)}catch(x){setErr(x.message)}setBusy(null)};
 const mine=r=>!r.petugas_id||String(r.petugas_id)===String(u.id);
 const q=f.q.trim().toLowerCase();
 const v=rows.filter(r=>(!f.kategori||r.kategori===f.kategori)&&(!f.status||r.status===f.status)&&(!f.urgensi||r.urgensi===f.urgensi)&&(!f.petugas_id||(f.petugas_id==='none'?!r.petugas_id:String(r.petugas_id)===f.petugas_id))&&(!q||[r.judul,r.kode,r.kategori,r.pelapor,r.lokasi].filter(Boolean).join(' ').toLowerCase().includes(q)));
 const count=(...s)=>rows.filter(r=>s.includes(r.status)).length;
 const total=rows.length,selesai=count('Selesai'),belum=count('Diterima','Diverifikasi','Diprioritaskan'),ditugaskan=count('Ditugaskan'),perbaikan=count('Dalam Perbaikan'),tanpa=rows.filter(r=>!r.petugas_id).length;
 const reset=()=>setF({q:'',kategori:'',status:'',urgensi:'',petugas_id:''});
 return<div className="ad-page">
  <header className="rw-hero">
   <span className="rw-eyebrow">📋 {isAdmin?'Kelola Pengaduan':'Tugas Pengaduan'}</span>
   <h2>{isAdmin?'Kelola Seluruh Pengaduan Masyarakat':'Pantau & Tangani Pengaduan'}</h2>
   <p>{isAdmin?'Verifikasi laporan, tugaskan petugas lapangan, perbarui status, dan pastikan setiap pengaduan tertangani.':'Kerjakan pengaduan yang ditugaskan kepada Anda atau ambil pengaduan yang belum ditugaskan, lalu perbarui status penanganannya.'}</p>
   <div className="rw-hero-stats">
    <div className="rw-hero-stat"><span>Total</span><b>{total}</b></div>
    <div className="rw-hero-stat"><span>Belum Ditangani</span><b>{belum}</b></div>
    <div className="rw-hero-stat"><span>Ditugaskan</span><b>{ditugaskan}</b></div>
    <div className="rw-hero-stat"><span>Dalam Perbaikan</span><b>{perbaikan}</b></div>
    <div className="rw-hero-stat"><span>Selesai</span><b>{selesai}</b></div>
    {isAdmin&&<div className="rw-hero-stat"><span>Tanpa Petugas</span><b>{tanpa}</b></div>}
   </div>
  </header>

  <section className="card ad-toolbar">
   <div className="ad-field ad-grow"><label>Cari Pengaduan</label><input className="in" placeholder="Judul, kode, kategori, pelapor, atau lokasi..." value={f.q} onChange={e=>setF({...f,q:e.target.value})}/></div>
   <div className="ad-field"><label>Kategori</label><select className="in" value={f.kategori} onChange={e=>setF({...f,kategori:e.target.value})}><option value="">Semua Kategori</option>{KAT.map(k=><option key={k}>{k}</option>)}</select></div>
   <div className="ad-field"><label>Status</label><select className="in" value={f.status} onChange={e=>setF({...f,status:e.target.value})}><option value="">Semua Status</option>{STATUS.map(k=><option key={k}>{k}</option>)}</select></div>
   <div className="ad-field"><label>Urgensi</label><select className="in" value={f.urgensi} onChange={e=>setF({...f,urgensi:e.target.value})}><option value="">Semua Urgensi</option>{['Tinggi','Sedang','Rendah'].map(k=><option key={k}>{k}</option>)}</select></div>
   {isAdmin&&<div className="ad-field"><label>Petugas</label><select className="in" value={f.petugas_id} onChange={e=>setF({...f,petugas_id:e.target.value})}><option value="">Semua Petugas</option><option value="none">Belum Ditugaskan</option>{petugas.filter(p=>p.aktif!==false).map(p=><option key={p.id} value={p.id}>{p.nama}</option>)}</select></div>}
   <div className="ad-actions"><button type="button" className="btn s" onClick={reset}>Reset Filter</button></div>
  </section>

  {msg&&<div className="ad-alert ok"><span>✓</span>{msg}<button type="button" onClick={()=>setMsg('')}>✕</button></div>}
  {err&&<div className="ad-alert bad"><span>⚠</span>{err}<button type="button" onClick={()=>setErr('')}>✕</button></div>}

  <section className="card rw-panel">
   <div className="rw-panel-head">
    <div><h3>Daftar Pengaduan</h3><p>Menampilkan {v.length} dari {rows.length} pengaduan</p></div>
    <span className="rw-filter-badge">{isAdmin?'Mode Admin':'Mode Petugas'}</span>
   </div>
   <div className="rw-panel-body">
    <table className="rw-table kl-table">
     <thead><tr><th>No.</th><th>Pengaduan</th><th>Kategori</th><th>Prioritas</th><th>Lokasi</th><th>Pelapor</th><th>Tanggal</th><th>Petugas</th><th>Status</th><th style={{textAlign:'right'}}>Aksi</th></tr></thead>
     <tbody>
      {v.map((r,i)=><tr key={r.id}>
       <td className="rw-cell-no">{String(i+1).padStart(2,'0')}</td>
       <td data-label="Pengaduan"><b className="rw-title">{r.judul}</b><span className="rw-code">{r.kode}</span></td>
       <td data-label="Kategori"><span className="rw-chip">{r.kategori}</span></td>
       <td data-label="Prioritas"><span className={'kl-urg '+slug(r.urgensi)}>{r.urgensi}</span></td>
       <td data-label="Lokasi"><span className="rw-loc" title={r.lokasi}>{r.lokasi}</span></td>
       <td data-label="Pelapor" className="rw-cell-sub">{r.pelapor}</td>
       <td data-label="Tanggal" className="rw-cell-date">{tgl(r.created_at)}</td>
       <td data-label="Petugas">{isAdmin?<select className="in kl-select" value={r.petugas_id||''} disabled={busy===r.id} onChange={e=>assign(r,e.target.value)}><option value="">Belum ditugaskan</option>{r.petugas_id&&!petugas.some(p=>p.id===r.petugas_id)&&<option value={r.petugas_id}>{r.petugas_nama||'Petugas #'+r.petugas_id}</option>}{petugas.filter(p=>p.aktif!==false||p.id===r.petugas_id).map(p=><option key={p.id} value={p.id}>{p.nama}</option>)}</select>:<span className="rw-cell-sub">{r.petugas_nama||'Belum ditugaskan'}</span>}</td>
       <td data-label="Status"><select className="in kl-select" value={r.status} disabled={busy===r.id||(!isAdmin&&!mine(r))} title={!isAdmin&&!mine(r)?'Pengaduan ini ditangani petugas lain':''} onChange={e=>change(r,e.target.value)}>{STATUS.map(s=><option key={s}>{s}</option>)}</select></td>
       <td data-label="Aksi" style={{textAlign:'right',whiteSpace:'nowrap'}}><Link className="rw-action" to={'/app/tracking/'+r.kode}>👁 Detail</Link>{isAdmin&&<button type="button" className="kl-del" title="Hapus pengaduan" onClick={()=>del(r)} disabled={busy===r.id}>🗑</button>}</td>
      </tr>)}
      {!v.length&&<tr><td colSpan="10"><div className="rw-empty"><div className="rw-empty-ic">📭</div><p>Tidak ada pengaduan yang cocok dengan filter ini.</p></div></td></tr>}
     </tbody>
    </table>
   </div>
  </section>
  <div className="ad-note"><span>ℹ</span><p>{isAdmin?'Perubahan status dan penugasan otomatis mengirim notifikasi kepada pelapor dan petugas. Penghapusan pengaduan hanya dapat dilakukan admin.':'Pengaduan tanpa petugas akan otomatis menjadi milik Anda saat statusnya Anda ubah.'}</p></div>
 </div>}
const Soon=()=><div className="card" style={{textAlign:'center',padding:60}}><h2>🚧 Halaman ini sedang disiapkan</h2><p className="mu">Fitur ini akan tersedia pada pembaruan berikutnya.</p></div>;
const pwScore=pw=>{if(!pw)return 0;let s=0;if(pw.length>=6)s++;if(pw.length>=10)s++;if(/[a-z]/.test(pw)&&/[A-Z]/.test(pw))s++;if(/[0-9]/.test(pw)&&/[^A-Za-z0-9]/.test(pw))s++;return Math.min(4,s)};
const pwLabel=['','Lemah','Cukup kuat','Kuat','Sangat kuat'];
const Profil=()=>{
 const nav=useNavigate();
 const [u,setU]=useState(getUser()||{});
 const [dark,setDark]=useState(()=>document.documentElement.classList.contains('dark'));
 const [tab,setTab]=useState('profil');
 const [f,setF]=useState({nama:u.nama||'',email:u.email||'',foto:u.foto||''});
 const [p,setP]=useState({oldPassword:'',newPassword:'',confirm:''});
 const [show,setShow]=useState({old:false,new:false,confirm:false});
 const [msg,setMsg]=useState('');const [err,setErr]=useState('');const [busy,setBusy]=useState(false);
 const [preview,setPreview]=useState(null);
 useEffect(()=>{const ck=()=>setDark(document.documentElement.classList.contains('dark'));ck();const ob=new MutationObserver(ck);ob.observe(document.documentElement,{attributes:true,attributeFilter:['class']});return()=>ob.disconnect();},[]);
 useEffect(()=>{api('/auth/me').then(d=>{setU(d);setF({nama:d.nama||'',email:d.email||'',foto:d.foto||''});localStorage.setItem('user',JSON.stringify(d));}).catch(()=>{})},[]);
 const compressImage=(file,maxSide=512,quality=0.8)=>new Promise((res,rej)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{const s=Math.min(1,maxSide/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);res(c.toDataURL('image/jpeg',quality))};img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('Gagal membaca foto'))};img.src=url});
 const uploadFoto=async(e)=>{const file=e.target.files?.[0];if(!file)return;try{const data=await compressImage(file);setF({...f,foto:data});setMsg('Foto dipilih. Klik Simpan Perubahan untuk menyimpan.');setErr('');}catch(x){setErr(x.message);}};
 const resetProfil=()=>{setF({nama:u.nama||'',email:u.email||'',foto:u.foto||''});setMsg('');setErr('')};
 const saveProfil=async(e)=>{e.preventDefault();setBusy(true);setMsg('');setErr('');try{const d=await api('/auth/me',{method:'PUT',body:f});const nu={...u,...d};setU(nu);setF({nama:nu.nama||'',email:nu.email||'',foto:nu.foto||''});localStorage.setItem('user',JSON.stringify(nu));window.dispatchEvent(new Event('user:refresh'));setMsg('Profil berhasil diperbarui.');}catch(x){setErr(x.message);}setBusy(false);};
 const savePass=async(e)=>{e.preventDefault();setMsg('');setErr('');
   if(!p.oldPassword)return setErr('Password saat ini wajib diisi');
   if(!p.newPassword)return setErr('Password baru wajib diisi');
   if((p.newPassword||'').length<6)return setErr('Password baru minimal 6 karakter');
   if(!p.confirm)return setErr('Konfirmasi password baru wajib diisi');
   if(p.newPassword!==p.confirm)return setErr('Konfirmasi password baru tidak cocok');
   setBusy(true);try{await api('/auth/password',{method:'PUT',body:{oldPassword:p.oldPassword,newPassword:p.newPassword}});setP({oldPassword:'',newPassword:'',confirm:''});setMsg('Password berhasil diubah.');}catch(x){setErr(x.message);}setBusy(false);};
 const initials=(u.nama||'U').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();
 const fotoSrc=f.foto||u.foto;
 const dirty=f.nama!==(u.nama||'')||f.email!==(u.email||'')||f.foto!==(u.foto||'');
 const score=pwScore(p.newPassword);
 const matchOk=p.confirm&&p.newPassword===p.confirm;
 const passReady=!!(p.oldPassword&&p.newPassword.length>=6&&matchOk);
 const filled=[u.nama,u.email,u.foto].filter(Boolean).length;
 const complete=Math.round(filled/3*100);
 const switchTab=t=>{setTab(t);setMsg('');setErr('')};
 return<div className="pf-page">
  <section className="pf-hero">
   <span className="pf-eyebrow">👤 Akun Saya</span>
   <h2>Profil & Keamanan Akun</h2>
   <p>Kelola identitas, foto profil, dan kredensial akun Anda agar data tetap akurat serta aman digunakan.</p>
   <div className="pf-hero-meta">
    <span className="pf-meta-chip">✉️ {u.email||'Email belum diisi'}</span>
    <span className="pf-meta-chip">🎫 {ROLE[u.role]||'Pengguna'}</span>
    <span className="pf-meta-chip ok"><i/>Akun Aktif</span>
   </div>
  </section>
  <div className="pf-layout">
   <div className="pf-col">
    <div className="pf-card">
     <div className="pf-cover">
      <div className="pf-avatar-wrap">
       {fotoSrc?<img src={fotoSrc} alt="Foto profil" onClick={()=>setPreview(fotoSrc)} style={{cursor:'zoom-in'}}/>:<div className="pf-avatar">{initials}</div>}
       <label className="pf-cam" title="Ubah foto profil">📷<input type="file" accept="image/png,image/jpeg" hidden onChange={uploadFoto}/></label>
      </div>
      <div className="pf-ident">
       <h3>{u.nama||'Pengguna'}</h3>
       <p>{ROLE[u.role]||'Pengguna'} • ID #{u.id||'-'}</p>
       <div className="pf-badges"><span className="pf-badge role">{ROLE[u.role]||'Pengguna'}</span><span className="pf-badge ok">● Akun Aktif</span></div>
      </div>
     </div>
     <div className="pf-tabs" role="tablist">
      <button type="button" className={tab==='profil'?'on':''} onClick={()=>switchTab('profil')}>👤 Informasi Profil</button>
      <button type="button" className={tab==='keamanan'?'on':''} onClick={()=>switchTab('keamanan')}>🔒 Keamanan</button>
     </div>
     {tab==='profil'&&<form className="pf-form" onSubmit={saveProfil}>
      <div className="pf-form-head"><h4>Informasi Pribadi</h4><p>Data ini tampil pada laporan pengaduan dan notifikasi akun Anda.</p></div>
      <div className="pf-grid2">
       <div className="pf-field"><label>Nama Lengkap</label><input className="in" value={f.nama} onChange={e=>setF({...f,nama:e.target.value})} placeholder="Masukkan nama lengkap"/><span className="pf-hint">Gunakan nama asli agar petugas mudah menghubungi Anda.</span></div>
       <div className="pf-field"><label>Alamat Email</label><input className="in" type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} placeholder="Masukkan email"/><span className="pf-hint">Email dipakai untuk login dan menerima notifikasi.</span></div>
      </div>
      <div className="pf-field"><label>Foto Profil <span className="pf-opt">opsional</span></label>
       <div className="pf-foto-row">
        <div className="pf-foto-thumb">{fotoSrc?<img src={fotoSrc} alt="Pratinjau foto"/>:<span>👤</span>}</div>
        <div className="pf-foto-input"><input className="in" value={f.foto} onChange={e=>setF({...f,foto:e.target.value})} placeholder="Tempel URL gambar profil"/><span className="pf-hint">Tempel tautan gambar, atau unggah dari perangkat (JPG/PNG, otomatis dikompres).</span></div>
        <label className="btn s pf-upload">📷 Unggah<input type="file" accept="image/png,image/jpeg" hidden onChange={uploadFoto}/></label>
       </div>
      </div>
      {msg&&<div className="pf-alert ok">✓ {msg}</div>}
      {err&&<div className="pf-alert bad">⚠ {err}</div>}
      <div className="pf-actions"><button type="button" className="btn s" onClick={resetProfil} disabled={!dirty||busy}>Batal</button><button className="btn" disabled={busy||!dirty}>{busy?'Menyimpan...':'Simpan Perubahan'}</button></div>
     </form>}
     {tab==='keamanan'&&<form className="pf-form" onSubmit={savePass}>
      <div className="pf-form-head"><h4>Keamanan Akun</h4><p>Ganti password secara berkala dan hindari memakai password yang sama di layanan lain.</p></div>
      <div className="pf-field"><label>Password Saat Ini</label><div className="pf-pass"><input className="in" type={show.old?'text':'password'} value={p.oldPassword} onChange={e=>setP({...p,oldPassword:e.target.value})} placeholder="Masukkan password saat ini" autoComplete="current-password"/><button type="button" onClick={()=>setShow({...show,old:!show.old})} title={show.old?'Sembunyikan':'Tampilkan'}>{show.old?'🙈':'👁️'}</button></div></div>
      <div className="pf-grid2">
       <div className="pf-field"><label>Password Baru</label><div className="pf-pass"><input className="in" type={show.new?'text':'password'} value={p.newPassword} onChange={e=>setP({...p,newPassword:e.target.value})} placeholder="Minimal 6 karakter" autoComplete="new-password"/><button type="button" onClick={()=>setShow({...show,new:!show.new})} title={show.new?'Sembunyikan':'Tampilkan'}>{show.new?'🙈':'👁️'}</button></div>
        <div className="pf-meter">{[1,2,3,4].map(i=><i key={i} className={i<=score?'on s'+score:''}/>)}</div>
        <span className={score>=3?'pf-hint ok':'pf-hint'}>{p.newPassword?('Kekuatan password: '+pwLabel[score]):'Gunakan kombinasi huruf besar, kecil, angka, dan simbol.'}</span>
       </div>
       <div className="pf-field"><label>Konfirmasi Password Baru</label><div className="pf-pass"><input className="in" type={show.confirm?'text':'password'} value={p.confirm} onChange={e=>setP({...p,confirm:e.target.value})} placeholder="Ulangi password baru" autoComplete="new-password"/><button type="button" onClick={()=>setShow({...show,confirm:!show.confirm})} title={show.confirm?'Sembunyikan':'Tampilkan'}>{show.confirm?'🙈':'👁️'}</button></div>
        <span className={p.confirm?(matchOk?'pf-hint ok':'pf-hint bad'):'pf-hint'}>{p.confirm?(matchOk?'✓ Password cocok':'✕ Password belum sama'):'Ulangi password baru untuk konfirmasi.'}</span>
       </div>
      </div>
      {msg&&<div className="pf-alert ok">✓ {msg}</div>}
      {err&&<div className="pf-alert bad">⚠ {err}</div>}
      <div className="pf-actions"><button type="button" className="btn s" onClick={()=>{setP({oldPassword:'',newPassword:'',confirm:''});setMsg('');setErr('')}} disabled={busy}>Batal</button><button className="btn" disabled={busy||!passReady}>{busy?'Mengubah...':'Ubah Password'}</button></div>
     </form>}
    </div>
   </div>
   <aside className="pf-col">
    <div className="pf-card pf-sidecard">
     <div className="pf-side-head"><h3>Informasi Akun</h3><span className="pf-side-tag">Terverifikasi</span></div>
     <div className="pf-info">
      <div className="pf-info-row"><span>ID Akun</span><b>#{u.id||'-'}</b></div>
      <div className="pf-info-row"><span>Peran</span><b>{ROLE[u.role]||'Pengguna'}</b></div>
      <div className="pf-info-row"><span>Status</span><b className="pf-green">Aktif</b></div>
      <div className="pf-info-row"><span>Email</span><b>{u.email||'-'}</b></div>
     </div>
    </div>
    <div className="pf-card pf-sidecard">
     <div className="pf-side-head"><h3>Kelengkapan Profil</h3><b className="pf-pct">{complete}%</b></div>
     <div className="pf-bar"><i style={{width:complete+'%'}}/></div>
     <ul className="pf-check">
      <li className={u.nama?'on':''}>Nama lengkap</li>
      <li className={u.email?'on':''}>Email aktif</li>
      <li className={u.foto?'on':''}>Foto profil</li>
     </ul>
    </div>
    <div className="pf-card pf-sidecard">
     <div className="pf-side-head"><h3>Tips Keamanan</h3></div>
     <ul className="pf-tips">
      <li><span>🔑</span><p>Gunakan password yang kuat, unik, dan tidak dipakai di layanan lain.</p></li>
      <li><span>🛡️</span><p>Jangan bagikan kredensial akun Anda kepada siapa pun.</p></li>
      <li><span>✉️</span><p>Perbarui email dan nomor kontak secara berkala.</p></li>
     </ul>
    </div>
   </aside>
  </div>
  {preview&&<div className="pf-preview" onClick={()=>setPreview(null)}><img src={preview} alt="Foto profil" onClick={e=>e.stopPropagation()}/><button type="button" className="pf-preview-close" onClick={()=>setPreview(null)}>✕</button></div>}
 </div>};
function Peta(){
 const [rows,setRows]=useState([]),[tab,setTab]=useState('Semua'),[sel,setSel]=useState(null),[err,setErr]=useState('');
 useEffect(()=>{api('/complaints').then(setRows).catch(e=>setErr(e.message))},[]);
 useEffect(()=>{setSel(null)},[tab]);
 const G={Semua:()=>true,'Belum Ditugaskan':r=>!r.petugas_id,'Diproses':r=>['Diterima','Diverifikasi','Diprioritaskan'].includes(r.status),'Ditugaskan':r=>r.status==='Ditugaskan','Dalam Perbaikan':r=>r.status==='Dalam Perbaikan','Selesai':r=>r.status==='Selesai','Ditolak':r=>r.status==='Ditolak'};
 const v=rows.filter(G[tab]),geo=v.filter(r=>r.lat&&r.lng),tanpa=v.length-geo.length;
 const pin=s=>L.divIcon({className:'pt-pin '+slug(s),html:'<span></span>',iconSize:[20,20],iconAnchor:[10,10],popupAnchor:[0,-12]});
 const colors={Diterima:'#7c3aed',Diverifikasi:'#7c3aed',Diprioritaskan:'#0ea5e9',Ditugaskan:'#2563eb','Dalam Perbaikan':'#f59e0b',Selesai:'#22c55e',Ditolak:'#ef4444'};
 return<div className="ad-page">
  <header className="rw-hero">
   <span className="rw-eyebrow">🗺 Peta Pengaduan</span>
   <h2>Sebaran Pengaduan Infrastruktur</h2>
   <p>Lihat titik lokasi seluruh pengaduan, pantau konsentrasi kerusakan, dan buka detail laporan langsung dari peta.</p>
   <div className="rw-hero-stats">
    <div className="rw-hero-stat"><span>Total</span><b>{rows.length}</b></div>
    <div className="rw-hero-stat"><span>Memiliki Titik</span><b>{rows.filter(r=>r.lat&&r.lng).length}</b></div>
    <div className="rw-hero-stat"><span>Ditampilkan</span><b>{geo.length}</b></div>
    <div className="rw-hero-stat"><span>Belum Ditugaskan</span><b>{rows.filter(r=>!r.petugas_id).length}</b></div>
   </div>
  </header>

  <section className="card ad-toolbar pt-toolbar">
   <div className="rw-tabs">{Object.keys(G).map(t=><button key={t} type="button" className={'rw-tab'+(tab===t?' on':'')} onClick={()=>setTab(t)}><span>{t}</span><span className="rw-tab-count">{rows.filter(G[t]).length}</span></button>)}</div>
   <div className="pt-legend">{Object.entries(colors).map(([s,c])=><span key={s} className="pt-legend-item"><i style={{background:c}}/>{s}</span>)}</div>
  </section>

  {err&&<div className="ad-alert bad"><span>⚠</span>{err}</div>}

  <div className="pt-layout">
   <section className="card pt-map-card">
    <div className="pt-map">
     <MapContainer center={[-7.0292,112.7461]} zoom={11} style={{height:'100%',width:'100%'}} scrollWheelZoom>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors'/>
      <FlyTo pos={sel&&sel.lat?[parseFloat(sel.lat),parseFloat(sel.lng)]:null}/>
      {geo.map(r=><Marker key={r.id} position={[parseFloat(r.lat),parseFloat(r.lng)]} icon={pin(r.status)} eventHandlers={{click:()=>setSel(r)}}>
       <Popup>
        <div className="pt-popup">
         <b>{r.judul}</b>
         <span className="pt-popup-code">{r.kode} · {r.kategori}</span>
         <span className="pt-popup-loc">📍 {r.lokasi}</span>
         <span className="pt-popup-meta"><span className={'pt-st '+slug(r.status)}>{r.status}</span><span className={'kl-urg '+slug(r.urgensi)}>{r.urgensi}</span></span>
         <span className="pt-popup-officer">Petugas: {r.petugas_nama||'Belum ditugaskan'}</span>
         <Link className="pt-popup-link" to={'/app/tracking/'+r.kode}>Lihat detail pengaduan →</Link>
        </div>
       </Popup>
      </Marker>)}
     </MapContainer>
    </div>
   </section>

   <aside className="card pt-side">
    <div className="pt-side-head"><div><h3>Daftar Lokasi</h3><p>{geo.length} titik · {tab}</p></div></div>
    <div className="pt-list">
     {geo.map(r=><button type="button" key={r.id} className={'pt-item'+(sel&&sel.id===r.id?' on':'')} onClick={()=>setSel(r)}>
      <span className="pt-item-ic" style={{background:colors[r.status]+'1a',color:colors[r.status]}}>📍</span>
      <span className="pt-item-body"><b>{r.judul}</b><span>{r.kode} · {r.kategori}</span><span className="pt-item-loc">{r.lokasi}</span></span>
      <span className={'pt-st '+slug(r.status)}>{r.status}</span>
     </button>)}
     {!geo.length&&<div className="rw-empty"><div className="rw-empty-ic">🗺</div><p>Belum ada pengaduan dengan koordinat pada filter ini.</p></div>}
    </div>
    {tanpa>0&&<div className="pt-foot">ℹ {tanpa} pengaduan pada filter ini belum memiliki titik koordinat.</div>}
   </aside>
  </div>
 </div>}
function DataMasyarakat(){
 const [rows,setRows]=useState([]),[tab,setTab]=useState('masyarakat'),[q,setQ]=useState('');
 const [modal,setModal]=useState(null),[form,setForm]=useState({}),[msg,setMsg]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 const load=()=>api('/users').then(d=>{setRows(d);setErr('')}).catch(e=>setErr(e.message));
 useEffect(()=>{load()},[]);
 const req=q.trim().toLowerCase();
 const list=rows.filter(r=>(tab==='semua'||r.role===tab)&&(!req||(r.nama+' '+r.email).toLowerCase().includes(req)));
 const n=role=>rows.filter(r=>r.role===role).length;
 const total=rows.length,aktif=rows.filter(r=>r.aktif).length,nonaktif=total-aktif;
 const initials=x=>(x.nama||'U').split(' ').map(y=>y[0]).slice(0,2).join('').toUpperCase();
 const openCreate=()=>{setErr('');setMsg('');setForm({nama:'',email:'',password:'',role:'petugas',aktif:true});setModal({mode:'create'})};
 const openEdit=r=>{setErr('');setMsg('');setForm({nama:r.nama,email:r.email,role:r.role,aktif:r.aktif,password:'',confirm:''});setModal({mode:'edit',id:r.id,nama:r.nama})};
 const openReset=r=>{setErr('');setMsg('');setForm({password:'',confirm:''});setModal({mode:'reset',id:r.id,nama:r.nama})};
 const close=()=>{setModal(null);setErr('')};
 const save=async e=>{e.preventDefault();setErr('');setBusy(true);try{
  if(modal.mode==='create'){
   if(!form.nama||!form.email||(form.password||'').length<6)throw new Error('Nama, email, dan password minimal 6 karakter wajib diisi');
   await api('/users',{method:'POST',body:{nama:form.nama,email:form.email,password:form.password,role:form.role}});
   setMsg(`Akun ${form.nama} berhasil dibuat.`);
  }else if(modal.mode==='edit'){
   await api('/users/'+modal.id,{method:'PATCH',body:{nama:form.nama,email:form.email,role:form.role,aktif:form.aktif}});
   setMsg(`Data ${form.nama} berhasil diperbarui.`);
  }else{
   if((form.password||'').length<6)throw new Error('Password baru minimal 6 karakter');
   if(form.password!==form.confirm)throw new Error('Konfirmasi password tidak cocok');
   await api('/users/'+modal.id+'/reset-password',{method:'POST',body:{newPassword:form.password}});
   setMsg(`Password ${modal.nama} berhasil direset.`);
  }
  close();load();
 }catch(x){setErr(x.message)}setBusy(false)};
 const toggle=async r=>{const a=!r.aktif;if(!window.confirm(`${a?'Aktifkan':'Nonaktifkan'} akun ${r.nama}?`))return;setErr('');setMsg('');try{await api('/users/'+r.id,{method:'PATCH',body:{aktif:a}});setRows(x=>x.map(y=>y.id===r.id?{...y,aktif:a}:y));setMsg(`Akun ${r.nama} ${a?'diaktifkan':'dinonaktifkan'}.`)}catch(x){setErr(x.message)}};
 const T=[['masyarakat','Masyarakat','👥'],['petugas','Petugas','🛠️'],['admin','Admin','🛡️'],['semua','Semua','📋']];
 return<div className="ad-page">
  <header className="rw-hero">
   <span className="rw-eyebrow">👥 Data Masyarakat & Petugas</span>
   <h2>Kelola Pengguna INFRA-CARE</h2>
   <p>Tambah akun petugas, atur peran, aktifkan atau nonaktifkan akun, dan pantau aktivitas masyarakat serta beban tugas petugas.</p>
   <div className="rw-hero-stats">
    <div className="rw-hero-stat"><span>Total Pengguna</span><b>{total}</b></div>
    <div className="rw-hero-stat"><span>Masyarakat</span><b>{n('masyarakat')}</b></div>
    <div className="rw-hero-stat"><span>Petugas</span><b>{n('petugas')}</b></div>
    <div className="rw-hero-stat"><span>Aktif</span><b>{aktif}</b></div>
    <div className="rw-hero-stat"><span>Nonaktif</span><b>{nonaktif}</b></div>
   </div>
  </header>

  <section className="card ad-toolbar">
   <div className="rw-tabs">{T.map(([k,l,ic])=><button key={k} type="button" className={'rw-tab'+(tab===k?' on':'')} onClick={()=>setTab(k)}><span className="rw-tab-ic">{ic}</span><span>{l}</span><span className="rw-tab-count">{k==='semua'?total:n(k)}</span></button>)}</div>
   <div className="ad-field ad-grow"><label>Cari Pengguna</label><input className="in" placeholder="Cari nama atau email..." value={q} onChange={e=>setQ(e.target.value)}/></div>
   <div className="ad-actions"><button type="button" className="btn" onClick={openCreate}>➕ Tambah Pengguna</button></div>
  </section>

  {msg&&<div className="ad-alert ok"><span>✓</span>{msg}<button type="button" onClick={()=>setMsg('')}>✕</button></div>}
  {err&&!modal&&<div className="ad-alert bad"><span>⚠</span>{err}<button type="button" onClick={()=>setErr('')}>✕</button></div>}

  <section className="card rw-panel">
   <div className="rw-panel-head">
    <div><h3>Daftar Pengguna</h3><p>Menampilkan {list.length} dari {rows.length} pengguna</p></div>
    <span className="rw-filter-badge">🔐 Hanya Admin</span>
   </div>
   <div className="rw-panel-body">
    <table className="rw-table dm-table">
     <thead><tr><th>Pengguna</th><th>Email</th><th>Peran</th><th>Aktivitas</th><th>Terdaftar</th><th>Status</th><th style={{textAlign:'right'}}>Aksi</th></tr></thead>
     <tbody>
      {list.map(r=><tr key={r.id}>
       <td data-label="Pengguna"><div className="dm-user"><span className={'dm-av '+slug(r.role)}>{initials(r)}</span><div><b className="rw-title">{r.nama}</b><span className="rw-code">ID #{r.id}</span></div></div></td>
       <td data-label="Email" className="dm-email">{r.email}</td>
       <td data-label="Peran"><span className={'dm-role '+slug(r.role)}>{ROLE[r.role]||r.role}</span></td>
       <td data-label="Aktivitas">{r.role==='petugas'?<span className="dm-act"><b>{r.tugas_aktif}</b> tugas aktif · <b>{r.tugas_selesai||0}</b> selesai</span>:r.role==='masyarakat'?<span className="dm-act"><b>{r.total_laporan}</b> laporan · <b>{r.selesai_laporan}</b> selesai</span>:<span className="dm-act">Administrator sistem</span>}</td>
       <td data-label="Terdaftar" className="rw-cell-date">{tgl(r.created_at)}</td>
       <td data-label="Status"><span className={'dm-status '+(r.aktif?'on':'off')}><i/>{r.aktif?'Aktif':'Nonaktif'}</span></td>
       <td data-label="Aksi" style={{textAlign:'right',whiteSpace:'nowrap'}}>
        <button type="button" className="dm-btn" onClick={()=>openEdit(r)}>✏ Kelola</button>
        <button type="button" className="dm-btn" onClick={()=>openReset(r)}>🔑 Reset</button>
        <button type="button" className={'dm-btn '+(r.aktif?'danger':'ok')} onClick={()=>toggle(r)}>{r.aktif?'⏸ Nonaktifkan':'▶ Aktifkan'}</button>
       </td>
      </tr>)}
      {!list.length&&<tr><td colSpan="7"><div className="rw-empty"><div className="rw-empty-ic">👥</div><p>Tidak ada pengguna pada filter ini.</p></div></td></tr>}
     </tbody>
    </table>
   </div>
  </section>
  <div className="ad-note"><span>ℹ</span><p>Akun nonaktif tidak dapat login, tetapi seluruh data pengaduan dan riwayatnya tetap tersimpan. Gunakan <b>Reset</b> untuk memberikan password baru kepada pengguna.</p></div>

  {modal&&<div className="dm-backdrop" onClick={close}>
   <form className="dm-modal" onClick={e=>e.stopPropagation()} onSubmit={save}>
    <div className="dm-modal-head"><div><h3>{modal.mode==='create'?'Tambah Pengguna Baru':modal.mode==='edit'?'Kelola Pengguna':'Reset Password'}</h3><p>{modal.mode==='create'?'Buat akun masyarakat, petugas, atau admin.':modal.mode==='edit'?`Perbarui data akun ${modal.nama}.`:`Buat password baru untuk ${modal.nama}.`}</p></div><button type="button" className="dm-close" onClick={close}>✕</button></div>
    <div className="dm-modal-body">
     {modal.mode!=='reset'&&<>
      <div className="ad-field"><label>Nama Lengkap</label><input className="in" value={form.nama||''} onChange={e=>setForm({...form,nama:e.target.value})} placeholder="Nama lengkap pengguna" required/></div>
      <div className="ad-field"><label>Alamat Email</label><input className="in" type="email" value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@contoh.com" required/></div>
      <div className="ad-field"><label>Peran</label><select className="in" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="masyarakat">Masyarakat</option><option value="petugas">Petugas Lapangan</option><option value="admin">Admin Pemerintah</option></select><span className="pf-hint">Petugas dapat menangani pengaduan; admin dapat mengelola pengguna dan pengaturan sistem.</span></div>
     </>}
     {modal.mode==='create'&&<div className="ad-field"><label>Password Awal</label><input className="in" type="password" value={form.password||''} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Minimal 6 karakter" autoComplete="new-password" required/><span className="pf-hint">Sampaikan password ini kepada pengguna, lalu minta mereka menggantinya.</span></div>}
     {modal.mode==='reset'&&<>
      <div className="ad-field"><label>Password Baru</label><input className="in" type="password" value={form.password||''} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Minimal 6 karakter" autoComplete="new-password" required/></div>
      <div className="ad-field"><label>Konfirmasi Password</label><input className="in" type="password" value={form.confirm||''} onChange={e=>setForm({...form,confirm:e.target.value})} placeholder="Ulangi password baru" autoComplete="new-password" required/></div>
     </>}
     {modal.mode==='edit'&&<label className="dm-check"><input type="checkbox" checked={!!form.aktif} onChange={e=>setForm({...form,aktif:e.target.checked})}/><span><b>Akun aktif</b><small>Nonaktifkan untuk mencegah pengguna login tanpa menghapus datanya.</small></span></label>}
     {err&&<div className="ad-alert bad"><span>⚠</span>{err}</div>}
    </div>
    <div className="dm-modal-foot"><button type="button" className="btn s" onClick={close}>Batal</button><button className="btn" disabled={busy}>{busy?'Menyimpan...':modal.mode==='reset'?'Reset Password':'Simpan'}</button></div>
   </form>
  </div>}
 </div>}
function Laporan(){
 const [period,setPeriod]=useState('30'),[from,setFrom]=useState(''),[to,setTo]=useState('');
 const [d,setD]=useState(null),[err,setErr]=useState(''),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false);
 const fmtDate=x=>{const z=new Date(x.getTime()-x.getTimezoneOffset()*60000);return z.toISOString().slice(0,10)};
 const range=()=>{
  if(period==='all')return{};
  if(period==='custom'){const o={};if(from)o.from=from;if(to)o.to=to;return o}
  const end=new Date(),start=new Date();start.setDate(end.getDate()-(Number(period)-1));
  return{from:fmtDate(start),to:fmtDate(end)};
 };
 const qs=()=>{const p=new URLSearchParams(range());return p.toString()};
 const load=()=>{setErr('');api('/reports'+(qs()?'?'+qs():'')).then(setD).catch(e=>setErr(e.message))};
 useEffect(()=>{load()},[period,from,to]);
 const s=d?.summary||{},total=s.total||0,selesai=s.selesai||0,proses=(s.diproses||0)+(s.perbaikan||0),ditolak=s.ditolak||0;
 const rate=total?Math.round(selesai/total*100):0;
 const sla=d?.settings?.sla_hari||7;
 const slaRate=selesai?Math.round((s.tepat_waktu||0)/selesai*100):0;
 const colors={Diterima:'#7c3aed',Diverifikasi:'#7c3aed',Diprioritaskan:'#0ea5e9',Ditugaskan:'#2563eb','Dalam Perbaikan':'#f59e0b',Selesai:'#22c55e',Ditolak:'#ef4444'};
 const urgColors={Tinggi:'#ef4444',Sedang:'#f59e0b',Rendah:'#22c55e'};
 const maxMonth=Math.max(...(d?.byMonth||[]).map(x=>x.n),1);
 const MN=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
 const fmtMonth=v=>{const[y,m]=String(v).split('-');return `${MN[Number(m)-1]||m} ${String(y).slice(2)}`};
 const exportCsv=async()=>{setBusy(true);setErr('');setMsg('');try{
  const data=await api('/complaints'+(qs()?'?'+qs():''));
  const head=['Kode','Judul','Kategori','Urgensi','Status','Pelapor','Petugas','Lokasi','Latitude','Longitude','Tanggal'];
  const body=data.map(r=>[r.kode,r.judul,r.kategori,r.urgensi,r.status,r.pelapor,r.petugas_nama||'',r.lokasi,r.lat||'',r.lng||'',tgl(r.created_at)]);
  const csv=[head,...body].map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`laporan-infra-care-${fmtDate(new Date())}.csv`;
  document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(a.href);
  setMsg(`Berhasil mengunduh ${data.length} baris laporan sebagai CSV.`);
 }catch(x){setErr(x.message)}setBusy(false)};
 return<div className="ad-page">
  <header className="rw-hero">
   <span className="rw-eyebrow">📊 Laporan & Statistik</span>
   <h2>Laporan Kinerja Penanganan Pengaduan</h2>
   <p>Analisis volume pengaduan, kecepatan penyelesaian, distribusi kategori, dan performa petugas lapangan dalam satu halaman.</p>
   <div className="rw-hero-stats">
    <div className="rw-hero-stat"><span>Total</span><b>{total}</b></div>
    <div className="rw-hero-stat"><span>Selesai</span><b>{selesai}</b></div>
    <div className="rw-hero-stat"><span>Dalam Proses</span><b>{proses}</b></div>
    <div className="rw-hero-stat"><span>Ditolak</span><b>{ditolak}</b></div>
    <div className="rw-hero-stat"><span>Rata-rata</span><b>{s.rata_hari||0} <small>hari</small></b></div>
   </div>
  </header>

  <section className="card ad-toolbar">
   <div className="lp-period">
    {[['7','7 Hari'],['30','30 Hari'],['90','90 Hari'],['all','Semua'],['custom','Kustom']].map(([k,l])=><button key={k} type="button" className={'rw-tab'+(period===k?' on':'')} onClick={()=>setPeriod(k)}>{l}</button>)}
   </div>
   {period==='custom'&&<div className="lp-dates"><div className="ad-field"><label>Dari</label><input className="in" type="date" value={from} onChange={e=>setFrom(e.target.value)}/></div><div className="ad-field"><label>Sampai</label><input className="in" type="date" value={to} onChange={e=>setTo(e.target.value)}/></div></div>}
   <div className="ad-actions"><button type="button" className="btn" onClick={exportCsv} disabled={busy}>{busy?'Menyiapkan...':'⬇ Ekspor CSV'}</button></div>
  </section>

  {msg&&<div className="ad-alert ok"><span>✓</span>{msg}<button type="button" onClick={()=>setMsg('')}>✕</button></div>}
  {err&&<div className="ad-alert bad"><span>⚠</span>{err}</div>}
  {!d&&!err&&<div className="card ad-loading">Memuat laporan...</div>}
  {d&&<>
   <div className="lp-kpis">
    <div className="lp-kpi"><span>Total Pengaduan</span><b>{total}</b><small>Periode terpilih</small></div>
    <div className="lp-kpi"><span>Selesai</span><b className="green">{selesai}</b><small>{rate}% dari total</small></div>
    <div className="lp-kpi"><span>Dalam Proses</span><b className="amber">{proses}</b><small>Diterima s.d. perbaikan</small></div>
    <div className="lp-kpi"><span>Ditolak</span><b className="red">{ditolak}</b><small>Tidak memenuhi syarat</small></div>
    <div className="lp-kpi"><span>Rata-rata Penyelesaian</span><b>{s.rata_hari||0} <i>hari</i></b><small>Dari laporan selesai</small></div>
    <div className="lp-kpi"><span>Tingkat Penyelesaian</span><b className="blue">{rate}%</b><div className="lp-bar"><i style={{width:rate+'%'}}/></div></div>
   </div>

   <div className="lp-grid2">
    <section className="card lp-panel">
     <div className="lp-panel-head"><div><h3>Distribusi Status</h3><p>Posisi seluruh pengaduan pada periode ini</p></div><span className="rw-filter-badge">{total} total</span></div>
     <div className="lp-rows">{(d.byStatus||[]).map(x=>{const pct=total?Math.round(x.n/total*100):0;return<div className="lp-row" key={x.status}><div className="lp-row-top"><span className="lp-label"><i style={{background:colors[x.status]||'#94a3b8'}}/>{x.status}</span><span className="lp-val">{x.n}<small>{pct}%</small></span></div><div className="lp-bar"><i style={{width:pct+'%',background:colors[x.status]||'#94a3b8'}}/></div></div>})}{!d.byStatus?.length&&<p className="lp-empty">Belum ada data pada periode ini.</p>}</div>
    </section>
    <section className="card lp-panel">
     <div className="lp-panel-head"><div><h3>Berdasarkan Urgensi</h3><p>Prioritas laporan yang masuk</p></div></div>
     <div className="lp-rows">{(d.byUrgensi||[]).map(x=>{const pct=total?Math.round(x.n/total*100):0;return<div className="lp-row" key={x.urgensi}><div className="lp-row-top"><span className="lp-label"><i style={{background:urgColors[x.urgensi]||'#94a3b8'}}/>{x.urgensi}</span><span className="lp-val">{x.n}<small>{pct}%</small></span></div><div className="lp-bar"><i style={{width:pct+'%',background:urgColors[x.urgensi]||'#94a3b8'}}/></div></div>})}{!d.byUrgensi?.length&&<p className="lp-empty">Belum ada data pada periode ini.</p>}</div>
    </section>
   </div>

   <div className="lp-grid2">
    <section className="card lp-panel">
     <div className="lp-panel-head"><div><h3>Kategori Infrastruktur</h3><p>Jenis kerusakan yang paling sering dilaporkan</p></div></div>
     <div className="lp-cats">{(d.byKategori||[]).map(x=>{const pct=total?Math.round(x.n/total*100):0;return<div className="lp-cat" key={x.kategori}><span>{x.kategori}</span><div className="lp-bar"><i style={{width:pct+'%'}}/></div><b>{x.n}</b><small>{pct}%</small></div>})}{!d.byKategori?.length&&<p className="lp-empty">Belum ada data pada periode ini.</p>}</div>
    </section>
    <section className="card lp-panel">
     <div className="lp-panel-head"><div><h3>Tren 6 Bulan</h3><p>Jumlah pengaduan masuk per bulan</p></div></div>
     <div className="lp-trend">{(d.byMonth||[]).map(x=><div className="lp-trend-col" key={x.label}><span className="lp-trend-val">{x.n}</span><div className="lp-trend-bar" style={{height:Math.max(4,x.n/maxMonth*100)+'%'}}/><small>{fmtMonth(x.label)}</small></div>)}</div>
    </section>
   </div>

   <div className="lp-grid2 lp-grid-wide">
    <section className="card lp-panel">
     <div className="lp-panel-head"><div><h3>Ketepatan SLA</h3><p>Target penyelesaian {sla} hari</p></div></div>
     <div className="lp-sla"><div className="lp-sla-ring" style={{'--pct':slaRate*3.6+'deg'}}><span><b>{slaRate}%</b><small>tepat waktu</small></span></div><div className="lp-sla-info"><div><b>{s.tepat_waktu||0}</b><span>Selesai dalam {sla} hari</span></div><div><b>{Math.max(0,selesai-(s.tepat_waktu||0))}</b><span>Melebihi target</span></div><p>Ubah target SLA di menu Pengaturan untuk menyesuaikan perhitungan ini.</p></div></div>
    </section>
    <section className="card rw-panel lp-table-panel">
     <div className="rw-panel-head"><div><h3>Performa Petugas</h3><p>Beban tugas dan penyelesaian per petugas</p></div><span className="rw-filter-badge">{d.petugas?.length||0} petugas</span></div>
     <div className="rw-panel-body"><table className="rw-table lp-table"><thead><tr><th>Petugas</th><th>Ditugaskan</th><th>Aktif</th><th>Selesai</th><th>Rata-rata</th></tr></thead><tbody>
      {(d.petugas||[]).map(p=><tr key={p.id}><td><b className="rw-title">{p.nama}</b><span className="rw-code">ID #{p.id}</span></td><td>{p.ditugaskan}</td><td><span className="lp-pill amber">{p.aktif}</span></td><td><span className="lp-pill green">{p.selesai}</span></td><td>{p.rata_hari} hari</td></tr>)}
      {!d.petugas?.length&&<tr><td colSpan="5"><div className="rw-empty"><div className="rw-empty-ic">🛠️</div><p>Belum ada akun petugas. Tambahkan melalui menu Data Masyarakat.</p></div></td></tr>}
     </tbody></table></div>
    </section>
   </div>
  </>}
 </div>}
function Pengaturan(){
 const [u,setU]=useState(getUser()||{});
 const isAdmin=u.role==='admin';
 const [tab,setTab]=useState('akun');
 const [f,setF]=useState({nama:u.nama||'',email:u.email||'',foto:u.foto||''});
 const [p,setP]=useState({oldPassword:'',newPassword:'',confirm:''});
 const [show,setShow]=useState({old:false,new:false,confirm:false});
 const [sys,setSys]=useState({instansi_nama:'INFRA-CARE',instansi_kontak:'Dinas Pekerjaan Umum',sla_hari:'7',auto_assign:false});
 const [msg,setMsg]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{api('/auth/me').then(d=>{setU(d);setF({nama:d.nama||'',email:d.email||'',foto:d.foto||''});localStorage.setItem('user',JSON.stringify(d))}).catch(()=>{})},[]);
 useEffect(()=>{api('/settings').then(s=>setSys({instansi_nama:s.instansi_nama||'',instansi_kontak:s.instansi_kontak||'',sla_hari:String(s.sla_hari||'7'),auto_assign:s.auto_assign==='true'})).catch(()=>{})},[]);
 const compressImage=(file,maxSide=512,quality=0.8)=>new Promise((res,rej)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{const s=Math.min(1,maxSide/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);res(c.toDataURL('image/jpeg',quality))};img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('Gagal membaca foto'))};img.src=url});
 const uploadFoto=async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=await compressImage(file);setF({...f,foto:data});setMsg('Foto dipilih. Klik Simpan Perubahan untuk menyimpan.');setErr('')}catch(x){setErr(x.message)}};
 const saveAkun=async e=>{e.preventDefault();setBusy(true);setMsg('');setErr('');try{const d=await api('/auth/me',{method:'PUT',body:f});const nu={...u,...d};setU(nu);setF({nama:nu.nama||'',email:nu.email||'',foto:nu.foto||''});localStorage.setItem('user',JSON.stringify(nu));window.dispatchEvent(new Event('user:refresh'));setMsg('Informasi akun berhasil diperbarui.')}catch(x){setErr(x.message)}setBusy(false)};
 const savePass=async e=>{e.preventDefault();setMsg('');setErr('');
  if(!p.oldPassword)return setErr('Password saat ini wajib diisi');
  if((p.newPassword||'').length<6)return setErr('Password baru minimal 6 karakter');
  if(p.newPassword!==p.confirm)return setErr('Konfirmasi password baru tidak cocok');
  setBusy(true);try{await api('/auth/password',{method:'PUT',body:{oldPassword:p.oldPassword,newPassword:p.newPassword}});setP({oldPassword:'',newPassword:'',confirm:''});setMsg('Password berhasil diubah.')}catch(x){setErr(x.message)}setBusy(false)};
 const saveSys=async e=>{e.preventDefault();setBusy(true);setMsg('');setErr('');try{const s=await api('/settings',{method:'PUT',body:sys});setSys({instansi_nama:s.instansi_nama||'',instansi_kontak:s.instansi_kontak||'',sla_hari:String(s.sla_hari||'7'),auto_assign:s.auto_assign==='true'});setMsg('Pengaturan layanan berhasil disimpan.')}catch(x){setErr(x.message)}setBusy(false)};
 const switchTab=t=>{setTab(t);setMsg('');setErr('')};
 const score=pwScore(p.newPassword),matchOk=p.confirm&&p.newPassword===p.confirm;
 const ready=!!(p.oldPassword&&p.newPassword.length>=6&&matchOk);
 const initials=(u.nama||'U').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();
 const fotoSrc=f.foto||u.foto;
 const dirty=f.nama!==(u.nama||'')||f.email!==(u.email||'')||f.foto!==(u.foto||'');
 const T=[['akun','👤 Informasi Akun'],['keamanan','🔒 Keamanan'],...(isAdmin?[['sistem','⚙️ Pengaturan Sistem']]:[])];
 return<div className="st-page">
  <header className="rw-hero">
   <span className="rw-eyebrow">⚙️ Pengaturan</span>
   <h2>Pengaturan Akun & Layanan</h2>
   <p>{isAdmin?'Kelola identitas akun, keamanan, serta kebijakan layanan yang berlaku untuk masyarakat dan petugas.':'Kelola identitas akun dan keamanan Anda. Kebijakan layanan ditetapkan oleh admin.'}</p>
   <div className="rw-hero-stats">
    <div className="rw-hero-stat"><span>Peran</span><b style={{fontSize:14}}>{ROLE[u.role]||'Pengguna'}</b></div>
    <div className="rw-hero-stat"><span>Status</span><b style={{fontSize:14}}>{u.aktif===false?'Nonaktif':'Aktif'}</b></div>
    <div className="rw-hero-stat"><span>Target SLA</span><b>{sys.sla_hari} <small>hari</small></b></div>
    <div className="rw-hero-stat"><span>Auto-Assign</span><b style={{fontSize:14}}>{sys.auto_assign?'Aktif':'Nonaktif'}</b></div>
   </div>
  </header>

  <div className="pf-layout">
   <div className="pf-col">
    <div className="pf-card">
     <div className="pf-tabs" role="tablist">{T.map(([k,l])=><button type="button" key={k} className={tab===k?'on':''} onClick={()=>switchTab(k)}>{l}</button>)}</div>

     {tab==='akun'&&<form className="pf-form" onSubmit={saveAkun}>
      <div className="pf-form-head"><h4>Informasi Akun</h4><p>Data ini digunakan pada laporan, penugasan, dan notifikasi.</p></div>
      <div className="pf-grid2">
       <div className="pf-field"><label>Nama Lengkap</label><input className="in" value={f.nama} onChange={e=>setF({...f,nama:e.target.value})} placeholder="Masukkan nama lengkap"/></div>
       <div className="pf-field"><label>Alamat Email</label><input className="in" type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} placeholder="Masukkan email"/><span className="pf-hint">Email dipakai untuk login.</span></div>
      </div>
      <div className="pf-field"><label>Foto Profil <span className="pf-opt">opsional</span></label>
       <div className="pf-foto-row">
        <div className="pf-foto-thumb">{fotoSrc?<img src={fotoSrc} alt="Pratinjau foto"/>:<span>👤</span>}</div>
        <div className="pf-foto-input"><input className="in" value={f.foto} onChange={e=>setF({...f,foto:e.target.value})} placeholder="Tempel URL gambar profil"/><span className="pf-hint">Tempel tautan gambar atau unggah dari perangkat (otomatis dikompres).</span></div>
        <label className="btn s pf-upload">📷 Unggah<input type="file" accept="image/png,image/jpeg" hidden onChange={uploadFoto}/></label>
       </div>
      </div>
      {msg&&<div className="pf-alert ok">✓ {msg}</div>}
      {err&&<div className="pf-alert bad">⚠ {err}</div>}
      <div className="pf-actions"><button type="button" className="btn s" onClick={()=>{setF({nama:u.nama||'',email:u.email||'',foto:u.foto||''});setMsg('');setErr('')}} disabled={!dirty||busy}>Batal</button><button className="btn" disabled={busy||!dirty}>{busy?'Menyimpan...':'Simpan Perubahan'}</button></div>
     </form>}

     {tab==='keamanan'&&<form className="pf-form" onSubmit={savePass}>
      <div className="pf-form-head"><h4>Keamanan Akun</h4><p>Gunakan password yang kuat dan unik untuk melindungi akun {ROLE[u.role]||'Anda'}.</p></div>
      <div className="pf-field"><label>Password Saat Ini</label><div className="pf-pass"><input className="in" type={show.old?'text':'password'} value={p.oldPassword} onChange={e=>setP({...p,oldPassword:e.target.value})} placeholder="Masukkan password saat ini" autoComplete="current-password"/><button type="button" onClick={()=>setShow({...show,old:!show.old})}>{show.old?'🙈':'👁️'}</button></div></div>
      <div className="pf-grid2">
       <div className="pf-field"><label>Password Baru</label><div className="pf-pass"><input className="in" type={show.new?'text':'password'} value={p.newPassword} onChange={e=>setP({...p,newPassword:e.target.value})} placeholder="Minimal 6 karakter" autoComplete="new-password"/><button type="button" onClick={()=>setShow({...show,new:!show.new})}>{show.new?'🙈':'👁️'}</button></div><div className="pf-meter">{[1,2,3,4].map(i=><i key={i} className={i<=score?'on s'+score:''}/>)}</div><span className={score>=3?'pf-hint ok':'pf-hint'}>{p.newPassword?('Kekuatan password: '+pwLabel[score]):'Gunakan campuran huruf besar, kecil, angka, dan simbol.'}</span></div>
       <div className="pf-field"><label>Konfirmasi Password Baru</label><div className="pf-pass"><input className="in" type={show.confirm?'text':'password'} value={p.confirm} onChange={e=>setP({...p,confirm:e.target.value})} placeholder="Ulangi password baru" autoComplete="new-password"/><button type="button" onClick={()=>setShow({...show,confirm:!show.confirm})}>{show.confirm?'🙈':'👁️'}</button></div><span className={p.confirm?(matchOk?'pf-hint ok':'pf-hint bad'):'pf-hint'}>{p.confirm?(matchOk?'✓ Password cocok':'✕ Password belum sama'):'Ulangi password baru untuk konfirmasi.'}</span></div>
      </div>
      {msg&&<div className="pf-alert ok">✓ {msg}</div>}
      {err&&<div className="pf-alert bad">⚠ {err}</div>}
      <div className="pf-actions"><button type="button" className="btn s" onClick={()=>{setP({oldPassword:'',newPassword:'',confirm:''});setMsg('');setErr('')}} disabled={busy}>Batal</button><button className="btn" disabled={busy||!ready}>{busy?'Mengubah...':'Ubah Password'}</button></div>
     </form>}

     {tab==='sistem'&&isAdmin&&<form className="pf-form" onSubmit={saveSys}>
      <div className="pf-form-head"><h4>Kebijakan Layanan</h4><p>Pengaturan ini berlaku untuk seluruh pengaduan dan petugas.</p></div>
      <div className="pf-grid2">
       <div className="pf-field"><label>Nama Instansi</label><input className="in" value={sys.instansi_nama} onChange={e=>setSys({...sys,instansi_nama:e.target.value})} placeholder="Nama instansi"/><span className="pf-hint">Ditampilkan pada laporan dan komunikasi layanan.</span></div>
       <div className="pf-field"><label>Kontak / Unit</label><input className="in" value={sys.instansi_kontak} onChange={e=>setSys({...sys,instansi_kontak:e.target.value})} placeholder="Contoh: Dinas Pekerjaan Umum"/></div>
      </div>
      <div className="pf-grid2">
       <div className="pf-field"><label>Target SLA (hari)</label><input className="in" type="number" min="1" max="365" value={sys.sla_hari} onChange={e=>setSys({...sys,sla_hari:e.target.value})}/><span className="pf-hint">Dipakai untuk menghitung ketepatan penyelesaian di menu Laporan.</span></div>
       <div className="pf-field"><label>Distribusi Otomatis</label><label className="st-switch"><input type="checkbox" checked={!!sys.auto_assign} onChange={e=>setSys({...sys,auto_assign:e.target.checked})}/><span/><b>{sys.auto_assign?'Aktif':'Nonaktif'}</b></label><span className="pf-hint">Jika aktif, pengaduan baru otomatis diberikan ke petugas aktif dengan beban tugas paling sedikit.</span></div>
      </div>
      {msg&&<div className="pf-alert ok">✓ {msg}</div>}
      {err&&<div className="pf-alert bad">⚠ {err}</div>}
      <div className="pf-actions"><button className="btn" disabled={busy}>{busy?'Menyimpan...':'Simpan Pengaturan'}</button></div>
     </form>}
    </div>
   </div>

   <aside className="pf-col">
    <div className="pf-card pf-sidecard">
     <div className="pf-side-head"><h3>Identitas Akun</h3><span className="pf-side-tag">{u.aktif===false?'Nonaktif':'Aktif'}</span></div>
     <div className="st-ident"><span className="st-avatar">{initials}</span><div><b>{u.nama||'Pengguna'}</b><span>{ROLE[u.role]||'Pengguna'} · ID #{u.id||'-'}</span></div></div>
     <div className="pf-info">
      <div className="pf-info-row"><span>Email</span><b>{u.email||'-'}</b></div>
      <div className="pf-info-row"><span>Peran</span><b>{ROLE[u.role]||'Pengguna'}</b></div>
      <div className="pf-info-row"><span>Status</span><b className={u.aktif===false?'':"pf-green"}>{u.aktif===false?'Nonaktif':'Aktif'}</b></div>
     </div>
    </div>
    <div className="pf-card pf-sidecard">
     <div className="pf-side-head"><h3>Kebijakan Layanan</h3>{isAdmin&&<span className="pf-side-tag">Dapat diubah</span>}</div>
     <div className="pf-info">
      <div className="pf-info-row"><span>Instansi</span><b>{sys.instansi_nama||'-'}</b></div>
      <div className="pf-info-row"><span>Unit / Kontak</span><b>{sys.instansi_kontak||'-'}</b></div>
      <div className="pf-info-row"><span>Target SLA</span><b>{sys.sla_hari} hari</b></div>
      <div className="pf-info-row"><span>Auto-assign</span><b>{sys.auto_assign?'Aktif':'Nonaktif'}</b></div>
     </div>
     {!isAdmin&&<p className="st-policy">Perubahan kebijakan dilakukan oleh admin melalui menu Pengaturan.</p>}
    </div>
    <div className="pf-card pf-sidecard">
     <div className="pf-side-head"><h3>Tips</h3></div>
     <ul className="pf-tips">
      <li><span>🔑</span><p>Ganti password secara berkala dan jangan bagikan kredensial akun.</p></li>
      <li><span>📧</span><p>Pastikan email aktif agar notifikasi dan komunikasi tidak terlewat.</p></li>
      <li><span>⚙️</span><p>Sebagai admin, sesuaikan SLA dan auto-assign agar penanganan lebih cepat.</p></li>
     </ul>
    </div>
   </aside>
  </div>
 </div>}

const Home=()=>{
  const u=getUser();
  if(!u)return <Navigate to="/login"/>;
  return <Dashboard/>;
};
const Guard=({roles,children})=>roles.includes(getUser()?.role)?children:<Navigate to="/app"/>;

export default function App(){return<Routes>
 <Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/>
 <Route path="/app" element={<Layout/>}><Route index element={<Home/>}/>
  <Route path="buat" element={<Guard roles={['masyarakat']}><Buat/></Guard>}/><Route path="sukses/:kode" element={<Sukses/>}/>
  <Route path="tracking" element={<Tracking/>}/><Route path="tracking/:kode" element={<Tracking/>}/>
  <Route path="riwayat" element={<Riwayat/>}/><Route path="notifikasi" element={<Notif/>}/>
  <Route path="kelola" element={<Guard roles={['admin','petugas']}><Kelola/></Guard>}/>
  <Route path="peta" element={<Guard roles={['admin','petugas']}><Peta/></Guard>}/>
  <Route path="data-masyarakat" element={<Guard roles={['admin']}><DataMasyarakat/></Guard>}/>
  <Route path="laporan" element={<Guard roles={['admin','petugas']}><Laporan/></Guard>}/>
  <Route path="pengaturan" element={<Guard roles={['admin','petugas']}><Pengaturan/></Guard>}/>
  <Route path="profil" element={<Profil/>}/><Route path="*" element={<Soon/>}/></Route>
 <Route path="*" element={<Navigate to="/"/>}/></Routes>}
