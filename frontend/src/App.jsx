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
    <div style={{flex:1,minWidth:280,background:'#f1f5f9',borderRadius:16,padding:24,textAlign:'center'}}>
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
   {!reg&&<div style={{display:'flex',justifyContent:'space-between',margin:'14px 0',fontSize:14}}><span><input type="checkbox"/> Ingat saya</span><a style={{color:'var(--b)'}}>Lupa password?</a></div>}
   {e&&<div className="err">{e}</div>}
   <button className="btn w" style={{marginTop:14}}>{reg?'DAFTAR':'MASUK'} →</button>
   <p className="mu" style={{textAlign:'center'}}>{reg?'Sudah punya akun?':'Belum memiliki akun?'} <a style={{color:'var(--b)',fontWeight:700,cursor:'pointer'}} onClick={()=>setReg(!reg)}>{reg?'Masuk':'Daftar sekarang'}</a></p>
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
 const nav=useNavigate(),[f,setF]=useState({judul:'',kategori:'',deskripsi:'',lokasi:'',lat:-6.2088,lng:106.8456,urgensi:'Tinggi'}),[foto,setFoto]=useState(null),[e,setE]=useState(''),[busy,setBusy]=useState(false);
 const [mapCenter,setMapCenter]=useState([-7.0292,112.7461]);
 const [markerPos,setMarkerPos]=useState([-7.0292,112.7461]);
 const [searchResults,setSearchResults]=useState([]);
 const [searchQuery,setSearchQuery]=useState('');
 const set=k=>v=>setF({...f,[k]:v.target.value});
 const compressImage=(file,maxSide=1280,quality=0.75)=>new Promise((res,rej)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{const s=Math.min(1,maxSide/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);res(c.toDataURL('image/jpeg',quality))};img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('Gambar tidak dapat dibaca'))};img.src=url});
 const searchLocation=async()=>{if(!searchQuery.trim())return;try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(searchQuery)}+Indonesia`,{headers:{'User-Agent':'INFRA-CARE/1.0'}});const d=await r.json();setSearchResults(d.map(x=>({label:x.display_name,lat:parseFloat(x.lat),lng:parseFloat(x.lon)})));}catch{setSearchResults([])}};
 const selectLoc=loc=>{setSearchQuery(loc.label);setF({...f,lokasi:loc.label});setMapCenter([loc.lat,loc.lng]);setMarkerPos([loc.lat,loc.lng]);setF({...f,lat:loc.lat,lng:loc.lng});setSearchResults([])};
 const onMapClick=e=>{setMarkerPos([e.latlng.lat,e.latlng.lng]);setMapCenter([e.latlng.lat,e.latlng.lng]);setF({...f,lat:e.latlng.lat,lng:e.latlng.lng,lokasi:`Titik di peta (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`})};
  const submit=async()=>{setE('');if(!foto)return setE('Foto / bukti kerusakan wajib diunggah');if(foto.size>5*1024*1024)return setE('Ukuran foto maksimal 5MB');if(!f.lokasi)return setE('Lokasi wajib dipilih dari peta');setBusy(true);try{const foto64=await compressImage(foto);if(!foto64||foto64.length<100)return setE('Gagal memproses foto, coba upload ulang');const c=await api('/complaints',{method:'POST',body:{...f,foto:foto64}});window.dispatchEvent(new Event('notif:refresh'));nav('/app/sukses/'+c.kode)}catch(x){setE(x.message)}setBusy(false)};
 return<div className="grid2"><div className="card"><Link to="/app" style={{color:'var(--b)'}}>← Kembali</Link><h2 style={{margin:'8px 0'}}>📢 Form Pengaduan</h2><p className="mu">Sampaikan laporan kerusakan infrastruktur dengan lengkap dan jelas.</p>
  <div className="row2"><div><label>Judul Pengaduan *</label><input className="in" placeholder="Contoh: Jalan Berlubang di Jl. Melati" value={f.judul} onChange={set('judul')}/></div>
  <div><label>Kategori *</label><select className="in" value={f.kategori} onChange={set('kategori')}><option value="">Pilih kategori</option>{KAT.map(k=><option key={k}>{k}</option>)}</select></div></div>
  <label>Deskripsi *</label><textarea className="in" rows="5" maxLength="500" placeholder="Jelaskan kondisi kerusakan secara detail..." value={f.deskripsi} onChange={set('deskripsi')}/><div className="mu" style={{textAlign:'right'}}>{f.deskripsi.length}/500</div>
  <div className="row2"><div><label>Foto / Bukti Kerusakan *</label><label className="in" style={{textAlign:'center',borderStyle:'dashed',cursor:'pointer',padding:30}}>☁ {foto?foto.name:'Klik untuk mengunggah foto'}<br/><span className="mu">Format: JPG, PNG (Maks. 5MB)</span><input type="file" accept="image/png,image/jpeg" hidden onChange={x=>setFoto(x.target.files[0])}/></label></div>
  <div style={{marginTop:14}}><label style={{fontWeight:700,fontSize:14,marginBottom:6,display:'block'}}>📍 Lokasi Kerusakan *</label>
   <div style={{display:'flex',gap:8,marginBottom:8}}><input className="in" style={{flex:1}} placeholder="Cari desa, jalan, atau alamat..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&searchLocation()}/><button className="btn s" onClick={searchLocation}>Cari</button></div>
   {searchResults.length>0&&<div style={{border:'1px solid #edf3fb',borderRadius:8,background:'#fff',maxHeight:200,overflowY:'auto',marginBottom:8}}>{searchResults.map((r,i)=><div key={i} style={{padding:8,cursor:'pointer',borderBottom:i<searchResults.length-1?'1px solid #f1f5f9':'none',fontSize:13}} onClick={()=>selectLoc(r)}><b>{r.label}</b><br/><span className="mu" style={{fontSize:11}}>Lat: {r.lat.toFixed(4)}, Lng: {r.lng.toFixed(4)}</span></div>)}</div>}
   <div style={{height:'12.5vh',border:'1px solid #edf3fb',borderRadius:12,overflow:'hidden',position:'relative',marginBottom:8}}><MapContainer center={mapCenter} zoom={15} style={{height:'100%',width:'100%'}}><MapClicker onClick={onMapClick}/><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors'/><Marker position={markerPos} icon={customIcon} draggable onDragEnd={e=>{const p=e.target.getLatLng();setMarkerPos([p.lat,p.lng]);setMapCenter([p.lat,p.lng]);setF({...f,lat:p.lat,lng:p.lng})}}><Popup>Titik lokasi pengaduan</Popup></Marker></MapContainer></div>
   <div className="mu" style={{textAlign:'center',fontSize:12}}>Titik terpilih: {markerPos[0].toFixed(6)}, {markerPos[1].toFixed(6)}</div>
  </div>
  <div style={{marginTop:16}}>
   <label>Tingkat Urgensi *</label><div className="urg">{[['Tinggi','Butuh penanganan segera'],['Sedang','Mengganggu aktivitas masyarakat'],['Rendah','Kerusakan ringan']].map(([u,d])=><div key={u} className={'tag '+u.toLowerCase()+(f.urgensi===u?' on':'')} onClick={()=>setF({...f,urgensi:u})}><b>{u}</b>{d}</div>)}</div>
   </div>
  {e&&<div className="err">{e}</div>}<div style={{display:'flex',gap:12,marginTop:18,alignItems:'center'}}><span className="mu" style={{flex:1}}>ℹ Pastikan data yang Anda isi sudah benar agar pengaduan dapat diproses dengan cepat.</span><button className="btn" disabled={busy} onClick={submit}>✈ {busy?'Mengirim...':'Kirim Pengaduan'}</button></div></div></div>
  <div className="stk"><img src="/stk-img.jpg" alt="Infrastruktur" className="stk-img"/><div className="card"><h3>Contoh Infrastruktur yang Dapat Dilaporkan</h3><div className="row2" style={{marginTop:12}}>{KAT.map(k=><span className="tag" key={k}>{k}</span>)}</div></div>
  <div className="card"><h3>💡 Tips Pengaduan</h3>{['Gunakan judul yang jelas dan spesifik.','Lengkapi deskripsi dengan detail kondisi kerusakan.','Lampirkan foto yang menunjukkan lokasi kerusakan.','Pastikan lokasi sudah sesuai dengan titik kejadian.','Pilih tingkat urgensi yang sesuai.'].map(t=><p key={t}>✅ {t}</p>)}</div></div></div>}

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
 const[rows,setRows]=useState([]),[tab,setTab]=useState('Semua');const load=()=>api('/notifications').then(setRows);useEffect(()=>{load()},[]);
 const [dark,setDark]=useState(()=>document.documentElement.classList.contains('dark'));
 useEffect(()=>{const ck=()=>setDark(document.documentElement.classList.contains('dark'));ck();const ob=new MutationObserver(ck);ob.observe(document.documentElement,{attributes:true,attributeFilter:['class']});return()=>ob.disconnect();},[]);
 const T=['Semua','Sistem','Pengaduan','Update'],v=rows.filter(r=>tab==='Semua'||r.tipe===tab),un=rows.filter(r=>!r.dibaca).length;
 const icon=(t,dib)=>{if(t==='Pengaduan')return dib?'📋':'📢';if(t==='Update')return dib?'🔄':'⚡';if(t==='Sistem')return dib?'ℹ️':'🛎️';return dib?'🔔':'🔔';};
 const cardBg=dark?'#1e293b':'#fff';const cardText=dark?'#e2e8f0':'#14306b';const cardSub=dark?'#94a3b8':'#6b7fa6';const borderCol=dark?'#334155':'#f1f5f9';
 return<div className="grid2"><div className="stk"><div className="banner"><h2>🔔 Notifikasi</h2><p>Pantau informasi terbaru seputar pengaduan Anda.</p></div>
  <div className="tabs">{T.map(t=><button key={t} className={tab===t?'on':''} onClick={()=>setTab(t)}>{t}{t==='Semua'&&un>0?` (${un})`:''}</button>)}</div>
  <div className="card" style={{padding:0,overflow:'hidden',background:cardBg}}>
   {v.map((r,i)=><div key={r.id} style={{display:'flex',gap:14,alignItems:'flex-start',padding:'16px 20px',borderBottom:i<v.length-1?('1px solid '+borderCol):'none',background:r.dibaca?cardBg:(dark?'rgba(59,130,246,0.12)':'#f8fbff'),cursor:'default',transition:'background 0.2s'}}><div style={{width:40,height:40,borderRadius:12,display:'grid',placeItems:'center',background:r.dibaca?(dark?'#334155':'#f1f5f9'):(dark?'rgba(59,130,246,0.25)':'#e8f3ff'),fontSize:18,flexShrink:0}}>{icon(r.tipe,r.dibaca)}</div>
    <div style={{flex:1,minWidth:0}}><div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}><div><b style={{color:cardText,fontSize:14,display:'block',marginBottom:4}}>{r.judul}</b><p style={{color:cardSub,fontSize:13,lineHeight:1.5,margin:0,whiteSpace:'normal'}}>{r.isi}</p></div>{!r.dibaca&&<span style={{width:8,height:8,borderRadius:'50%',background:'#3b82f6',flexShrink:0,marginTop:6}} title="Belum dibaca"></span>}</div><div style={{display:'flex',alignItems:'center',gap:10,marginTop:10}}><span style={{fontSize:11,color:cardSub,opacity:0.9}}>{tgl(r.created_at)}</span><span style={{fontSize:11,padding:'2px 8px',borderRadius:10,background:dark?'#334155':'#f1f5f9',color:cardSub}}>{r.tipe}</span></div></div></div>)}
   {!v.length&&<div style={{padding:40,textAlign:'center'}}><div style={{fontSize:40,marginBottom:12,opacity:0.5}}>🔕</div><p className="mu">Tidak ada notifikasi.</p></div>}
   {v.length>0&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px',borderTop:'1px solid '+borderCol,background:dark?'#0f172a':'#f9fbfd'}}><span className="mu" style={{fontSize:12}}>Menampilkan {v.length} dari {rows.length} notifikasi</span><button className="btn s" onClick={()=>api('/notifications/read-all',{method:'POST'}).then(()=>{load();window.dispatchEvent(new Event('notif:refresh'));})}>✔ Tandai Semua Dibaca</button></div>}
  </div></div>
  <div className="card" style={{background:cardBg}}><h3 style={{color:cardText,marginBottom:16}}>Ringkasan Notifikasi</h3><div style={{display:'flex',flexDirection:'column',gap:12}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:12,borderRadius:12,background:dark?'#0f172a':'#f8fbff',border:'1px solid '+borderCol}}><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{fontSize:18}}>📬</span><span style={{color:cardText,fontSize:13}}>Belum Dibaca</span></div><b style={{color:'#3b82f6'}}>{un}</b></div>{T.slice(1).map(t=><div key={t} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:12,borderRadius:12,background:cardBg,border:'1px solid '+borderCol}}><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{fontSize:18}}>{t==='Pengaduan'?'📋':t==='Update'?'⚡':'🛎️'}</span><span style={{color:cardText,fontSize:13}}>{t}</span></div><b style={{color:cardText}}>{rows.filter(r=>r.tipe===t).length}</b></div>)}</div></div></div>}

function Kelola(){
 const u=getUser(),[rows,setRows]=useState([]),[f,setF]=useState({q:'',kategori:'',status:''}),[dark,setDark]=useState(()=>document.documentElement.classList.contains('dark'));
 useEffect(()=>{const ck=()=>setDark(document.documentElement.classList.contains('dark'));ck();const ob=new MutationObserver(ck);ob.observe(document.documentElement,{attributes:true,attributeFilter:['class']});return()=>ob.disconnect();},[]);
 const load=()=>api('/complaints?'+new URLSearchParams(Object.fromEntries(Object.entries(f).filter(([,v])=>v)))).then(setRows);useEffect(()=>{load()},[f]);
 const change=async(r,status)=>{await api(`/complaints/${r.id}/status`,{method:'PATCH',body:{status,catatan:`Status diubah oleh ${u.nama}`}});load()};
 return<><div className="banner"><h2>📋 {u.role==='admin'?'Kelola Pengaduan':'Tugas Pengaduan'}</h2><p>Pantau, verifikasi, dan tindak lanjuti semua pengaduan masyarakat.</p></div>
  <div className="card"><div className="row2" style={{gridTemplateColumns:'2fr 1fr 1fr',marginBottom:14}}><input className="in" placeholder="Cari berdasarkan ID, judul, atau kategori..." value={f.q} onChange={e=>setF({...f,q:e.target.value})}/>
  <select className="in" value={f.kategori} onChange={e=>setF({...f,kategori:e.target.value})}><option value="">Semua Kategori</option>{KAT.map(k=><option key={k}>{k}</option>)}</select>
  <select className="in" value={f.status} onChange={e=>setF({...f,status:e.target.value})}><option value="">Semua Status</option>{STATUS.map(k=><option key={k}>{k}</option>)}</select></div>
  <Table rows={rows} admin onChange={change} dark={dark}/><p className="mu">Menampilkan {rows.length} data pengaduan</p></div></>}

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
  <Route path="kelola" element={<Guard roles={['admin','petugas']}><Kelola/></Guard>}/><Route path="profil" element={<Profil/>}/><Route path="*" element={<Soon/>}/></Route>
 <Route path="*" element={<Navigate to="/"/>}/></Routes>}
