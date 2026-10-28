// Hanya muat .env di development lokal. Di Vercel, Environment Variables
// diambil langsung dari dasbor; jangan bergantung pada file .env di produksi.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const rawDatabaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!rawDatabaseUrl) {
  throw new Error('DATABASE_URL or POSTGRES_URL is missing from Vercel Environment Variables.');
}

// Safely parse the connection string using the native URL Web API
const dbUrl = new URL(rawDatabaseUrl);

// Remove any pre-existing sslmode query parameters that override our configuration
dbUrl.searchParams.delete('sslmode');

const poolOptions = {
  connectionString: dbUrl.toString(),
  max: 5,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
};

// Enforce non-strict SSL certification validation inside Vercel Serverless production
if (process.env.NODE_ENV === 'production' || !rawDatabaseUrl.includes('localhost')) {
  poolOptions.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(poolOptions);

// Tangani error pool agar tidak crash proses serverless saat jaringan terputus sesaat.
pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err.message);
});

const app = express();
const SECRET = process.env.JWT_SECRET || 'infra-care-dev';
const STATUS = ['Diterima','Diverifikasi','Diprioritaskan','Ditugaskan','Dalam Perbaikan','Selesai','Ditolak'];
app.use(cors(),express.json({ limit: '10mb' }));
const q=(s,p)=>pool.query(s,p).then(r=>r.rows);
const wrap=f=>(req,res)=>f(req,res).catch(e=>{console.error('WRAP ERROR:',e.stack||e.message);res.status(500).json({message:'Terjadi kesalahan server: '+e.message})});
const auth=roles=>(req,res,next)=>{try{req.user=jwt.verify((req.headers.authorization||'').replace('Bearer ',''),SECRET)}catch{return res.status(401).json({message:'Belum login'})}
 if(roles&&!roles.includes(req.user.role))return res.status(403).json({message:'Tidak diizinkan'});next()};
// Payload JWT sengaja TIDAK memuat foto profil (base64). Foto bisa puluhan KB
// dan membuat header Authorization membengkak sampai Vercel menolak request
// dengan 494 Request Header Too Large. Foto tetap dikirim lewat objek `user`.
const sign=u=>{const user={id:u.id,nama:u.nama,email:u.email,role:u.role,foto:u.foto||null};
 const payload={id:u.id,nama:u.nama,email:u.email,role:u.role};
 return{token:jwt.sign(payload,SECRET,{expiresIn:'7d'}),user}};
pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS foto TEXT").catch(()=>{});
// Kolom & tabel tambahan untuk fitur admin (dibuat otomatis, aman diulang).
const schemaReady = Promise.all([
 pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS aktif boolean DEFAULT true"),
 pool.query("CREATE TABLE IF NOT EXISTS app_settings(key text primary key, value text, updated_at timestamptz default now())")
]).catch(e=>console.error('SCHEMA INIT:',e.message));
const DEFAULT_SETTINGS={instansi_nama:'INFRA-CARE',instansi_kontak:'Dinas Pekerjaan Umum',sla_hari:'7',auto_assign:'false'};
const getSettings=async()=>{await schemaReady;const rows=await q('select key,value from app_settings');const o={...DEFAULT_SETTINGS};rows.forEach(r=>{o[r.key]=r.value});return o};

app.post('/api/auth/login',wrap(async(req,res)=>{await schemaReady;const[u]=await q('select * from users where email=$1',[req.body.email]);
 if(!u||!bcrypt.compareSync(req.body.password||'',u.password))return res.status(400).json({message:'Email atau password salah'});
 if(u.aktif===false)return res.status(403).json({message:'Akun Anda dinonaktifkan. Hubungi admin untuk mengaktifkan kembali.'});
 res.json(sign(u))}));
app.post('/api/auth/register',wrap(async(req,res)=>{const{nama,email,password}=req.body;
 if(!nama||!email||(password||'').length<6)return res.status(400).json({message:'Nama, email, dan password (min. 6 karakter) wajib diisi'});
 if((await q('select 1 from users where email=$1',[email])).length)return res.status(400).json({message:'Email sudah terdaftar'});
 const[u]=await q("insert into users(nama,email,password,role) values($1,$2,$3,'masyarakat') returning *",[nama,email,bcrypt.hashSync(password,10)]);res.status(201).json(sign(u))}));
app.get('/api/auth/me',auth(),wrap(async(req,res)=>{await schemaReady;const[u]=await q('select id,nama,email,role,foto,aktif from users where id=$1',[req.user.id]);res.json(u||req.user)}));
app.put('/api/auth/me',auth(),wrap(async(req,res)=>{const{nama,email,foto}=req.body;
 if(email){const e=await q('select 1 from users where email=$1 and id<>$2',[email,req.user.id]);if(e.length)return res.status(400).json({message:'Email sudah digunakan'})}
 // Batasi ukuran foto (base64) supaya respons /auth/me tetap ringan.
 if(foto&&foto.length>400000)return res.status(400).json({message:'Foto profil terlalu besar. Gunakan gambar di bawah 300KB.'});
 const[u]=await q('update users set nama=coalesce($1,nama), email=coalesce($2,email), foto=coalesce($3,foto) where id=$4 returning id,nama,email,role,foto',[nama||null,email||null,foto||null,req.user.id]);
 res.json(u)}));
app.put('/api/auth/password',auth(),wrap(async(req,res)=>{const{oldPassword,newPassword}=req.body;
 if(!oldPassword||!newPassword)return res.status(400).json({message:'Password lama dan password baru wajib diisi'});
 if((newPassword||'').length<6)return res.status(400).json({message:'Password baru minimal 6 karakter'});
 const[u]=await q('select password from users where id=$1',[req.user.id]);
 if(!u||!bcrypt.compareSync(oldPassword,u.password))return res.status(400).json({message:'Password lama salah'});
 await q('update users set password=$1 where id=$2',[bcrypt.hashSync(newPassword,10),req.user.id]);
 res.json({ok:true})}));
app.get('/api/public/stats',wrap(async(req,res)=>{const[r]=await q("select count(*)::int total,count(*) filter(where status='Selesai')::int selesai,count(*) filter(where status not in('Selesai','Ditolak'))::int proses from complaints");res.json(r)}));

app.get('/api/stats',auth(),wrap(async(req,res)=>{const m=req.user.role==='masyarakat',w=m?'where user_id=$1':'',p=m?[req.user.id]:[];
 const[s]=await q(`select count(*)::int total,count(*) filter(where status in('Diterima','Diverifikasi','Diprioritaskan','Ditugaskan'))::int diproses,count(*) filter(where status='Dalam Perbaikan')::int perbaikan,count(*) filter(where status='Selesai')::int selesai,count(*) filter(where status='Ditolak')::int ditolak from complaints ${w}`,p);
 const kategori=await q(`select kategori,count(*)::int n from complaints ${w} group by 1 order by 2 desc`,p);
 const harian=await q(`select to_char(d,'DD Mon') hari,(select count(*)::int from complaints c where c.created_at::date=d ${m?'and c.user_id=$1':''}) n from generate_series(current_date-6,current_date,'1 day') d`,p);
 res.json({...s,kategori,harian})}));

app.get('/api/complaints',auth(),wrap(async(req,res)=>{const c=[],p=[],add=(s,v)=>{p.push(v);c.push(s.replaceAll('?','$'+p.length))};
 if(req.user.role==='masyarakat')add('c.user_id=?',req.user.id);
 const{status,kategori,q:s,petugas_id,urgensi,from,to}=req.query;
 if(status)add('c.status=?',status);if(kategori)add('c.kategori=?',kategori);
 if(petugas_id==='none')c.push('c.petugas_id is null');else if(petugas_id)add('c.petugas_id=?',petugas_id);
 if(urgensi)add('c.urgensi=?',urgensi);
 if(from)add('c.created_at>=?',from);
 if(to)add('c.created_at<=?',to+' 23:59:59');
 if(s)add('(c.judul ilike ? or c.kode ilike ? or c.kategori ilike ? or u.nama ilike ?)','%'+s+'%');
 res.json(await q(`select c.*,u.nama pelapor,p.nama petugas_nama from complaints c join users u on u.id=c.user_id left join users p on p.id=c.petugas_id ${c.length?'where '+c.join(' and '):''} order by c.created_at desc`,p))}));
app.get('/api/complaints/:kode',auth(),wrap(async(req,res)=>{
 const[c]=await q('select c.*,u.nama pelapor,p.nama petugas_nama from complaints c join users u on u.id=c.user_id left join users p on p.id=c.petugas_id where c.kode=$1',[req.params.kode]);
 if(!c)return res.status(404).json({message:'Pengaduan tidak ditemukan'});
 if(req.user.role==='masyarakat'&&c.user_id!==req.user.id)return res.status(403).json({message:'Tidak diizinkan'});
 c.logs=await q('select status,catatan,created_at from complaint_logs where complaint_id=$1 order by created_at,id',[c.id]);res.json(c)}));
app.post('/api/complaints',auth(['masyarakat']),wrap(async(req,res)=>{const b=req.body;
 if(!b.judul||!b.kategori||!b.deskripsi||!b.lokasi||!b.urgensi||!b.foto)return res.status(400).json({message:'Lengkapi semua data wajib termasuk foto'});
 const[{n}]=await q("select nextval('complaint_seq')::int n"),kode=`INF-${new Date().getFullYear()}-${String(n).padStart(5,'0')}`;
 const[c]=await q('insert into complaints(kode,judul,kategori,deskripsi,foto,lokasi,lat,lng,urgensi,user_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *',
  [kode,b.judul,b.kategori,b.deskripsi,b.foto,b.lokasi,b.lat||null,b.lng||null,b.urgensi,req.user.id]);
 await q("insert into complaint_logs(complaint_id,status,catatan) values($1,'Diterima','Pengaduan diterima oleh sistem')",[c.id]);
 // Auto-assign opsional: pilih petugas aktif dengan beban tugas paling sedikit.
 const cfg=await getSettings();
 if(cfg.auto_assign==='true'){
  const[p]=await q("select u.id,u.nama from users u where u.role='petugas' and coalesce(u.aktif,true) order by (select count(*) from complaints c where c.petugas_id=u.id and c.status in('Ditugaskan','Dalam Perbaikan')) asc,u.id asc limit 1");
  if(p){
   const[upd]=await q("update complaints set petugas_id=$1,status='Ditugaskan' where id=$2 returning *",[p.id,c.id]);
   await q("insert into complaint_logs(complaint_id,status,catatan) values($1,'Ditugaskan',$2)",[c.id,`Otomatis ditugaskan kepada ${p.nama}`]);
   await q("insert into notifications(user_id,tipe,judul,isi) values($1,'Pengaduan','Tugas Baru',$2)",[p.id,`Pengaduan ${kode} ditugaskan kepada Anda.`]);
   Object.assign(c,upd);
  }
 }
 await q("insert into notifications(user_id,tipe,judul,isi) values($1,'Pengaduan','Pengaduan Diterima',$2)",[req.user.id,`Pengaduan Anda dengan nomor ${kode} telah diterima oleh sistem.`]);
 res.status(201).json(c)}));
app.patch('/api/complaints/:id/status',auth(['admin','petugas']),wrap(async(req,res)=>{const{status,catatan}=req.body;
 if(!STATUS.includes(status))return res.status(400).json({message:'Status tidak valid'});
 const[old]=await q('select * from complaints where id=$1',[req.params.id]);
 if(!old)return res.status(404).json({message:'Pengaduan tidak ditemukan'});
 if(req.user.role==='petugas'&&old.petugas_id&&old.petugas_id!==req.user.id)return res.status(403).json({message:'Pengaduan ini ditugaskan kepada petugas lain'});
 const claim=req.user.role==='petugas'&&!old.petugas_id?req.user.id:null;
 const[c]=await q('update complaints set status=$1,petugas_id=coalesce(petugas_id,$3),updated_at=now() where id=$2 returning *',[status,req.params.id,claim]);
 await q('insert into complaint_logs(complaint_id,status,catatan) values($1,$2,$3)',[c.id,status,catatan||'Status diperbarui']);
 await q("insert into notifications(user_id,tipe,judul,isi) values($1,'Update','Update Status Pengaduan',$2)",[c.user_id,`Status pengaduan ${c.kode} telah berubah menjadi "${status}".`]);res.json(c)}));
app.patch('/api/complaints/:id/assign',auth(['admin']),wrap(async(req,res)=>{await schemaReady;
 const{petugas_id}=req.body;const[c]=await q('select * from complaints where id=$1',[req.params.id]);
 if(!c)return res.status(404).json({message:'Pengaduan tidak ditemukan'});
 if(!petugas_id){
  if(!c.petugas_id)return res.json(c);
  const[nextStatus]=['Diterima','Diverifikasi','Diprioritaskan','Ditugaskan'].includes(c.status)?['Diverifikasi']:[c.status];
  const[upd]=await q('update complaints set petugas_id=null,status=$1,updated_at=now() where id=$2 returning *',[nextStatus,c.id]);
  await q('insert into complaint_logs(complaint_id,status,catatan) values($1,$2,$3)',[c.id,nextStatus,'Penugasan petugas dilepas']);
  return res.json(upd);
 }
 const[p]=await q("select id,nama from users where id=$1 and role='petugas' and coalesce(aktif,true)=true",[petugas_id]);
 if(!p)return res.status(400).json({message:'Petugas tidak valid atau sedang nonaktif'});
 const nextStatus=['Dalam Perbaikan','Selesai','Ditolak'].includes(c.status)?c.status:'Ditugaskan';
 const[upd]=await q('update complaints set petugas_id=$1,status=$2,updated_at=now() where id=$3 returning *',[p.id,nextStatus,c.id]);
 await q('insert into complaint_logs(complaint_id,status,catatan) values($1,$2,$3)',[c.id,nextStatus,`Ditugaskan kepada ${p.nama}`]);
 await q("insert into notifications(user_id,tipe,judul,isi) values($1,'Pengaduan','Tugas Baru',$2)",[p.id,`Pengaduan ${c.kode} ditugaskan kepada Anda.`]);
 await q("insert into notifications(user_id,tipe,judul,isi) values($1,'Update','Petugas Ditugaskan',$2)",[c.user_id,`Pengaduan ${c.kode} kini ditangani oleh ${p.nama}.`]);
 res.json(upd)}));
app.delete('/api/complaints/:id',auth(['admin']),wrap(async(req,res)=>{
 const[c]=await q('delete from complaints where id=$1 returning kode',[req.params.id]);
 if(!c)return res.status(404).json({message:'Pengaduan tidak ditemukan'});res.json({ok:true,kode:c.kode})}));

// ===================== MANAJEMEN PENGGUNA (ADMIN) =====================
app.get('/api/users',auth(['admin']),wrap(async(req,res)=>{await schemaReady;
 const{role,q:s,status}=req.query;const w=[],p=[];
 if(role){p.push(role);w.push(`u.role=$${p.length}`)}
 if(s){p.push('%'+s+'%');w.push(`(u.nama ilike $${p.length} or u.email ilike $${p.length})`)}
 if(status==='aktif')w.push('coalesce(u.aktif,true)=true');
 if(status==='nonaktif')w.push('coalesce(u.aktif,true)=false');
 res.json(await q(`select u.id,u.nama,u.email,u.role,coalesce(u.aktif,true) aktif,u.created_at,
  (select count(*)::int from complaints c where c.user_id=u.id) total_laporan,
  (select count(*)::int from complaints c where c.user_id=u.id and c.status='Selesai') selesai_laporan,
  (select count(*)::int from complaints c where c.petugas_id=u.id) total_tugas,
  (select count(*)::int from complaints c where c.petugas_id=u.id and c.status='Selesai') tugas_selesai,
  (select count(*)::int from complaints c where c.petugas_id=u.id and c.status in('Ditugaskan','Dalam Perbaikan')) tugas_aktif
  from users u ${w.length?'where '+w.join(' and '):''} order by u.role,u.created_at desc`,p))}));
app.post('/api/users',auth(['admin']),wrap(async(req,res)=>{await schemaReady;const{nama,email,password,role}=req.body;
 if(!nama||!email||(password||'').length<6)return res.status(400).json({message:'Nama, email, dan password (min. 6 karakter) wajib diisi'});
 if(!['masyarakat','petugas','admin'].includes(role))return res.status(400).json({message:'Peran tidak valid'});
 if((await q('select 1 from users where email=$1',[email])).length)return res.status(400).json({message:'Email sudah terdaftar'});
 const[u]=await q('insert into users(nama,email,password,role,aktif) values($1,$2,$3,$4,true) returning id,nama,email,role,aktif,created_at',[nama,email,bcrypt.hashSync(password,10),role]);
 res.status(201).json(u)}));
app.patch('/api/users/:id',auth(['admin']),wrap(async(req,res)=>{await schemaReady;
 const id=Number(req.params.id),{nama,email,role,aktif}=req.body;
 if(role&&!['masyarakat','petugas','admin'].includes(role))return res.status(400).json({message:'Peran tidak valid'});
 if(email&&(await q('select 1 from users where email=$1 and id<>$2',[email,id])).length)return res.status(400).json({message:'Email sudah digunakan'});
 const[t]=await q('select * from users where id=$1',[id]);if(!t)return res.status(404).json({message:'Pengguna tidak ditemukan'});
 const nextRole=role||t.role,nextAktif=aktif===undefined?t.aktif!==false:!!aktif;
 if(id===req.user.id&&(nextRole!=='admin'||!nextAktif))return res.status(400).json({message:'Tidak dapat menurunkan peran atau menonaktifkan akun sendiri'});
 if(t.role==='admin'&&(nextRole!=='admin'||!nextAktif)){
  const[{n}]=await q("select count(*)::int n from users where role='admin' and coalesce(aktif,true)=true and id<>$1",[id]);
  if(n<1)return res.status(400).json({message:'Minimal harus ada satu admin aktif'});
 }
 const[u]=await q('update users set nama=coalesce($1,nama),email=coalesce($2,email),role=$3,aktif=$4 where id=$5 returning id,nama,email,role,aktif,created_at',[nama||null,email||null,nextRole,nextAktif,id]);
 res.json(u)}));
app.post('/api/users/:id/reset-password',auth(['admin']),wrap(async(req,res)=>{await schemaReady;
 const{newPassword}=req.body;if((newPassword||'').length<6)return res.status(400).json({message:'Password baru minimal 6 karakter'});
 const[u]=await q('update users set password=$1 where id=$2 returning id',[bcrypt.hashSync(newPassword,10),req.params.id]);
 if(!u)return res.status(404).json({message:'Pengguna tidak ditemukan'});res.json({ok:true})}));

// ===================== LAPORAN & PENGATURAN =====================
app.get('/api/reports',auth(['admin','petugas']),wrap(async(req,res)=>{await schemaReady;
 const cfg=await getSettings(),sla=Math.max(1,parseInt(cfg.sla_hari)||7);
 const{from,to}=req.query;const w=[],p=[];
 if(from){p.push(from);w.push(`c.created_at>=$${p.length}`)}
 if(to){p.push(to+' 23:59:59');w.push(`c.created_at<=$${p.length}`)}
 const where=w.length?'where '+w.join(' and '):'';
 const[s]=await q(`select count(*)::int total,
  count(*) filter(where status='Selesai')::int selesai,
  count(*) filter(where status in('Diterima','Diverifikasi','Diprioritaskan','Ditugaskan'))::int diproses,
  count(*) filter(where status='Dalam Perbaikan')::int perbaikan,
  count(*) filter(where status='Ditolak')::int ditolak,
  count(*) filter(where petugas_id is null)::int tanpa_petugas,
  count(*) filter(where status='Selesai' and updated_at-created_at<=(interval '1 day' * ${sla}))::int tepat_waktu,
  coalesce(round(avg(extract(epoch from (updated_at-created_at))/86400) filter(where status='Selesai'))::numeric,0)::float rata_hari
  from complaints c ${where}`,p);
 const byStatus=await q(`select status,count(*)::int n from complaints c ${where} group by status order by n desc`,p);
 const byKategori=await q(`select kategori,count(*)::int n from complaints c ${where} group by kategori order by n desc`,p);
 const byUrgensi=await q(`select urgensi,count(*)::int n from complaints c ${where} group by urgensi order by n desc`,p);
 const mw=[],mp=[];
 if(from){mp.push(from);mw.push(`c.created_at>=$${mp.length}`)}
 if(to){mp.push(to+' 23:59:59');mw.push(`c.created_at<=$${mp.length}`)}
 const byMonth=await q(`select to_char(d,'YYYY-MM') label,count(c.id)::int n
  from generate_series(date_trunc('month',current_date)-interval '5 months',date_trunc('month',current_date),'1 month') d
  left join complaints c on date_trunc('month',c.created_at)=d ${mw.length?'and '+mw.join(' and '):''}
  group by d order by d`,mp);
 const pw=[],pp=[];
 if(from){pp.push(from);pw.push(`c.created_at>=$${pp.length}`)}
 if(to){pp.push(to+' 23:59:59');pw.push(`c.created_at<=$${pp.length}`)}
 const petugas=await q(`select p.id,p.nama,
  count(c.id)::int ditugaskan,
  count(c.id) filter(where c.status='Selesai')::int selesai,
  count(c.id) filter(where c.status in('Ditugaskan','Dalam Perbaikan'))::int aktif,
  coalesce(round(avg(extract(epoch from (c.updated_at-c.created_at))/86400) filter(where c.status='Selesai'))::numeric,0)::float rata_hari
  from users p left join complaints c on c.petugas_id=p.id ${pw.length?'and '+pw.join(' and '):''}
  where p.role='petugas' and coalesce(p.aktif,true)=true
  group by p.id,p.nama order by selesai desc,ditugaskan desc,p.nama`,pp);
 res.json({summary:s,byStatus,byKategori,byUrgensi,byMonth,petugas,settings:{sla_hari:sla}})}));
app.get('/api/settings',auth(['admin','petugas']),wrap(async(req,res)=>res.json(await getSettings())));
app.put('/api/settings',auth(['admin']),wrap(async(req,res)=>{await schemaReady;
 const b=req.body||{},out={};
 for(const k of ['instansi_nama','instansi_kontak','sla_hari','auto_assign'])if(b[k]!==undefined)out[k]=String(b[k]).slice(0,200);
 if(out.sla_hari&&(!/^\d+$/.test(out.sla_hari)||+out.sla_hari<1||+out.sla_hari>365))return res.status(400).json({message:'SLA harus berupa angka 1–365 hari'});
 if(out.auto_assign!==undefined)out.auto_assign=out.auto_assign==='true'?'true':'false';
 for(const[k,v]of Object.entries(out))await q('insert into app_settings(key,value) values($1,$2) on conflict(key) do update set value=excluded.value,updated_at=now()',[k,v]);
 res.json(await getSettings())}));

app.get('/api/notifications',auth(),wrap(async(req,res)=>res.json(await q('select * from notifications where user_id=$1 order by created_at desc',[req.user.id]))));
app.post('/api/notifications/read-all',auth(),wrap(async(req,res)=>{await q('update notifications set dibaca=true where user_id=$1',[req.user.id]);res.json({ok:true})}));
// Error handler umum (selalu kirim JSON)
app.use((err,req,res,next)=>{if(err.type==='entity.too.large')return res.status(413).json({message:'Ukuran foto terlalu besar. Gunakan foto yang lebih kecil.'});console.error('ERROR:',err.stack||err.message);res.status(500).json({message:'Terjadi kesalahan server: '+err.message})});

// 404 handler untuk route API yang tidak ditemukan (selalu JSON)
app.use('/api',(req,res)=>res.status(404).json({message:'Endpoint tidak ditemukan'}));

app.listen(process.env.PORT||4000,()=>console.log('INFRA-CARE API berjalan'));
