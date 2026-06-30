/* Número de WhatsApp da loja (formato internacional, só dígitos): (21) 98757-8187 */
export const WHATSAPP_NUMBER = "5521987578187";

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const waLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/* Link de atendimento direto (botões "Falar no WhatsApp" / "Ajuda") */
export const WHATSAPP_CONTACT = waLink(
  "Olá! Vim pelo site da Paulex e gostaria de atendimento."
);
