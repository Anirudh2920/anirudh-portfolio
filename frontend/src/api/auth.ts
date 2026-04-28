// Module-level access token. Never persisted to localStorage.
// On full reload we silently refresh from the httpOnly cookie.
let _token: string | null = null;
const _listeners = new Set<(t: string | null) => void>();

export const authToken = {
  get: (): string | null => _token,
  set: (t: string | null): void => {
    _token = t;
    _listeners.forEach((fn) => fn(t));
  },
  subscribe: (fn: (t: string | null) => void): (() => void) => {
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  },
};
