import { WHATSAPP_NUMBER } from "../data/catalog";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Evento de analytics — pronto para Google Tag Manager / GA4. */
export function track(event: string, data: Record<string, unknown> = {}): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

export function openWhatsApp(texto?: string): void {
  const msg = texto || "Olá, Paulex! Vim pelo site e gostaria de um atendimento.";
  track("whatsapp_click");
  const win = window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
    "_blank",
    "noopener",
  );
  if (win) win.opener = null;
}
