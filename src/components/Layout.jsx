import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, RotateCcw, X, ChevronsUpDown } from "lucide-react";
import { Avatar, InstagramIcon, Logo } from "./ui";
import { useStore, useToast } from "../store/StoreContext";
import { brand } from "../config";
import { cn } from "../lib/format";

const roleHome = { mahasiswa: "/mahasiswa", klien: "/klien", admin: "/admin" };
const roleLabel = { mahasiswa: "Mahasiswa", klien: "Klien", admin: "Admin" };
export const homeFor = (role) => roleHome[role] || "/";

/* ---------------- Navbar publik ---------------- */
export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const { role } = useStore();
  const links = [
    { href: "/#masalah", label: "Masalah" },
    { href: "/#cara-kerja", label: "Cara Kerja" },
    { href: "/#fitur", label: "Fitur" },
    { href: "/#validasi", label: "Validasi" },
    { href: "/#tim", label: "Tim" },
    { href: "/#faq", label: "FAQ" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-navy-100/80 bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="SLance beranda" className="shrink-0">
          <Logo variant="wordmark" className="h-8" />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-50">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {role ? (
            <Link to={homeFor(role)} className="btn btn-primary">Buka Dashboard</Link>
          ) : (
            <>
              <Link to="/masuk" className="btn btn-ghost">Masuk</Link>
              <Link to="/#waitlist" className="btn btn-gold">Join Waitlist</Link>
            </>
          )}
        </div>
        <button className="cursor-pointer rounded-lg p-2 text-navy-800 hover:bg-navy-50 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-navy-100 bg-white lg:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-50">
                {l.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {role ? (
                <Link to={homeFor(role)} className="btn btn-primary col-span-2">Buka Dashboard</Link>
              ) : (
                <>
                  <Link to="/masuk" className="btn btn-outline" onClick={() => setOpen(false)}>Masuk</Link>
                  <Link to="/#waitlist" className="btn btn-gold" onClick={() => setOpen(false)}>Join Waitlist</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo variant="wordmark" light className="h-8" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-300">{brand.description}</p>
          <a href={brand.instagram.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-gold-400">
            <InstagramIcon size={18} /> {brand.instagram.handle}
          </a>
        </div>
        <FooterCol title="Platform" items={[["Cara kerja", "/#cara-kerja"], ["Fitur", "/#fitur"], ["Kategori jasa", "/#kategori"], ["FAQ", "/#faq"]]} />
        <FooterCol title="Bergabung" items={[["Join waitlist", "/#waitlist"], ["Daftar mahasiswa", "/daftar?peran=mahasiswa"], ["Daftar UMKM / startup", "/daftar?peran=klien"], ["Masuk", "/masuk"]]} />
        <FooterCol title="Tentang" items={[["Validasi pasar", "/#validasi"], ["Tim kami", "/#tim"]]} />
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SLance. {brand.course}.</p>
          <p>Tahap pra-peluncuran. Data dalam mode demo bersifat contoh.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <p className="text-sm font-bold text-white">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {items.map(([label, href]) => (
          <li key={label}>
            {href.startsWith("/#") ? (
              <a href={href} className="text-navy-300 hover:text-white">{label}</a>
            ) : (
              <Link to={href} className="text-navy-300 hover:text-white">{label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicLayout() {
  const { pathname, hash } = useLocation();
  // Gulir ke anchor (#bagian) setelah navigasi, atau ke atas jika tanpa anchor.
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 50);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
export function DashboardLayout({ role, items, accent = "navy" }) {
  const { me, role: current, actions } = useStore();
  const reset = actions.reset;
  const toast = useToast();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  if (!me || current !== role) return <Navigate to="/masuk" replace />;

  const logout = () => {
    actions.logout();
    nav("/");
  };
  const switchRole = (r) => {
    actions.loginDemo(r);
    nav(homeFor(r));
    setOpen(false);
  };
  const resetDemo = () => {
    reset();
    toast("Data demo dikembalikan ke kondisi awal.", "info");
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Link to="/" aria-label="Ke beranda">
          <Logo variant="wordmark" light className="h-7" />
        </Link>
      </div>
      <div className="px-3 pt-4">
        <p className="px-3 pb-2 text-[11px] font-bold tracking-[0.14em] text-navy-400 uppercase">Tampilan {roleLabel[role]}</p>
        <nav className="space-y-1" aria-label="Menu dashboard">
          {items.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", isActive ? "bg-white text-navy-900" : "text-navy-200 hover:bg-white/10 hover:text-white")
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {badge > 0 && <span className="rounded-full bg-gold-500 px-1.5 py-0.5 text-[11px] font-bold text-navy-950">{badge}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto space-y-3 border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-gold-400 uppercase">
            <ChevronsUpDown size={12} /> Mode demo · ganti peran
          </p>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {["mahasiswa", "klien", "admin"].map((r) => (
              <button key={r} onClick={() => switchRole(r)} className={cn("cursor-pointer rounded-lg px-1 py-1.5 text-[11px] font-bold transition", r === role ? "bg-white text-navy-900" : "bg-white/10 text-navy-100 hover:bg-white/20")}>
                {roleLabel[r]}
              </button>
            ))}
          </div>
          <button onClick={resetDemo} className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-navy-300 hover:bg-white/10 hover:text-white">
            <RotateCcw size={12} /> Reset data demo
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Avatar name={me.name} size={36} className="!bg-brand-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{me.name}</p>
            <p className="truncate text-xs text-navy-300">{roleLabel[role]}</p>
          </div>
          <button onClick={logout} className="cursor-pointer rounded-lg p-2 text-navy-300 hover:bg-white/10 hover:text-white" aria-label="Keluar">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-50/60">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-navy-900 lg:block">{sidebar}</aside>

      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-navy-100 bg-white px-4 lg:hidden">
        <button onClick={() => setOpen(true)} className="-ml-2 cursor-pointer rounded-lg p-2 text-navy-800" aria-label="Buka menu">
          <Menu size={22} />
        </button>
        <Logo variant="wordmark" className="h-6" />
        <Avatar name={me.name} size={32} className="!bg-brand-600" />
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} aria-label="Tutup menu" />
          <aside className="animate-fade-up absolute inset-y-0 left-0 w-72 bg-navy-900">{sidebar}</aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
