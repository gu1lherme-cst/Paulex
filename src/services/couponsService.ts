import { supabase } from "../lib/supabaseClient";
import { fmtBRL } from "../data/catalog";
import type { CouponRow } from "./types";

/* ----------------------------------------------------------------------------
 * Acesso à tabela `coupons`. A RLS já filtra para o público só os cupons
 * válidos (ativos, dentro da vigência e com uso disponível) — por isso o
 * getValidCoupon é um select simples: se voltar vazio, o cupom não vale.
 * ------------------------------------------------------------------------- */

export async function getValidCoupon(code: string): Promise<CouponRow | null> {
  const clean = code.trim().toUpperCase();
  if (!clean) return null;
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", clean)
    .maybeSingle();
  if (error) return null;
  return data;
}

export function couponLabel(c: CouponRow): string {
  return c.type === "percentage"
    ? `${c.value}% de desconto`
    : `${fmtBRL(c.value)} de desconto`;
}

export function couponDiscount(c: { type: CouponRow["type"]; value: number; min_order_amount: number }, subtotal: number): number {
  if (subtotal < c.min_order_amount) return 0;
  const raw = c.type === "percentage" ? (subtotal * c.value) / 100 : c.value;
  return Math.min(raw, subtotal);
}

/* --------------------------------- Admin ---------------------------------- */

export async function listAllCoupons(): Promise<CouponRow[]> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export type CouponInput = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount: number;
  starts_at?: string | null;
  expires_at?: string | null;
  usage_limit?: number | null;
  is_active: boolean;
};

export async function createCoupon(input: CouponInput): Promise<void> {
  const { error } = await supabase.from("coupons").insert({ ...input, code: input.code.trim().toUpperCase() });
  if (error) throw error;
}

export async function updateCoupon(id: string, input: Partial<CouponInput>): Promise<void> {
  const patch = input.code ? { ...input, code: input.code.trim().toUpperCase() } : input;
  const { error } = await supabase.from("coupons").update(patch).eq("id", id);
  if (error) throw error;
}

export async function setCouponActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from("coupons").update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
}
