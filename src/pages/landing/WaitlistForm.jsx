import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Field } from "../../components/ui";
import { campuses, isCampusEmail } from "../../config";
import { joinWaitlist } from "../../lib/waitlist";
import { useStore } from "../../store/StoreContext";
import { cn } from "../../lib/format";

const roles = [
  { id: "mahasiswa", label: "Mahasiswa", hint: "Cari project & bangun portofolio" },
  { id: "umkm", label: "UMKM", hint: "Cari talenta terjangkau" },
  { id: "startup", label: "Startup", hint: "Butuh tenaga fleksibel" },
  { id: "komunitas", label: "Komunitas", hint: "Butuh panitia & kreator" },
];

export default function WaitlistForm({ onJoined }) {
  const { actions } = useStore();
  const [role, setRole] = useState("mahasiswa");
  const [form, setForm] = useState({ fullName: "", email: "", whatsapp: "", campus: "", businessName: "", interest: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState(null);

  const isStudent = role === "mahasiswa";
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (form.fullName.trim().length < 2) e.fullName = "Isi nama lengkap.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Format email belum benar.";
    else if (isStudent && !isCampusEmail(form.email)) e.email = "Mahasiswa memakai email kampus berakhiran .ac.id.";
    if (isStudent && !form.campus) e.campus = "Pilih kampus kamu.";
    if (!isStudent && form.businessName.trim().length < 2) e.businessName = "Isi nama usaha atau komunitas.";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setServerError("");
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      const res = await joinWaitlist({ role, ...form });
      setResult(res);
      actions.addWaitlist({
        name: form.fullName.trim(),
        role,
        origin: isStudent ? form.campus : form.businessName.trim(),
        email: form.email.trim().replace(/^(.{2}).*(@.*)$/, "$1***$2"),
        createdAt: new Date().toISOString().slice(0, 10),
      });
      onJoined?.(res);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="text-center" role="status">
        <CheckCircle2 className="mx-auto text-emerald-600" size={44} />
        <h3 className="mt-4 text-xl font-extrabold text-navy-900">{result.alreadyRegistered ? "Email ini sudah terdaftar" : "Kamu masuk waitlist!"}</h3>
        <p className="mt-1 text-sm text-navy-600">Nomor antrian kamu</p>
        <p className="mt-1 text-5xl font-extrabold tracking-tight text-brand-700">#{String(result.position).padStart(3, "0")}</p>
        <p className="mx-auto mt-4 max-w-xs text-sm text-navy-600">Kami akan menghubungi lewat email saat SLance dibuka. Ajak temanmu agar antrian kalian berdekatan.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <fieldset>
        <legend className="label">Saya mendaftar sebagai</legend>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((r) => (
            <button key={r.id} type="button" onClick={() => setRole(r.id)} aria-pressed={role === r.id} className={cn("cursor-pointer rounded-xl border px-3 py-2.5 text-left transition", role === r.id ? "border-brand-600 bg-brand-50 ring-2 ring-brand-100" : "border-navy-200 hover:bg-navy-50")}>
              <span className="block text-sm font-bold text-navy-900">{r.label}</span>
              <span className="block text-[11px] leading-tight text-navy-500">{r.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <Field label="Nama lengkap" error={errors.fullName} required>
        <input className="input" value={form.fullName} onChange={set("fullName")} autoComplete="name" placeholder="Nama kamu" />
      </Field>
      <Field label={isStudent ? "Email kampus" : "Email"} error={errors.email} hint={isStudent ? "Contoh: nama@mhs.unnes.ac.id" : undefined} required>
        <input className="input" type="email" value={form.email} onChange={set("email")} autoComplete="email" placeholder={isStudent ? "nama@mhs.kampus.ac.id" : "nama@email.com"} />
      </Field>
      {isStudent ? (
        <Field label="Kampus" error={errors.campus} required>
          <select className="input" value={form.campus} onChange={set("campus")}>
            <option value="">Pilih kampus…</option>
            {campuses.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      ) : (
        <Field label="Nama usaha / komunitas" error={errors.businessName} required>
          <input className="input" value={form.businessName} onChange={set("businessName")} placeholder="Mis. Kopi Senja" />
        </Field>
      )}
      <Field label="WhatsApp (opsional)">
        <input className="input" inputMode="tel" value={form.whatsapp} onChange={set("whatsapp")} placeholder="08xxxxxxxxxx" autoComplete="tel" />
      </Field>
      <Field label={isStudent ? "Keahlian utama (opsional)" : "Kebutuhan utama (opsional)"}>
        <input className="input" value={form.interest} onChange={set("interest")} placeholder={isStudent ? "Mis. desain, web, copywriting" : "Mis. admin Instagram, logo, website"} />
      </Field>

      {serverError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{serverError}</p>}
      <button type="submit" disabled={loading} className="btn btn-gold btn-lg w-full">
        {loading ? <><Loader2 size={18} className="animate-spin" /> Mendaftarkan…</> : "Join Waitlist"}
      </button>
      <p className="text-center text-xs text-navy-500">Gratis. Datamu hanya dipakai untuk pemberitahuan peluncuran.</p>
    </form>
  );
}
