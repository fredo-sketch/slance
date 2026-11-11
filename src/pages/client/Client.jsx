import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Award, Briefcase, CheckCircle2, Clock3, FolderKanban, Home, Lock, PlusCircle, ShieldCheck, User, Users, Wallet, Receipt } from "lucide-react";
import { DashboardLayout } from "../../components/Layout";
import { Avatar, Empty, Field, Modal, PageHeader, StatCard, Stars, Tabs } from "../../components/ui";
import { CategoryIcon, DeadlineText, EscrowBadge, FeeBreakdown, LevelBadge, StatusBadge } from "../../components/ProjectParts";
import Workspace from "../../components/Workspace";
import { useStore, useToast } from "../../store/StoreContext";
import { categories, categoryById, cities, workModes } from "../../config";
import { badgeProgress, calcFees } from "../../lib/selectors";
import { budgetRange, cn, dayOffset, formatDate, rupiah, timeAgo, uid } from "../../lib/format";

const projectsOfClient = (projects, id) => projects.filter((p) => p.clientId === id);

export function ClientLayout() {
  const { me, projects } = useStore();
  const need = me ? projectsOfClient(projects, me.id).filter((p) => p.status === "funding" || p.status === "review" || (p.status === "open" && p.applicants.some((a) => a.status === "pending"))).length : 0;
  const items = [
    { to: "/klien", label: "Ringkasan", icon: Home, end: true },
    { to: "/klien/posting", label: "Posting Project", icon: PlusCircle },
    { to: "/klien/project", label: "Project Saya", icon: FolderKanban, badge: need },
    { to: "/klien/pembayaran", label: "Pembayaran", icon: Receipt },
    { to: "/klien/profil", label: "Profil Usaha", icon: User },
  ];
  return <DashboardLayout role="klien" items={items} />;
}

const VerifyBanner = ({ me }) => me.verification === "approved" ? null : (
  <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-gold-100/60 p-4 text-sm" role="status">
    <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-700" />
    <div><p className="font-bold text-amber-900">Akun menunggu verifikasi admin</p><p className="text-amber-900">Kamu bisa memasang project, tetapi mendanai escrow baru bisa dilakukan setelah akun disetujui.</p></div>
  </div>
);

/* ---------- Ringkasan ---------- */
export function ClientOverview() {
  const { me, projects, studentById } = useStore();
  const mine = projectsOfClient(projects, me.id);
  const open = mine.filter((p) => p.status === "open");
  const running = mine.filter((p) => ["funding", "in_progress", "review"].includes(p.status));
  const done = mine.filter((p) => p.status === "completed");
  const spent = done.reduce((s, p) => s + calcFees(p.price).clientTotal, 0);
  const todo = [
    ...mine.filter((p) => p.status === "review").map((p) => ({ p, text: "Hasil menunggu persetujuanmu", tone: "badge-navy", cta: "Tinjau" })),
    ...mine.filter((p) => p.status === "funding").map((p) => ({ p, text: "Danai escrow agar pengerjaan dimulai", tone: "badge-amber", cta: "Danai" })),
    ...open.filter((p) => p.moderation === "approved" && p.applicants.some((a) => a.status === "pending")).map((p) => ({ p, text: `${p.applicants.filter((a) => a.status === "pending").length} pelamar menunggu`, tone: "badge-blue", cta: "Pilih" })),
  ];
  return (
    <>
      <PageHeader title={me.name} desc="Pantau project, pelamar, dan pembayaran escrow." actions={<Link to="/klien/posting" className="btn btn-primary"><PlusCircle size={16} /> Posting project</Link>} />
      <VerifyBanner me={me} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Briefcase} label="Project terbuka" value={open.length} tone="blue" />
        <StatCard icon={Clock3} label="Sedang berjalan" value={running.length} tone="gold" />
        <StatCard icon={CheckCircle2} label="Selesai" value={done.length} tone="green" />
        <StatCard icon={Wallet} label="Total dibayarkan" value={rupiah(spent)} sub="termasuk biaya layanan" tone="navy" />
      </div>
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-extrabold">Perlu tindakanmu</h2>
        {todo.length === 0 ? <Empty icon={CheckCircle2} title="Semua beres" desc="Tidak ada yang perlu kamu tindaklanjuti sekarang." /> : (
          <ul className="card divide-y divide-navy-100">
            {todo.map(({ p, text, tone, cta }) => (
              <li key={p.id + text}><Link to={`/klien/project/${p.id}`} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-navy-50">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><CategoryIcon id={p.category} /></span>
                <div className="min-w-0 flex-1"><p className="truncate font-bold">{p.title}</p><p className="text-sm text-navy-600">{text}</p></div>
                <span className={cn("badge", tone)}>{cta}</span>
              </Link></li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-extrabold">Mahasiswa yang pernah bekerja denganmu</h2>
        {done.length === 0 ? <p className="text-sm text-navy-500">Belum ada project selesai.</p> : (
          <div className="flex flex-wrap gap-3">{[...new Set(done.map((p) => p.hiredStudentId))].map((sid) => { const s = studentById(sid); return s && (
            <div key={sid} className="card flex items-center gap-3 px-4 py-3"><Avatar name={s.name} size={36} /><div><p className="text-sm font-bold">{s.name}</p><p className="text-xs text-navy-500">{s.campus.replace(/\s*\(.*\)/, "")}</p></div></div>
          ); })}</div>
        )}
      </section>
    </>
  );
}

/* ---------- Posting project ---------- */
export function ClientPost() {
  const { me, actions } = useStore();
  const toast = useToast();
  const nav = useNavigate();
  const [f, setF] = useState({ title: "", category: "desain", description: "", deliverables: "", skills: "", budgetMin: "", budgetMax: "", city: me.city || "Semarang", mode: "remote", deadline: dayOffset(14), durationDays: "14", level: "pemula" });
  const [err, setErr] = useState({});
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const num = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value.replace(/\D/g, "") }));

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    const min = Number(f.budgetMin), max = Number(f.budgetMax);
    if (f.title.trim().length < 10) e.title = "Judul minimal 10 karakter agar mudah dipahami.";
    if (f.description.trim().length < 40) e.description = "Jelaskan kebutuhanmu minimal 40 karakter.";
    const deliverables = f.deliverables.split("\n").map((x) => x.trim()).filter(Boolean);
    if (deliverables.length < 1) e.deliverables = "Tulis minimal satu hasil yang diharapkan (satu baris per hasil).";
    if (!min || !max) e.budget = "Isi rentang budget.";
    else if (min > max) e.budget = "Budget minimum tidak boleh lebih besar dari maksimum.";
    else if (min < 50000) e.budget = "Budget minimal Rp50.000 agar adil bagi mahasiswa.";
    if (!f.deadline || f.deadline < dayOffset(1)) e.deadline = "Tenggat harus di masa depan.";
    setErr(e);
    if (Object.keys(e).length) return;
    const id = uid("p");
    actions.postProject({
      id, clientId: me.id, title: f.title.trim(), category: f.category, description: f.description.trim(), deliverables,
      skills: f.skills.split(",").map((x) => x.trim()).filter(Boolean), budgetMin: min, budgetMax: max, city: f.city, mode: f.mode,
      deadline: f.deadline, durationDays: Number(f.durationDays) || 7, level: f.level, status: "open", moderation: "pending", createdAt: dayOffset(0),
      applicants: [], hiredStudentId: null, price: 0, escrow: "none", milestones: [], review: null,
    });
    toast("Project dikirim. Setelah ditinjau admin, project tampil untuk mahasiswa.");
    nav(`/klien/project/${id}`);
  };

  return (
    <>
      <PageHeader title="Posting Project" desc="Gratis. Semakin jelas kebutuhanmu, semakin tepat mahasiswa yang melamar." />
      <VerifyBanner me={me} />
      <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="card card-pad space-y-4">
          <Field label="Judul project" error={err.title} required><input className="input" value={f.title} onChange={set("title")} placeholder="Mis. Desain 12 template feed Instagram untuk toko kopi" maxLength={120} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kategori" required><select className="input" value={f.category} onChange={set("category")}>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></Field>
            <Field label="Level kesulitan" hint="Ramah pemula cocok untuk mahasiswa baru."><select className="input" value={f.level} onChange={set("level")}><option value="pemula">Ramah pemula</option><option value="menengah">Menengah</option></select></Field>
          </div>
          <Field label="Deskripsi kebutuhan" error={err.description} required><textarea className="input min-h-32" value={f.description} onChange={set("description")} maxLength={1200} placeholder="Ceritakan latar belakang, tujuan, dan gaya yang diinginkan." /></Field>
          <Field label="Hasil yang diharapkan" error={err.deliverables} hint="Satu baris per hasil." required><textarea className="input min-h-24" value={f.deliverables} onChange={set("deliverables")} placeholder={"12 template feed 1080x1350\nFile editable (Canva/Figma)"} /></Field>
          <Field label="Skill yang dibutuhkan" hint="Pisahkan dengan koma."><input className="input" value={f.skills} onChange={set("skills")} placeholder="Canva, Figma, Branding" /></Field>
        </div>
        <div className="space-y-6">
          <div className="card card-pad space-y-4">
            <h2 className="font-extrabold">Budget & waktu</h2>
            <Field label="Rentang budget (Rp)" error={err.budget} required>
              <div className="flex items-center gap-2"><input className="input" inputMode="numeric" value={f.budgetMin} onChange={num("budgetMin")} placeholder="Min" aria-label="Budget minimum" /><span className="text-navy-400">–</span><input className="input" inputMode="numeric" value={f.budgetMax} onChange={num("budgetMax")} placeholder="Maks" aria-label="Budget maksimum" /></div>
            </Field>
            <p className="text-xs text-navy-500">Ditambah biaya layanan 5% saat mendanai escrow.</p>
            <Field label="Tenggat" error={err.deadline} required><input className="input" type="date" min={dayOffset(1)} value={f.deadline} onChange={set("deadline")} /></Field>
            <Field label="Estimasi pengerjaan (hari)"><input className="input" inputMode="numeric" value={f.durationDays} onChange={num("durationDays")} /></Field>
          </div>
          <div className="card card-pad space-y-4">
            <h2 className="font-extrabold">Lokasi</h2>
            <Field label="Mode kerja"><select className="input" value={f.mode} onChange={set("mode")}>{Object.entries(workModes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
            <Field label="Kota"><select className="input" value={f.city} onChange={set("city")}>{[...new Set([f.city, ...cities])].map((c) => <option key={c}>{c}</option>)}</select></Field>
          </div>
          <button className="btn btn-primary btn-lg w-full" type="submit">Kirim project</button>
        </div>
      </form>
    </>
  );
}

/* ---------- Daftar project ---------- */
export function ClientProjects() {
  const { me, projects } = useStore();
  const [tab, setTab] = useState("semua");
  const mine = projectsOfClient(projects, me.id);
  const groups = {
    semua: mine,
    terbuka: mine.filter((p) => p.status === "open"),
    berjalan: mine.filter((p) => ["funding", "in_progress", "review"].includes(p.status)),
    selesai: mine.filter((p) => ["completed", "cancelled"].includes(p.status)),
  };
  const list = groups[tab];
  return (
    <>
      <PageHeader title="Project Saya" actions={<Link to="/klien/posting" className="btn btn-primary"><PlusCircle size={16} /> Posting project</Link>} />
      <Tabs value={tab} onChange={setTab} tabs={Object.keys(groups).map((k) => ({ id: k, label: k[0].toUpperCase() + k.slice(1), count: groups[k].length }))} />
      {list.length === 0 ? <Empty title="Belum ada project" action={<Link to="/klien/posting" className="btn btn-primary btn-sm">Posting project pertama</Link>} /> : (
        <div className="space-y-3">{list.map((p) => (
          <Link key={p.id} to={`/klien/project/${p.id}`} className="card card-pad flex flex-wrap items-center gap-4 transition hover:border-brand-300">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><CategoryIcon id={p.category} /></span>
            <div className="min-w-0 flex-1"><p className="font-bold">{p.title}</p><p className="text-xs text-navy-500">{categoryById[p.category]?.short} · tenggat <DeadlineText iso={p.deadline} /> · {p.status === "open" ? `${p.applicants.length} pelamar` : rupiah(p.price)}</p></div>
            {p.moderation !== "approved" && <span className="badge badge-amber">{p.moderation === "pending" ? "Ditinjau admin" : p.moderation === "rejected" ? "Ditolak admin" : "Ditandai admin"}</span>}
            <StatusBadge status={p.status} />
          </Link>
        ))}</div>
      )}
    </>
  );
}

/* ---------- Detail project ---------- */
export function ClientProjectDetail() {
  const { id } = useParams();
  const { me, projectById } = useStore();
  const p = projectById(id);
  if (!p || p.clientId !== me.id) return <Navigate to="/klien/project" replace />;
  return (
    <>
      <Link to="/klien/project" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900"><ArrowLeft size={16} /> Project saya</Link>
      {p.status === "open" ? <OpenProject project={p} /> : <Workspace project={p} role="klien" />}
    </>
  );
}

function OpenProject({ project: p }) {
  const { actions, studentById, projects } = useStore();
  const toast = useToast();
  const [confirm, setConfirm] = useState(null);
  const pending = p.moderation === "pending";
  const flagged = p.moderation === "flagged" || p.moderation === "rejected";

  const ranked = useMemo(
    () => p.applicants.map((a) => ({ a, s: studentById(a.studentId) })).filter((x) => x.s).map((x) => {
      const done = projects.filter((q) => q.hiredStudentId === x.s.id && q.status === "completed");
      const ratings = done.map((q) => q.review?.rating).filter(Boolean);
      return { ...x, done: done.length, rating: ratings.length ? ratings.reduce((m, n) => m + n, 0) / ratings.length : null, badges: badgeProgress(projects, x.s.id).filter((b) => b.level) };
    }),
    [p.applicants, studentById, projects],
  );

  return (
    <div className="space-y-5">
      <div className="card card-pad">
        <div className="flex flex-wrap items-center gap-2"><StatusBadge status="open" /><LevelBadge level={p.level} />{pending && <span className="badge badge-amber">Menunggu tinjauan admin</span>}{flagged && <span className="badge badge-red">{p.moderation === "rejected" ? "Ditolak admin" : "Ditandai admin"}</span>}</div>
        <h2 className="mt-3 text-xl font-extrabold sm:text-2xl">{p.title}</h2>
        <p className="mt-1 text-sm text-navy-500">{categoryById[p.category]?.label} · {budgetRange(p.budgetMin, p.budgetMax)} · tenggat {formatDate(p.deadline)}</p>
        <p className="mt-4 text-sm leading-relaxed text-navy-700">{p.description}</p>
        {pending && <p className="mt-4 rounded-lg bg-gold-100/60 px-3.5 py-2.5 text-sm text-amber-900">Project akan tampil untuk mahasiswa setelah admin SLance meninjau. Biasanya kurang dari 1 hari kerja.</p>}
      </div>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><Users size={18} /> Pelamar ({ranked.length})</h3>
        {ranked.length === 0 ? <Empty icon={Users} title="Belum ada pelamar" desc="Mahasiswa yang cocok akan melamar dalam beberapa hari. Pastikan deskripsi dan budget realistis." /> : (
          <div className="space-y-3">
            {ranked.map(({ a, s, done, rating, badges }) => (
              <article key={a.id} className="card card-pad">
                <div className="flex flex-wrap items-start gap-4">
                  <Avatar name={s.name} size={48} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><h4 className="font-extrabold">{s.name}</h4>{s.verification === "approved" && <span className="badge badge-green"><ShieldCheck size={12} /> Terverifikasi</span>}</div>
                    <p className="text-xs text-navy-500">{s.major} · {s.campus} · Semester {s.semester}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-navy-600">
                      <span className="inline-flex items-center gap-1.5">{rating ? <><Stars value={rating} /> <b>{rating.toFixed(1)}</b></> : <span>Belum ada rating</span>}</span>
                      <span>{done} project selesai</span>
                    </div>
                    {badges.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{badges.map((b) => <span key={b.category} className="badge badge-navy"><Award size={12} style={{ color: b.level.color }} />{b.short} {b.level.label}</span>)}</div>}
                    <p className="mt-3 rounded-xl bg-navy-50 px-3.5 py-2.5 text-sm text-navy-700">“{a.message}”</p>
                  </div>
                  <div className="w-full text-left sm:w-auto sm:text-right"><p className="text-xs text-navy-500">Tawaran</p><p className="text-xl font-extrabold">{rupiah(a.price)}</p><p className="text-xs text-navy-500">{timeAgo(a.createdAt)}</p>
                    <button disabled={pending || flagged} onClick={() => setConfirm({ a, s })} className="btn btn-primary btn-sm mt-3 w-full sm:w-auto">Pilih mahasiswa</button></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Pilih mahasiswa ini?" size="sm"
        footer={<><button className="btn btn-ghost" onClick={() => setConfirm(null)}>Batal</button><button className="btn btn-primary" onClick={() => { actions.hire(p.id, confirm.a.id); toast(`${confirm.s.name} dipilih. Lanjutkan dengan mendanai escrow.`); setConfirm(null); }}>Ya, pilih</button></>}>
        {confirm && <div className="space-y-4"><p className="text-sm text-navy-600">Pelamar lain akan diberi tahu bahwa project ini sudah terisi. Langkah berikutnya adalah mendanai escrow.</p><FeeBreakdown fees={calcFees(confirm.a.price)} view="klien" /></div>}
      </Modal>
    </div>
  );
}

/* ---------- Pembayaran ---------- */
export function ClientPayments() {
  const { me, projects, studentById } = useStore();
  const mine = projectsOfClient(projects, me.id).filter((p) => p.hiredStudentId);
  const held = mine.filter((p) => p.escrow === "held").reduce((s, p) => s + calcFees(p.price).clientTotal, 0);
  const released = mine.filter((p) => p.escrow === "released").reduce((s, p) => s + calcFees(p.price).clientTotal, 0);
  const awaiting = mine.filter((p) => p.status === "funding").reduce((s, p) => s + calcFees(p.price).clientTotal, 0);
  return (
    <>
      <PageHeader title="Pembayaran" desc="Seluruh pendanaan escrow dan pencairan untuk project-mu. Simulasi sampai payment gateway aktif." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={Lock} label="Ditahan di escrow" value={rupiah(held)} tone="gold" />
        <StatCard icon={CheckCircle2} label="Sudah dicairkan" value={rupiah(released)} tone="green" />
        <StatCard icon={Clock3} label="Menunggu pendanaan" value={rupiah(awaiting)} tone="blue" />
      </div>
      <div className="card mt-6 overflow-x-auto">
        {mine.length === 0 ? <div className="p-6"><Empty title="Belum ada transaksi" /></div> : (
          <table className="table-x min-w-[680px]"><thead><tr><th>Project</th><th>Mahasiswa</th><th className="text-right">Harga</th><th className="text-right">Biaya layanan</th><th className="text-right">Total</th><th>Status</th></tr></thead>
            <tbody>{mine.map((p) => { const f = calcFees(p.price); return (
              <tr key={p.id}><td className="max-w-[16rem] font-semibold"><Link to={`/klien/project/${p.id}`} className="hover:text-brand-700 hover:underline">{p.title}</Link></td><td>{studentById(p.hiredStudentId)?.name}</td><td className="text-right tabular-nums">{rupiah(f.price)}</td><td className="text-right tabular-nums">{rupiah(f.clientFee)}</td><td className="text-right font-bold tabular-nums">{rupiah(f.clientTotal)}</td><td><EscrowBadge escrow={p.escrow} /></td></tr>); })}</tbody></table>
        )}
      </div>
    </>
  );
}

/* ---------- Profil usaha ---------- */
export function ClientProfile() {
  const { me, actions } = useStore();
  const toast = useToast();
  const [f, setF] = useState({ name: me.name, owner: me.owner, type: me.type, city: me.city, whatsapp: me.whatsapp, about: me.about });
  const save = (e) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return toast("Nama usaha tidak boleh kosong.", "error");
    actions.updateClient(me.id, { ...f, name: f.name.trim(), about: f.about.trim() });
    toast("Profil usaha diperbarui.");
  };
  return (
    <>
      <PageHeader title="Profil Usaha" desc="Profil lengkap membuat mahasiswa lebih percaya melamar." />
      <form onSubmit={save} className="card card-pad max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama usaha / komunitas" required><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Penanggung jawab"><input className="input" value={f.owner} onChange={(e) => setF({ ...f, owner: e.target.value })} /></Field>
          <Field label="Jenis"><input className="input" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} /></Field>
          <Field label="Kota"><select className="input" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}>{[...new Set([f.city, ...cities])].map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Email"><input className="input" value={me.email} disabled /></Field>
          <Field label="WhatsApp"><input className="input" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} /></Field>
        </div>
        <Field label="Tentang usaha"><textarea className="input min-h-24" maxLength={300} value={f.about} onChange={(e) => setF({ ...f, about: e.target.value })} /></Field>
        <div className="flex items-center justify-between"><span className={cn("badge", me.verification === "approved" ? "badge-green" : "badge-amber")}>{me.verification === "approved" ? "Terverifikasi" : "Menunggu verifikasi"}</span><button className="btn btn-primary" type="submit">Simpan</button></div>
      </form>
    </>
  );
}

