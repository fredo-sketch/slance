import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Briefcase, GraduationCap, Info, ShieldCheck, Upload, CheckCircle2 } from "lucide-react";
import { Field, Logo } from "../components/ui";
import { homeFor } from "../components/Layout";
import { useStore, useToast } from "../store/StoreContext";
import { campuses, cities, isCampusEmail } from "../config";
import { cn, dayOffset, uid } from "../lib/format";

function AuthShell({ title, desc, children, wide }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-navy-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-dots absolute inset-0" aria-hidden="true" />
        <div className="relative"><Logo variant="wordmark" light className="h-8" /></div>
        <div className="relative">
          <p className="text-3xl leading-tight font-extrabold">Skill jadi karya,<br /><span className="text-gold-400">karya jadi cuan.</span></p>
          <ul className="mt-8 space-y-3 text-sm text-navy-200">
            {["Hanya mahasiswa terverifikasi", "Dana aman lewat Safe Escrow", "Portofolio tersusun otomatis"].map((t) => (
              <li key={t} className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400" /> {t}</li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-navy-400">Tahap pra-peluncuran · mode demo</p>
      </aside>
      <div className="flex items-center justify-center bg-white px-5 py-10 sm:px-8">
        <div className={cn("w-full", wide ? "max-w-xl" : "max-w-md")}>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-navy-600">{desc}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}

const DemoNote = () => (
  <div className="flex gap-3 rounded-xl bg-brand-50 px-4 py-3 text-xs leading-relaxed text-brand-900">
    <Info size={16} className="mt-0.5 shrink-0" />
    <p>Ini mode demo: data berupa contoh dan akun yang kamu buat hanya tersimpan di browser ini. Login sungguhan lewat Supabase Auth akan diaktifkan di tahap berikutnya.</p>
  </div>
);

/* ---------------- Masuk ---------------- */
export function Login() {
  const { actions, role } = useStore();
  const nav = useNavigate();
  if (role) return <Navigate to={homeFor(role)} replace />;

  const enter = (r) => {
    actions.loginDemo(r);
    nav(homeFor(r));
  };
  const options = [
    { r: "mahasiswa", i: GraduationCap, t: "Mahasiswa (freelancer)", d: "Nadia Safitri · Sistem Informasi UNNES", tone: "bg-brand-100 text-brand-700" },
    { r: "klien", i: Briefcase, t: "Klien (UMKM / startup)", d: "Kopi Senja Semarang · Kafe", tone: "bg-gold-100 text-amber-700" },
    { r: "admin", i: ShieldCheck, t: "Admin SLance", d: "Verifikasi, moderasi, escrow & sengketa", tone: "bg-navy-100 text-navy-800" },
  ];
  return (
    <AuthShell title="Masuk ke SLance" desc="Pilih peran untuk mencoba tampilan platform dengan data contoh.">
      <div className="space-y-3">
        {options.map((o) => (
          <button key={o.r} onClick={() => enter(o.r)} className="card card-pad flex w-full cursor-pointer items-center gap-4 text-left transition hover:border-brand-400 hover:shadow-pop">
            <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", o.tone)}><o.i size={24} /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold text-navy-900">{o.t}</span>
              <span className="block truncate text-sm text-navy-600">{o.d}</span>
            </span>
            <ArrowRight size={18} className="shrink-0 text-navy-400" />
          </button>
        ))}
      </div>
      <div className="mt-5"><DemoNote /></div>
      <p className="mt-6 text-center text-sm text-navy-600">Belum punya akun? <Link to="/daftar" className="font-bold text-brand-700 hover:underline">Daftar sekarang</Link></p>
    </AuthShell>
  );
}

/* ---------------- Daftar ---------------- */
export function Register() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get("peran") === "klien" ? "klien" : "mahasiswa");
  const { actions, role: current } = useStore();
  const toast = useToast();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", campus: "", major: "", semester: "3", city: "Semarang", bio: "", ktm: null, owner: "", type: "UMKM", about: "", whatsapp: "" });
  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);

  if (current) return <Navigate to={homeFor(current)} replace />;
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const isStudent = role === "mahasiswa";

  const onKtm = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type) && file.type !== "application/pdf") return setErrors((x) => ({ ...x, ktm: "Gunakan file JPG, PNG, WebP, atau PDF." }));
    if (file.size > 3 * 1024 * 1024) return setErrors((x) => ({ ...x, ktm: "Ukuran file maksimal 3 MB." }));
    setErrors((x) => ({ ...x, ktm: undefined }));
    setF((s) => ({ ...s, ktm: file.name }));
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (f.name.trim().length < 2) e.name = "Isi nama lengkap.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Format email belum benar.";
    if (isStudent) {
      if (!isCampusEmail(f.email)) e.email = "Wajib memakai email kampus berakhiran .ac.id.";
      if (!f.campus) e.campus = "Pilih kampus.";
      if (f.major.trim().length < 2) e.major = "Isi program studi.";
      if (!f.ktm) e.ktm = "Unggah foto KTM untuk verifikasi.";
    } else {
      if (f.owner.trim().length < 2) e.owner = "Isi nama pemilik / penanggung jawab.";
      if (!/^0\d{8,13}$/.test(f.whatsapp.replace(/[\s-]/g, ""))) e.whatsapp = "Isi nomor WhatsApp aktif (08xxxxxxxxxx).";
    }
    if (!agree) e.agree = "Setujui ketentuan untuk melanjutkan.";
    setErrors(e);
    if (Object.keys(e).length) return;

    if (isStudent) {
      actions.registerStudent({
        id: uid("s"), username: f.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + uid("").slice(0, 3),
        name: f.name.trim(), email: f.email.trim().toLowerCase(), campus: f.campus, major: f.major.trim(), semester: Number(f.semester),
        city: f.city, bio: f.bio.trim() || "Mahasiswa yang sedang membangun portofolio lewat SLance.", skills: [], verification: "pending", ktm: true, ktmName: f.ktm, joinedAt: dayOffset(0),
      });
      toast("Pendaftaran berhasil. Akunmu menunggu verifikasi admin.");
      nav("/mahasiswa");
    } else {
      actions.registerClient({
        id: uid("c"), name: f.name.trim(), owner: f.owner.trim(), type: f.type, city: f.city, email: f.email.trim().toLowerCase(), whatsapp: f.whatsapp.trim(),
        verification: "pending", joinedAt: dayOffset(0), about: f.about.trim(),
      });
      toast("Pendaftaran berhasil. Akunmu menunggu verifikasi admin.");
      nav("/klien");
    }
  };

  return (
    <AuthShell wide title="Buat akun SLance" desc="Gratis. Pilih peranmu, lalu lengkapi data singkat.">
      <div className="mb-6 grid grid-cols-2 gap-2" role="tablist">
        {[["mahasiswa", "Mahasiswa", GraduationCap], ["klien", "UMKM / Startup / Komunitas", Briefcase]].map(([id, label, I]) => (
          <button key={id} type="button" role="tab" aria-selected={role === id} onClick={() => { setRole(id); setErrors({}); }} className={cn("flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition", role === id ? "border-navy-900 bg-navy-900 text-white" : "border-navy-200 text-navy-700 hover:bg-navy-50")}>
            <I size={18} /> {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label={isStudent ? "Nama lengkap" : "Nama usaha / komunitas"} error={errors.name} required>
          <input className="input" value={f.name} onChange={set("name")} autoComplete={isStudent ? "name" : "organization"} />
        </Field>
        {!isStudent && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama penanggung jawab" error={errors.owner} required><input className="input" value={f.owner} onChange={set("owner")} /></Field>
            <Field label="Jenis" required>
              <select className="input" value={f.type} onChange={set("type")}>
                {["UMKM", "Startup", "Komunitas", "Organisasi"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
        )}
        <Field label={isStudent ? "Email kampus" : "Email"} error={errors.email} hint={isStudent ? "Wajib berakhiran .ac.id, mis. nama@mhs.unnes.ac.id" : undefined} required>
          <input className="input" type="email" value={f.email} onChange={set("email")} autoComplete="email" />
        </Field>

        {isStudent ? (
          <>
            <Field label="Kampus" error={errors.campus} required>
              <select className="input" value={f.campus} onChange={set("campus")}>
                <option value="">Pilih kampus…</option>
                {campuses.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
              <Field label="Program studi" error={errors.major} required><input className="input" value={f.major} onChange={set("major")} placeholder="Mis. Sistem Informasi" /></Field>
              <Field label="Semester">
                <select className="input" value={f.semester} onChange={set("semester")}>{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => <option key={n}>{n}</option>)}</select>
              </Field>
            </div>
            <Field label="Foto KTM" error={errors.ktm} hint="Dipakai admin untuk memastikan kamu mahasiswa aktif. JPG/PNG/PDF, maks. 3 MB." required>
              <label className={cn("flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3.5 text-sm transition hover:bg-navy-50", f.ktm ? "border-emerald-400 bg-emerald-50" : "border-navy-300")}>
                {f.ktm ? <CheckCircle2 size={20} className="shrink-0 text-emerald-600" /> : <Upload size={20} className="shrink-0 text-navy-500" />}
                <span className="min-w-0 flex-1 truncate font-semibold text-navy-800">{f.ktm || "Pilih file KTM…"}</span>
                <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={onKtm} className="sr-only" />
              </label>
            </Field>
          </>
        ) : (
          <>
            <Field label="WhatsApp" error={errors.whatsapp} required><input className="input" inputMode="tel" value={f.whatsapp} onChange={set("whatsapp")} placeholder="08xxxxxxxxxx" /></Field>
            <Field label="Tentang usaha (opsional)"><textarea className="input min-h-20" value={f.about} onChange={set("about")} maxLength={300} /></Field>
          </>
        )}
        <Field label="Kota">
          <select className="input" value={f.city} onChange={set("city")}>{cities.map((c) => <option key={c}>{c}</option>)}</select>
        </Field>

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-navy-700">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-4 accent-brand-600" />
            <span>Saya menyetujui ketentuan penggunaan SLance, termasuk verifikasi data dan komisi platform.</span>
          </label>
          {errors.agree && <p className="mt-1 text-xs font-medium text-red-600">{errors.agree}</p>}
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-full">Daftar</button>
      </form>
      <div className="mt-5"><DemoNote /></div>
      <p className="mt-6 text-center text-sm text-navy-600">Sudah punya akun? <Link to="/masuk" className="font-bold text-brand-700 hover:underline">Masuk</Link></p>
    </AuthShell>
  );
}
