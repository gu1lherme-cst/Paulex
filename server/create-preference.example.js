// Exemplo de função serverless (Vercel) para Mercado Pago Checkout Pro.
// Copie para  api/create-preference.js  no seu projeto da Vercel.
//
// Variáveis de ambiente necessárias (Settings → Environment Variables):
//   MP_ACCESS_TOKEN  → Access Token do Mercado Pago
//   APP_URL          → URL pública da loja (para o retorno após o pagamento)

export default async function handler(req, res) {
  // CORS — permite que a loja (outro domínio) chame esta função
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { numero, itens } = req.body || {};
  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ error: "Pedido inválido" });
  }

  try {
    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        external_reference: String(numero || ""),
        items: itens.map((i) => ({
          title: String(i.title).slice(0, 250),
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price),
          currency_id: "BRL",
        })),
        back_urls: {
          success: `${process.env.APP_URL}#/pedidos`,
          pending: `${process.env.APP_URL}#/pedidos`,
          failure: `${process.env.APP_URL}#/carrinho`,
        },
        auto_return: "approved",
      }),
    });

    const data = await mpRes.json();
    if (!mpRes.ok) return res.status(502).json({ error: "Mercado Pago", data });

    // init_point = checkout de produção; sandbox_init_point = testes
    return res.status(200).json({ url: data.init_point || data.sandbox_init_point });
  } catch (e) {
    return res.status(500).json({ error: "Falha ao criar preferência" });
  }
}
