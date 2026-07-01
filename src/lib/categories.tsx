import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from "react";
import { categorySlug, type IconName, type Tone } from "../data/catalog";
import { listActiveCategories } from "../services/categoriesService";
import type { CategoryRow } from "../services/types";

/* ----------------------------------------------------------------------------
 * Categorias ativas, buscadas do Supabase. Usado pelo cabeçalho (dropdown de
 * busca), pela home (cards de categoria) e pela listagem (chips de filtro).
 * ------------------------------------------------------------------------- */

export type CategoryCard = { name: string; slug: string; desc: string; icon: IconName; tone: Tone };

type CategoriesValue = {
  categories: CategoryCard[];
  names: string[];
  loading: boolean;
  error: string | null;
  bySlug: (slug: string) => CategoryCard | undefined;
  reload: () => void;
};

const CategoriesContext = createContext<CategoriesValue | null>(null);

function toCard(row: CategoryRow): CategoryCard {
  return {
    name: row.name,
    slug: row.slug || categorySlug(row.name),
    desc: row.description ?? "",
    icon: row.icon as IconName,
    tone: row.tone as Tone,
  };
}

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listActiveCategories()
      .then((rows) => { if (!cancelled) { setCategories(rows.map(toCard)); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Erro ao carregar categorias."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  const bySlug = useCallback((slug: string) => categories.find((c) => c.slug === slug), [categories]);
  const names = useMemo(() => categories.map((c) => c.name), [categories]);

  const value = useMemo<CategoriesValue>(
    () => ({ categories, names, loading, error, bySlug, reload }),
    [categories, names, loading, error, bySlug, reload]
  );

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories(): CategoriesValue {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories precisa estar dentro de <CategoriesProvider>");
  return ctx;
}
