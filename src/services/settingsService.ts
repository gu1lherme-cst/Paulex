import { supabase } from "../lib/supabaseClient";
import type { StoreSettingsRow } from "./types";

/* ----------------------------------------------------------------------------
 * Configurações da loja (linha única, id = 1): WhatsApp, endereço, horário,
 * taxa de entrega e pedido mínimo. Leitura pública; escrita só admin.
 * ------------------------------------------------------------------------- */

export const DEFAULT_SETTINGS: StoreSettingsRow = {
  id: 1,
  whatsapp_number: "5521987578187",
  address: null,
  opening_hours: null,
  delivery_fee: 0,
  min_order_amount: 0,
  updated_at: "",
};

export async function getStoreSettings(): Promise<StoreSettingsRow> {
  const { data, error } = await supabase.from("store_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return data;
}

export type StoreSettingsInput = {
  whatsapp_number: string;
  address?: string | null;
  opening_hours?: string | null;
  delivery_fee: number;
  min_order_amount: number;
};

export async function updateStoreSettings(input: StoreSettingsInput): Promise<void> {
  const { error } = await supabase.from("store_settings").update(input).eq("id", 1);
  if (error) throw error;
}
