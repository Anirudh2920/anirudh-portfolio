import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

export default function AdminLayout(): React.ReactElement {
  const auth = useAuth();
  const [theme, toggleTheme] = useTheme();

  if (!auth.ready) {
    return (
      <div style={{ padding: 60, fontFamily: "var(--mono)" }}>$ checking session…</div>
    );
  }
  if (!auth.token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="admin-brand">
          <span className="dot dot-r" />
          <span className="dot dot-y" />
          <span className="dot dot-g" />
          <span className="admin-brand-name">$ admin · {auth.username}</span>
        </div>
        <div className="admin-top-actions">
          <button className="cmd-btn cmd-btn-ghost" onClick={toggleTheme}>
            <span className="cmd-bracket">[</span>
            <span className="cmd-content">{theme === "dark" ? "light" : "dark"}</span>
            <span className="cmd-bracket">]</span>
          </button>
          <button className="cmd-btn" onClick={() => void auth.logout()}>
            <span className="cmd-bracket">[</span>
            <span className="cmd-content">logout</span>
            <span className="cmd-bracket">]</span>
          </button>
        </div>
      </header>
      <div className="admin-body">
        <nav className="admin-nav">
          <NavLink to="/admin" end>profile</NavLink>
          <NavLink to="/admin/about">about</NavLink>
          <NavLink to="/admin/experience">experience</NavLink>
          <NavLink to="/admin/projects">projects</NavLink>
          <NavLink to="/admin/stack">stack</NavLink>
          <NavLink to="/admin/certs">certifications</NavLink>
        </nav>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
