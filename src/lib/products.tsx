import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from "react";
import {
  findById, inCategory, onlyOffers, searchList, relatedIn, type Product, type Category,
} from "../data/catalog";
import { listActiveProducts } from "../services/productsService";

/* ----------------------------------------------------------------------------
 * Catálogo de produtos ativos, buscado do Supabase. A API pública deste
 * contexto (products, byId, byCategory, offers, search, related) é a mesma
 * de antes — só a origem dos dados mudou de localStorage para o banco.
 * Cadastro/edição de produtos passou a ser feito direto pelo painel admin
 * via src/services/productsService.ts.
 * ------------------------------------------------------------------------- */

type ProductsValue = {
  products: Product[];
  loading: boolean;
  error: string | null;
  byId: (id: string) => Product | undefined;
  byCategory: (c: Category) => Product[];
  offers: () => Product[];
  search: (q: string) => Product[];
  related: (p: Product, n?: number) => Product[];
  reload: () => void;
};

const ProductsContext = createContext<ProductsValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listActiveProducts()
      .then((list) => { if (!cancelled) { setProducts(list); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Erro ao carregar produtos."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  const byId = useCallback((id: string) => findById(products, id), [products]);
  const byCategory = useCallback((c: Category) => inCategory(products, c), [products]);
  const offers = useCallback(() => onlyOffers(products), [products]);
  const search = useCallback((q: string) => searchList(products, q), [products]);
  const related = useCallback((p: Product, n = 4) => relatedIn(products, p, n), [products]);

  const value = useMemo<ProductsValue>(
    () => ({ products, loading, error, byId, byCategory, offers, search, related, reload }),
    [products, loading, error, byId, byCategory, offers, search, related, reload]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts(): ProductsValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts precisa estar dentro de <ProductsProvider>");
  return ctx;
}
