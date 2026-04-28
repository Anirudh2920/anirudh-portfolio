import { useEffect, useState } from "react";
import { authToken } from "@/api/auth";
import { api } from "@/api/client";

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

interface MeResponse {
  username: string;
}

interface AuthState {
  token: string | null;
  username: string | null;
  ready: boolean;
}

export function useAuth(): AuthState & {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({
    token: authToken.get(),
    username: null,
    ready: false,
  });

  // Subscribe to token changes
  useEffect(() => {
    return authToken.subscribe((t) => setState((s) => ({ ...s, token: t })));
  }, []);

  // Try to silently refresh on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (authToken.get()) {
        setState((s) => ({ ...s, ready: true }));
        return;
      }
      try {
        const r = await api.post<TokenResponse>("/api/auth/refresh");
        if (cancelled) return;
        authToken.set(r.access_token);
        try {
          const me = await api.get<MeResponse>("/api/auth/me", true);
          if (!cancelled) setState((s) => ({ ...s, username: me.username, ready: true }));
        } catch {
          if (!cancelled) setState((s) => ({ ...s, ready: true }));
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, ready: true }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const r = await api.post<TokenResponse>("/api/auth/login", { username, password });
    authToken.set(r.access_token);
    const me = await api.get<MeResponse>("/api/auth/me", true);
    setState((s) => ({ ...s, username: me.username, ready: true }));
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore — clearing token client-side is enough
    }
    authToken.set(null);
    setState({ token: null, username: null, ready: true });
  };

  return { ...state, login, logout };
}
