import { Link, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./components/Layout";
import Landing from "./pages/Landing";
import { Login, Register } from "./pages/Auth";
import {
  StudentBrowse, StudentEarnings, StudentGuide, StudentLayout, StudentOverview, StudentPortfolio, StudentProfile, StudentProjectDetail, StudentProjects, StudentWorkspace,
} from "./pages/student/Student";
import { ClientLayout, ClientOverview, ClientPayments, ClientPost, ClientProfile, ClientProjectDetail, ClientProjects } from "./pages/client/Client";
import { AdminEscrow, AdminLayout, AdminModeration, AdminOverview, AdminSurvey, AdminVerify, AdminWaitlist } from "./pages/admin/Admin";
import { Logo } from "./components/ui";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Logo variant="wordmark" className="h-9" />
      <p className="text-6xl font-extrabold text-navy-900">404</p>
      <p className="text-navy-600">Halaman yang kamu cari tidak ditemukan.</p>
      <Link to="/" className="btn btn-primary">Kembali ke beranda</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Landing />} />
        <Route path="masuk" element={<Login />} />
        <Route path="daftar" element={<Register />} />
      </Route>

      <Route path="mahasiswa" element={<StudentLayout />}>
        <Route index element={<StudentOverview />} />
        <Route path="cari" element={<StudentBrowse />} />
        <Route path="cari/:id" element={<StudentProjectDetail />} />
        <Route path="project" element={<StudentProjects />} />
        <Route path="project/:id" element={<StudentWorkspace />} />
        <Route path="portofolio" element={<StudentPortfolio />} />
        <Route path="penghasilan" element={<StudentEarnings />} />
        <Route path="profil" element={<StudentProfile />} />
        <Route path="panduan" element={<StudentGuide />} />
      </Route>

      <Route path="klien" element={<ClientLayout />}>
        <Route index element={<ClientOverview />} />
        <Route path="posting" element={<ClientPost />} />
        <Route path="project" element={<ClientProjects />} />
        <Route path="project/:id" element={<ClientProjectDetail />} />
        <Route path="pembayaran" element={<ClientPayments />} />
        <Route path="profil" element={<ClientProfile />} />
      </Route>

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="verifikasi" element={<AdminVerify />} />
        <Route path="moderasi" element={<AdminModeration />} />
        <Route path="escrow" element={<AdminEscrow />} />
        <Route path="waitlist" element={<AdminWaitlist />} />
        <Route path="validasi" element={<AdminSurvey />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
