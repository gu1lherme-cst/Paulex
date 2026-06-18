/* ============================================================
   Ponto de integração com BACKEND NA NUVEM (opcional).

   Por padrão o app funciona 100% offline, salvando no navegador.
   Para sincronizar produtos, pedidos e contas entre dispositivos,
   plugue aqui um backend. O caminho mais rápido é o Supabase
   (Postgres + auth + APIs prontas, com plano gratuito):

   1. Crie um projeto em https://supabase.com
   2. Crie as tabelas `products`, `orders`, `profiles`.
   3. Adicione as variáveis ao arquivo .env (veja .env.example):
        VITE_SUPABASE_URL=...
        VITE_SUPABASE_ANON_KEY=...
   4. Instale o SDK:  npm i @supabase/supabase-js
   5. Descomente o bloco abaixo e implemente fetchProducts/saveOrder.

   Enquanto as variáveis não existirem, isCloudEnabled() retorna
   false e o app continua usando o armazenamento local.
   ============================================================ */

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export function isCloudEnabled(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/*
import { createClient } from "@supabase/supabase-js";
import type { Order, Product } from "../types";

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

export async function fetchProducts(): Promise<Product[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("products").select("*");
  if (error) return null;
  return data as Product[];
}

export async function saveOrder(order: Order): Promise<void> {
  if (!supabase) return;
  await supabase.from("orders").insert(order);
}
*/
