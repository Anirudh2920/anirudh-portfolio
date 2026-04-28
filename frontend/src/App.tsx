import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PortfolioRoute from "./routes/PortfolioRoute";

const LoginRoute = lazy(() => import("./routes/admin/LoginRoute"));
const AdminLayout = lazy(() => import("./routes/admin/AdminLayout"));
const ProfileEditor = lazy(() => import("./routes/admin/ProfileEditor"));
const AboutEditor = lazy(() => import("./routes/admin/AboutEditor"));
const ExperienceEditor = lazy(() => import("./routes/admin/ExperienceEditor"));
const ProjectsEditor = lazy(() => import("./routes/admin/ProjectsEditor"));
const StackEditor = lazy(() => import("./routes/admin/StackEditor"));
const CertsEditor = lazy(() => import("./routes/admin/CertsEditor"));

function AdminFallback(): React.ReactElement {
  return <div style={{ padding: 40, fontFamily: "var(--mono)" }}>$ loading admin…</div>;
}

export default function App(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<PortfolioRoute />} />
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <LoginRoute />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLayout />
          </Suspense>
        }
      >
        <Route index element={<Suspense fallback={<AdminFallback />}><ProfileEditor /></Suspense>} />
        <Route path="about" element={<Suspense fallback={<AdminFallback />}><AboutEditor /></Suspense>} />
        <Route path="experience" element={<Suspense fallback={<AdminFallback />}><ExperienceEditor /></Suspense>} />
        <Route path="projects" element={<Suspense fallback={<AdminFallback />}><ProjectsEditor /></Suspense>} />
        <Route path="stack" element={<Suspense fallback={<AdminFallback />}><StackEditor /></Suspense>} />
        <Route path="certs" element={<Suspense fallback={<AdminFallback />}><CertsEditor /></Suspense>} />
      </Route>
      <Route path="*" element={<div style={{ padding: 60 }}>404 — no such route</div>} />
    </Routes>
  );
}
