import { supabase } from "../lib/supabaseClient";
import type { Fulfillment, OrderStatus, OrderWithItems, PaymentMethod } from "./types";

/* ----------------------------------------------------------------------------
 * Acesso às tabelas `orders` / `order_items`. Qualquer visitante pode criar
 * um pedido (checkout sem login); listar/alterar exige sessão de admin
 * (ver supabase/02_policies.sql). A criação também vincula o pedido a um
 * cliente deduplicado por telefone via upsert_customer (SECURITY DEFINER).
 * ------------------------------------------------------------------------- */

export type NewOrderItem = {
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type NewOrder = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  fulfillment: Fulfillment;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: NewOrderItem[];
};

export async function createOrder(order: NewOrder): Promise<string> {
  /* Vincula/atualiza o cliente por telefone. Falha aqui não impede o pedido. */
  let customerId: string | null = null;
  try {
    const { data } = await supabase.rpc("upsert_customer", {
      p_name: order.customerName,
      p_phone: order.customerPhone,
      p_email: order.customerEmail ?? null,
      p_address: order.customerAddress ?? null,
    });
    customerId = (data as string | null) ?? null;
  } catch { /* segue sem vínculo de cliente */ }

  const { data: created, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_email: order.customerEmail || null,
      customer_address: order.customerAddress || null,
      fulfillment: order.fulfillment,
      subtotal_amount: order.subtotalAmount,
      discount_amount: order.discountAmount,
      shipping_fee: order.shippingFee,
      coupon_code: order.couponCode || null,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      notes: order.notes || null,
    })
    .select("id")
    .single();
  if (orderError) throw orderError;

  const orderId = created.id as string;
  const items = order.items.map((it) => ({
    order_id: orderId,
    product_id: it.productId,
    product_name: it.productName,
    quantity: it.quantity,
    unit_price: it.unitPrice,
    subtotal: it.subtotal,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(items);
  if (itemsError) throw itemsError;

  return orderId;
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
