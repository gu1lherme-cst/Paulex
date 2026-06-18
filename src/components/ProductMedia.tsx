import type { Product } from "../types";

/** Foto real do produto quando existir; ilustração SVG como reserva. */
export function ProductMedia({ p }: { p: Product }) {
  if (p.imagem) {
    return <img src={p.imagem} alt={p.nome} loading="lazy" decoding="async" />;
  }
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="#0B3BA7"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={p.nome}
      dangerouslySetInnerHTML={{ __html: p.art }}
    />
  );
}
