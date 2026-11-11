import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Briefcase, CheckCircle2, ClipboardList, FileCheck2, Flag, GraduationCap, Home, Lock, ShieldAlert, ShieldCheck, Store, TrendingUp, Users, Wallet, X, Gavel } from "lucide-react";
import { DashboardLayout } from "../../components/Layout";
import { Avatar, Empty, Modal, PageHeader, StatCard, Tabs } from "../../components/ui";
import { CategoryIcon, EscrowBadge, StatusBadge } from "../../components/ProjectParts";
import { useStore, useToast } from "../../store/StoreContext";
import { categoryById, fees } from "../../config";
import { survey } from "../../data/survey";
import { getWaitlistStats } from "../../lib/waitlist";
import { calcFees, platformStats } from "../../lib/selectors";
import { budgetRange, cn, formatDate, pct, rupiah, timeAgo } from "../../lib/format";

export function AdminLayout() {
  const store = useStore();
  const s = platformStats(store);
  const items = [
    { to: "/admin", label: "Ringkasan", icon: Home, end: true },
    { to: "/admin/verifikasi", label: "Verifikasi Akun", icon: FileCheck2, badge: s.pendingStudents + s.pendingClients },
    { to: "/admin/moderasi", label: "Moderasi Project", icon: Flag, badge: s.pendingProjects },
    { to: "/admin/escrow", label: "Escrow & Sengketa", icon: Lock, badge: s.openDisputes },
    { to: "/admin/waitlist", label: "Waitlist", icon: ClipboardList },
    { to: "/admin/validasi", label: "Hasil Survei", icon: BarChart3 },
  ];
  return <DashboardLayout role="admin" items={items} />;
}

/* ---------- Ringkasan ---------- */
export function AdminOverview() {
  const store = useStore();
  const { projects, students, clients } = store;
  const s = platformStats(store);
  const byCat = Object.keys(categoryById).map((id) => ({ id, label: categoryById[id].short, n: projects.filter((p) => p.category === id).length })).sort((a, b) => b.n - a.n);
  const max = Math.max(1, ...byCat.map((c) => c.n));
  const queue = s.pendingStudents + s.pendingClients + s.pendingProjects + s.openDisputes;
  return (
    <>
      <PageHeader title="Ringkasan Platform" desc="Kondisi marketplace SLance saat ini (data demo)." />
      {queue > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-gold-100/60 p-4 text-sm">
          <ShieldAlert className="text-amber-700" size={20} /><p className="flex-1 font-semibold text-amber-900">{queue} hal menunggu tindakanmu: {s.pendingStudents + s.pendingClients} verifikasi akun, {s.pendingProjects} moderasi project, {s.openDisputes} sengketa.</p>
          <Link to="/admin/verifikasi" className="btn btn-primary btn-sm">Mulai tinjau</Link>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={GraduationCap} label="Mahasiswa" value={s.students} sub={`${students.filter((x) => x.verification === "approved").length} terverifikasi`} tone="blue" />
        <StatCard icon={Store} label="Klien" value={s.clients} sub={`${clients.filter((x) => x.verification === "approved").length} terverifikasi`} tone="gold" />
        <StatCard icon={Briefcase} label="Project" value={s.projectsTotal} sub={`${s.projectsOpen} terbuka · ${s.projectsActive} berjalan`} tone="navy" />
        <StatCard icon={CheckCircle2} label="Project selesai" value={s.projectsDone} tone="green" />
        <StatCard icon={Wallet} label="Nilai transaksi (GMV)" value={rupiah(s.gmv)} sub="harga project terdanai" tone="blue" />
        <StatCard icon={Lock} label="Dana di escrow" value={rupiah(s.escrowHeld)} sub="belum dicairkan" tone="gold" />
        <StatCard icon={TrendingUp} label="Pendapatan platform" value={rupiah(s.revenue)} sub={`komisi ${Math.round((fees.clientRate + fees.studentRate) * 100)}% dari project selesai`} tone="green" />
        <StatCard icon={Gavel} label="Sengketa terbuka" value={s.openDisputes} tone={s.openDisputes ? "red" : "navy"} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card card-pad">
          <h2 className="font-extrabold">Project per kategori</h2>
          <ul className="mt-4 space-y-3">{byCat.map((c) => (
            <li key={c.id}><div className="flex justify-between text-sm"><span className="font-semibold">{c.label}</span><span className="font-bold tabular-nums">{c.n}</span></div><div className="mt-1 h-2 rounded-full bg-navy-100"><div className="h-full rounded-full bg-brand-600" style={{ width: `${(c.n / max) * 100}%` }} /></div></li>
          ))}</ul>
        </section>
        <section className="card card-pad">
          <h2 className="font-extrabold">Alur status project</h2>
          <ul className="mt-4 space-y-3">{[["Terbuka", projects.filter((p) => p.status === "open").length, "bg-brand-500"], ["Menunggu pendanaan", projects.filter((p) => p.status === "funding").length, "bg-gold-500"], ["Berjalan", projects.filter((p) => p.status === "in_progress").length, "bg-amber-500"], ["Menunggu persetujuan", projects.filter((p) => p.status === "review").length, "bg-navy-500"], ["Selesai", projects.filter((p) => p.status === "completed").length, "bg-emerald-500"]].map(([l, n, c]) => (
            <li key={l}><div className="flex justify-between text-sm"><span className="font-semibold">{l}</span><span className="font-bold tabular-nums">{n}</span></div><div className="mt-1 h-2 rounded-full bg-navy-100"><div className={cn("h-full rounded-full", c)} style={{ width: `${pct(n, projects.length)}%` }} /></div></li>
          ))}</ul>
        </section>
      </div>
    </>
  );
}

/* ---------- Verifikasi ---------- */
export function AdminVerify() {
  const { students, clients, actions } = useStore();
  const toast = useToast();
  const [tab, setTab] = useState("mahasiswa");
  const [view, setView] = useState(null);
  const pendingS = students.filter((s) => s.verification === "pending");
  const pendingC = clients.filter((c) => c.verification === "pending");
  const decide = (kind, id, status) => {
    (kind === "mahasiswa" ? actions.verifyStudent : actions.verifyClient)(id, status);
    toast(status === "approved" ? "Akun disetujui." : "Akun ditolak.", status === "approved" ? "success" : "info");
    setView(null);
  };
  const studentChecks = (s) => [
    ["Email berakhiran .ac.id", /ac\.id$/i.test(s.email)],
    ["Kampus dipilih dari daftar resmi", s.campus !== "Kampus lainnya"],
    ["Foto KTM diunggah", !!s.ktm],
  ];
  return (
    <>
      <PageHeader title="Verifikasi Akun" desc="Setujui mahasiswa yang email kampus dan KTM-nya valid, serta klien yang datanya jelas." />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: "mahasiswa", label: "Mahasiswa", count: pendingS.length }, { id: "klien", label: "Klien", count: pendingC.length }]} />
      {tab === "mahasiswa" ? (
        <>
          <h2 className="mb-3 font-extrabold">Menunggu verifikasi</h2>
          {pendingS.length === 0 ? <Empty icon={CheckCircle2} title="Tidak ada antrian" desc="Semua pendaftar mahasiswa sudah ditinjau." /> : (
            <div className="space-y-3">{pendingS.map((s) => (
              <div key={s.id} className="card card-pad flex flex-wrap items-center gap-4">
                <Avatar name={s.name} size={44} />
                <div className="min-w-0 flex-1"><p className="font-bold">{s.name}</p><p className="truncate text-xs text-navy-500">{s.email} · {s.campus}</p><p className="text-xs text-navy-500">Daftar {timeAgo(s.joinedAt)}</p></div>
                <button onClick={() => setView({ kind: "mahasiswa", item: s })} className="btn btn-outline btn-sm">Tinjau data</button>
              </div>
            ))}</div>
          )}
          <h2 className="mt-8 mb-3 font-extrabold">Semua mahasiswa</h2>
          <div className="card overflow-x-auto"><table className="table-x min-w-[560px]"><thead><tr><th>Nama</th><th>Kampus</th><th>Prodi</th><th>Status</th></tr></thead><tbody>{students.map((s) => (
            <tr key={s.id}><td className="font-semibold">{s.name}</td><td>{s.campus.replace(/\s*\(.*\)/, "")}</td><td>{s.major}</td><td><VerifyBadge v={s.verification} /></td></tr>))}</tbody></table></div>
        </>
      ) : (
        <>
          <h2 className="mb-3 font-extrabold">Menunggu verifikasi</h2>
          {pendingC.length === 0 ? <Empty icon={CheckCircle2} title="Tidak ada antrian" /> : (
            <div className="space-y-3">{pendingC.map((c) => (
              <div key={c.id} className="card card-pad flex flex-wrap items-center gap-4"><Avatar name={c.name} size={44} /><div className="min-w-0 flex-1"><p className="font-bold">{c.name}</p><p className="truncate text-xs text-navy-500">{c.type} · {c.city} · {c.email}</p></div><button onClick={() => setView({ kind: "klien", item: c })} className="btn btn-outline btn-sm">Tinjau data</button></div>
            ))}</div>
          )}
          <h2 className="mt-8 mb-3 font-extrabold">Semua klien</h2>
          <div className="card overflow-x-auto"><table className="table-x min-w-[560px]"><thead><tr><th>Nama</th><th>Jenis</th><th>Kota</th><th>Status</th></tr></thead><tbody>{clients.map((c) => (
            <tr key={c.id}><td className="font-semibold">{c.name}</td><td>{c.type}</td><td>{c.city}</td><td><VerifyBadge v={c.verification} /></td></tr>))}</tbody></table></div>
        </>
      )}

      <Modal open={!!view} onClose={() => setView(null)} title={view ? `Tinjau ${view.item.name}` : ""} size="sm"
        footer={view && <><button className="btn btn-outline" onClick={() => decide(view.kind, view.item.id, "rejected")}><X size={16} /> Tolak</button><button className="btn btn-success" onClick={() => decide(view.kind, view.item.id, "approved")}><CheckCircle2 size={16} /> Setujui</button></>}>
        {view?.kind === "mahasiswa" && (
          <div className="space-y-4">
            <dl className="space-y-1.5 text-sm"><div className="flex justify-between gap-4"><dt className="text-navy-500">Email</dt><dd className="font-semibold">{view.item.email}</dd></div><div className="flex justify-between gap-4"><dt className="text-navy-500">Kampus</dt><dd className="text-right font-semibold">{view.item.campus}</dd></div><div className="flex justify-between gap-4"><dt className="text-navy-500">Prodi · semester</dt><dd className="font-semibold">{view.item.major} · {view.item.semester}</dd></div><div className="flex justify-between gap-4"><dt className="text-navy-500">File KTM</dt><dd className="font-semibold">{view.item.ktmName || (view.item.ktm ? "ktm.jpg" : "-")}</dd></div></dl>
            <ul className="space-y-2 rounded-xl bg-navy-50 p-3.5 text-sm">{studentChecks(view.item).map(([t, ok]) => <li key={t} className="flex items-center gap-2">{ok ? <CheckCircle2 size={16} className="text-emerald-600" /> : <X size={16} className="text-red-600" />}{t}</li>)}</ul>
            <p className="text-xs text-navy-500">Dalam versi produksi, gambar KTM dibuka dari penyimpanan privat dan hanya terlihat oleh admin.</p>
          </div>
        )}
        {view?.kind === "klien" && (
          <dl className="space-y-1.5 text-sm">{[["Penanggung jawab", view.item.owner], ["Jenis", view.item.type], ["Kota", view.item.city], ["Email", view.item.email], ["WhatsApp", view.item.whatsapp], ["Tentang", view.item.about || "-"]].map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-navy-500">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>)}</dl>
        )}
      </Modal>
    </>
  );
}

const VerifyBadge = ({ v }) => <span className={cn("badge", v === "approved" ? "badge-green" : v === "pending" ? "badge-amber" : "badge-red")}>{v === "approved" ? "Terverifikasi" : v === "pending" ? "Menunggu" : "Ditolak"}</span>;

/* ---------- Moderasi project ---------- */
export function AdminModeration() {
  const { projects, clientById, actions } = useStore();
  const toast = useToast();
  const queue = projects.filter((p) => p.moderation === "pending" || p.moderation === "flagged");
  const decide = (id, status) => { actions.moderateProject(id, status); toast(status === "approved" ? "Project disetujui dan tampil ke mahasiswa." : "Project ditolak.", status === "approved" ? "success" : "info"); };
  const lowBudget = (p) => p.budgetMax < 150000;
  return (
    <>
      <PageHeader title="Moderasi Project" desc="Pastikan project jelas, wajar, dan tidak merugikan mahasiswa sebelum tampil." />
      {queue.length === 0 ? <Empty icon={CheckCircle2} title="Tidak ada project yang perlu ditinjau" /> : (
        <div className="space-y-4">{queue.map((p) => (
          <article key={p.id} className="card card-pad">
            <div className="flex flex-wrap items-start gap-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><CategoryIcon id={p.category} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold">{p.title}</h3><span className={cn("badge", p.moderation === "flagged" ? "badge-red" : "badge-amber")}>{p.moderation === "flagged" ? "Dilaporkan" : "Baru"}</span></div>
                <p className="text-xs text-navy-500">{clientById(p.clientId)?.name} · {categoryById[p.category]?.short} · {budgetRange(p.budgetMin, p.budgetMax)}</p>
                <p className="mt-2 text-sm text-navy-700">{p.description}</p>
                {p.flagReason && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{p.flagReason}</p>}
                {lowBudget(p) && <p className="mt-2 rounded-lg bg-gold-100/60 px-3 py-2 text-sm text-amber-900">Perhatian: budget di bawah Rp150.000 untuk beban kerja yang disebutkan. Pertimbangkan menolak atau minta klien menyesuaikan.</p>}
              </div>
              <div className="flex w-full gap-2 sm:w-auto sm:flex-col"><button onClick={() => decide(p.id, "approved")} className="btn btn-success btn-sm flex-1">Setujui</button><button onClick={() => decide(p.id, "rejected")} className="btn btn-outline btn-sm flex-1">Tolak</button></div>
            </div>
          </article>
        ))}</div>
      )}
    </>
  );
}

/* ---------- Escrow & sengketa ---------- */
export function AdminEscrow() {
  const { projects, disputes, clientById, studentById, actions } = useStore();
  const toast = useToast();
  const [tab, setTab] = useState("sengketa");
  const open = disputes.filter((d) => d.status === "open");
  const tx = projects.filter((p) => p.escrow !== "none");
  const resolve = (id, r) => { actions.resolveDispute(id, r); toast(r === "release" ? "Dana dicairkan ke mahasiswa." : "Dana dikembalikan ke klien.", "info"); };
  return (
    <>
      <PageHeader title="Escrow & Sengketa" desc="Pantau dana yang ditahan dan putuskan sengketa antara klien dan mahasiswa." />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: "sengketa", label: "Sengketa", count: open.length }, { id: "transaksi", label: "Semua transaksi", count: tx.length }]} />
      {tab === "sengketa" ? (
        disputes.length === 0 ? <Empty icon={ShieldCheck} title="Tidak ada sengketa" /> : (
          <div className="space-y-4">{disputes.map((d) => { const p = projects.find((x) => x.id === d.projectId); if (!p) return null; const f = calcFees(p.price); return (
            <article key={d.id} className="card card-pad">
              <div className="flex flex-wrap items-center gap-2"><span className={cn("badge", d.status === "open" ? "badge-red" : "badge-green")}>{d.status === "open" ? "Terbuka" : "Selesai"}</span><span className="text-xs text-navy-500">Diajukan {timeAgo(d.createdAt)} oleh {d.openedBy}</span></div>
              <h3 className="mt-2 font-extrabold">{p.title}</h3>
              <p className="text-sm text-navy-600">{clientById(p.clientId)?.name} ↔ {studentById(p.hiredStudentId)?.name} · dana ditahan <b>{rupiah(f.clientTotal)}</b></p>
              <p className="mt-3 rounded-xl bg-navy-50 px-3.5 py-3 text-sm text-navy-700">“{d.reason}”</p>
              {d.status === "open" ? (
                <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => resolve(d.id, "release")} className="btn btn-success btn-sm">Cairkan ke mahasiswa</button><button onClick={() => resolve(d.id, "refund")} className="btn btn-outline btn-sm">Kembalikan ke klien</button></div>
              ) : <p className="mt-3 text-sm font-semibold text-navy-700">Keputusan: {d.resolution === "release" ? "dana dicairkan ke mahasiswa" : "dana dikembalikan ke klien"}.</p>}
            </article>); })}</div>
        )
      ) : (
        <div className="card overflow-x-auto"><table className="table-x min-w-[720px]"><thead><tr><th>Project</th><th className="text-right">Dana klien</th><th className="text-right">Pendapatan SLance</th><th>Status project</th><th>Escrow</th></tr></thead><tbody>{tx.map((p) => { const f = calcFees(p.price); return (
          <tr key={p.id}><td className="max-w-[18rem] font-semibold">{p.title}</td><td className="text-right tabular-nums">{rupiah(f.clientTotal)}</td><td className="text-right tabular-nums">{rupiah(f.platformRevenue)}</td><td><StatusBadge status={p.status} /></td><td><EscrowBadge escrow={p.escrow} /></td></tr>); })}</tbody></table></div>
      )}
    </>
  );
}

/* ---------- Waitlist ---------- */
export function AdminWaitlist() {
  const { waitlist } = useStore();
  const [live, setLive] = useState(undefined);
  useEffect(() => {
    let alive = true;
    getWaitlistStats().then((x) => alive && setLive(x));
    return () => { alive = false; };
  }, []);
  const shown = waitlist.slice(0, 50);
  const roleLabel = { mahasiswa: "Mahasiswa", umkm: "UMKM", startup: "Startup", komunitas: "Komunitas" };
  return (
    <>
      <PageHeader title="Waitlist" desc="Calon pengguna yang mendaftar dari landing page." />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={Users} label="Pendaftar nyata (Supabase)" value={live === undefined ? "…" : live ? live.total : "n/a"} sub={live ? `${live.mahasiswa} mahasiswa · ${live.bisnis} pelaku usaha` : live === null ? "Tidak dapat terhubung" : "Memuat"} tone="green" />
        <StatCard icon={ClipboardList} label="Contoh data tabel (demo)" value={waitlist.length} sub="hanya untuk tampilan" tone="navy" />
      </div>
      <p className="mb-3 rounded-xl bg-brand-50 px-4 py-3 text-xs leading-relaxed text-brand-900">Data pendaftar sungguhan tersimpan di tabel <code className="font-mono">waitlist</code> Supabase (aman, tidak bisa dibaca publik) dan dapat dilihat atau diekspor lewat Table Editor Supabase. Tabel di bawah memakai data contoh ditambah pendaftaran dari sesi browser ini.</p>
      <div className="card overflow-x-auto"><table className="table-x min-w-[600px]"><thead><tr><th>#</th><th>Nama</th><th>Peran</th><th>Asal</th><th>Email</th><th>Daftar</th></tr></thead><tbody>{shown.map((w) => (
        <tr key={w.id}><td className="tabular-nums text-navy-500">{w.id}</td><td className="font-semibold">{w.name}</td><td><span className={cn("badge", w.role === "mahasiswa" ? "badge-blue" : "badge-amber")}>{roleLabel[w.role]}</span></td><td>{w.origin}</td><td className="font-mono text-xs">{w.email}</td><td>{formatDate(w.createdAt)}</td></tr>))}</tbody></table></div>
    </>
  );
}

/* ---------- Survei ---------- */
export function AdminSurvey() {
  const Bars = ({ title, rows, color = "bg-brand-600" }) => (
    <section className="card card-pad"><h2 className="font-extrabold">{title}</h2><ul className="mt-4 space-y-3">{rows.map((r) => (
      <li key={r.label}><div className="flex justify-between gap-3 text-sm"><span>{r.label}</span><span className="font-bold tabular-nums">{r.count} ({pct(r.count, survey.n)}%)</span></div><div className="mt-1 h-2 rounded-full bg-navy-100"><div className={cn("h-full rounded-full", color)} style={{ width: `${pct(r.count, survey.n)}%` }} /></div></li>))}</ul></section>
  );
  return (
    <>
      <PageHeader title="Hasil Survei Validasi" desc={`Ringkasan jawaban ${survey.n} responden mahasiswa (dari berkas CSV Google Form).`} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Responden valid" value={survey.n} sub={`${survey.unnes} dari UNNES`} tone="blue" />
        <StatCard icon={TrendingUp} label="Rata-rata minat" value={`${survey.minatAvg.toLocaleString("id-ID")} / 5`} tone="green" />
        <StatCard icon={Briefcase} label="Pentingnya portofolio" value={`${survey.portofolioAvg.toLocaleString("id-ID")} / 5`} tone="navy" />
        <StatCard icon={CheckCircle2} label="Bersedia project kecil" value={`${survey.bersedia}/${survey.n}`} tone="gold" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Bars title="Kendala utama mencari freelance" rows={survey.kendala} />
        <Bars title="Keahlian yang ditawarkan" rows={survey.skills} color="bg-navy-700" />
        <Bars title="Motivasi bergabung" rows={survey.motivasi} color="bg-emerald-600" />
        <section className="card card-pad"><h2 className="font-extrabold">Sebaran minat bergabung (1–5)</h2><ul className="mt-4 space-y-3">{[5, 4, 3, 2, 1].map((k) => (
          <li key={k}><div className="flex justify-between text-sm"><span>Skor {k}</span><span className="font-bold tabular-nums">{survey.minatDist[k]}</span></div><div className="mt-1 h-2 rounded-full bg-navy-100"><div className="h-full rounded-full bg-gold-500" style={{ width: `${pct(survey.minatDist[k], survey.n)}%` }} /></div></li>))}</ul></section>
      </div>
      <p className="mt-6 text-xs text-navy-500">Catatan: satu baris tanpa timestamp pada berkas CSV diabaikan karena tidak lengkap. Survei belum mencakup sisi UMKM.</p>
    </>
  );
}

