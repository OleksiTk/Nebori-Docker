"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type AuthUser = {
  id: number;
  username: string;
  email: string;
  avatar?: string;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "nebori.auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { token?: string; user?: AuthUser };
      if (parsed.token && parsed.user) {
        setToken(parsed.token);
        setUser(parsed.user);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const tokenRef = useRef<string | null>(null);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);
  const login = useCallback((nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser }),
    );
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((current) => {
      if (!current) return current;
      const nextUser = { ...current, ...patch };
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { token?: string };
          localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
              token: parsed.token ?? tokenRef.current,
              user: nextUser,
            }),
          );
        } catch {
          localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ token: tokenRef.current, user: nextUser }),
          );
        }
      }
      return nextUser;
    });
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const g: any = window;
    if (g.__nebori_fetch_patched) return;
    const originalFetch = window.fetch.bind(window);
    g.__nebori_original_fetch = originalFetch;
    g.__nebori_fetch_patched = true;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      let tokenToUse: string | null = tokenRef.current;
      if (!tokenToUse) {
        try {
          const raw = localStorage.getItem(AUTH_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            tokenToUse = parsed?.token ?? null;
          }
        } catch {
          tokenToUse = null;
        }
      }

      const mergedInit: RequestInit = { ...(init || {}) };
      const headers = new Headers(
        mergedInit.headers ??
          (input instanceof Request ? input.headers : undefined),
      );

      // Avoid sending Authorization on auth endpoints (register/login/refresh)
      const urlString =
        typeof input === "string"
          ? input
          : input instanceof Request
            ? input.url
            : String(input);
      const isAuthEndpoint =
        /\/api\/auth\//i.test(urlString) || /\/auth\//i.test(urlString);
      if (!isAuthEndpoint && tokenToUse) {
        headers.set("Authorization", `Bearer ${tokenToUse}`);
      } else {
        headers.delete("Authorization");
      }

      mergedInit.headers = headers;

      const fetchInput =
        input instanceof Request ? new Request(input, mergedInit) : input;
      const response = await originalFetch(
        fetchInput,
        mergedInit as RequestInit,
      );

      try {
        const clone = response.clone();
        const data = await clone.json().catch(() => null);
        if (data && (data.access || data.token) && data.user) {
          const nextToken = data.access || data.token;
          const nextUser = data.user as AuthUser;
          login(nextToken, nextUser);
        }
      } catch {}

      return response;
    };

    return () => {
      if (g.__nebori_original_fetch) {
        window.fetch = g.__nebori_original_fetch;
      }
      g.__nebori_fetch_patched = false;
    };
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      updateUser,
      logout,
    }),
    [login, logout, token, updateUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
