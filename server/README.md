# Backend de pagamento (opcional)

A loja é um site estático e **não pode** guardar a chave secreta do provedor de
pagamento. Por isso o pagamento online precisa de uma pequena função no
servidor. O exemplo abaixo usa **Mercado Pago Checkout Pro** (Pix, cartão e
boleto) na **Vercel** — o plano gratuito é suficiente para começar.

## Passo a passo

1. Crie uma conta no Mercado Pago e pegue seu **Access Token** em
   <https://www.mercadopago.com.br/developers> (use o de produção quando for ao ar).
2. Crie um projeto na Vercel e adicione o arquivo `api/create-preference.js`
   (conteúdo em `create-preference.example.js`).
3. Na Vercel, em *Settings → Environment Variables*, adicione:
   - `MP_ACCESS_TOKEN` = seu Access Token
   - `APP_URL` = a URL pública da loja (ex.: `https://gu1lherme-cst.github.io/Paulex/`)
4. Após o deploy, copie a URL da função (ex.: `https://seu-projeto.vercel.app/api`)
   e coloque em `VITE_PAYMENTS_API` no `.env` da loja (e nos *secrets* do GitHub).
5. Pronto: o checkout passa a oferecer Pix e cartão automaticamente.

> Segurança: o token secreto fica **só** na Vercel. O navegador nunca o vê.
