// Konfigurasi terpusat SLance. Ubah angka/teks di sini, tampilan ikut berubah.

export const brand = {
  name: "SLance",
  tagline: "Skill jadi karya, karya jadi cuan",
  subtitle: "Student Freelance",
  description:
    "Platform freelance khusus mahasiswa yang mempertemukan talenta kampus dengan UMKM, startup, dan komunitas. Bangun portofolio nyata, dapat penghasilan, dan tetap aman lewat rekening bersama (escrow).",
  instagram: { handle: "@slance.id", url: "https://www.instagram.com/slance.id/" },
  course: "Proyek mata kuliah Bisnis Digital · Kelompok 5",
};

// Komisi platform (ditampilkan di landing page & dipakai simulasi escrow).
// 0.05 = 5%. Mahasiswa dipotong dari honor, klien membayar biaya layanan di atas harga project.
export const fees = {
  studentRate: 0.05,
  clientRate: 0.05,
};

export const categories = [
  { id: "desain", label: "Desain Grafis & UI/UX", short: "Desain", icon: "Palette", desc: "Logo, feed Instagram, poster, kemasan, UI aplikasi." },
  { id: "web", label: "Web & Aplikasi", short: "Web & App", icon: "Code2", desc: "Landing page, company profile, dashboard, toko online." },
  { id: "konten", label: "Penulisan & Copywriting", short: "Konten", icon: "PenLine", desc: "Caption, artikel blog, deskripsi produk, naskah." },
  { id: "sosmed", label: "Sosial Media & Digital Marketing", short: "Sosmed", icon: "Megaphone", desc: "Kelola akun, konten bulanan, iklan Meta & TikTok." },
  { id: "data", label: "Data & Riset", short: "Data & Riset", icon: "BarChart3", desc: "Survei pelanggan, riset kompetitor, olah data & laporan." },
  { id: "bahasa", label: "Penerjemahan & Asisten Akademik", short: "Bahasa", icon: "Languages", desc: "Terjemahan katalog, proofreading, rangkuman." },
  { id: "event", label: "Event Staff & Komunitas", short: "Event", icon: "CalendarCheck", desc: "Panitia, registrasi, dokumentasi, MC acara." },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

export const levels = {
  pemula: { label: "Ramah pemula", badge: "badge-green" },
  menengah: { label: "Menengah", badge: "badge-blue" },
};

export const workModes = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "Tatap muka",
};

// Level badge skill dihitung otomatis dari jumlah project selesai pada kategori tersebut.
export const badgeLevels = [
  { id: "bronze", label: "Bronze", min: 1, color: "#b9733a" },
  { id: "silver", label: "Silver", min: 3, color: "#7b8794" },
  { id: "gold", label: "Gold", min: 5, color: "#d99700" },
];

export const cities = [
  "Semarang",
  "Ungaran",
  "Demak",
  "Kendal",
  "Salatiga",
  "Kudus",
  "Surakarta",
  "Yogyakarta",
  "Jakarta",
  "Bandung",
  "Surabaya",
];

export const campuses = [
  "Universitas Negeri Semarang (UNNES)",
  "Universitas Diponegoro (Undip)",
  "Universitas Dian Nuswantoro (Udinus)",
  "UIN Walisongo Semarang",
  "Universitas Katolik Soegijapranata",
  "Politeknik Negeri Semarang (Polines)",
  "Universitas Islam Sultan Agung (Unissula)",
  "Universitas Muhammadiyah Semarang",
  "Universitas Semarang (USM)",
  "Universitas Gadjah Mada (UGM)",
  "Universitas Negeri Yogyakarta (UNY)",
  "Universitas Sebelas Maret (UNS)",
  "Universitas Indonesia (UI)",
  "Institut Teknologi Bandung (ITB)",
  "Institut Teknologi Sepuluh Nopember (ITS)",
  "Universitas Airlangga (Unair)",
  "Universitas Brawijaya (UB)",
  "Universitas Telkom",
  "Bina Nusantara University (BINUS)",
  "Kampus lainnya",
];

// TEMPLATE: ganti `name` dengan nama anggota, lalu taruh foto di public/team/<slug>.jpg
// (rasio persegi). Kalau foto belum ada, otomatis tampil inisial.
export const team = [
  { slug: "anggota-1", name: "Nama Anggota 1", role: "CEO / Product Manager", desc: "Arah produk, prioritas fitur, dan strategi bisnis SLance." },
  { slug: "anggota-2", name: "Nama Anggota 2", role: "Chief Marketing Officer", desc: "Pemasaran, komunitas kampus, dan akuisisi pengguna awal." },
  { slug: "anggota-3", name: "Nama Anggota 3", role: "Chief Technology Officer", desc: "Arsitektur platform, pengembangan web, dan keamanan data." },
  { slug: "anggota-4", name: "Nama Anggota 4", role: "Chief Financial Officer", desc: "Model pendapatan, skema escrow, dan perencanaan keuangan." },
];

export const faqs = [
  {
    q: "Siapa yang bisa daftar sebagai freelancer?",
    a: "Mahasiswa aktif dari kampus mana pun. Pendaftaran wajib memakai email kampus (berakhiran .ac.id), mengunggah foto KTM, dan memilih kampus. Tim kami memverifikasi data sebelum akun aktif.",
  },
  {
    q: "Apakah saya akan bersaing dengan freelancer profesional?",
    a: "Tidak. Di SLance semua freelancer adalah mahasiswa terverifikasi, dan project diberi label level (ramah pemula atau menengah) sehingga cocok dengan kemampuanmu.",
  },
  {
    q: "Bagaimana uang saya dijamin aman?",
    a: "Setiap project memakai Safe Escrow (rekening bersama). Klien mendanai di awal, dana ditahan SLance, dan baru dicairkan ke mahasiswa setelah hasil kerja disetujui. Jika ada sengketa, admin SLance membantu menengahi.",
  },
  {
    q: "Berapa komisi yang diambil SLance?",
    a: "Mahasiswa dipotong 5% dari honor project, klien membayar biaya layanan 5% di atas harga project. Mendaftar dan memasang project gratis.",
  },
  {
    q: "Saya UMKM dengan budget terbatas, apakah cocok?",
    a: "Sangat cocok. Kamu menentukan rentang budget sendiri dan akan mendapat lamaran dari mahasiswa yang ingin membangun portofolio, dengan harga yang jauh lebih terjangkau dibanding agensi.",
  },
  {
    q: "Apakah pembayaran sudah bisa dipakai sekarang?",
    a: "SLance masih tahap pra-peluncuran. Saat ini kamu bisa bergabung ke waitlist dan mencoba demo platform dengan data contoh. Payment gateway akan diaktifkan menjelang peluncuran.",
  },
];

export const isCampusEmail = (email = "") => /^[^\s@]+@([a-z0-9-]+\.)*ac\.id$/i.test(email.trim());
