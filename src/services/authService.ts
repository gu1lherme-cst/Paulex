import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

/* ----------------------------------------------------------------------------
 * Autenticação do painel admin via magic link (e-mail, sem senha).
 * Autorização real é feita pelo banco (RLS + admin_users); checkIsAdmin()
 * só reflete o que a policy "admin_users_select_self" deixa o usuário ver.
 * ------------------------------------------------------------------------- */

function adminRedirectUrl(): string {
  /* Precisa estar na lista de Redirect URLs do Supabase
     (Authentication → URL Configuration). Ver docs/SETUP.md. */
  return `${window.location.origin}${import.meta.env.BASE_URL}#/admin`;
}

/* Converte erros técnicos ("Load failed" no Safari, "Failed to fetch" no
   Chrome, rate limit do Supabase) em mensagens acionáveis para o lojista. */
function friendlyAuthError(message: string): string {
  if (/load failed|failed to fetch|network|fetch/i.test(message)) {
    return "Não foi possível conectar ao Supabase. Verifique se os secrets " +
      "SUPABASE_URL e SUPABASE_ANON_KEY estão preenchidos no GitHub " +
      "(Settings → Secrets → Actions) e se o site foi publicado DEPOIS " +
      "de criá-los (aba Actions → Deploy to GitHub Pages → Re-run).";
  }
  if (/rate limit|too many/i.test(message)) {
    return "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.";
  }
  if (/redirect/i.test(message)) {
    return "URL de redirecionamento não autorizada. No Supabase, adicione " +
      "https://gu1lherme-cst.github.io/Paulex/** em Authentication → " +
      "URL Configuration → Redirect URLs.";
  }
  return message;
}

export async function sendMagicLink(email: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase não configurado neste site. Crie os secrets SUPABASE_URL e " +
      "SUPABASE_ANON_KEY no GitHub e publique novamente (docs/SETUP.md)."
    );
  }
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: adminRedirectUrl() },
  });
  if (error) throw new Error(friendlyAuthError(error.message));
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(cb: (session: Session | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}

/** true se o e-mail logado está cadastrado em admin_users. */
export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.from("admin_users").select("id").limit(1);
  if (error) return false;
  return (data?.length ?? 0) > 0;
}

/** Remove o "?code=..." que o magic link (PKCE) deixa na URL após o login. */
export function cleanAuthParamsFromUrl(): void {
  if (window.location.search.includes("code=")) {
    const clean = window.location.pathname + window.location.hash;
    window.history.replaceState(null, "", clean);
  }
}
