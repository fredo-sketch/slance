import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle, ArrowLeft, Award, BadgeCheck, BookOpen, Briefcase, CheckCircle2, ExternalLink, FolderKanban, Home, Search, SlidersHorizontal, Star, User, Wallet, Clock3, ShieldCheck, TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "../../components/Layout";
import { Avatar, Empty, Field, Modal, PageHeader, ProgressBar, StatCard, Stars, Tabs } from "../../components/ui";
import {
  CategoryIcon, DeadlineText, DetailRow, EscrowBadge, FeeBreakdown, LevelBadge, ProjectCard, StatusBadge,
} from "../../components/ProjectParts";
import Workspace from "../../components/Workspace";
import { useStore, useToast } from "../../store/StoreContext";
import { badgeLevels, categories, categoryById, cities, workModes, campuses } from "../../config";
import { appliedByStudent, badgeProgress, matchScore, projectsOfStudent } from "../../lib/selectors";
import { budgetRange, cn, dayOffset, formatDate, rupiah, timeAgo, uid } from "../../lib/format";

/* ---------- Layout ---------- */
export function StudentLayout() {
  const { projects, me } = useStore();
  const active = me ? projectsOfStudent(projects, me.id).filter((p) => ["funding", "in_progress", "review"].includes(p.status)).length : 0;
  const items = [
    { to: "/mahasiswa", label: "Ringkasan", icon: Home, end: true },
    { to: "/mahasiswa/cari", label: "Cari Project", icon: Search },
    { to: "/mahasiswa/project", label: "Project Saya", icon: FolderKanban, badge: active },
    { to: "/mahasiswa/portofolio", label: "Portofolio", icon: Briefcase },
    { to: "/mahasiswa/penghasilan", label: "Penghasilan", icon: Wallet },
    { to: "/mahasiswa/profil", label: "Profil & Badge", icon: User },
    { to: "/mahasiswa/panduan", label: "Panduan Pemula", icon: BookOpen },
  ];
  return <DashboardLayout role="mahasiswa" items={items} />;
}

const VerifyBanner = ({ me }) => {
  if (me.verification === "approved") return null;
  const rejected = me.verification === "rejected";
  return (
    <div className={cn("mb-6 flex gap-3 rounded-2xl border p-4 text-sm", rejected ? "border-red-200 bg-red-50" : "border-amber-200 bg-gold-100/60")} role="status">
      <AlertCircle size={20} className={cn("mt-0.5 shrink-0", rejected ? "text-red-600" : "text-amber-700")} />
      <div>
        <p className={cn("font-bold", rejected ? "text-red-900" : "text-amber-900")}>{rejected ? "Verifikasi ditolak" : "Akun menunggu verifikasi admin"}</p>
        <p className={rejected ? "text-red-800" : "text-amber-900"}>
          {rejected ? "Data KTM atau email kampus belum sesuai. Perbarui profilmu lalu hubungi admin." : "Kamu sudah bisa menjelajah project, tetapi baru bisa melamar setelah email kampus dan KTM diverifikasi."}
        </p>
      </div>
    </div>
  );
};

/* ---------- Ringkasan ---------- */
export function StudentOverview() {
  const { me, projects, clientById, payouts, statsOf } = useStore();
  const nav = useNavigate();
  const s = statsOf(me.id);
  const mine = projectsOfStudent(projects, me.id).filter((p) => ["funding", "in_progress", "review"].includes(p.status));
  const recs = useMemo(
    () =>
      projects
        .filter((p) => p.status === "open" && p.moderation === "approved" && !p.applicants.some((a) => a.studentId === me.id))
        .map((p) => ({ p, score: matchScore(me, p) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [projects, me],
  );
  const pending = appliedByStudent(projects, me.id).filter((x) => x.application.status === "pending");
  void payouts;

  return (
    <>
      <PageHeader title={`Halo, ${me.name.split(" ")[0]}`} desc="Ringkasan aktivitas freelance dan project yang cocok untukmu." actions={<Link to="/mahasiswa/cari" className="btn btn-primary"><Search size={16} /> Cari project</Link>} />
      <VerifyBanner me={me} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Briefcase} label="Project berjalan" value={s.active + s.inReview} sub={`${s.completed} selesai`} tone="blue" />
        <StatCard icon={Wallet} label="Total penghasilan" value={rupiah(s.totalEarned)} sub="setelah komisi" tone="green" />
        <StatCard icon={Clock3} label="Dana di escrow" value={rupiah(s.escrowHeld)} sub="menunggu persetujuan" tone="gold" />
        <StatCard icon={Star} label="Rating" value={s.rating ? s.rating.toFixed(1) : "-"} sub={s.reviews ? `${s.reviews} ulasan` : "Belum ada ulasan"} tone="navy" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-extrabold">Project yang sedang dikerjakan</h2><Link to="/mahasiswa/project" className="text-sm font-bold text-brand-700 hover:underline">Lihat semua</Link></div>
          {mine.length === 0 ? (
            <Empty title="Belum ada project berjalan" desc="Lamar project yang cocok dan mulai bangun portofoliomu." action={<Link to="/mahasiswa/cari" className="btn btn-primary btn-sm">Cari project</Link>} />
          ) : (
            <div className="space-y-3">
              {mine.map((p) => (
                <Link key={p.id} to={`/mahasiswa/project/${p.id}`} className="card card-pad flex items-center gap-4 transition hover:border-brand-300">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><CategoryIcon id={p.category} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{p.title}</p>
                    <p className="truncate text-xs text-navy-500">{clientById(p.clientId)?.name} · tenggat <DeadlineText iso={p.deadline} /></p>
                    <ProgressBar className="mt-2" value={Math.round((p.milestones.filter((m) => m.done).length / Math.max(1, p.milestones.length)) * 100)} />
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          )}
        </section>
        <section>
          <h2 className="mb-3 text-lg font-extrabold">Lamaran menunggu</h2>
          {pending.length === 0 ? <p className="text-sm text-navy-500">Tidak ada lamaran yang menunggu jawaban.</p> : (
            <ul className="card divide-y divide-navy-100">
              {pending.map(({ project, application }) => (
                <li key={project.id}><Link to={`/mahasiswa/cari/${project.id}`} className="block px-4 py-3 hover:bg-navy-50">
                  <p className="truncate text-sm font-bold">{project.title}</p>
                  <p className="text-xs text-navy-500">Tawaran {rupiah(application.price)} · {timeAgo(application.createdAt)}</p>
                </Link></li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-extrabold">Rekomendasi untukmu</h2><Link to="/mahasiswa/cari" className="text-sm font-bold text-brand-700 hover:underline">Cari lainnya</Link></div>
        <div className="grid gap-4 md:grid-cols-3">
          {recs.map(({ p, score }) => <ProjectCard key={p.id} project={p} client={clientById(p.clientId)} matchScore={score} onOpen={() => nav(`/mahasiswa/cari/${p.id}`)} />)}
        </div>
      </section>
    </>
  );
}

/* ---------- Cari project ---------- */
export function StudentBrowse() {
  const { me, projects, clientById } = useStore();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [f, setF] = useState({ category: "", city: "", mode: "", level: "", minBudget: 0, sort: "cocok" });
  const [showFilters, setShowFilters] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return projects
      .filter((p) => p.status === "open" && p.moderation === "approved")
      .filter((p) => !term || `${p.title} ${p.description} ${p.skills.join(" ")} ${clientById(p.clientId)?.name}`.toLowerCase().includes(term))
      .filter((p) => !f.category || p.category === f.category)
      .filter((p) => !f.city || p.city === f.city || p.mode === "remote")
      .filter((p) => !f.mode || p.mode === f.mode)
      .filter((p) => !f.level || p.level === f.level)
      .filter((p) => p.budgetMax >= Number(f.minBudget))
      .map((p) => ({ p, score: matchScore(me, p) }))
      .sort((a, b) => {
        if (f.sort === "honor") return b.p.budgetMax - a.p.budgetMax;
        if (f.sort === "deadline") return a.p.deadline.localeCompare(b.p.deadline);
        if (f.sort === "baru") return b.p.createdAt.localeCompare(a.p.createdAt);
        return b.score - a.score;
      });
  }, [projects, q, f, me, clientById]);

  const activeFilters = ["category", "city", "mode", "level"].filter((k) => f[k]).length + (Number(f.minBudget) > 0 ? 1 : 0);
  const reset = () => { setQ(""); setF({ category: "", city: "", mode: "", level: "", minBudget: 0, sort: f.sort }); };

  return (
    <>
      <PageHeader title="Cari Project" desc="Semua project terbuka dari UMKM, startup, dan komunitas. Filter sesuai skill, kota, dan honor." />
      <VerifyBanner me={me} />
      <div className="card card-pad">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-navy-400" />
            <input className="input !pl-10" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul, skill, atau nama klien…" aria-label="Cari project" />
          </div>
          <select className="input sm:w-52" value={f.sort} onChange={set("sort")} aria-label="Urutkan">
            <option value="cocok">Paling cocok</option><option value="baru">Terbaru</option><option value="honor">Honor tertinggi</option><option value="deadline">Tenggat terdekat</option>
          </select>
          <button onClick={() => setShowFilters((v) => !v)} className="btn btn-outline" aria-expanded={showFilters}><SlidersHorizontal size={16} /> Filter{activeFilters > 0 && <span className="rounded-full bg-brand-600 px-1.5 text-[11px] text-white">{activeFilters}</span>}</button>
        </div>
        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-navy-100 pt-4 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="Kategori"><select className="input" value={f.category} onChange={set("category")}><option value="">Semua</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.short}</option>)}</select></Field>
            <Field label="Kota"><select className="input" value={f.city} onChange={set("city")}><option value="">Semua kota</option>{cities.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Mode kerja"><select className="input" value={f.mode} onChange={set("mode")}><option value="">Semua</option>{Object.entries(workModes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
            <Field label="Level"><select className="input" value={f.level} onChange={set("level")}><option value="">Semua</option><option value="pemula">Ramah pemula</option><option value="menengah">Menengah</option></select></Field>
            <Field label="Honor minimal"><select className="input" value={f.minBudget} onChange={set("minBudget")}><option value={0}>Berapa pun</option><option value={500000}>≥ Rp500 rb</option><option value={1000000}>≥ Rp1 jt</option></select></Field>
            <div className="sm:col-span-2 lg:col-span-5"><button onClick={reset} className="text-sm font-bold text-brand-700 hover:underline">Reset filter</button></div>
          </div>
        )}
      </div>
      <p className="mt-5 mb-3 text-sm text-navy-600" aria-live="polite"><b className="text-navy-900">{list.length}</b> project ditemukan</p>
      {list.length === 0 ? (
        <Empty icon={Search} title="Tidak ada project yang cocok" desc="Coba ubah kata kunci atau longgarkan filter." action={<button onClick={reset} className="btn btn-outline btn-sm">Reset filter</button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map(({ p, score }) => <ProjectCard key={p.id} project={p} client={clientById(p.clientId)} matchScore={score} onOpen={() => nav(`/mahasiswa/cari/${p.id}`)} />)}
        </div>
      )}
    </>
  );
}

/* ---------- Detail project + lamar ---------- */
export function StudentProjectDetail() {
  const { id } = useParams();
  const { me, projectById, clientById, actions, calcFees } = useStore();
  const toast = useToast();
  const p = projectById(id);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [price, setPrice] = useState("");
  const [err, setErr] = useState({});

  if (!p) return <Navigate to="/mahasiswa/cari" replace />;
  // Project yang sudah dipegang mahasiswa ini dialihkan ke ruang kerja.
  if (p.hiredStudentId === me.id) return <Navigate to={`/mahasiswa/project/${p.id}`} replace />;

  const client = clientById(p.clientId);
  const mine = p.applicants.find((a) => a.studentId === me.id);
  const canApply = me.verification === "approved" && p.status === "open" && !mine;
  const fees = calcFees(Number(price) || 0);

  const openApply = () => { setPrice(String(Math.round((p.budgetMin + p.budgetMax) / 2 / 1000) * 1000)); setMsg(""); setErr({}); setOpen(true); };
  const submit = () => {
    const e = {};
    const n = Number(price);
    if (!n || n < 50000) e.price = "Masukkan tawaran minimal Rp50.000.";
    if (msg.trim().length < 20) e.msg = "Tulis pesan minimal 20 karakter agar klien mengenalmu.";
    setErr(e);
    if (Object.keys(e).length) return;
    actions.apply(p.id, { id: uid("ap"), studentId: me.id, message: msg.trim(), price: n, status: "pending", createdAt: dayOffset(0) });
    toast("Lamaran terkirim. Klien akan meninjau profilmu.");
    setOpen(false);
  };

  return (
    <>
      <Link to="/mahasiswa/cari" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900"><ArrowLeft size={16} /> Kembali ke daftar</Link>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <div className="card card-pad">
            <div className="flex flex-wrap gap-2"><LevelBadge level={p.level} /><span className="badge badge-navy">{categoryById[p.category]?.short}</span></div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">{p.title}</h1>
            <p className="mt-1 text-sm text-navy-500">oleh {client?.name} · {client?.type} · diposting {timeAgo(p.createdAt)}</p>
            <p className="mt-5 text-[15px] leading-relaxed text-navy-700">{p.description}</p>
          </div>
          <div className="card card-pad">
            <h2 className="font-extrabold">Hasil yang diharapkan</h2>
            <ul className="mt-3 space-y-2">{p.deliverables.map((d) => <li key={d} className="flex gap-2.5 text-sm"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-600" />{d}</li>)}</ul>
            <h2 className="mt-6 font-extrabold">Skill yang dibutuhkan</h2>
            <div className="mt-3 flex flex-wrap gap-2">{p.skills.map((s) => <span key={s} className="badge badge-blue">{s}</span>)}</div>
          </div>
          <div className="card card-pad">
            <h2 className="font-extrabold">Tentang klien</h2>
            <div className="mt-3 flex gap-3"><Avatar name={client?.name} size={44} /><div><p className="font-bold">{client?.name}</p><p className="text-sm text-navy-600">{client?.about || "Belum ada deskripsi."}</p>{client?.verification === "approved" && <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> Klien terverifikasi</p>}</div></div>
          </div>
        </div>
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className="card card-pad space-y-3">
            <dl className="space-y-2.5">
              <DetailRow label="Budget">{budgetRange(p.budgetMin, p.budgetMax)}</DetailRow>
              <DetailRow label="Tenggat"><DeadlineText iso={p.deadline} /> · {formatDate(p.deadline)}</DetailRow>
              <DetailRow label="Estimasi">{p.durationDays} hari</DetailRow>
              <DetailRow label="Mode">{p.mode === "remote" ? "Remote" : `${p.city} · ${workModes[p.mode]}`}</DetailRow>
              <DetailRow label="Pelamar">{p.applicants.length} orang</DetailRow>
            </dl>
            {mine ? (
              <div className="rounded-xl bg-brand-50 p-3.5 text-sm"><p className="font-bold text-brand-900">Kamu sudah melamar</p><p className="text-brand-800">Tawaran {rupiah(mine.price)} · {mine.status === "pending" ? "menunggu keputusan klien" : mine.status === "rejected" ? "tidak terpilih" : "diterima"}</p>
                {mine.status === "pending" && <button onClick={() => { actions.withdrawApplication(p.id, me.id); toast("Lamaran ditarik.", "info"); }} className="mt-2 cursor-pointer text-xs font-bold text-red-700 hover:underline">Tarik lamaran</button>}
              </div>
            ) : (
              <>
                <button onClick={openApply} disabled={!canApply} className="btn btn-brand btn-lg w-full">Lamar project ini</button>
                {me.verification !== "approved" && <p className="text-xs text-amber-800">Verifikasi akun diperlukan sebelum melamar.</p>}
                {p.status !== "open" && <p className="text-xs text-navy-500">Project ini sudah tidak menerima lamaran.</p>}
              </>
            )}
          </div>
          <div className="rounded-2xl bg-navy-900 p-5 text-sm text-navy-100"><p className="flex items-center gap-2 font-bold text-white"><ShieldCheck size={16} className="text-gold-400" /> Dilindungi Safe Escrow</p><p className="mt-1.5 leading-relaxed">Klien mendanai di muka. Kamu mulai bekerja setelah dana ditahan, dan honor cair saat hasil disetujui.</p></div>
        </aside>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Lamar project" footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Batal</button><button className="btn btn-brand" onClick={submit}>Kirim lamaran</button></>}>
        <div className="space-y-4">
          <p className="text-sm text-navy-600">Budget klien: <b>{budgetRange(p.budgetMin, p.budgetMax)}</b>. Tawaranmu sudah termasuk revisi sesuai kesepakatan.</p>
          <Field label="Tawaran harga (Rp)" error={err.price} required><input className="input" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} /></Field>
          {Number(price) > 0 && <FeeBreakdown fees={fees} view="mahasiswa" />}
          <Field label="Pesan untuk klien" error={err.msg} hint="Ceritakan pengalaman yang relevan dan kapan kamu bisa mulai." required><textarea className="input min-h-28" value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={500} /></Field>
        </div>
      </Modal>
    </>
  );
}

/* ---------- Project saya ---------- */
export function StudentProjects() {
  const { me, projects, clientById } = useStore();
  const [tab, setTab] = useState("aktif");
  const mine = projectsOfStudent(projects, me.id);
  const applied = appliedByStudent(projects, me.id).filter((x) => x.application.status !== "accepted");
  const groups = {
    aktif: mine.filter((p) => ["funding", "in_progress", "review"].includes(p.status)),
    lamaran: applied,
    selesai: mine.filter((p) => ["completed", "cancelled"].includes(p.status)),
  };
  return (
    <>
      <PageHeader title="Project Saya" desc="Pantau project yang berjalan, lamaran, dan riwayat project." />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: "aktif", label: "Berjalan", count: groups.aktif.length }, { id: "lamaran", label: "Lamaran", count: groups.lamaran.length }, { id: "selesai", label: "Riwayat", count: groups.selesai.length }]} />
      {groups[tab].length === 0 ? <Empty title="Belum ada data" desc="Project akan muncul di sini." action={<Link to="/mahasiswa/cari" className="btn btn-primary btn-sm">Cari project</Link>} /> : tab === "lamaran" ? (
        <div className="space-y-3">
          {groups.lamaran.map(({ project: p, application: a }) => (
            <Link key={p.id} to={`/mahasiswa/cari/${p.id}`} className="card card-pad flex flex-wrap items-center gap-4 transition hover:border-brand-300">
              <div className="min-w-0 flex-1"><p className="font-bold">{p.title}</p><p className="text-xs text-navy-500">{clientById(p.clientId)?.name} · dilamar {timeAgo(a.createdAt)}</p></div>
              <span className="text-sm font-bold">{rupiah(a.price)}</span>
              <span className={cn("badge", a.status === "pending" ? "badge-amber" : "badge-slate")}>{a.status === "pending" ? "Menunggu" : "Tidak terpilih"}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {groups[tab].map((p) => (
            <Link key={p.id} to={`/mahasiswa/project/${p.id}`} className="card card-pad flex flex-wrap items-center gap-4 transition hover:border-brand-300">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><CategoryIcon id={p.category} /></span>
              <div className="min-w-0 flex-1"><p className="font-bold">{p.title}</p><p className="text-xs text-navy-500">{clientById(p.clientId)?.name} · tenggat {formatDate(p.deadline)}</p></div>
              <span className="text-sm font-bold">{rupiah(p.price)}</span>
              <EscrowBadge escrow={p.escrow} /><StatusBadge status={p.status} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export function StudentWorkspace() {
  const { id } = useParams();
  const { me, projectById } = useStore();
  const p = projectById(id);
  if (!p || p.hiredStudentId !== me.id) return <Navigate to="/mahasiswa/project" replace />;
  return (
    <>
      <Link to="/mahasiswa/project" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900"><ArrowLeft size={16} /> Project saya</Link>
      <Workspace project={p} role="mahasiswa" />
    </>
  );
}

/* ---------- Portofolio otomatis ---------- */
export function StudentPortfolio() {
  const { me, projects, clientById, statsOf } = useStore();
  const toast = useToast();
  const done = projectsOfStudent(projects, me.id).filter((p) => p.status === "completed").sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""));
  const s = statsOf(me.id);
  const badges = badgeProgress(projects, me.id).filter((b) => b.level);
  const url = `slance.vercel.app/p/${me.username}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(`https://${url}`); toast("Tautan portofolio disalin."); } catch { toast("Tidak bisa menyalin otomatis. Salin tautannya secara manual.", "error"); }
  };
  return (
    <>
      <PageHeader title="Portofolio Otomatis" desc="Tersusun sendiri dari project selesai dan ulasan klien. Bagikan tautannya ke calon klien atau HRD." actions={<button onClick={copy} className="btn btn-outline"><ExternalLink size={16} /> Salin tautan</button>} />
      <div className="card overflow-hidden">
        <div className="bg-navy-900 p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <Avatar name={me.name} size={72} className="!bg-brand-600" />
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-extrabold">{me.name}</h2>
              <p className="text-sm text-navy-200">{me.major} · {me.campus} · Semester {me.semester}</p>
              <p className="mt-1 text-xs text-navy-300">{url}</p>
            </div>
            {me.verification === "approved" && <span className="badge bg-white/10 text-white"><BadgeCheck size={14} className="text-emerald-400" /> Mahasiswa terverifikasi</span>}
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-navy-100">{me.bio}</p>
          <dl className="mt-6 grid grid-cols-3 gap-4 text-center sm:max-w-md">
            <div><dd className="text-2xl font-extrabold">{s.completed}</dd><dt className="text-xs text-navy-300">Project selesai</dt></div>
            <div><dd className="text-2xl font-extrabold">{s.rating ? s.rating.toFixed(1) : "-"}</dd><dt className="text-xs text-navy-300">Rating rata-rata</dt></div>
            <div><dd className="text-2xl font-extrabold">{badges.length}</dd><dt className="text-xs text-navy-300">Skill badge</dt></div>
          </dl>
        </div>
        <div className="p-6 sm:p-8">
          {badges.length > 0 && <div className="mb-8 flex flex-wrap gap-2">{badges.map((b) => <span key={b.category} className="badge badge-navy !px-3 !py-1.5"><Award size={14} style={{ color: b.level.color }} /> {b.short} · {b.level.label}</span>)}</div>}
          <h3 className="text-lg font-extrabold">Karya & project</h3>
          {done.length === 0 ? <div className="mt-4"><Empty title="Portofolio masih kosong" desc="Selesaikan project pertamamu, lalu karya dan ulasan klien akan muncul di sini otomatis." /></div> : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {done.map((p) => (
                <article key={p.id} className="rounded-2xl border border-navy-100 p-5">
                  <div className="flex items-start justify-between gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><CategoryIcon id={p.category} /></span><span className="badge badge-navy">{categoryById[p.category]?.short}</span></div>
                  <h4 className="mt-3 font-bold">{p.title}</h4>
                  <p className="text-xs text-navy-500">untuk {clientById(p.clientId)?.name} · selesai {formatDate(p.completedAt, { month: "long", year: "numeric" })}</p>
                  <ul className="mt-3 space-y-1">{p.deliverables.slice(0, 3).map((d) => <li key={d} className="text-sm text-navy-700">• {d}</li>)}</ul>
                  {p.review && <figure className="mt-4 rounded-xl bg-navy-50 p-3.5"><Stars value={p.review.rating} /><blockquote className="mt-1.5 text-sm text-navy-700">“{p.review.text}”</blockquote></figure>}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------- Penghasilan ---------- */
export function StudentEarnings() {
  const { me, projects, payouts, statsOf, actions, calcFees, clientById } = useStore();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const s = statsOf(me.id);
  const history = projectsOfStudent(projects, me.id).filter((p) => p.escrow !== "none").sort((a, b) => (b.completedAt || b.deadline).localeCompare(a.completedAt || a.deadline));
  const mypay = payouts.filter((x) => x.studentId === me.id);

  const doWithdraw = () => {
    const n = Number(amount);
    if (!n || n < 50000) return toast("Penarikan minimal Rp50.000.", "error");
    if (n > s.available) return toast("Jumlah melebihi saldo yang bisa ditarik.", "error");
    actions.withdraw(me.id, n);
    toast(`Penarikan ${rupiah(n)} diajukan (simulasi).`);
    setOpen(false); setAmount("");
  };
  return (
    <>
      <PageHeader title="Penghasilan" desc="Saldo, dana di escrow, dan riwayat pembayaran. Pembayaran sungguhan akan aktif setelah payment gateway terpasang." actions={<button onClick={() => setOpen(true)} disabled={s.available < 50000} className="btn btn-primary"><Wallet size={16} /> Tarik saldo</button>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Saldo tersedia" value={rupiah(s.available)} tone="green" />
        <StatCard icon={Clock3} label="Di escrow" value={rupiah(s.escrowHeld)} sub="dicairkan saat disetujui" tone="gold" />
        <StatCard icon={TrendingUp} label="Total diterima" value={rupiah(s.totalEarned)} tone="blue" />
        <StatCard icon={CheckCircle2} label="Sudah ditarik" value={rupiah(s.withdrawn)} tone="navy" />
      </div>
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-extrabold">Riwayat project berbayar</h2>
        {history.length === 0 ? <Empty title="Belum ada transaksi" /> : (
          <div className="card overflow-x-auto"><table className="table-x min-w-[640px]">
            <thead><tr><th>Project</th><th>Klien</th><th className="text-right">Honor</th><th className="text-right">Komisi</th><th className="text-right">Diterima</th><th>Status</th></tr></thead>
            <tbody>{history.map((p) => { const f = calcFees(p.price); return (
              <tr key={p.id}><td className="max-w-[16rem] font-semibold"><Link to={`/mahasiswa/project/${p.id}`} className="hover:text-brand-700 hover:underline">{p.title}</Link></td><td>{clientById(p.clientId)?.name}</td><td className="text-right tabular-nums">{rupiah(f.price)}</td><td className="text-right text-red-600 tabular-nums">−{rupiah(f.studentFee)}</td><td className="text-right font-bold tabular-nums">{rupiah(f.studentNet)}</td><td><EscrowBadge escrow={p.escrow} /></td></tr>
            ); })}</tbody></table></div>
        )}
        {mypay.length > 0 && <p className="mt-3 text-xs text-navy-500">Penarikan: {mypay.map((x) => `${rupiah(x.amount)} (${formatDate(x.date)})`).join(" · ")}</p>}
      </section>
      <Modal open={open} onClose={() => setOpen(false)} title="Tarik saldo" size="sm" footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Batal</button><button className="btn btn-primary" onClick={doWithdraw}>Ajukan penarikan</button></>}>
        <div className="space-y-4"><p className="text-sm text-navy-600">Saldo tersedia <b>{rupiah(s.available)}</b>. Ini simulasi: belum ada transfer sungguhan.</p><Field label="Jumlah (Rp)"><input className="input" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} placeholder="Minimal 50000" /></Field></div>
      </Modal>
    </>
  );
}

/* ---------- Profil & badge ---------- */
export function StudentProfile() {
  const { me, projects, actions } = useStore();
  const toast = useToast();
  const [f, setF] = useState({ name: me.name, major: me.major, semester: me.semester, city: me.city, campus: me.campus, bio: me.bio, skills: me.skills });
  const progress = badgeProgress(projects, me.id);
  const toggle = (id) => setF((s) => ({ ...s, skills: s.skills.includes(id) ? s.skills.filter((x) => x !== id) : [...s.skills, id] }));
  const save = (e) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return toast("Nama tidak boleh kosong.", "error");
    actions.updateStudent(me.id, { ...f, name: f.name.trim(), semester: Number(f.semester), bio: f.bio.trim() });
    toast("Profil diperbarui.");
  };
  return (
    <>
      <PageHeader title="Profil & Skill Badge" desc="Badge naik otomatis dari jumlah project selesai di tiap kategori." />
      <section className="card card-pad">
        <h2 className="font-extrabold">Skill Badge</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {progress.map((b) => {
            const next = b.next; const pctDone = next ? Math.round((b.count / next.min) * 100) : 100;
            return (
              <div key={b.category} className={cn("rounded-2xl border p-4", b.level ? "border-navy-200 bg-white" : "border-dashed border-navy-200 bg-navy-50/50")}>
                <div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><CategoryIcon id={b.category} size={17} /></span>
                  {b.level ? <span className="badge badge-navy"><Award size={13} style={{ color: b.level.color }} />{b.level.label}</span> : <span className="badge badge-slate">Belum ada</span>}</div>
                <p className="mt-2.5 text-sm font-bold">{b.short}</p>
                <ProgressBar className="mt-2" value={pctDone} />
                <p className="mt-1.5 text-xs text-navy-500">{b.count} project selesai{next ? ` · ${next.min - b.count} lagi menuju ${next.label}` : " · level tertinggi"}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-navy-500">Syarat: {badgeLevels.map((l) => `${l.label} = ${l.min} project`).join(", ")}.</p>
      </section>

      <form onSubmit={save} className="card card-pad mt-6 space-y-4">
        <h2 className="font-extrabold">Data profil</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama lengkap" required><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Email kampus"><input className="input" value={me.email} disabled /></Field>
          <Field label="Kampus"><select className="input" value={f.campus} onChange={(e) => setF({ ...f, campus: e.target.value })}>{[...new Set([f.campus, ...campuses])].map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Program studi"><input className="input" value={f.major} onChange={(e) => setF({ ...f, major: e.target.value })} /></Field>
          <Field label="Semester"><input className="input" type="number" min={1} max={14} value={f.semester} onChange={(e) => setF({ ...f, semester: e.target.value })} /></Field>
          <Field label="Kota"><select className="input" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}>{[...new Set([f.city, ...cities])].map((c) => <option key={c}>{c}</option>)}</select></Field>
        </div>
        <Field label="Bio singkat"><textarea className="input min-h-24" maxLength={300} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /></Field>
        <fieldset><legend className="label">Keahlian (dipakai untuk rekomendasi project)</legend>
          <div className="flex flex-wrap gap-2">{categories.map((c) => (
            <button key={c.id} type="button" aria-pressed={f.skills.includes(c.id)} onClick={() => toggle(c.id)} className={cn("cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-semibold transition", f.skills.includes(c.id) ? "border-brand-600 bg-brand-50 text-brand-800" : "border-navy-200 text-navy-700 hover:bg-navy-50")}>{c.short}</button>
          ))}</div>
        </fieldset>
        <div className="flex justify-end"><button className="btn btn-primary" type="submit">Simpan perubahan</button></div>
      </form>
    </>
  );
}

/* ---------- Panduan pemula ---------- */
export function StudentGuide() {
  const steps = [
    ["Lengkapi profil dan pilih skill", "Isi bio singkat, pilih 2–3 keahlian utama, dan pastikan verifikasi akunmu disetujui. Profil lengkap lebih dipercaya klien."],
    ["Pilih project sesuai level", "Mulai dari label “Ramah pemula” dengan tenggat longgar. Satu project kecil yang selesai lebih berharga daripada tiga lamaran yang tidak dibalas."],
    ["Tulis lamaran yang spesifik", "Sebut hal yang kamu pahami dari kebutuhan klien, satu pengalaman yang relevan, dan kapan bisa mulai. Hindari pesan salinan yang sama untuk semua project."],
    ["Tentukan harga dengan percaya diri", "Lihat rentang budget, hitung jam kerjamu, dan ingat komisi 5% dipotong dari honor. Tawaran terlalu murah justru membuat klien ragu."],
    ["Pastikan escrow sudah didanai", "Mulai bekerja setelah status project menjadi “Berjalan” dan dana ditahan. Jangan mengerjakan di luar platform."],
    ["Kabarkan progres secara rutin", "Centang tahapan pengerjaan tepat waktu. Kalau ada kendala jadwal kuliah, sampaikan sejak awal, bukan di hari tenggat."],
    ["Minta ulasan setelah selesai", "Ulasan klien dan project selesai akan menaikkan badge serta mengisi portofoliomu otomatis."],
  ];
  return (
    <>
      <PageHeader title="Panduan Freelance untuk Pemula" desc="Langkah singkat dari melamar sampai dibayar, untuk kamu yang baru pertama kali mengambil project." />
      <ol className="space-y-3">
        {steps.map(([t, d], i) => (
          <li key={t} className="card card-pad flex gap-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-extrabold text-white">{i + 1}</span><div><h3 className="font-bold">{t}</h3><p className="mt-1 text-sm leading-relaxed text-navy-600">{d}</p></div></li>
        ))}
      </ol>
      <div className="mt-6 flex gap-3 rounded-2xl bg-navy-900 p-5 text-sm text-navy-100"><ShieldCheck className="mt-0.5 shrink-0 text-gold-400" size={20} /><p><b className="text-white">Takut ditipu?</b> Jangan terima pembayaran atau berpindah ke WhatsApp sebelum escrow didanai. Jika klien memintanya, laporkan lewat tombol sengketa di halaman project.</p></div>
    </>
  );
}

