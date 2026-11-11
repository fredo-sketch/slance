import { createClient } from "@supabase/supabase-js";

// URL dan publishable key aman berada di sisi klien (akses dibatasi Row Level Security).
// Bisa ditimpa lewat environment variable VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (lihat .env.example).
const url = import.meta.env.VITE_SUPABASE_URL || "https://vbrzfzdsndqvlafxxcco.supabase.co";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_xUUdK7jB_PfsQBw46iuyZg_dVYD1x3N";

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true },
});
