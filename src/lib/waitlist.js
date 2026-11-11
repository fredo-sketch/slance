import { supabase } from "./supabase";

/**
 * Daftar waitlist lewat fungsi database `join_waitlist` (lihat supabase/migrations).
 * Mengembalikan { position, alreadyRegistered }. Melempar Error berpesan Indonesia jika gagal.
 */
export async function joinWaitlist({ role, fullName, email, whatsapp, campus, businessName, interest }) {
  const { data, error } = await supabase.rpc("join_waitlist", {
    p_role: role,
    p_full_name: fullName,
    p_email: email,
    p_whatsapp: whatsapp || null,
    p_campus: campus || null,
    p_business_name: businessName || null,
    p_interest: interest || null,
  });

  if (error) {
    if (error.code === "23514") throw new Error("Data belum valid. Periksa kembali nama dan email kamu.");
    throw new Error("Pendaftaran gagal. Periksa koneksi internet lalu coba lagi.");
  }
  return { position: Number(data?.position) || 0, alreadyRegistered: Boolean(data?.already_registered) };
}

/** Statistik publik waitlist: { total, mahasiswa, bisnis }. Mengembalikan null jika gagal. */
export async function getWaitlistStats() {
  const { data, error } = await supabase.rpc("waitlist_stats");
  if (error || !data) return null;
  return { total: Number(data.total) || 0, mahasiswa: Number(data.mahasiswa) || 0, bisnis: Number(data.bisnis) || 0 };
}
