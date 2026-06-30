import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from "react";
import { PRODUCTS, productById, type Product } from "../data/catalog";

const KEY = "paulex:favoritos";
const validIds = new Set(PRODUCTS.map((p) => p.id));

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string" && validIds.has(id)) : [];
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
  const [ids, setIds] = useState<string[]>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* modo privado */ }
  }, [ids]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback((id: string) => {
    if (!validIds.has(id)) return;
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const items = useMemo(
    () => ids.map((id) => productById(id)).filter((p): p is Product => !!p),
    [ids]
  );

  const value = useMemo<WishlistValue>(
    () => ({ ids, items, count: ids.length, has, toggle }),
    [ids, items, has, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist precisa estar dentro de <WishlistProvider>");
  return ctx;
}
