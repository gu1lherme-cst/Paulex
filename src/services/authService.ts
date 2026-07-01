import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

/* ----------------------------------------------------------------------------
 * Autenticação do painel admin via magic link (e-mail, sem senha).
 * Autorização real é feita pelo banco (RLS + admin_users); checkIsAdmin()
 * só reflete o que a policy "admin_users_select_self" deixa o usuário ver.
 * ------------------------------------------------------------------------- */

function adminRedirectUrl(): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}#/admin`;
}

export async function sendMagicLink(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: adminRedirectUrl() },
  });
  if (error) throw error;
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
