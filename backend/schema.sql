drop table if exists notifications, complaint_logs, complaints, users cascade;
drop sequence if exists complaint_seq;
create sequence complaint_seq start 1;
create table users(id serial primary key,nama text not null,email text unique not null,password text not null,
 role text not null check(role in('masyarakat','admin','petugas')),created_at timestamptz default now());
create table complaints(id serial primary key,kode text unique not null,judul text not null,kategori text not null,deskripsi text not null,
 foto text,lokasi text not null,lat numeric,lng numeric,urgensi text not null check(urgensi in('Tinggi','Sedang','Rendah')),
 status text not null default 'Diterima' check(status in('Diterima','Diverifikasi','Diprioritaskan','Ditugaskan','Dalam Perbaikan','Selesai','Ditolak')),
 user_id int references users(id),petugas_id int references users(id),created_at timestamptz default now(),updated_at timestamptz default now());
create table complaint_logs(id serial primary key,complaint_id int references complaints(id) on delete cascade,status text,catatan text,created_at timestamptz default now());
create table notifications(id serial primary key,user_id int references users(id) on delete cascade,tipe text,judul text,isi text,dibaca boolean default false,created_at timestamptz default now());
