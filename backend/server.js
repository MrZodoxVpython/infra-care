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
const multer = require('multer');
const path = require('path');

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
const up = multer({ storage: multer.diskStorage({ destination: path.join(__dirname,'uploads'), filename: (req,file,cb)=>{ cb(null, Date.now()+'-'+file.originalname) } }), limits: { fileSize: 5 * 1024 * 1024 } });
app.use(cors(),express.json());app.use('/uploads',express.static(path.join(__dirname,'uploads')));
const q=(s,p)=>pool.query(s,p).then(r=>r.rows);
const wrap=f=>(req,res)=>f(req,res).catch(e=>{console.error(e);res.status(500).json({message:'Terjadi kesalahan server'})});
const auth=roles=>(req,res,next)=>{try{req.user=jwt.verify((req.headers.authorization||'').replace('Bearer ',''),SECRET)}catch{return res.status(401).json({message:'Belum login'})}
 if(roles&&!roles.includes(req.user.role))return res.status(403).json({message:'Tidak diizinkan'});next()};
const sign=u=>{const user={id:u.id,nama:u.nama,email:u.email,role:u.role};return{token:jwt.sign(user,SECRET,{expiresIn:'7d'}),user}};

app.post('/api/auth/login',wrap(async(req,res)=>{const[u]=await q('select * from users where email=$1',[req.body.email]);
 if(!u||!bcrypt.compareSync(req.body.password||'',u.password))return res.status(400).json({message:'Email atau password salah'});res.json(sign(u))}));
app.post('/api/auth/register',wrap(async(req,res)=>{const{nama,email,password}=req.body;
 if(!nama||!email||(password||'').length<6)return res.status(400).json({message:'Nama, email, dan password (min. 6 karakter) wajib diisi'});
 if((await q('select 1 from users where email=$1',[email])).length)return res.status(400).json({message:'Email sudah terdaftar'});
 const[u]=await q("insert into users(nama,email,password,role) values($1,$2,$3,'masyarakat') returning *",[nama,email,bcrypt.hashSync(password,10)]);res.status(201).json(sign(u))}));
app.get('/api/public/stats',wrap(async(req,res)=>{const[r]=await q("select count(*)::int total,count(*) filter(where status='Selesai')::int selesai,count(*) filter(where status not in('Selesai','Ditolak'))::int proses from complaints");res.json(r)}));

app.get('/api/stats',auth(),wrap(async(req,res)=>{const m=req.user.role==='masyarakat',w=m?'where user_id=$1':'',p=m?[req.user.id]:[];
 const[s]=await q(`select count(*)::int total,count(*) filter(where status in('Diterima','Diverifikasi','Diprioritaskan','Ditugaskan'))::int diproses,count(*) filter(where status='Dalam Perbaikan')::int perbaikan,count(*) filter(where status='Selesai')::int selesai,count(*) filter(where status='Ditolak')::int ditolak from complaints ${w}`,p);
 const kategori=await q(`select kategori,count(*)::int n from complaints ${w} group by 1 order by 2 desc`,p);
 const harian=await q(`select to_char(d,'DD Mon') hari,(select count(*)::int from complaints c where c.created_at::date=d ${m?'and c.user_id=$1':''}) n from generate_series(current_date-6,current_date,'1 day') d`,p);
 res.json({...s,kategori,harian})}));

app.get('/api/complaints',auth(),wrap(async(req,res)=>{const c=[],p=[],add=(s,v)=>{p.push(v);c.push(s.replaceAll('?','$'+p.length))};
 if(req.user.role==='masyarakat')add('c.user_id=?',req.user.id);
 const{status,kategori,q:s}=req.query;if(status)add('c.status=?',status);if(kategori)add('c.kategori=?',kategori);
 if(s)add('(c.judul ilike ? or c.kode ilike ? or c.kategori ilike ?)','%'+s+'%');
 res.json(await q(`select c.*,u.nama pelapor from complaints c join users u on u.id=c.user_id ${c.length?'where '+c.join(' and '):''} order by c.created_at desc`,p))}));
app.get('/api/complaints/:kode',auth(),wrap(async(req,res)=>{
 const[c]=await q('select c.*,u.nama pelapor,p.nama petugas_nama from complaints c join users u on u.id=c.user_id left join users p on p.id=c.petugas_id where c.kode=$1',[req.params.kode]);
 if(!c)return res.status(404).json({message:'Pengaduan tidak ditemukan'});
 if(req.user.role==='masyarakat'&&c.user_id!==req.user.id)return res.status(403).json({message:'Tidak diizinkan'});
 c.logs=await q('select status,catatan,created_at from complaint_logs where complaint_id=$1 order by created_at,id',[c.id]);res.json(c)}));
app.post('/api/complaints',auth(['masyarakat']),up.single('foto'),wrap(async(req,res)=>{const b=req.body;
 if(!b.judul||!b.kategori||!b.deskripsi||!b.lokasi||!b.urgensi)return res.status(400).json({message:'Lengkapi semua data wajib'});
 const[{n}]=await q("select nextval('complaint_seq')::int n"),kode=`INF-${new Date().getFullYear()}-${String(n).padStart(5,'0')}`;
 const[c]=await q('insert into complaints(kode,judul,kategori,deskripsi,foto,lokasi,lat,lng,urgensi,user_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *',
  [kode,b.judul,b.kategori,b.deskripsi,req.file?'/uploads/'+req.file.filename:null,b.lokasi,b.lat||null,b.lng||null,b.urgensi,req.user.id]);
 await q("insert into complaint_logs(complaint_id,status,catatan) values($1,'Diterima','Pengaduan diterima oleh sistem')",[c.id]);
 await q("insert into notifications(user_id,tipe,judul,isi) values($1,'Pengaduan','Pengaduan Diterima',$2)",[req.user.id,`Pengaduan Anda dengan nomor ${kode} telah diterima oleh sistem.`]);
 res.status(201).json(c)}));
app.patch('/api/complaints/:id/status',auth(['admin','petugas']),wrap(async(req,res)=>{const{status,catatan}=req.body;
 if(!STATUS.includes(status))return res.status(400).json({message:'Status tidak valid'});
 const[c]=await q('update complaints set status=$1,updated_at=now() where id=$2 returning *',[status,req.params.id]);
 if(!c)return res.status(404).json({message:'Pengaduan tidak ditemukan'});
 await q('insert into complaint_logs(complaint_id,status,catatan) values($1,$2,$3)',[c.id,status,catatan||'Status diperbarui']);
 await q("insert into notifications(user_id,tipe,judul,isi) values($1,'Update','Update Status Pengaduan',$2)",[c.user_id,`Status pengaduan ${c.kode} telah berubah menjadi "${status}".`]);res.json(c)}));

app.get('/api/notifications',auth(),wrap(async(req,res)=>res.json(await q('select * from notifications where user_id=$1 order by created_at desc',[req.user.id]))));
app.post('/api/notifications/read-all',auth(),wrap(async(req,res)=>{await q('update notifications set dibaca=true where user_id=$1',[req.user.id]);res.json({ok:true})}));
app.listen(process.env.PORT||4000,()=>console.log('INFRA-CARE API berjalan'));
