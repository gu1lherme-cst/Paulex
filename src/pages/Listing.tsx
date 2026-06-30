import { useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import { ProductCard } from "../components/ProductCard";
import { href } from "../lib/router";
import type { Route } from "../lib/router";
import {
  PRODUCTS, CATEGORIES, categorySlug, categoryFromSlug, productsByCategory,
  offers, searchProducts, discountPercent, type Product, type Category,
} from "../data/catalog";

type Sort = "relevancia" | "menor" | "maior" | "desconto";
const SORTS: { value: Sort; label: string }[] = [
  { value: "relevancia", label: "Mais relevantes" },
  { value: "menor", label: "Menor preço" },
  { value: "maior", label: "Maior preço" },
  { value: "desconto", label: "Maior desconto" },
];

function resolve(route: Route): { title: string; crumb: string; products: Product[]; activeCat?: Category; notFound?: boolean } {
  switch (route.name) {
    case "ofertas":
      return { title: "Ofertas", crumb: "Ofertas", products: offers() };
    case "categoria": {
      const cat = categoryFromSlug(route.slug);
      if (!cat) return { title: "Categoria não encontrada", crumb: "Categoria", products: [], notFound: true };
      return { title: cat, crumb: cat, products: productsByCategory(cat), activeCat: cat };
    }
    case "busca":
      return { title: `Resultados para "${route.query}"`, crumb: "Busca", products: searchProducts(route.query) };
    default:
      return { title: "Todos os produtos", crumb: "Produtos", products: PRODUCTS };
  }
}

function sortProducts(list: Product[], sort: Sort): Product[] {
  const arr = [...list];
  switch (sort) {
    case "menor": return arr.sort((a, b) => a.priceNum - b.priceNum);
    case "maior": return arr.sort((a, b) => b.priceNum - a.priceNum);
    case "desconto": return arr.sort((a, b) => discountPercent(b) - discountPercent(a));
    default: return arr;
  }
}

export function Listing({ route }: { route: Route }) {
  const [sort, setSort] = useState<Sort>("relevancia");
  const { title, crumb, products, activeCat, notFound } = useMemo(() => resolve(route), [route]);
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  return (
    <main className="px-section px-listing" id="topo">
      <nav className="px-crumb" aria-label="Você está em">
        <a href={href("/")}>Início</a>
        <Icon name="chevronR" size={13} />
        <span aria-current="page">{crumb}</span>
      </nav>

      <div className="px-listing__head">
        <div>
          <h1 className="px-listing__title">{title}</h1>
          {!notFound && (
            <p className="px-listing__count">
              {sorted.length} {sorted.length === 1 ? "produto" : "produtos"}
            </p>
          )}
        </div>
        {sorted.length > 0 && (
          <label className="px-sort">
            <span className="px-sort__label">Ordenar por</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="px-chips" role="list">
        <a role="listitem" href={href("/produtos")} className={`px-chip${route.name === "produtos" ? " px-chip--on" : ""}`}>Todas</a>
        {CATEGORIES.map((c) => (
          <a
            role="listitem"
            key={c}
            href={href(`/categoria/${categorySlug(c)}`)}
            className={`px-chip${activeCat === c ? " px-chip--on" : ""}`}
          >
            {c}
          </a>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="px-empty">
          <span className="px-empty__icon"><Icon name="search" size={30} /></span>
          <p>{notFound ? "Categoria não encontrada." : "Nenhum produto encontrado."}</p>
          <a href={href("/produtos")} className="px-btn px-btn--primary px-btn--sm">Ver todos os produtos</a>
        </div>
      ) : (
        <div className="px-grid">
          {sorted.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </main>
  );
}
