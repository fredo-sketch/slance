// Data contoh (fiktif) untuk mode demo. Semua nama, bisnis, dan angka di sini rekaan.
import { dayOffset as d } from "../lib/format";

export const DEMO_IDS = { mahasiswa: "s1", klien: "c1", admin: "a1" };

export const seedAdmins = [{ id: "a1", name: "Admin SLance", email: "admin@slance.demo" }];

export const seedStudents = [
  {
    id: "s1", username: "nadia-safitri", name: "Nadia Safitri", email: "nadia.safitri@mhs.unnes.ac.id",
    campus: "Universitas Negeri Semarang (UNNES)", major: "Sistem Informasi", semester: 5, city: "Semarang",
    bio: "Mahasiswa Sistem Informasi yang suka merancang antarmuka dan membangun website untuk UMKM. Terbiasa bekerja dengan deadline kuliah dan klien sekaligus.",
    skills: ["web", "desain"], verification: "approved", ktm: true, joinedAt: d(-120),
  },
  {
    id: "s2", username: "raka-pratama", name: "Raka Pratama", email: "raka.pratama@mhs.undip.ac.id",
    campus: "Universitas Diponegoro (Undip)", major: "Ilmu Komunikasi", semester: 6, city: "Semarang",
    bio: "Fokus di copywriting dan strategi konten media sosial untuk brand lokal.",
    skills: ["konten", "sosmed"], verification: "approved", ktm: true, joinedAt: d(-100),
  },
  {
    id: "s3", username: "salsa-amelia", name: "Salsa Amelia", email: "salsa.amelia@students.dinus.ac.id",
    campus: "Universitas Dian Nuswantoro (Udinus)", major: "Desain Komunikasi Visual", semester: 7, city: "Semarang",
    bio: "Ilustrator dan desainer kemasan. Suka identitas visual yang hangat dan mudah diingat.",
    skills: ["desain", "sosmed"], verification: "approved", ktm: true, joinedAt: d(-95),
  },
  {
    id: "s4", username: "bagas-wicaksono", name: "Bagas Wicaksono", email: "bagas.w@mhs.unnes.ac.id",
    campus: "Universitas Negeri Semarang (UNNES)", major: "Teknik Informatika", semester: 4, city: "Ungaran",
    bio: "Pengembang web React dan Laravel. Senang membangun fitur kecil yang langsung dipakai.",
    skills: ["web", "data"], verification: "approved", ktm: true, joinedAt: d(-80),
  },
  {
    id: "s5", username: "citra-lestari", name: "Citra Lestari", email: "citra.lestari@mhs.undip.ac.id",
    campus: "Universitas Diponegoro (Undip)", major: "Statistika", semester: 7, city: "Semarang",
    bio: "Analisis data dan riset pasar: dari kuesioner sampai laporan yang mudah dipahami pemilik usaha.",
    skills: ["data", "bahasa"], verification: "approved", ktm: true, joinedAt: d(-70),
  },
  {
    id: "s6", username: "farhan-alamsyah", name: "Farhan Alamsyah", email: "farhan.a@walisongo.ac.id",
    campus: "UIN Walisongo Semarang", major: "Sastra Inggris", semester: 5, city: "Semarang",
    bio: "Penerjemah Indonesia–Inggris dan proofreader. Pernah jadi MC dan panitia beberapa acara kampus.",
    skills: ["bahasa", "event"], verification: "approved", ktm: true, joinedAt: d(-60),
  },
  {
    id: "s7", username: "dewi-anggraini", name: "Dewi Anggraini", email: "dewi.anggraini@mhs.unnes.ac.id",
    campus: "Universitas Negeri Semarang (UNNES)", major: "Manajemen", semester: 3, city: "Semarang",
    bio: "Baru mulai freelance. Tertarik di digital marketing dan pengelolaan komunitas.",
    skills: ["sosmed", "event"], verification: "pending", ktm: true, joinedAt: d(-2),
  },
  {
    id: "s8", username: "ilham-maulana", name: "Ilham Maulana", email: "ilham.maulana@gmail.com",
    campus: "Kampus lainnya", major: "Desain Grafis", semester: 2, city: "Kendal",
    bio: "Belajar desain otomotif dan poster.",
    skills: ["desain"], verification: "pending", ktm: false, joinedAt: d(-1),
  },
];

export const seedClients = [
  { id: "c1", name: "Kopi Senja Semarang", owner: "Rina Wulandari", type: "UMKM · Kafe", city: "Semarang", email: "halo@kopisenja.demo", whatsapp: "081234567801", verification: "approved", joinedAt: d(-110), about: "Kafe kopi susu lokal dengan dua gerai di Semarang. Sedang memperkuat kehadiran digital." },
  { id: "c2", name: "Batik Lasem Nusantara", owner: "Hendra Gunawan", type: "UMKM · Fesyen", city: "Kendal", email: "cs@batiklasem.demo", whatsapp: "081234567802", verification: "approved", joinedAt: d(-90), about: "Produsen batik tulis Lasem yang mulai menjual ke pasar internasional." },
  { id: "c3", name: "Toko Elektronik Murah Jaya", owner: "Budi S.", type: "UMKM · Ritel", city: "Semarang", email: "tokomurahjaya@mail.demo", whatsapp: "081234567803", verification: "pending", joinedAt: d(-1), about: "" },
  { id: "c4", name: "AgriLink Startup", owner: "Fajar Nugroho", type: "Startup tahap awal", city: "Semarang", email: "team@agrilink.demo", whatsapp: "081234567804", verification: "approved", joinedAt: d(-75), about: "Startup yang menghubungkan petani sayur dengan restoran lokal." },
  { id: "c5", name: "Gerakan Peduli Pesisir", owner: "Maya Sari", type: "Komunitas", city: "Demak", email: "info@pedulipesisir.demo", whatsapp: "081234567805", verification: "approved", joinedAt: d(-60), about: "Komunitas relawan yang rutin menggelar bersih pantai dan edukasi lingkungan." },
  { id: "c6", name: "Laundry Kilat Ngaliyan", owner: "Siti Aminah", type: "UMKM · Jasa", city: "Semarang", email: "kilat.laundry@mail.demo", whatsapp: "081234567806", verification: "approved", joinedAt: d(-50), about: "Laundry kiloan dekat kampus dengan layanan antar-jemput." },
];

const ms = (...titles) => titles.map((title, i) => ({ id: `m${i + 1}`, title, done: false }));
const done = (list, n) => list.map((m, i) => ({ ...m, done: i < n }));

export const seedProjects = [
  // ===== Terbuka =====
  {
    id: "p1", clientId: "c1", title: "Desain 12 template feed Instagram untuk Kopi Senja", category: "desain",
    description: "Kami butuh satu set 12 template feed Instagram (promo, menu baru, quote, testimoni) dengan nuansa hangat dan konsisten. File akhir dalam format Canva atau Figma agar bisa kami edit sendiri.",
    deliverables: ["12 template feed 1080x1350", "File editable (Canva/Figma)", "Panduan warna & font singkat"],
    skills: ["Canva", "Figma", "Branding"], budgetMin: 400000, budgetMax: 600000, city: "Semarang", mode: "remote",
    deadline: d(12), durationDays: 10, level: "pemula", status: "open", moderation: "approved", createdAt: d(-3),
    applicants: [
      { id: "ap1", studentId: "s3", message: "Saya biasa mengerjakan identitas visual F&B. Bisa mulai minggu ini.", price: 550000, status: "pending", createdAt: d(-2) },
      { id: "ap2", studentId: "s8", message: "Saya mau coba, sedang membangun portofolio.", price: 300000, status: "pending", createdAt: d(-1) },
    ],
    hiredStudentId: null, price: 0, escrow: "none", milestones: [], review: null,
  },
  {
    id: "p2", clientId: "c2", title: "Landing page katalog koleksi batik (React / Tailwind)", category: "web",
    description: "Halaman katalog satu halaman yang menampilkan 20 produk batik unggulan dengan tombol pesan via WhatsApp, responsif di ponsel, dan memuat cepat.",
    deliverables: ["Landing page responsif", "Integrasi tombol WhatsApp", "Deploy ke Vercel/Netlify"],
    skills: ["React", "Tailwind CSS", "Responsive"], budgetMin: 800000, budgetMax: 1500000, city: "Kendal", mode: "remote",
    deadline: d(21), durationDays: 14, level: "menengah", status: "open", moderation: "approved", createdAt: d(-5),
    applicants: [
      { id: "ap3", studentId: "s1", message: "Pengalaman saya membuat landing page UMKM dan dashboard. Portofolio ada di profil.", price: 1200000, status: "pending", createdAt: d(-4) },
      { id: "ap4", studentId: "s4", message: "Saya biasa pakai React + Tailwind, siap revisi 2 kali.", price: 1000000, status: "pending", createdAt: d(-3) },
    ],
    hiredStudentId: null, price: 0, escrow: "none", milestones: [], review: null,
  },
  {
    id: "p3", clientId: "c6", title: "Admin Instagram & TikTok 1 bulan (3 konten/minggu)", category: "sosmed",
    description: "Mengelola akun Instagram dan TikTok laundry: membuat jadwal konten, caption, posting, serta membalas komentar. Materi foto/video disediakan atau diambil bersama.",
    deliverables: ["Kalender konten 1 bulan", "12 postingan terjadwal", "Laporan performa akhir bulan"],
    skills: ["Content planning", "Caption", "Canva"], budgetMin: 500000, budgetMax: 800000, city: "Semarang", mode: "hybrid",
    deadline: d(9), durationDays: 30, level: "pemula", status: "open", moderation: "approved", createdAt: d(-2),
    applicants: [{ id: "ap5", studentId: "s2", message: "Saya sudah mengelola 2 akun brand lokal. Bisa mulai pekan depan.", price: 700000, status: "pending", createdAt: d(-1) }],
    hiredStudentId: null, price: 0, escrow: "none", milestones: [], review: null,
  },
  {
    id: "p4", clientId: "c4", title: "Riset kompetitor & survei 30 calon pelanggan restoran", category: "data",
    description: "Kami ingin memahami harga, fitur, dan kelemahan 5 kompetitor serta menjaring masukan 30 pemilik restoran. Output berupa laporan ringkas dan rekap data.",
    deliverables: ["Matriks 5 kompetitor", "Rekap jawaban 30 responden (xlsx)", "Laporan ringkas 8–10 slide"],
    skills: ["Riset pasar", "Excel", "Presentasi"], budgetMin: 600000, budgetMax: 900000, city: "Semarang", mode: "remote",
    deadline: d(18), durationDays: 14, level: "pemula", status: "open", moderation: "approved", createdAt: d(-4),
    applicants: [], hiredStudentId: null, price: 0, escrow: "none", milestones: [], review: null,
  },
  {
    id: "p5", clientId: "c2", title: "Terjemahan katalog produk Indonesia ke Inggris (20 halaman)", category: "bahasa",
    description: "Menerjemahkan katalog batik beserta deskripsi bahan dan perawatan. Gaya bahasa profesional namun hangat, istilah batik tetap dipertahankan dengan penjelasan singkat.",
    deliverables: ["Dokumen terjemahan (docx)", "Daftar istilah batik", "1x revisi"],
    skills: ["Penerjemahan ID–EN", "Proofreading"], budgetMin: 350000, budgetMax: 500000, city: "Kendal", mode: "remote",
    deadline: d(10), durationDays: 7, level: "pemula", status: "open", moderation: "approved", createdAt: d(-6),
    applicants: [{ id: "ap6", studentId: "s6", message: "Saya mahasiswa Sastra Inggris dan terbiasa menerjemahkan dokumen produk.", price: 450000, status: "pending", createdAt: d(-5) }],
    hiredStudentId: null, price: 0, escrow: "none", milestones: [], review: null,
  },
  {
    id: "p6", clientId: "c5", title: "Panitia lapangan Festival Pesisir (2 hari)", category: "event",
    description: "Membutuhkan 6 panitia untuk registrasi peserta, pengarahan lokasi, dan dokumentasi ringan pada festival bersih pantai. Konsumsi dan transport lokal ditanggung.",
    deliverables: ["Hadir 2 hari penuh", "Mengelola meja registrasi", "Dokumentasi foto kegiatan"],
    skills: ["Komunikasi", "Registrasi", "Dokumentasi"], budgetMin: 300000, budgetMax: 400000, city: "Demak", mode: "onsite",
    deadline: d(26), durationDays: 2, level: "pemula", status: "open", moderation: "approved", createdAt: d(-1),
    applicants: [], hiredStudentId: null, price: 0, escrow: "none", milestones: [], review: null,
  },
  {
    id: "p7", clientId: "c1", title: "Copywriting: 10 caption + 3 artikel blog tentang kopi", category: "konten",
    description: "Menulis 10 caption Instagram dan 3 artikel blog (600–800 kata) tentang edukasi kopi susu dan cerita di balik gerai kami. Gaya santai dan relevan untuk anak muda.",
    deliverables: ["10 caption", "3 artikel 600–800 kata", "Ide judul & kata kunci SEO dasar"],
    skills: ["Copywriting", "SEO dasar"], budgetMin: 300000, budgetMax: 500000, city: "Semarang", mode: "remote",
    deadline: d(14), durationDays: 10, level: "pemula", status: "open", moderation: "approved", createdAt: d(-2),
    applicants: [{ id: "ap7", studentId: "s2", message: "Saya suka menulis tentang F&B. Contoh tulisan bisa saya kirim.", price: 400000, status: "pending", createdAt: d(-1) }],
    hiredStudentId: null, price: 0, escrow: "none", milestones: [], review: null,
  },
  {
    id: "p8", clientId: "c6", title: "Redesain logo dan stiker kemasan laundry", category: "desain",
    description: "Logo saat ini kurang terbaca. Butuh logo baru yang modern dan stiker kemasan untuk plastik laundry serta hanger tag.",
    deliverables: ["Logo (PNG & vektor)", "Desain stiker kemasan", "Mini brand guideline"],
    skills: ["Logo", "Ilustrator", "Kemasan"], budgetMin: 700000, budgetMax: 1200000, city: "Semarang", mode: "remote",
    deadline: d(20), durationDays: 14, level: "menengah", status: "open", moderation: "approved", createdAt: d(-7),
    applicants: [
      { id: "ap8", studentId: "s3", message: "Saya bisa mengerjakan paket logo dan kemasan sekaligus.", price: 950000, status: "pending", createdAt: d(-6) },
      { id: "ap9", studentId: "s1", message: "Saya bisa bantu riset visual dan eksplorasi 3 konsep logo.", price: 850000, status: "pending", createdAt: d(-5) },
    ],
    hiredStudentId: null, price: 0, escrow: "none", milestones: [], review: null,
  },

  // ===== Berjalan =====
  {
    id: "p9", clientId: "c4", title: "Website company profile AgriLink", category: "web",
    description: "Website company profile 5 halaman (Beranda, Tentang, Layanan, Mitra, Kontak) dengan CMS sederhana untuk memperbarui berita.",
    deliverables: ["5 halaman responsif", "Form kontak tersambung email", "Panduan memperbarui konten"],
    skills: ["React", "Supabase", "UI Design"], budgetMin: 1000000, budgetMax: 1500000, city: "Semarang", mode: "remote",
    deadline: d(11), durationDays: 21, level: "menengah", status: "in_progress", moderation: "approved", createdAt: d(-16),
    applicants: [{ id: "ap10", studentId: "s1", message: "Saya siap mengerjakan bertahap per halaman.", price: 1200000, status: "accepted", createdAt: d(-14) }],
    hiredStudentId: "s1", price: 1200000, escrow: "held",
    milestones: done(ms("Wireframe & desain disetujui", "Halaman Beranda & Tentang", "Halaman Layanan, Mitra, Kontak", "Uji coba & serah terima"), 2),
    review: null,
  },
  {
    id: "p10", clientId: "c1", title: "Konten TikTok 8 video promosi menu baru", category: "sosmed",
    description: "Membuat 8 video pendek (15–30 detik) untuk TikTok dan Reels dengan hook kuat. Bahan video direkam bersama barista.",
    deliverables: ["8 video final 9:16", "Naskah singkat per video", "Musik bebas hak cipta"],
    skills: ["CapCut", "Video pendek", "Storytelling"], budgetMin: 600000, budgetMax: 900000, city: "Semarang", mode: "hybrid",
    deadline: d(6), durationDays: 14, level: "menengah", status: "in_progress", moderation: "approved", createdAt: d(-13),
    applicants: [{ id: "ap11", studentId: "s2", message: "Saya sudah terbiasa membuat konten video pendek.", price: 800000, status: "accepted", createdAt: d(-12) }],
    hiredStudentId: "s2", price: 800000, escrow: "held",
    milestones: done(ms("Konsep & naskah", "Pengambilan video", "Penyuntingan 8 video"), 1),
    review: null, disputeId: "d1",
  },

  // ===== Menunggu persetujuan klien =====
  {
    id: "p11", clientId: "c1", title: "Desain menu digital (QR) 2 gerai", category: "desain",
    description: "Menu digital yang bisa diakses lewat QR code di meja, mudah dibaca di ponsel, dan konsisten dengan identitas Kopi Senja.",
    deliverables: ["Desain menu 2 gerai", "QR code siap cetak", "File sumber"],
    skills: ["Figma", "UI Design", "Print"], budgetMin: 500000, budgetMax: 700000, city: "Semarang", mode: "remote",
    deadline: d(3), durationDays: 10, level: "pemula", status: "review", moderation: "approved", createdAt: d(-12),
    applicants: [{ id: "ap12", studentId: "s1", message: "Saya bisa selesaikan dalam 10 hari.", price: 600000, status: "accepted", createdAt: d(-11) }],
    hiredStudentId: "s1", price: 600000, escrow: "held", submittedAt: d(-1),
    milestones: done(ms("Konsep & moodboard", "Desain menu", "Revisi & finalisasi"), 3),
    review: null,
  },

  // ===== Selesai =====
  {
    id: "p12", clientId: "c1", title: "Poster promo Grand Opening gerai kedua", category: "desain",
    description: "Poster promo ukuran A3 dan versi Instagram Story untuk pembukaan gerai kedua.",
    deliverables: ["Poster A3", "Versi Story 9:16", "File sumber"],
    skills: ["Poster", "Canva"], budgetMin: 300000, budgetMax: 400000, city: "Semarang", mode: "remote",
    deadline: d(-40), durationDays: 5, level: "pemula", status: "completed", moderation: "approved", createdAt: d(-52),
    applicants: [{ id: "ap13", studentId: "s1", message: "Siap mengerjakan.", price: 350000, status: "accepted", createdAt: d(-50) }],
    hiredStudentId: "s1", price: 350000, escrow: "released", completedAt: d(-41),
    milestones: done(ms("Konsep", "Desain", "Final"), 3),
    review: { rating: 5, text: "Hasilnya rapi dan cepat. Komunikasinya enak, revisinya juga sigap.", createdAt: d(-41) },
  },
  {
    id: "p13", clientId: "c4", title: "Dashboard laporan penjualan mingguan", category: "web",
    description: "Mengubah rekap penjualan di Excel menjadi dashboard web sederhana dengan grafik dan filter periode.",
    deliverables: ["Dashboard web", "Impor data CSV", "Dokumentasi singkat"],
    skills: ["React", "Chart", "CSV"], budgetMin: 800000, budgetMax: 1000000, city: "Semarang", mode: "remote",
    deadline: d(-28), durationDays: 14, level: "menengah", status: "completed", moderation: "approved", createdAt: d(-48),
    applicants: [{ id: "ap14", studentId: "s1", message: "Saya pernah membuat dashboard serupa.", price: 900000, status: "accepted", createdAt: d(-46) }],
    hiredStudentId: "s1", price: 900000, escrow: "released", completedAt: d(-29),
    milestones: done(ms("Desain dashboard", "Implementasi", "Uji & serah terima"), 3),
    review: { rating: 4, text: "Sesuai kebutuhan. Fitur filter sangat membantu tim kami.", createdAt: d(-29) },
  },
  {
    id: "p14", clientId: "c1", title: "Paket foto produk menu & logo ringan", category: "desain",
    description: "Penyuntingan 30 foto produk dan pembuatan watermark logo untuk dipakai di media sosial.",
    deliverables: ["30 foto disunting", "Watermark logo"],
    skills: ["Photoshop", "Lightroom"], budgetMin: 250000, budgetMax: 350000, city: "Semarang", mode: "remote",
    deadline: d(-60), durationDays: 5, level: "pemula", status: "completed", moderation: "approved", createdAt: d(-72),
    applicants: [{ id: "ap15", studentId: "s3", message: "Siap.", price: 300000, status: "accepted", createdAt: d(-70) }],
    hiredStudentId: "s3", price: 300000, escrow: "released", completedAt: d(-61),
    milestones: done(ms("Seleksi foto", "Penyuntingan"), 2),
    review: { rating: 5, text: "Warna fotonya jadi jauh lebih hidup.", createdAt: d(-61) },
  },
  {
    id: "p15", clientId: "c2", title: "Rekap & analisis penjualan batik 2 tahun", category: "data",
    description: "Membersihkan data penjualan dan membuat analisis produk terlaris per musim.",
    deliverables: ["Dataset bersih", "Laporan analisis"],
    skills: ["Excel", "Analisis data"], budgetMin: 500000, budgetMax: 700000, city: "Kendal", mode: "remote",
    deadline: d(-35), durationDays: 10, level: "menengah", status: "completed", moderation: "approved", createdAt: d(-50),
    applicants: [{ id: "ap16", studentId: "s5", message: "Siap dikerjakan.", price: 600000, status: "accepted", createdAt: d(-48) }],
    hiredStudentId: "s5", price: 600000, escrow: "released", completedAt: d(-36),
    milestones: done(ms("Pembersihan data", "Analisis", "Laporan"), 3),
    review: { rating: 5, text: "Insight-nya jelas dan langsung bisa dipakai menentukan stok.", createdAt: d(-36) },
  },

  // ===== Moderasi (untuk panel admin) =====
  {
    id: "p16", clientId: "c3", title: "Butuh pembuat website toko lengkap, budget kecil", category: "web",
    description: "Cari mahasiswa untuk membuat website toko online lengkap dengan pembayaran dan admin panel. Budget menyesuaikan.",
    deliverables: ["Website toko lengkap"],
    skills: ["Web"], budgetMin: 100000, budgetMax: 150000, city: "Semarang", mode: "remote",
    deadline: d(15), durationDays: 14, level: "menengah", status: "open", moderation: "pending", createdAt: d(-1),
    applicants: [], hiredStudentId: null, price: 0, escrow: "none", milestones: [], review: null,
  },
  {
    id: "p17", clientId: "c3", title: "Admin sosmed full time, bayaran per bulan Rp50 ribu", category: "sosmed",
    description: "Mengelola 5 akun media sosial setiap hari termasuk akhir pekan.",
    deliverables: ["Posting harian", "Balas komentar"],
    skills: ["Sosmed"], budgetMin: 50000, budgetMax: 50000, city: "Semarang", mode: "remote",
    deadline: d(8), durationDays: 30, level: "pemula", status: "open", moderation: "flagged", flagReason: "Dilaporkan mahasiswa: budget tidak sebanding dengan beban kerja.", createdAt: d(-3),
    applicants: [], hiredStudentId: null, price: 0, escrow: "none", milestones: [], review: null,
  },
];

export const seedDisputes = [
  {
    id: "d1", projectId: "p10", openedBy: "klien",
    reason: "Video ke-3 sampai ke-5 belum sesuai arahan dan revisi kedua belum dikirim melewati tenggat yang disepakati.",
    status: "open", resolution: null, createdAt: d(-2),
  },
];

export const seedPayouts = [{ id: "po1", studentId: "s1", amount: 500000, date: d(-27) }];

// Contoh data waitlist untuk tabel admin (data asli ada di Supabase).
const wlNames = ["Aulia Rahma", "Dimas Prakoso", "Putri Wulandari", "Ahmad Fauzi", "Rizky Ramadhan", "Nabila Zahra", "Galih Saputra", "Intan Permata", "Yoga Pranata", "Laila Nur Hidayah", "Adit Kurniawan", "Mega Safitri", "Fikri Hakim", "Tiara Anjani", "Bima Satria", "Rani Oktaviani", "Zaki Mubarak", "Sekar Ayu", "Hafidz Alfarizi", "Dinda Maharani"];
const wlRoles = ["mahasiswa", "mahasiswa", "umkm", "mahasiswa", "startup", "mahasiswa", "mahasiswa", "umkm", "mahasiswa", "komunitas"];
const wlWhere = ["UNNES", "Undip", "Udinus", "UIN Walisongo", "Unissula", "Polines", "USM", "Unika Soegijapranata"];
export const seedWaitlist = wlNames.map((name, i) => ({
  id: i + 1,
  name,
  role: wlRoles[i % wlRoles.length],
  origin: wlRoles[i % wlRoles.length] === "mahasiswa" ? wlWhere[i % wlWhere.length] : "Semarang & sekitarnya",
  email: `${name.split(" ")[0].toLowerCase().slice(0, 2)}***@mail.demo`,
  createdAt: d(-(wlNames.length - i) % 12),
}));
