import { supabase } from "../lib/supabaseClient";
import type { BrandRow } from "./types";

/* ----------------------------------------------------------------------------
 * Acesso à tabela `brands`. Leitura pública respeita RLS (só marcas ativas
 * para quem não é admin); escrita exige sessão de administrador.
 * ------------------------------------------------------------------------- */

export async function listActiveBrands(): Promise<BrandRow[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listAllBrands(): Promise<BrandRow[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export type BrandInput = {
  name: string;
  slug: string;
  logo_url?: string | null;
  is_active: boolean;
};

export async function createBrand(input: BrandInput): Promise<void> {
  const { error } = await supabase.from("brands").insert(input);
  if (error) throw error;
}

export async function updateBrand(id: string, input: Partial<BrandInput>): Promise<void> {
  const { error } = await supabase.from("brands").update(input).eq("id", id);
  if (error) throw error;
}

export async function setBrandActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from("brands").update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
}
