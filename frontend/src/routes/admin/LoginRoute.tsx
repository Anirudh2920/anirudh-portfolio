import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function LoginRoute(): React.ReactElement {
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (auth.ready && auth.token) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await auth.login(username, password);
      navigate("/admin", { replace: true });
    } catch {
      setError("invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-shell">
      <form className="hero-window login-window" onSubmit={onSubmit}>
        <div className="window-chrome">
          <span className="dot dot-r" />
          <span className="dot dot-y" />
          <span className="dot dot-g" />
          <span className="window-title">login.sh — bash</span>
        </div>
        <div className="terminal-body">
          <div className="term-line term-cmd">
            <span className="term-prompt">$</span> login --user
          </div>
          <input
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
          />
          <div className="term-line term-cmd">
            <span className="term-prompt">$</span> login --pass
          </div>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <div className="term-line term-out login-error">→ {error}</div>}
          <div className="hero-ctas" style={{ marginTop: 16 }}>
            <button
              type="submit"
              className="cmd-btn cmd-btn-primary"
              disabled={busy}
            >
              <span className="cmd-bracket">[</span>
              <span className="cmd-content">
                {busy ? "authenticating…" : "↵ authenticate"}
              </span>
              <span className="cmd-bracket">]</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
