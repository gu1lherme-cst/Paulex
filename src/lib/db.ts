/* ============================================================
   Camada de dados — abstração de armazenamento.

   Hoje os dados ficam no navegador (localStorage). Esta camada
   isola o resto do app dessa decisão: para mover tudo para a
   nuvem (Supabase, Firebase, API própria), basta reimplementar
   estas funções — nenhuma tela precisa mudar.

   Veja src/lib/cloud.ts para o ponto de integração com backend.
   ============================================================ */

const PREFIX = "paulex_";

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* armazenamento cheio ou indisponível — ignora */
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export const KEYS = {
  cart: "cart",
  favs: "favs",
  orders: "orders",
  addrs: "addrs",
  cupom: "cupom",
  recent: "recent",
  user: "user",
  logged: "logged",
  products: "products_override",
} as const;
