import type { Order } from "../types";

export function clubPoints(orders: Order[]): number {
  return Math.floor(
    orders.filter((o) => o.status !== "cancelado").reduce((a, o) => a + o.total, 0),
  );
}

export interface ClubLevel {
  nome: "Bronze" | "Prata" | "Ouro";
  cashback: number;
  base: number;
  prox: { nome: string; pts: number } | null;
}

export function clubLevel(pts: number): ClubLevel {
  if (pts >= 5000) return { nome: "Ouro", cashback: 3, base: 5000, prox: null };
  if (pts >= 1000)
    return { nome: "Prata", cashback: 2, base: 1000, prox: { nome: "Ouro", pts: 5000 } };
  return { nome: "Bronze", cashback: 1, base: 0, prox: { nome: "Prata", pts: 1000 } };
}
