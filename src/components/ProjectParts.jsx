import { CalendarClock, MapPin, Users, Wallet, Sparkles } from "lucide-react";
import { iconByName } from "../lib/icons";
import { categoryById, levels, workModes } from "../config";
import { budgetRange, cn, deadlineLabel, daysFromToday, formatDate, rupiah } from "../lib/format";
import { escrowMeta, projectStatusMeta } from "../lib/selectors";

export const CategoryIcon = ({ id, size = 18, className }) => {
  const Icon = iconByName(categoryById[id]?.icon);
  return <Icon size={size} className={className} />;
};

export function StatusBadge({ status }) {
  const m = projectStatusMeta[status] || projectStatusMeta.open;
  return <span className={cn("badge", m.badge)}>{m.label}</span>;
}

export function EscrowBadge({ escrow }) {
  const m = escrowMeta[escrow] || escrowMeta.none;
  return <span className={cn("badge", m.badge)}>{m.label}</span>;
}

export function LevelBadge({ level }) {
  const m = levels[level] || levels.pemula;
  return <span className={cn("badge", m.badge)}>{m.label}</span>;
}

export function DeadlineText({ iso, className }) {
  const n = daysFromToday(iso);
  const urgent = n !== null && n >= 0 && n <= 3;
  return <span className={cn(urgent ? "font-semibold text-red-600" : "", className)}>{deadlineLabel(iso)}</span>;
}

export function ProjectCard({ project, client, matchScore, onOpen, footer }) {
  const cat = categoryById[project.category];
  return (
    <article className="card card-pad flex h-full flex-col gap-4 transition hover:border-brand-300 hover:shadow-pop">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
          <CategoryIcon id={project.category} />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {matchScore >= 85 && (
            <span className="badge bg-gold-100 text-amber-800">
              <Sparkles size={12} /> Cocok {matchScore}%
            </span>
          )}
          <LevelBadge level={project.level} />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] leading-snug font-bold text-navy-900">{project.title}</h3>
        <p className="mt-1 truncate text-xs text-navy-500">
          {client?.name} · {cat?.short}
        </p>
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-navy-600">{project.description}</p>
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-navy-600">
        <div className="col-span-2 flex items-center gap-1.5"><Wallet size={14} className="shrink-0 text-navy-400" /><dt className="sr-only">Budget</dt><dd className="font-bold text-navy-900">{budgetRange(project.budgetMin, project.budgetMax)}</dd></div>
        <div className="flex items-center gap-1.5"><CalendarClock size={14} className="shrink-0 text-navy-400" /><dt className="sr-only">Tenggat</dt><dd><DeadlineText iso={project.deadline} /></dd></div>
        <div className="flex items-center gap-1.5"><MapPin size={14} className="shrink-0 text-navy-400" /><dt className="sr-only">Lokasi</dt><dd>{project.mode === "remote" ? "Remote" : `${project.city} · ${workModes[project.mode]}`}</dd></div>
        <div className="flex items-center gap-1.5"><Users size={14} className="shrink-0 text-navy-400" /><dt className="sr-only">Pelamar</dt><dd>{project.applicants.length} pelamar</dd></div>
      </dl>
      {footer ?? (
        <button onClick={() => onOpen?.(project)} className="btn btn-outline w-full">Lihat detail</button>
      )}
    </article>
  );
}

/** Rincian biaya escrow: transparan untuk klien maupun mahasiswa. */
export function FeeBreakdown({ fees, view = "klien" }) {
  const Row = ({ label, value, strong, minus }) => (
    <div className={cn("flex items-center justify-between gap-4 py-2 text-sm", strong && "border-t border-navy-200 pt-3 font-extrabold text-navy-900")}>
      <span className={strong ? "" : "text-navy-600"}>{label}</span>
      <span className={cn("tabular-nums", minus && "text-red-600")}>{minus ? "− " : ""}{rupiah(value)}</span>
    </div>
  );
  return (
    <div className="rounded-xl bg-navy-50 px-4 py-2">
      {view === "klien" ? (
        <>
          <Row label="Harga project" value={fees.price} />
          <Row label="Biaya layanan SLance (5%)" value={fees.clientFee} />
          <Row label="Total didanai ke escrow" value={fees.clientTotal} strong />
        </>
      ) : (
        <>
          <Row label="Honor project" value={fees.price} />
          <Row label="Komisi SLance (5%)" value={fees.studentFee} minus />
          <Row label="Yang kamu terima" value={fees.studentNet} strong />
        </>
      )}
    </div>
  );
}

export function EscrowSteps({ escrow, status }) {
  const funded = escrow === "held" || escrow === "released";
  const steps = [
    { label: "Dana didanai", done: funded },
    { label: "Dana ditahan", done: funded },
    { label: "Hasil disetujui", done: status === "completed" },
    { label: "Dana dicairkan", done: escrow === "released" },
  ];
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Tahapan escrow">
      {steps.map((s, i) => (
        <li key={s.label} className="text-center">
          <div className={cn("mx-auto flex size-8 items-center justify-center rounded-full text-xs font-bold", s.done ? "bg-emerald-600 text-white" : "bg-navy-100 text-navy-500")}>{s.done ? "✓" : i + 1}</div>
          <p className={cn("mt-1.5 text-[11px] leading-tight font-semibold", s.done ? "text-navy-900" : "text-navy-500")}>{s.label}</p>
        </li>
      ))}
    </ol>
  );
}

export function Milestones({ milestones, editable, onToggle }) {
  if (!milestones?.length) return <p className="text-sm text-navy-500">Belum ada tahapan pengerjaan.</p>;
  return (
    <ul className="space-y-2">
      {milestones.map((m) => (
        <li key={m.id}>
          <label className={cn("flex items-center gap-3 rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm", editable ? "cursor-pointer hover:bg-navy-50" : "")}>
            <input type="checkbox" checked={m.done} disabled={!editable} onChange={() => onToggle?.(m.id)} className="size-4 accent-brand-600" />
            <span className={cn("flex-1", m.done && "text-navy-500 line-through")}>{m.title}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

export const DetailRow = ({ label, children }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
    <dt className="w-36 shrink-0 text-sm text-navy-500">{label}</dt>
    <dd className="text-sm font-semibold text-navy-900">{children}</dd>
  </div>
);

export { formatDate };
