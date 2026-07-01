import { supabase } from "../lib/supabaseClient";
import type { Fulfillment, OrderStatus, OrderWithItems, PaymentMethod } from "./types";

/* ----------------------------------------------------------------------------
 * Pedidos. A CRIAÇÃO acontece SÓ pela função create_order (SECURITY DEFINER)
 * no banco — o cliente não escreve direto em orders/order_items. A função
 * valida tudo no servidor: produto ativo, preço real do banco, quantidade
 * limitada ao estoque, cupom e frete. Assim o cliente não consegue forjar
 * preços/totais nem drenar estoque. Listar/alterar exige sessão de admin
 * (ver supabase/02_policies.sql e 06_secure_orders.sql).
 * ------------------------------------------------------------------------- */

/* Só product_id e quantity são confiáveis: o resto (nome, preço, subtotal) é
   recalculado no servidor a partir da tabela products. */
export type NewOrderItem = {
  productId: string;
  quantity: number;
};

export type NewOrder = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  fulfillment: Fulfillment;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: NewOrderItem[];
};

export async function createOrder(order: NewOrder): Promise<string> {
  const payload = {
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    customer_email: order.customerEmail ?? null,
    customer_address: order.customerAddress ?? null,
    fulfillment: order.fulfillment,
    payment_method: order.paymentMethod,
    coupon_code: order.couponCode ?? null,
    notes: order.notes ?? null,
    items: order.items
      .filter((it) => it.productId)
      .map((it) => ({ product_id: it.productId, quantity: it.quantity })),
  };

  const { data, error } = await supabase.rpc("create_order", { payload });
  if (error) throw error;
  return data as string;
}

export async function listOrders(): Promise<OrderWithItems[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items ( * )")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as OrderWithItems[];
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}
