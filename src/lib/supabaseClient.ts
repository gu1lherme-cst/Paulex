import { createClient } from "@supabase/supabase-js";

/* ----------------------------------------------------------------------------
 * Cliente único do Supabase, usado por toda a camada de serviços
 * (src/services/*). As credenciais vêm de variáveis de ambiente (Vite):
 * VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
 *
 * A "anon key" é pública por design — a segurança dos dados é garantida
 * pelas políticas de RLS no banco (supabase/02_policies.sql e
 * 05_policies_v2.sql), não por esconder essa chave. Nunca coloque a
 * "service_role key" aqui.
 * ------------------------------------------------------------------------- */

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Paulex] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não configuradas. " +
    "Copie .env.example para .env e preencha com os dados do seu projeto Supabase."
  );
}

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
  {
    auth: {
      /* PKCE em vez do fluxo implícito: o magic link volta com "?code=..."
         na query string (antes do "#"), o que funciona com o roteamento por
         hash ("#/admin") do GitHub Pages. No fluxo implícito os tokens viriam
         no fragmento ("#access_token=...") e colidiriam com o hash da rota. */
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
