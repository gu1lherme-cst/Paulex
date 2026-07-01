import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { checkIsAdmin, getSession, onAuthStateChange, sendMagicLink, signOut } from "../services/authService";

/* ----------------------------------------------------------------------------
 * Sessão de administrador (login por magic link). Usado só pela página
 * /admin — o resto da loja não precisa de autenticação.
 * ------------------------------------------------------------------------- */

type AuthValue = {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const refresh = async (s: Session | null) => {
      setSession(s);
      if (!s) { setIsAdmin(false); return; }
      const admin = await checkIsAdmin();
      if (!cancelled) setIsAdmin(admin);
    };

    getSession().then(async (s) => {
      await refresh(s);
      if (!cancelled) setLoading(false);
    });

    const unsubscribe = onAuthStateChange((s) => { refresh(s); });
    return () => { cancelled = true; unsubscribe(); };
  }, []);

  const login = useCallback((email: string) => sendMagicLink(email), []);
  const logout = useCallback(() => signOut(), []);

  const value = useMemo<AuthValue>(
    () => ({ session, isAdmin, loading, login, logout }),
    [session, isAdmin, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
