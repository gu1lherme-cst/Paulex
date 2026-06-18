import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CATEGORIES } from "../data/catalog";
import { useStore } from "../context/StoreContext";
import { TopBar } from "../components/Layout";
import { ProductCard } from "../components/ProductCard";
import { productMatches } from "../components/SearchBox";
import type { Product } from "../types";

type Sort = "relevancia" | "menor" | "maior" | "avaliados";

function resolve(kind: string, products: Product[], favs: Set<string>) {
  if (kind.startsWith("busca:")) {
    const termo = decodeURIComponent(kind.slice(6));
    const q = termo.toLowerCase();
    return { title: `Busca: ${termo}`, list: products.filter((p) => productMatches(p, q)) };
  }
  if (kind.startsWith("cat:")) {
    const cat = CATEGORIES.find((c) => c.id === kind.slice(4));
    return {
      title: cat ? cat.nome : "Produtos",
      list: products.filter((p) => p.cat === cat?.id),
    };
  }
  if (kind === "promocoes" || kind === "ofertas")
    return { title: "Promoções", list: products.filter((p) => p.promo) };
  if (kind === "novidades")
    return { title: "Novidades", list: products.filter((p) => p.novidade) };
  if (kind === "favoritos")
    return { title: "Favoritos", list: products.filter((p) => favs.has(p.id)) };
  return { title: "Mais vendidos", list: products.filter((p) => p.maisVendido) };
}

export function Lista() {
  const { kind = "maisvendidos" } = useParams();
  const { products, favs } = useStore();
  const [sort, setSort] = useState<Sort>("relevancia");

  const { title, list } = useMemo(
    () => resolve(kind, products, favs),
    [kind, products, favs],
  );

  const sorted = useMemo(() => {
    const l = [...list];
    if (sort === "menor") l.sort((a, b) => a.preco - b.preco);
    if (sort === "maior") l.sort((a, b) => b.preco - a.preco);
    if (sort === "avaliados") l.sort((a, b) => b.avaliacoes - a.avaliacoes);
    return l;
  }, [list, sort]);

  const sorts: { key: Sort; label: string }[] = [
    { key: "relevancia", label: "Relevância" },
    { key: "menor", label: "Menor preço" },
    { key: "maior", label: "Maior preço" },
    { key: "avaliados", label: "Mais avaliados" },
  ];

  return (
    <section className="screen active">
      <TopBar title={title} />
      <div className="wrap">
        {list.length >= 2 && (
          <div className="sort-row">
            {sorts.map((s) => (
              <button
                key={s.key}
                className={"sort" + (sort === s.key ? " active" : "")}
                onClick={() => setSort(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
        {list.length === 0 ? (
          <p className="empty">Nenhum produto encontrado.</p>
        ) : (
          <div className="product-grid pad">
            {sorted.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
