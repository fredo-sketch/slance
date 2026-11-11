export const cn = (...args) => args.filter(Boolean).join(" ");

export const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n) || 0);

/** 1500000 -> "Rp1,5 jt" */
export const rupiahShort = (n) => {
  const v = Number(n) || 0;
  if (v >= 1_000_000) return `Rp${(v / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  if (v >= 1_000) return `Rp${Math.round(v / 1_000).toLocaleString("id-ID")} rb`;
  return `Rp${v}`;
};

export const budgetRange = (min, max) => (min === max ? rupiahShort(min) : `${rupiahShort(min)} – ${rupiahShort(max)}`);

export const formatDate = (iso, opts = { day: "numeric", month: "short", year: "numeric" }) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID", opts);
};

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Selisih hari dari hari ini (positif = di masa depan). */
export const daysFromToday = (iso) => {
  if (!iso) return null;
  return Math.round((startOfDay(new Date(iso)) - startOfDay(new Date())) / 86_400_000);
};

export const deadlineLabel = (iso) => {
  const n = daysFromToday(iso);
  if (n === null) return "-";
  if (n < 0) return `Lewat ${Math.abs(n)} hari`;
  if (n === 0) return "Hari ini";
  if (n === 1) return "Besok";
  return `${n} hari lagi`;
};

export const timeAgo = (iso) => {
  const n = daysFromToday(iso);
  if (n === null) return "";
  if (n === 0) return "hari ini";
  if (n === -1) return "kemarin";
  if (n < 0) return `${Math.abs(n)} hari lalu`;
  return formatDate(iso);
};

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

export const pct = (part, total) => (total ? Math.round((part / total) * 100) : 0);

/** Tanggal ISO (yyyy-mm-dd) n hari dari hari ini. */
export const dayOffset = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const uid = (prefix = "id") => `${prefix}${Math.random().toString(36).slice(2, 8)}`;
