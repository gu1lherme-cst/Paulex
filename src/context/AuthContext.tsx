import { createContext, useContext, useMemo, useState } from "react";
import type { User } from "../types";
import { KEYS, load, remove, save } from "../lib/db";

/* E-mails com acesso ao Painel Administrativo (/admin). */
const ADMIN_EMAILS = ["guilhermehenrique777666@gmail.com"];

function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

interface AuthCtx {
  user: User | null;
  logged: boolean;
  isAdmin: boolean;
  login: (data: { nome?: string; email?: string }) => User;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    load<User | null>(KEYS.user, null),
  );
  const [logged, setLogged] = useState<boolean>(
    () => load<string>(KEYS.logged, "") === "1",
  );

  const login: AuthCtx["login"] = ({ nome, email }) => {
    const mail = (email || "").trim();
    const u: User = {
      nome: (nome || mail || "cliente").trim(),
      email: mail,
      admin: mail ? isAdminEmail(mail) : false,
    };
    setUser(u);
    setLogged(true);
    save(KEYS.user, u);
    save(KEYS.logged, "1");
    return u;
  };

  const logout = () => {
    setUser(null);
    setLogged(false);
    remove(KEYS.user);
    remove(KEYS.logged);
  };

  const value = useMemo<AuthCtx>(
    () => ({ user, logged, isAdmin: Boolean(user?.admin), login, logout }),
    [user, logged],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
