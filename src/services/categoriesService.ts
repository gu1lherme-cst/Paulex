import { supabase } from "../lib/supabaseClient";
import type { CategoryRow } from "./types";

/* ----------------------------------------------------------------------------
 * Acesso à tabela `categories`. Leitura pública respeita RLS (só ativas para
 * quem não é admin); escrita exige sessão de administrador (ver
 * supabase/02_policies.sql).
 * ------------------------------------------------------------------------- */

export async function listActiveCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listAllCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export type CategoryInput = {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  icon: string;
  tone: string;
  is_active: boolean;
};

export async function createCategory(input: CategoryInput): Promise<CategoryRow> {
  const { data, error } = await supabase.from("categories").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, input: Partial<CategoryInput>): Promise<CategoryRow> {
  const { data, error } = await supabase.from("categories").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function setCategoryActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from("categories").update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
}
