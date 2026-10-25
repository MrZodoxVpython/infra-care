require('dotenv').config();
const {Pool}=require('pg'),bcrypt=require('bcryptjs'),fs=require('fs');
const pool=new Pool({connectionString:process.env.DATABASE_URL});
(async()=>{
 await pool.query(fs.readFileSync(__dirname+'/schema.sql','utf8'));
 const pw=bcrypt.hashSync('password123',10);
 const ins=async(n,e,r)=>(await pool.query('insert into users(nama,email,password,role) values($1,$2,$3,$4) returning id',[n,e,pw,r])).rows[0].id;
 const yeni=await ins('Yeni Fatimatus Zahro','yeni@infracare.id','masyarakat'),budi=await ins('Budi Santoso','budi@infracare.id','admin'),andi=await ins('Andi Pratama','andi@infracare.id','petugas');
 const data=[['Jalan Berlubang di Jl. Melati','Jalan','Jl. Melati, Kec. Sukajadi, Kota Bandung','Dalam Perbaikan','Tinggi',-6.9027,107.6191],
 ['Drainase Tersumbat','Drainase','Jl. Anggrek, Kec. Cempaka, Kota Bandung','Diverifikasi','Sedang',-6.91,107.62],
 ['Lampu Jalan Mati','Penerangan','Jl. Kenanga, Kec. Harapan, Kota Bandung','Diverifikasi','Rendah',-6.92,107.63],
 ['Jembatan Rusak','Jembatan','Desa Suka Maju, Kec. Indah, Kab. Bandung','Selesai','Tinggi',-6.93,107.61],
 ['Trotoar Rusak','Fasilitas Umum','Jl. Veteran, Kec. Lengkong, Kota Bandung','Ditugaskan','Sedang',-6.94,107.60]];
 for(const [i,d] of data.entries()){
  const kode=`INF-2026-${String(125-i*7).padStart(5,'0')}`;
  const c=(await pool.query("insert into complaints(kode,judul,kategori,deskripsi,lokasi,lat,lng,urgensi,status,user_id,petugas_id,created_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now()-($12||' days')::interval) returning id",
   [kode,d[0],d[1],'Terdapat kerusakan cukup besar yang dapat membahayakan pengguna.',d[2],d[5],d[6],d[4],d[3],yeni,andi,i*2])).rows[0].id;
  await pool.query("insert into complaint_logs(complaint_id,status,catatan) values($1,'Diterima','Pengaduan diterima oleh sistem')",[c]);
 }
 await pool.query("select setval('complaint_seq',125)");
 await pool.query("insert into notifications(user_id,tipe,judul,isi) values($1,'Pengaduan','Pengaduan Diterima','Pengaduan Anda dengan nomor INF-2026-00125 telah diterima oleh sistem.'),($1,'Update','Update Status Pengaduan','Status pengaduan Anda telah berubah menjadi \"Dalam Perbaikan\".'),($1,'Sistem','Notifikasi Sistem','Terima kasih telah menggunakan INFRA-CARE.')",[yeni]);
 console.log('Seed selesai.');process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
