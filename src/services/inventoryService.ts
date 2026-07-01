import { supabase } from "../lib/supabaseClient";
import type { InventoryMovementRow, InventoryMovementType } from "./types";

/* ----------------------------------------------------------------------------
 * Movimentações de estoque (admin). O registro passa pela função SQL
 * register_inventory_movement, que atualiza o estoque e grava o log na
 * mesma transação — a RLS garante que só admins conseguem executá-la.
 * ------------------------------------------------------------------------- */

export async function registerMovement(params: {
  productId: string;
  variantId?: string | null;
  type: InventoryMovementType;
  quantity: number;
  reason?: string;
}): Promise<void> {
  const { error } = await supabase.rpc("register_inventory_movement", {
    p_product_id: params.productId,
    p_variant_id: params.variantId ?? null,
    p_type: params.type,
    p_quantity: params.quantity,
    p_reason: params.reason ?? null,
  });
  if (error) throw error;
}

export async function listMovements(limit = 50): Promise<InventoryMovementRow[]> {
  const { data, error } = await supabase
    .from("inventory_movements")
    .select("*, products ( name )")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as InventoryMovementRow[];
}
