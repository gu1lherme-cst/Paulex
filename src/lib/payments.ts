/* ============================================================
   PAGAMENTO ONLINE (Pix / cartão / boleto)

   Loja estática (GitHub Pages) não pode guardar a chave secreta
   do provedor de pagamento — isso TEM que ficar num backend. O
   fluxo recomendado para o Brasil é o Mercado Pago Checkout Pro:

     [App React]  →  [sua função serverless]  →  [Mercado Pago]
        cria o pedido        cria a "preference"      hospeda o
                             com a ACCESS_TOKEN        checkout

   Veja server/README.md para o exemplo da função serverless.

   Configure no .env a URL pública da sua função:
       VITE_PAYMENTS_API=https://suas-funcoes.vercel.app/api

   Sem essa variável, o checkout cai automaticamente no fluxo
   atual por WhatsApp (que já funciona, sem custo nem cadastro).
   ============================================================ */

import type { Order } from "../types";

export const PAYMENTS_API = import.meta.env.VITE_PAYMENTS_API as
  | string
  | undefined;

export function isOnlinePaymentEnabled(): boolean {
  return Boolean(PAYMENTS_API);
}

export interface CheckoutResult {
  /** URL do checkout hospedado para onde redirecionar o cliente */
  url: string;
}

/**
 * Pede ao backend a criação de uma preferência de pagamento e
 * retorna a URL do checkout. Lança erro se o backend não responder.
 */
export async function createOnlineCheckout(order: Order): Promise<CheckoutResult> {
  if (!PAYMENTS_API) throw new Error("Pagamento online não configurado");
  const res = await fetch(`${PAYMENTS_API}/create-preference`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      numero: order.numero,
      total: order.total,
      itens: order.itens.map((i) => ({
        title: i.nome,
        quantity: i.qty,
        unit_price: i.valor / i.qty,
      })),
    }),
  });
  if (!res.ok) throw new Error("Falha ao iniciar o pagamento");
  return (await res.json()) as CheckoutResult;
}
