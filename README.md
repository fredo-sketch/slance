# SLance — Student Freelance

> **Skill jadi karya, karya jadi cuan.**

SLance adalah platform freelance khusus mahasiswa yang mempertemukan talenta kampus dengan UMKM, startup, dan komunitas. Dibuat untuk proyek mata kuliah Bisnis Digital (Kelompok 5) sekaligus sebagai alat validasi pasar dengan pelanggan nyata.

Instagram: [@slance.id](https://www.instagram.com/slance.id/)

## Fitur

Satu aplikasi, tiga tampilan berdasarkan peran:

| Peran | Yang bisa dilakukan |
| --- | --- |
| **Publik** | Landing page, hasil validasi survei, tim, FAQ, **waitlist dengan nomor antrian** (tersimpan di Supabase), daftar & masuk |
| **Mahasiswa (freelancer)** | Cari project dengan filter (kategori, kota, mode kerja, level, honor), rekomendasi project, melamar dengan tawaran harga, ruang kerja project (milestone, kirim hasil, revisi), **Skill Badge** Bronze/Silver/Gold, **portofolio otomatis**, penghasilan & penarikan, panduan pemula |
| **Klien (UMKM/startup/komunitas)** | Posting project, bandingkan pelamar (badge, rating, tawaran), pilih mahasiswa, danai **Safe Escrow**, setujui/minta revisi, beri ulasan, riwayat pembayaran |
| **Admin** | Statistik platform, verifikasi akun (email kampus + KTM), moderasi project, escrow & sengketa, waitlist, hasil survei |

Komisi platform: klien membayar biaya layanan 5% di atas harga project, mahasiswa dipotong 5% dari honor (ubah di `src/config.js`).

## Status

**Tahap 1: frontend + waitlist (saat ini).**

- Waitlist: **sudah terhubung ke Supabase** (data nyata).
- Dashboard mahasiswa, klien, dan admin: memakai **data contoh** yang disimpan di `localStorage` browser. Masuk lewat tombol peran di halaman `/masuk`; tersedia tombol *Reset data demo* di sidebar.
- Escrow & penarikan: **simulasi**, belum ada payment gateway.
- Login sungguhan (Supabase Auth), penyimpanan KTM, dan sinkronisasi data project ke database: **tahap berikutnya**.

## Tech stack

React 19 · Vite · Tailwind CSS 4 · React Router · Supabase · lucide-react. Deploy ke Vercel.

## Menjalankan lokal

```bash
npm install
cp .env.example .env   # opsional; nilai bawaan sudah menunjuk ke project Supabase SLance
npm run dev            # http://localhost:5173
npm run build          # build produksi ke folder dist/
```

## Deploy ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new) dan impor repo `fredo-sketch/slance`.
2. Framework otomatis terdeteksi sebagai **Vite** (build `npm run build`, output `dist`). `vercel.json` sudah menangani routing halaman.
3. (Opsional) isi *Environment Variables*: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (publishable key). Jika dikosongkan, aplikasi memakai nilai bawaan.
4. Deploy. Alamat bawaan Vercel (`*.vercel.app`) sudah cukup untuk tahap ini.

## Database (Supabase)

Skema waitlist ada di `supabase/migrations/`. Tabel `waitlist` dikunci dengan Row Level Security tanpa policy, sehingga publik **tidak bisa membaca atau menulis langsung**. Pendaftaran lewat fungsi `join_waitlist` dan statistik publik lewat `waitlist_stats`. Data pendaftar dilihat atau diekspor dari *Table Editor* di dashboard Supabase.

## Menambahkan foto tim

Ganti nama anggota di `src/config.js` (bagian `team`), lalu taruh foto persegi di `public/team/<slug>.jpg` sesuai `slug` masing-masing. Jika foto belum ada, otomatis tampil inisial.

## Struktur

```
public/logo/        Logo SVG (ikon, wordmark, wordmark + tagline)
logo/               Logo asli
src/config.js       Brand, komisi, kategori, kampus, tim, FAQ
src/data/           Data contoh dan hasil survei
src/store/          State bersama (localStorage) untuk mode demo
src/pages/          Landing, auth, dan dashboard (student / client / admin)
supabase/migrations Skema database
```

## Data survei

`src/data/survey.js` dihitung dari berkas CSV hasil Google Form (20 responden valid, sebagian besar mahasiswa UNNES Sistem Informasi). Angka ini indikasi awal, bukan sampel representatif.
