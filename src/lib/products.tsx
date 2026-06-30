import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from "react";
import {
  DEFAULT_PRODUCTS, sanitizeCatalog, findById, inCategory, onlyOffers, searchList, relatedIn,
  type Product, type Category,
} from "../data/catalog";

/* ----------------------------------------------------------------------------
 * Catálogo reativo. Por padrão usa DEFAULT_PRODUCTS; se o painel admin tiver
 * salvo um catálogo no navegador (localStorage), usa esse. É a base para, no
 * futuro, trocar a fonte por uma API/backend sem mexer na loja.
 * ------------------------------------------------------------------------- */

const KEY = "paulex:catalogo";

function loadProducts(): { list: Product[]; custom: boolean } {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { list: DEFAULT_PRODUCTS, custom: false };
    const list = sanitizeCatalog(JSON.parse(raw));
    return list.length ? { list, custom: true } : { list: DEFAULT_PRODUCTS, custom: false };
  } catch {
    return { list: DEFAULT_PRODUCTS, custom: false };
  }
}

type ProductsValue = {
  products: Product[];
  isCustom: boolean;
  byId: (id: string) => Product | undefined;
  byCategory: (c: Category) => Product[];
  offers: () => Product[];
  search: (q: string) => Product[];
  related: (p: Product, n?: number) => Product[];
  upsert: (p: Product) => void;
  remove: (id: string) => void;
  replaceAll: (list: Product[]) => boolean;
  reset: () => void;
};

const ProductsContext = createContext<ProductsValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(loadProducts, []);
  const [products, setProducts] = useState<Product[]>(initial.list);
  const [isCustom, setIsCustom] = useState(initial.custom);

  const persist = useCallback((list: Product[]) => {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* modo privado */ }
    setIsCustom(true);
  }, []);

  const upsert = useCallback((p: Product) => {
    setProducts((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      const next = exists ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev];
      persist(next);
      return next;
    });
  }, [persist]);

  const remove = useCallback((id: string) => {
    setProducts((prev) => {
      const next = prev.filter((x) => x.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  const replaceAll = useCallback((list: Product[]) => {
    const clean = sanitizeCatalog(list);
    if (!clean.length) return false;
    setProducts(clean);
    persist(clean);
    return true;
  }, [persist]);

  const reset = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch { /* modo privado */ }
    setProducts(DEFAULT_PRODUCTS);
    setIsCustom(false);
  }, []);

  const byId = useCallback((id: string) => findById(products, id), [products]);
  const byCategory = useCallback((c: Category) => inCategory(products, c), [products]);
  const offers = useCallback(() => onlyOffers(products), [products]);
  const search = useCallback((q: string) => searchList(products, q), [products]);
  const related = useCallback((p: Product, n = 4) => relatedIn(products, p, n), [products]);

  const value = useMemo<ProductsValue>(
    () => ({ products, isCustom, byId, byCategory, offers, search, related, upsert, remove, replaceAll, reset }),
    [products, isCustom, byId, byCategory, offers, search, related, upsert, remove, replaceAll, reset]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts(): ProductsValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts precisa estar dentro de <ProductsProvider>");
  return ctx;
}
