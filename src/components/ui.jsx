import { useEffect } from "react";
import { Star, X, Inbox } from "lucide-react";
import { cn, initials } from "../lib/format";

export function Logo({ variant = "full", className = "h-9", light = false }) {
  const src = variant === "icon" ? "/logo/slance-icon.svg" : variant === "wordmark" ? "/logo/slance-logo.svg" : "/logo/slance-logo-full.svg";
  const img = <img src={src} alt="SLance" className={cn("w-auto select-none", className)} draggable="false" />;
  if (!light) return img;
  // Di latar gelap, logo dibungkus panel putih agar warna navy tetap terbaca.
  return <span className="inline-flex items-center rounded-xl bg-white px-3 py-2">{img}</span>;
}

export function InstagramIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function Avatar({ name, src, size = 40, className }) {
  const style = { width: size, height: size, fontSize: size * 0.38 };
  if (src) return <img src={src} alt={name} style={style} className={cn("rounded-full object-cover", className)} />;
  return (
    <span style={style} className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-navy-900 font-bold text-white", className)} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export function Stars({ value = 0, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? "fill-gold-500 text-gold-500" : "text-navy-200"} />
      ))}
    </span>
  );
}

export function StarInput({ value, onChange }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Beri rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" role="radio" aria-checked={value === i} aria-label={`${i} bintang`} onClick={() => onChange(i)} className="cursor-pointer rounded p-0.5">
          <Star size={28} className={i <= value ? "fill-gold-500 text-gold-500" : "text-navy-200 hover:text-gold-400"} />
        </button>
      ))}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  const width = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 cursor-default bg-navy-950/60 backdrop-blur-[2px]" onClick={onClose} aria-label="Tutup" tabIndex={-1} />
      <div className={cn("animate-fade-up relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-pop sm:rounded-3xl", width)}>
        <div className="flex items-start justify-between gap-4 border-b border-navy-100 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-extrabold text-navy-900">{title}</h2>
          <button onClick={onClose} className="-mr-2 cursor-pointer rounded-lg p-2 text-navy-500 hover:bg-navy-50" aria-label="Tutup">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-navy-100 bg-navy-50/50 px-5 py-3.5 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, sub, tone = "navy" }) {
  const tones = { navy: "bg-navy-100 text-navy-800", blue: "bg-brand-100 text-brand-700", green: "bg-emerald-100 text-emerald-700", gold: "bg-gold-100 text-amber-700", red: "bg-red-100 text-red-700" };
  return (
    <div className="card card-pad">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-navy-500">{label}</p>
          <p className="mt-1.5 truncate text-2xl font-extrabold tracking-tight text-navy-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-navy-500">{sub}</p>}
        </div>
        {Icon && (
          <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
            <Icon size={20} />
          </span>
        )}
      </div>
    </div>
  );
}

export function PageHeader({ title, desc, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-[1.7rem]">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-sm text-navy-600">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Empty({ title, desc, action, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-navy-200 bg-navy-50/40 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-navy-100 text-navy-500">
        <Icon size={22} />
      </span>
      <p className="mt-4 font-bold text-navy-900">{title}</p>
      {desc && <p className="mt-1 max-w-sm text-sm text-navy-600">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="-mx-1 mb-5 flex gap-1 overflow-x-auto px-1 pb-1" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition",
            value === t.id ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-50",
          )}
        >
          {t.label}
          {t.count != null && (
            <span className={cn("rounded-full px-1.5 py-0.5 text-[11px]", value === t.id ? "bg-white/20" : "bg-navy-100 text-navy-700")}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, hint, error, children, required }) {
  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

export function ProgressBar({ value, className }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-navy-100", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
