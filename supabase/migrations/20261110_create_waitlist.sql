-- Waitlist SLance. Dijalankan di Supabase project vbrzfzdsndqvlafxxcco.
-- Tabel dikunci (RLS aktif tanpa policy): publik tidak bisa membaca/menulis langsung.
-- Semua akses publik lewat dua fungsi di bawah.

create table public.waitlist (
  id bigint generated always as identity primary key,
  role text not null check (role in ('mahasiswa', 'umkm', 'startup', 'komunitas')),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 100),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  whatsapp text check (whatsapp is null or char_length(whatsapp) <= 20),
  campus text check (campus is null or char_length(campus) <= 120),
  business_name text check (business_name is null or char_length(business_name) <= 120),
  interest text check (interest is null or char_length(interest) <= 200),
  created_at timestamptz not null default now()
);

create unique index waitlist_email_unique on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

create or replace function public.join_waitlist(
  p_role text,
  p_full_name text,
  p_email text,
  p_whatsapp text default null,
  p_campus text default null,
  p_business_name text default null,
  p_interest text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id bigint;
  v_pos bigint;
  v_dup boolean := false;
  v_email text := lower(btrim(p_email));
begin
  insert into public.waitlist (role, full_name, email, whatsapp, campus, business_name, interest)
  values (
    p_role,
    btrim(p_full_name),
    v_email,
    nullif(btrim(p_whatsapp), ''),
    nullif(btrim(p_campus), ''),
    nullif(btrim(p_business_name), ''),
    nullif(btrim(p_interest), '')
  )
  on conflict ((lower(email))) do nothing
  returning id into v_id;

  if v_id is null then
    v_dup := true;
    select id into v_id from public.waitlist where lower(email) = v_email;
  end if;

  select count(*) into v_pos from public.waitlist where id <= v_id;

  return jsonb_build_object('position', v_pos, 'already_registered', v_dup);
end;
$$;

create or replace function public.waitlist_stats()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'total', count(*),
    'mahasiswa', count(*) filter (where role = 'mahasiswa'),
    'bisnis', count(*) filter (where role <> 'mahasiswa')
  )
  from public.waitlist;
$$;

revoke all on function public.join_waitlist(text, text, text, text, text, text, text) from public;
revoke all on function public.waitlist_stats() from public;
grant execute on function public.join_waitlist(text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.waitlist_stats() to anon, authenticated;
