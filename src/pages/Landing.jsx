import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BadgeCheck, Briefcase, CheckCircle2, ChevronDown, FileText, GraduationCap, Lock, MessageSquareQuote, Search, ShieldCheck, Store, TrendingUp, Users, Wallet,
} from "lucide-react";
import { iconByName } from "../lib/icons";
import WaitlistForm from "./landing/WaitlistForm";
import { Avatar, InstagramIcon } from "../components/ui";
import { brand, categories, faqs, fees, team } from "../config";
import { survey } from "../data/survey";
import { getWaitlistStats } from "../lib/waitlist";
import { cn, pct } from "../lib/format";

/* ---------------- Hero ---------------- */
function Hero() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    let alive = true;
    getWaitlistStats().then((s) => alive && setStats(s));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="bg-dots absolute inset-0" aria-hidden="true" />
      <div className="absolute -top-40 -right-32 size-[34rem] rounded-full bg-brand-600/30 blur-3xl" aria-hidden="true" />
      <div className="container-x relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-navy-100">
            <GraduationCap size={14} className="text-gold-400" /> Platform freelance khusus mahasiswa
          </span>
          <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Skill jadi karya,
            <br />
            <span className="text-gold-400">karya jadi cuan.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-200 sm:text-lg">
            SLance mempertemukan mahasiswa dengan UMKM, startup, dan komunitas yang butuh bantuan nyata. Kerjakan project sesuai levelmu, bangun portofolio otomatis, dan terima bayaran aman lewat escrow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#waitlist" className="btn btn-gold btn-lg">Join Waitlist <ArrowRight size={18} /></a>
            <Link to="/masuk" className="btn btn-lg border border-white/25 text-white hover:bg-white/10">Coba demo platform</Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-200">
            {["Hanya mahasiswa terverifikasi", "Dana aman lewat escrow", "Gratis untuk mendaftar"].map((t) => (
              <li key={t} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> {t}</li>
            ))}
          </ul>
          {stats && stats.total > 0 && (
            <p className="mt-6 text-sm text-navy-300">
              <span className="font-bold text-white">{stats.total}</span> orang sudah masuk waitlist
              {stats.mahasiswa > 0 && stats.bisnis > 0 && <> ({stats.mahasiswa} mahasiswa, {stats.bisnis} pelaku usaha)</>}.
            </p>
          )}
        </div>
        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="animate-floaty rounded-[2rem] border border-white/15 bg-white p-4 text-navy-900 shadow-pop">
        <div className="flex items-center justify-between px-1 pb-3">
          <img src="/logo/slance-logo.svg" alt="" className="h-6" />
          <span className="badge badge-green">● Terverifikasi</span>
        </div>
        <div className="space-y-3">
          {[
            { t: "Desain 12 template feed Instagram", c: "Kopi Senja · Semarang", b: "Rp400 rb – 600 rb", i: iconByName("Palette") },
            { t: "Landing page katalog batik", c: "Batik Lasem · Remote", b: "Rp800 rb – 1,5 jt", i: iconByName("Code2") },
          ].map(({ t, c, b, i: I }) => (
            <div key={t} className="rounded-2xl border border-navy-100 p-3.5">
              <div className="flex items-start gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><I size={18} /></span>
                <div className="min-w-0">
                  <p className="text-sm leading-snug font-bold">{t}</p>
                  <p className="text-xs text-navy-500">{c}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900">{b}</span>
                <span className="badge badge-green">Ramah pemula</span>
              </div>
            </div>
          ))}
          <div className="rounded-2xl bg-navy-900 p-3.5 text-white">
            <p className="flex items-center gap-2 text-xs font-bold text-gold-400"><Lock size={14} /> Safe Escrow</p>
            <p className="mt-1 text-sm font-semibold">Dana Rp1.260.000 ditahan aman</p>
            <div className="mt-2.5 h-1.5 rounded-full bg-white/15"><div className="h-full w-2/3 rounded-full bg-gold-500" /></div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-4 hidden rounded-2xl bg-white p-3 shadow-pop sm:block">
        <p className="flex items-center gap-2 text-xs font-bold text-navy-900"><BadgeCheck size={16} className="text-brand-600" /> Skill Badge Gold</p>
        <p className="text-[11px] text-navy-500">Web & Aplikasi · 5 project</p>
      </div>
    </div>
  );
}

/* ---------------- Masalah ---------------- */
function Problem() {
  const top = survey.kendala;
  return (
    <section id="masalah" className="scroll-mt-16 bg-white py-20">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">Masalah yang kami selesaikan</p>
          <h2 className="h-section mt-2">Mahasiswa butuh pengalaman, UMKM butuh tenaga terjangkau. Sayangnya mereka sulit bertemu.</h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="card card-pad">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><GraduationCap size={22} /></span>
            <h3 className="mt-4 text-lg font-extrabold">Sisi mahasiswa</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">Di platform global, mahasiswa harus bersaing dengan freelancer senior yang sudah punya nama. Tanpa portofolio nyata, sulit mendapat klien pertama.</p>
            <ul className="mt-5 space-y-3">
              {top.map((k) => (
                <li key={k.label}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-navy-800">{k.label}</span>
                    <span className="font-bold tabular-nums text-navy-900">{k.count} dari {survey.n}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-navy-100"><div className="h-full rounded-full bg-brand-600" style={{ width: `${pct(k.count, survey.n)}%` }} /></div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-navy-500">Sumber: survei kepada {survey.n} mahasiswa, boleh memilih lebih dari satu kendala.</p>
          </div>
          <div className="card card-pad">
            <span className="flex size-11 items-center justify-center rounded-xl bg-gold-100 text-amber-700"><Store size={22} /></span>
            <h3 className="mt-4 text-lg font-extrabold">Sisi UMKM, startup & komunitas</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">Budget terbatas membuat agensi terlalu mahal, sementara mempercayakan pekerjaan ke orang yang belum dikenal terasa berisiko.</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["Agensi dan freelancer profesional sering di luar jangkauan budget.", Wallet],
                ["Khawatir uang sudah dibayar tetapi hasil tidak sesuai atau tidak selesai.", ShieldCheck],
                ["Sulit menilai kemampuan mahasiswa yang belum punya rekam jejak.", Search],
              ].map(([t, I]) => (
                <li key={t} className="flex gap-3"><I size={18} className="mt-0.5 shrink-0 text-amber-600" /><span className="text-navy-700">{t}</span></li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-navy-50 px-4 py-3 text-xs leading-relaxed text-navy-600">
              <b className="text-navy-800">Catatan:</b> data sisi UMKM sedang kami kumpulkan lewat wawancara langsung. Pernyataan di atas adalah hipotesis awal tim yang kami uji bersama waitlist.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Cara kerja ---------------- */
function HowItWorks() {
  const [side, setSide] = useState("mahasiswa");
  const flows = {
    mahasiswa: [
      { i: FileText, t: "Daftar & verifikasi", d: "Gunakan email kampus (.ac.id), unggah KTM, dan pilih kampusmu." },
      { i: Search, t: "Pilih project", d: "Cari dengan filter kategori, kota, level, dan estimasi honor. Lihat rekomendasi yang cocok denganmu." },
      { i: Wallet, t: "Kerjakan & terima bayaran", d: "Dana sudah ditahan escrow sebelum kamu mulai. Setelah disetujui, honor cair, dan project masuk portofolio otomatis." },
    ],
    klien: [
      { i: Briefcase, t: "Posting kebutuhan", d: "Tulis project, budget, dan tenggat. Gratis, tanpa biaya posting." },
      { i: Users, t: "Pilih mahasiswa", d: "Bandingkan pelamar lewat portofolio, skill badge, dan rating dari klien sebelumnya." },
      { i: ShieldCheck, t: "Danai escrow & setujui", d: "Dana ditahan aman. Cairkan hanya setelah hasil sesuai. Jika ada masalah, admin SLance menengahi." },
    ],
  };
  return (
    <section id="cara-kerja" className="scroll-mt-16 bg-navy-50/70 py-20">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Cara kerja</p>
          <h2 className="h-section mt-2">Tiga langkah, dua sisi</h2>
        </div>
        <div className="mx-auto mt-8 flex w-fit rounded-2xl bg-white p-1 shadow-card" role="tablist">
          {[["mahasiswa", "Saya mahasiswa"], ["klien", "Saya UMKM / startup"]].map(([id, label]) => (
            <button key={id} role="tab" aria-selected={side === id} onClick={() => setSide(id)} className={cn("cursor-pointer rounded-xl px-5 py-2.5 text-sm font-bold transition", side === id ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-50")}>{label}</button>
          ))}
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {flows[side].map((s, idx) => (
            <li key={s.t} className="card card-pad relative">
              <span className="absolute top-5 right-5 text-5xl font-extrabold text-navy-100">{idx + 1}</span>
              <span className="flex size-11 items-center justify-center rounded-xl bg-navy-900 text-white"><s.i size={20} /></span>
              <h3 className="mt-4 text-lg font-extrabold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Fitur ---------------- */
function Features() {
  const main = [
    { i: BadgeCheck, t: "Skill Badge", d: "Setiap project selesai menambah progres badge Bronze, Silver, Gold per kategori. Klien langsung melihat keahlian yang terbukti, bukan sekadar klaim.", tone: "bg-brand-100 text-brand-700" },
    { i: FileText, t: "Auto-Portfolio", d: "Project selesai dan ulasan klien otomatis menjadi halaman portofolio publik. Tidak perlu repot menyusun CV portofolio dari nol.", tone: "bg-gold-100 text-amber-700" },
    { i: Lock, t: "Safe Escrow", d: "Dana klien ditahan SLance dan baru dicairkan setelah hasil disetujui. Mahasiswa pasti dibayar, klien pasti mendapat hasil.", tone: "bg-emerald-100 text-emerald-700" },
  ];
  const more = [
    ["Filter pencarian lengkap", "Kategori, kota, mode kerja, level, dan rentang honor."],
    ["Estimasi honor di setiap project", "Budget transparan sebelum melamar."],
    ["Rekomendasi project", "Disusun dari skill dan lokasimu."],
    ["Review & rating klien", "Membangun reputasi sejak project pertama."],
    ["Tenggat dan tahapan jelas", "Milestone terlihat oleh kedua pihak."],
    ["Panduan untuk pemula", "Cara melamar, menawar harga, dan berkomunikasi dengan klien."],
  ];
  return (
    <section id="fitur" className="scroll-mt-16 bg-white py-20">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">Fitur</p>
          <h2 className="h-section mt-2">Dirancang dari keluhan mahasiswa sendiri</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {main.map((f) => (
            <div key={f.t} className="card card-pad">
              <span className={cn("flex size-12 items-center justify-center rounded-2xl", f.tone)}><f.i size={24} /></span>
              <h3 className="mt-5 text-xl font-extrabold">{f.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{f.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-3xl bg-navy-50 p-6 sm:p-8">
          <p className="text-sm font-bold text-navy-900">Dan fitur yang diminta responden survei kami:</p>
          <ul className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {more.map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <div><p className="text-sm font-bold text-navy-900">{t}</p><p className="text-sm text-navy-600">{d}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Kategori ---------------- */
function Categories() {
  return (
    <section id="kategori" className="scroll-mt-16 bg-navy-50/70 py-20">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">Kategori jasa</p>
          <h2 className="h-section mt-2">Dari desain sampai event, sesuai jurusanmu</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const I = iconByName(c.icon);
            return (
              <div key={c.id} className="card card-pad transition hover:border-brand-300">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><I size={20} /></span>
                <h3 className="mt-4 text-[15px] font-bold">{c.label}</h3>
                <p className="mt-1.5 text-sm text-navy-600">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Biaya ---------------- */
function Pricing() {
  const c = Math.round(fees.clientRate * 100);
  const s = Math.round(fees.studentRate * 100);
  const sample = 1_000_000;
  const rp = (n) => new Intl.NumberFormat("id-ID").format(n);
  return (
    <section id="biaya" className="scroll-mt-16 bg-white py-20">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Biaya transparan</p>
          <h2 className="h-section mt-2">Gratis bergabung. Komisi hanya saat project berhasil.</h2>
          <p className="mt-4 text-navy-600">Tidak ada biaya pendaftaran, biaya posting, atau biaya bulanan. SLance baru mendapat pendapatan ketika project selesai dan dana dicairkan.</p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex gap-3"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" /><span><b>Klien</b> membayar biaya layanan <b>{c}%</b> di atas harga project.</span></li>
            <li className="flex gap-3"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" /><span><b>Mahasiswa</b> dipotong komisi <b>{s}%</b> dari honor.</span></li>
          </ul>
        </div>
        <div className="card card-pad">
          <p className="text-xs font-bold tracking-wide text-navy-500 uppercase">Contoh project Rp{rp(sample)}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-navy-50 p-4">
              <p className="text-xs font-semibold text-navy-500">Klien membayar</p>
              <p className="mt-1 text-2xl font-extrabold">Rp{rp(sample * (1 + fees.clientRate))}</p>
              <p className="text-xs text-navy-500">harga + biaya layanan {c}%</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold text-emerald-800">Mahasiswa menerima</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-900">Rp{rp(sample * (1 - fees.studentRate))}</p>
              <p className="text-xs text-emerald-800">honor − komisi {s}%</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-navy-500">Pendapatan SLance dari project ini: Rp{rp(sample * (fees.clientRate + fees.studentRate))} ({c + s}% dari harga).</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Validasi ---------------- */
function Validation() {
  const Bar = ({ label, count }) => (
    <li>
      <div className="flex items-center justify-between gap-3 text-sm"><span className="text-navy-700">{label}</span><span className="font-bold tabular-nums">{count}</span></div>
      <div className="mt-1 h-2 rounded-full bg-navy-100"><div className="h-full rounded-full bg-navy-800" style={{ width: `${pct(count, survey.n)}%` }} /></div>
    </li>
  );
  const quotes = [
    "Harapannya platform ini dapat menemukan solusi dari masalah bagaimana client dapat mempercayakan bisnis atau usahanya ke mahasiswa yang belum memiliki portofolio, namun sama-sama menguntungkan di kedua belah pihak.",
    "Saran untuk menambahkan filter daerah tempat kerja dan estimasi salary yang didapatkan.",
    "Bakal lebih bagus kalau ada fitur rekomendasi proyek, sistem review dari klien, dan informasi deadline yang jelas. Kalau bisa ada panduan untuk mahasiswa yang baru pertama kali ambil proyek freelance.",
  ];
  return (
    <section id="validasi" className="scroll-mt-16 bg-navy-950 py-20 text-white">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow !text-gold-400">Validasi pasar</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Hasil survei awal kepada {survey.n} mahasiswa</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [`${survey.minatAvg.toLocaleString("id-ID")} / 5`, "rata-rata minat bergabung ke platform"],
            [`${survey.bersedia} dari ${survey.n}`, "bersedia ambil project berbayar kecil demi portofolio"],
            [`${survey.portofolioAvg.toLocaleString("id-ID")} / 5`, "rata-rata pentingnya portofolio sebelum lulus"],
            [`${survey.belumTapiIngin} dari ${survey.n}`, "belum pernah freelance, tetapi ingin mencoba"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-gold-400">{v}</p>
              <p className="mt-2 text-sm text-navy-200">{l}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 text-navy-900">
            <h3 className="font-extrabold">Motivasi utama bergabung</h3>
            <ul className="mt-4 space-y-3">{survey.motivasi.map((m) => <Bar key={m.label} {...m} />)}</ul>
          </div>
          <div className="rounded-2xl bg-white p-6 text-navy-900">
            <h3 className="font-extrabold">Keahlian yang ditawarkan</h3>
            <ul className="mt-4 space-y-3">{survey.skills.map((m) => <Bar key={m.label} {...m} />)}</ul>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <MessageSquareQuote size={20} className="text-gold-400" />
              <blockquote className="mt-3 text-sm leading-relaxed text-navy-100">“{q}”</blockquote>
              <figcaption className="mt-3 text-xs text-navy-400">Responden survei, mahasiswa</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-xs text-navy-400">Metode: Google Form kepada mahasiswa (sebagian besar UNNES, Sistem Informasi; {survey.unnes} dari {survey.n} responden). Hasil ini indikasi awal, bukan sampel representatif nasional.</p>
      </div>
    </section>
  );
}

/* ---------------- Tim ---------------- */
function Team() {
  return (
    <section id="tim" className="scroll-mt-16 bg-white py-20">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Tim kami</p>
          <h2 className="h-section mt-2">Mahasiswa yang membangun untuk mahasiswa</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.slug} className="card card-pad text-center">
              <TeamPhoto member={m} />
              <h3 className="mt-4 font-extrabold">{m.name}</h3>
              <p className="text-sm font-semibold text-brand-700">{m.role}</p>
              <p className="mt-2 text-sm text-navy-600">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamPhoto({ member }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Avatar name={member.name} size={96} className="mx-auto" />;
  return <img src={`/team/${member.slug}.jpg`} alt={member.name} onError={() => setFailed(true)} className="mx-auto size-24 rounded-full object-cover" />;
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="scroll-mt-16 bg-navy-50/70 py-20">
      <div className="container-x max-w-3xl">
        <div className="text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="h-section mt-2">Pertanyaan yang sering muncul</h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="card overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="font-bold text-navy-900">{f.q}</span>
                <ChevronDown size={20} className={cn("shrink-0 text-navy-500 transition", open === i && "rotate-180")} />
              </button>
              {open === i && <p className="px-5 pb-5 text-sm leading-relaxed text-navy-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Waitlist ---------------- */
function WaitlistSection() {
  return (
    <section id="waitlist" className="relative scroll-mt-16 overflow-hidden bg-navy-900 py-20 text-white">
      <div className="bg-dots absolute inset-0" aria-hidden="true" />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="eyebrow !text-gold-400">Pra-peluncuran</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">Jadi yang pertama masuk, dapatkan nomor antrian.</h2>
          <p className="mt-4 max-w-lg text-navy-200">Pengguna awal mendapat akses lebih dulu dan membantu kami menentukan fitur yang dibangun berikutnya.</p>
          <ul className="mt-6 space-y-2.5 text-sm text-navy-100">
            {["Akses awal sebelum peluncuran publik", "Kesempatan jadi freelancer atau klien pertama", "Ikut menentukan fitur lewat masukanmu"].map((t) => (
              <li key={t} className="flex items-center gap-2.5"><TrendingUp size={16} className="text-gold-400" /> {t}</li>
            ))}
          </ul>
          <a href={brand.instagram.url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy-100 hover:text-white"><InstagramIcon size={18} /> Ikuti kami {brand.instagram.handle}</a>
        </div>
        <div className="rounded-3xl bg-white p-6 text-navy-900 shadow-pop sm:p-8">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Categories />
      <Pricing />
      <Validation />
      <Team />
      <FAQ />
      <WaitlistSection />
    </>
  );
}
