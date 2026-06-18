import type { Product, CartMap } from "../types";
import { ATACADO_MIN, ATACADO_DESCONTO_PADRAO, CUPONS } from "../data/catalog";

export function atacadoUnit(p: Product): number {
  if (p.precoAtacado) return p.precoAtacado;
  return Math.round(p.preco * (1 - ATACADO_DESCONTO_PADRAO / 100) * 100) / 100;
}

export function atacadoOff(p: Product): number {
  return Math.round((1 - atacadoUnit(p) / p.preco) * 100);
}

export function unitPrice(p: Product, qty: number): number {
  if (p.tiers) {
    const tier = p.tiers.find((t) => qty >= t.de && qty <= t.ate);
    return tier ? tier.preco : p.preco;
  }
  if (qty >= ATACADO_MIN) return atacadoUnit(p);
  return p.preco;
}

export interface PriceTier {
  faixa: string;
  preco: number;
  off: string | null;
}

export function priceTiers(p: Product): PriceTier[] {
  if (p.tiers) {
    return p.tiers.map((t) => ({
      faixa:
        t.ate === Infinity
          ? `${t.de}+ unidades`
          : `${t.de} a ${t.ate} unidades`,
      preco: t.preco,
      off: t.off,
    }));
  }
  return [
    { faixa: `1 a ${ATACADO_MIN - 1} unidades`, preco: p.preco, off: null },
    {
      faixa: `${ATACADO_MIN}+ unidades (atacado)`,
      preco: atacadoUnit(p),
      off: `-${atacadoOff(p)}%`,
    },
  ];
}

export interface CartTotals {
  cheio: number;
  total: number;
  desconto: number;
  cupomVal: number;
  itens: number;
}

export function cartTotals(
  cart: CartMap,
  products: Product[],
  cupom: string,
): CartTotals {
  let cheio = 0;
  let total = 0;
  let itens = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const p = products.find((x) => x.id === id);
    if (!p) continue;
    cheio += p.preco * qty;
    total += unitPrice(p, qty) * qty;
    itens += qty;
  }
  const cupomVal = CUPONS[cupom] ? total * (CUPONS[cupom].desconto / 100) : 0;
  return { cheio, total: total - cupomVal, desconto: cheio - total, cupomVal, itens };
}
