import { fees, badgeLevels, categories } from "../config";

/** Hitung rincian biaya untuk sebuah harga project (dalam rupiah). */
export function calcFees(price) {
  const p = Number(price) || 0;
  const clientFee = Math.round(p * fees.clientRate);
  const studentFee = Math.round(p * fees.studentRate);
  return {
    price: p,
    clientFee, // biaya layanan yang ditambahkan ke tagihan klien
    studentFee, // potongan dari honor mahasiswa
    clientTotal: p + clientFee, // total yang didanai klien ke escrow
    studentNet: p - studentFee, // yang diterima mahasiswa
    platformRevenue: clientFee + studentFee,
  };
}

export const projectsOfStudent = (projects, studentId) => projects.filter((p) => p.hiredStudentId === studentId);

export const appliedByStudent = (projects, studentId) =>
  projects
    .map((p) => ({ project: p, application: p.applicants.find((a) => a.studentId === studentId) }))
    .filter((x) => x.application);

/** Statistik performa & penghasilan mahasiswa (semua dihitung dari data project). */
export function studentStats(projects, payouts, studentId) {
  const mine = projectsOfStudent(projects, studentId);
  const completed = mine.filter((p) => p.status === "completed");
  const active = mine.filter((p) => p.status === "in_progress" || p.status === "funding");
  const inReview = mine.filter((p) => p.status === "review");
  const ratings = completed.map((p) => p.review?.rating).filter(Boolean);
  const rating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

  const released = completed.filter((p) => p.escrow === "released").reduce((s, p) => s + calcFees(p.price).studentNet, 0);
  const escrowHeld = [...active, ...inReview].filter((p) => p.escrow === "held").reduce((s, p) => s + calcFees(p.price).studentNet, 0);
  const withdrawn = payouts.filter((x) => x.studentId === studentId).reduce((s, x) => s + x.amount, 0);

  return {
    completed: completed.length,
    active: active.length,
    inReview: inReview.length,
    rating,
    reviews: ratings.length,
    totalEarned: released,
    escrowHeld,
    withdrawn,
    available: Math.max(0, released - withdrawn),
  };
}

/** Badge skill per kategori dihitung dari jumlah project selesai di kategori itu. */
export function badgesFor(projects, studentId) {
  const done = projects.filter((p) => p.hiredStudentId === studentId && p.status === "completed");
  return categories
    .map((cat) => {
      const count = done.filter((p) => p.category === cat.id).length;
      const earned = [...badgeLevels].reverse().find((l) => count >= l.min) || null;
      const next = badgeLevels.find((l) => count < l.min) || null;
      return { category: cat.id, label: cat.label, short: cat.short, count, level: earned, next };
    })
    .filter((b) => b.count > 0 || false);
}

/** Semua kategori beserta progres badge (termasuk yang belum dimulai). */
export function badgeProgress(projects, studentId) {
  const done = projects.filter((p) => p.hiredStudentId === studentId && p.status === "completed");
  return categories.map((cat) => {
    const count = done.filter((p) => p.category === cat.id).length;
    const earned = [...badgeLevels].reverse().find((l) => count >= l.min) || null;
    const next = badgeLevels.find((l) => count < l.min) || null;
    return { category: cat.id, label: cat.label, short: cat.short, icon: cat.icon, count, level: earned, next };
  });
}

/** Skor kecocokan 0–100 antara mahasiswa dan project (untuk rekomendasi). */
export function matchScore(student, project) {
  if (!student || !project) return 0;
  let score = 20;
  if (student.skills.includes(project.category)) score += 50;
  if (project.level === "pemula") score += 10;
  if (project.mode === "remote" || project.city === student.city) score += 15;
  if (project.applicants.length <= 1) score += 5;
  return Math.min(100, score);
}

/** Ringkasan platform untuk dashboard admin. */
export function platformStats({ students, clients, projects, disputes }) {
  const funded = projects.filter((p) => p.escrow === "held" || p.escrow === "released");
  const held = projects.filter((p) => p.escrow === "held");
  const released = projects.filter((p) => p.escrow === "released");
  return {
    students: students.length,
    clients: clients.length,
    projectsTotal: projects.length,
    projectsOpen: projects.filter((p) => p.status === "open" && p.moderation === "approved").length,
    projectsActive: projects.filter((p) => ["funding", "in_progress", "review"].includes(p.status)).length,
    projectsDone: projects.filter((p) => p.status === "completed").length,
    gmv: funded.reduce((s, p) => s + p.price, 0),
    escrowHeld: held.reduce((s, p) => s + calcFees(p.price).clientTotal, 0),
    revenue: released.reduce((s, p) => s + calcFees(p.price).platformRevenue, 0),
    pendingStudents: students.filter((s) => s.verification === "pending").length,
    pendingClients: clients.filter((c) => c.verification === "pending").length,
    pendingProjects: projects.filter((p) => p.moderation === "pending" || p.moderation === "flagged").length,
    openDisputes: disputes.filter((d) => d.status === "open").length,
  };
}

export const projectStatusMeta = {
  open: { label: "Terbuka", badge: "badge-blue" },
  funding: { label: "Menunggu pendanaan", badge: "badge-amber" },
  in_progress: { label: "Berjalan", badge: "badge-amber" },
  review: { label: "Menunggu persetujuan", badge: "badge-navy" },
  completed: { label: "Selesai", badge: "badge-green" },
  cancelled: { label: "Dibatalkan", badge: "badge-slate" },
};

export const escrowMeta = {
  none: { label: "Belum didanai", badge: "badge-slate" },
  held: { label: "Ditahan di escrow", badge: "badge-amber" },
  released: { label: "Dicairkan", badge: "badge-green" },
  refunded: { label: "Dikembalikan", badge: "badge-slate" },
};
