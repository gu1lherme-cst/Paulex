import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../data/catalog";
import { useStore } from "../context/StoreContext";
import type { Product } from "../types";
import { money } from "../lib/format";
import { ProductMedia } from "./ProductMedia";
import { Icon, ICONS } from "./Icon";
import { track } from "../lib/whatsapp";

export function productMatches(p: Product, q: string): boolean {
  const cat = CATEGORIES.find((c) => c.id === p.cat);
  return [p.nome, p.desc, p.unidade, cat?.nome]
    .filter(Boolean)
    .some((v) => (v as string).toLowerCase().includes(q));
}

export function SearchBox() {
  const navigate = useNavigate();
  const { products } = useStore();
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const q = term.trim().toLowerCase();
  const hits = useMemo(
    () => (q.length < 2 ? [] : products.filter((p) => productMatches(p, q)).slice(0, 6)),
    [q, products],
  );

  const goProduct = (id: string) => {
    setTerm("");
    setOpen(false);
    navigate(`/produto/${id}`);
  };

  const goSearch = () => {
    if (q.length < 2) return;
    setOpen(false);
    track("search", { search_term: q });
    navigate(`/lista/busca:${encodeURIComponent(term.trim())}`);
  };

  return (
    <div className="search-wrap wrap" ref={wrapRef}>
      <div className="search">
        <Icon path={ICONS.search} />
        <input
          type="search"
          value={term}
          placeholder="O que você está procurando?"
          autoComplete="off"
          aria-label="Buscar produtos"
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "Enter") goSearch();
          }}
        />
      </div>
      {open && q.length >= 2 && (
        <div className="suggest">
          {hits.length === 0 ? (
            <div className="sug-empty">Nenhum produto encontrado para “{term}”.</div>
          ) : (
            hits.map((p) => (
              <button key={p.id} className="sug" onMouseDown={() => goProduct(p.id)}>
                <span className="sug-art">
                  <ProductMedia p={p} />
                </span>
                <span className="sug-name">{p.nome}</span>
                <span className="sug-price">{money(p.preco)}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
