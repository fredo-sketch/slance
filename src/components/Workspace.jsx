import { useState } from "react";
import { AlertTriangle, CheckCircle2, Flag, Lock, RotateCcw, Send, ShieldAlert } from "lucide-react";
import { Avatar, Modal, Stars, StarInput, Field } from "./ui";
import { DetailRow, DeadlineText, EscrowBadge, EscrowSteps, FeeBreakdown, LevelBadge, Milestones, StatusBadge } from "./ProjectParts";
import { useStore, useToast } from "../store/StoreContext";
import { categoryById, workModes } from "../config";
import { budgetRange, formatDate, rupiah } from "../lib/format";

/**
 * Ruang kerja satu project yang sudah punya mahasiswa terpilih.
 * role: "mahasiswa" | "klien" — menentukan aksi yang tersedia.
 */
export default function Workspace({ project, role }) {
  const { actions, studentById, clientById, calcFees, disputes, me } = useStore();
  const toast = useToast();
  const [modal, setModal] = useState(null); // 'approve' | 'revision' | 'dispute'
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const client = clientById(project.clientId);
  const student = studentById(project.hiredStudentId);
  const fees = calcFees(project.price);
  const dispute = project.disputeId ? disputes.find((d) => d.id === project.disputeId) : null;
  const isClient = role === "klien";
  const verified = me?.verification === "approved";
  const close = () => { setModal(null); setText(""); setRating(5); };

  const doApprove = () => {
    actions.approve(project.id, rating, text.trim() || "Pekerjaan sesuai harapan.");
    toast("Project selesai. Dana dicairkan ke mahasiswa.");
    close();
  };
  const doRevision = () => {
    if (text.trim().length < 5) return toast("Tuliskan catatan revisi agar mahasiswa paham yang perlu diperbaiki.", "error");
    actions.requestRevision(project.id, text.trim());
    toast("Permintaan revisi dikirim.", "info");
    close();
  };
  const doDispute = () => {
    if (text.trim().length < 10) return toast("Jelaskan masalahnya minimal 10 karakter.", "error");
    actions.openDispute(project.id, isClient ? "klien" : "mahasiswa", text.trim());
    toast("Sengketa diajukan. Admin SLance akan menengahi dan dana tetap ditahan.", "info");
    close();
  };

  const canDispute = ["in_progress", "review"].includes(project.status) && project.escrow === "held" && !dispute;

  return (
    <div className="space-y-5">
      <div className="card card-pad">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={project.status} />
          <EscrowBadge escrow={project.escrow} />
          <LevelBadge level={project.level} />
        </div>
        <h2 className="mt-3 text-xl font-extrabold text-navy-900 sm:text-2xl">{project.title}</h2>
        <p className="mt-1 text-sm text-navy-500">{categoryById[project.category]?.label}</p>
      </div>

      {dispute && (
        <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm" role="alert">
          <ShieldAlert className="mt-0.5 shrink-0 text-red-600" size={20} />
          <div>
            <p className="font-bold text-red-900">Sengketa {dispute.status === "open" ? "sedang ditinjau admin" : "telah diselesaikan"}</p>
            <p className="mt-1 text-red-800">Diajukan oleh {dispute.openedBy}: “{dispute.reason}”</p>
            {dispute.status === "open" && <p className="mt-1 text-xs text-red-700">Dana tetap ditahan sampai admin memutuskan.</p>}
          </div>
        </div>
      )}
      {project.revisionNote && project.status === "in_progress" && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-gold-100/60 p-4 text-sm">
          <RotateCcw className="mt-0.5 shrink-0 text-amber-700" size={20} />
          <div><p className="font-bold text-amber-900">Catatan revisi dari klien</p><p className="mt-1 text-amber-900">{project.revisionNote}</p></div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <section className="card card-pad">
            <h3 className="font-extrabold">Deskripsi & hasil yang diminta</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-700">{project.description}</p>
            <ul className="mt-4 space-y-2">
              {project.deliverables.map((d) => (
                <li key={d} className="flex gap-2.5 text-sm text-navy-800"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-600" />{d}</li>
              ))}
            </ul>
          </section>

          <section className="card card-pad">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-extrabold">Tahapan pengerjaan</h3>
              <span className="text-xs font-semibold text-navy-500">{project.milestones.filter((m) => m.done).length}/{project.milestones.length} selesai</span>
            </div>
            <div className="mt-3">
              <Milestones milestones={project.milestones} editable={!isClient && project.status === "in_progress"} onToggle={(mid) => actions.toggleMilestone(project.id, mid)} />
            </div>
            {!isClient && project.status === "funding" && <p className="mt-3 rounded-lg bg-gold-100/60 px-3 py-2 text-xs text-amber-900">Kamu bisa mulai bekerja setelah klien mendanai escrow.</p>}
          </section>

          {project.review && (
            <section className="card card-pad">
              <h3 className="font-extrabold">Ulasan klien</h3>
              <div className="mt-2"><Stars value={project.review.rating} size={18} /></div>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">“{project.review.text}”</p>
              <p className="mt-2 text-xs text-navy-500">{client?.name} · {formatDate(project.review.createdAt)}</p>
            </section>
          )}
        </div>

        <div className="space-y-5">
          <section className="card card-pad space-y-3">
            <h3 className="font-extrabold">Rincian project</h3>
            <dl className="space-y-2.5">
              <DetailRow label="Budget awal">{budgetRange(project.budgetMin, project.budgetMax)}</DetailRow>
              <DetailRow label="Harga disepakati">{rupiah(project.price)}</DetailRow>
              <DetailRow label="Tenggat"><DeadlineText iso={project.deadline} /> · {formatDate(project.deadline)}</DetailRow>
              <DetailRow label="Mode kerja">{project.mode === "remote" ? "Remote" : `${project.city} · ${workModes[project.mode]}`}</DetailRow>
              <DetailRow label={isClient ? "Mahasiswa" : "Klien"}>
                <span className="inline-flex items-center gap-2"><Avatar name={isClient ? student?.name : client?.name} size={24} />{isClient ? student?.name : client?.name}</span>
              </DetailRow>
            </dl>
          </section>

          <section className="card card-pad space-y-4">
            <h3 className="flex items-center gap-2 font-extrabold"><Lock size={16} className="text-brand-600" /> Safe Escrow</h3>
            <EscrowSteps escrow={project.escrow} status={project.status} />
            <FeeBreakdown fees={fees} view={isClient ? "klien" : "mahasiswa"} />

            {isClient && project.status === "funding" && (
              <>
                <button disabled={!verified} onClick={() => { actions.fund(project.id); toast("Dana berhasil ditahan di escrow (simulasi)."); }} className="btn btn-brand w-full">
                  <Lock size={16} /> Danai escrow {rupiah(fees.clientTotal)}
                </button>
                <p className="text-xs text-navy-500">{verified ? "Simulasi: belum ada pembayaran sungguhan. Payment gateway diaktifkan menjelang peluncuran." : "Akunmu perlu diverifikasi admin sebelum bisa mendanai escrow."}</p>
              </>
            )}
            {!isClient && project.status === "in_progress" && (
              <button onClick={() => { actions.submitWork(project.id); toast("Hasil dikirim. Menunggu persetujuan klien.", "info"); }} className="btn btn-primary w-full">
                <Send size={16} /> Kirim hasil untuk disetujui
              </button>
            )}
            {isClient && project.status === "review" && (
              <div className="grid gap-2">
                <button onClick={() => setModal("approve")} className="btn btn-success w-full"><CheckCircle2 size={16} /> Setujui & cairkan dana</button>
                <button onClick={() => setModal("revision")} className="btn btn-outline w-full"><RotateCcw size={16} /> Minta revisi</button>
              </div>
            )}
            {!isClient && project.status === "review" && <p className="rounded-lg bg-navy-50 px-3 py-2.5 text-sm text-navy-700">Hasil sudah dikirim {project.submittedAt ? formatDate(project.submittedAt) : ""}. Menunggu persetujuan klien.</p>}
            {project.status === "completed" && project.escrow === "released" && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800">Dana {rupiah(isClient ? fees.clientTotal : fees.studentNet)} telah dicairkan {project.completedAt ? `pada ${formatDate(project.completedAt)}` : ""}.</p>
            )}
            {project.status === "cancelled" && <p className="rounded-lg bg-navy-50 px-3 py-2.5 text-sm text-navy-700">Project dibatalkan{project.escrow === "refunded" ? ". Dana dikembalikan ke klien." : "."}</p>}
            {canDispute && (
              <button onClick={() => setModal("dispute")} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"><Flag size={14} /> Ada masalah? Ajukan sengketa</button>
            )}
          </section>
        </div>
      </div>

      <Modal open={modal === "approve"} onClose={close} title="Setujui hasil & beri ulasan" size="sm"
        footer={<><button onClick={close} className="btn btn-ghost">Batal</button><button onClick={doApprove} className="btn btn-success">Setujui & cairkan</button></>}>
        <div className="space-y-4">
          <p className="text-sm text-navy-600">Dana {rupiah(fees.studentNet)} akan dicairkan ke {student?.name}. Tindakan ini tidak bisa dibatalkan.</p>
          <Field label="Rating"><StarInput value={rating} onChange={setRating} /></Field>
          <Field label="Ulasan (opsional)"><textarea className="input min-h-24" value={text} onChange={(e) => setText(e.target.value)} maxLength={400} placeholder="Ceritakan pengalamanmu bekerja dengan mahasiswa ini" /></Field>
        </div>
      </Modal>
      <Modal open={modal === "revision"} onClose={close} title="Minta revisi" size="sm"
        footer={<><button onClick={close} className="btn btn-ghost">Batal</button><button onClick={doRevision} className="btn btn-primary">Kirim permintaan</button></>}>
        <Field label="Apa yang perlu diperbaiki?" required><textarea className="input min-h-28" value={text} onChange={(e) => setText(e.target.value)} maxLength={500} placeholder="Jelaskan bagian yang belum sesuai secara spesifik" /></Field>
      </Modal>
      <Modal open={modal === "dispute"} onClose={close} title="Ajukan sengketa" size="sm"
        footer={<><button onClick={close} className="btn btn-ghost">Batal</button><button onClick={doDispute} className="btn btn-danger">Ajukan ke admin</button></>}>
        <div className="space-y-4">
          <p className="flex gap-2 text-sm text-navy-600"><AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" /> Dana tetap ditahan sampai admin SLance meninjau dan memutuskan.</p>
          <Field label="Jelaskan masalahnya" required><textarea className="input min-h-28" value={text} onChange={(e) => setText(e.target.value)} maxLength={600} /></Field>
        </div>
      </Modal>
    </div>
  );
}
