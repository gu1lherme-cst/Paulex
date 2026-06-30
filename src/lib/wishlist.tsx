import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from "react";
import type { Product } from "../data/catalog";
import { useProducts } from "./products";

const KEY = "paulex:favoritos";

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

type WishlistValue = {
  ids: string[];
  items: Product[];
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
};

const WishlistContext = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { byId } = useProducts();
  const [ids, setIds] = useState<string[]>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* modo privado */ }
  }, [ids]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  /* Itens favoritos existentes no catálogo atual (ignora ids removidos). */
  const items = useMemo(
    () => ids.map((id) => byId(id)).filter((p): p is Product => !!p),
    [ids, byId]
  );

  const value = useMemo<WishlistValue>(
    () => ({ ids, items, count: items.length, has, toggle }),
    [ids, items, has, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist precisa estar dentro de <WishlistProvider>");
  return ctx;
}
