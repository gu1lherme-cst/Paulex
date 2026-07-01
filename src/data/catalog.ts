/* ============================================================================
 * Paulex Armarinho — tipos e helpers do catálogo.
 * Produtos e categorias vêm do Supabase (src/services/*); este arquivo guarda
 * só tipos, conteúdo estático da home (banners, marcas, benefícios) e funções
 * puras reaproveitadas pela loja e pelo painel admin.
 * ========================================================================= */

export type Tone = "blue" | "red" | "soft" | "violet" | "teal" | "amber";

export type IconName =
  | "pin" | "medal" | "shield" | "headset" | "store" | "user" | "heart" | "cart"
  | "arrow" | "chevronL" | "chevronR" | "search" | "plus" | "minus" | "stack"
  | "tag" | "truck" | "box" | "check" | "mail" | "up" | "whatsapp" | "instagram"
  | "facebook" | "pencil" | "cup" | "users" | "monitor" | "lipstick" | "trash"
  | "list" | "calendar" | "boxes" | "backpack" | "pot";

/* Categoria agora é um nome vindo do banco (tabela `categories`), não mais um
   union fixo — o cadastro de categorias é dinâmico pelo painel admin. */
export type Category = string;

export type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  /* Preço efetivo de venda, já formatado / numérico */
  price: string;
  priceNum: number;
  /* Preço "de" (cheio), presente só quando há promotional_price no banco */
  oldPrice?: string;
  oldPriceNum?: number;
  /* Atacado: preço unitário aplicado quando a quantidade atinge wholesaleMin */
  wholesalePrice?: number;
  wholesaleMin?: number;
  stock: number;
  installment: string;
  n: number;
  reviews: string;
  icon: IconName;
  tone: Tone;
  imageUrl?: string;
  category: Category;
  isFeatured: boolean;
};

/* Cupons de desconto (percentual). Recurso local do carrinho — não depende do banco. */
export const COUPONS: Record<string, { percent: number; label: string }> = {
  PAULEX10: { percent: 10, label: "10% de desconto" },
  RETIRADA5: { percent: 5, label: "5% de desconto na retirada" },
  ATACADO15: { percent: 15, label: "15% de desconto no atacado" },
};

/* --------------------------- Conteúdo da home ---------------------------- */
/* Conteúdo institucional/estático — não faz parte do escopo de dados
   dinâmicos pedido (produtos, categorias, pedidos), por isso continua fixo. */

export const BENEFITS: { title: string; desc: string; icon: IconName }[] = [
  { title: "Variedade completa", desc: "Para casa, escola e trabalho", icon: "stack" },
  { title: "Preços justos", desc: "Condições que cabem no bolso", icon: "tag" },
  { title: "Compra segura", desc: "Proteção dos seus dados", icon: "shield" },
  { title: "Entrega rápida", desc: "Para todo o Rio de Janeiro", icon: "truck" },
  { title: "Atendimento humano", desc: "Equipe especializada", icon: "headset" },
];

export const CAMPAIGNS: { tag: string; title: string; off: string; cta: string; tone: Tone; categorySlug: string }[] = [
  { tag: "Volta às aulas", title: "Tudo para um novo começo", off: "30%", cta: "Aproveitar ofertas", tone: "blue", categorySlug: "papelaria" },
  { tag: "Home office", title: "Mais produtividade no seu dia", off: "25%", cta: "Ver produtos", tone: "teal", categorySlug: "utilidades" },
  { tag: "Tecnologia", title: "Conecte-se com o futuro", off: "35%", cta: "Ver ofertas", tone: "violet", categorySlug: "informatica" },
];

export const ATACADO_BENEFITS: { title: string; desc: string; icon: IconName }[] = [
  { title: "Preços por volume", desc: "Condições exclusivas para grandes compras", icon: "box" },
  { title: "Atendimento especializado", desc: "Equipe dedicada ao seu negócio", icon: "users" },
  { title: "Orçamentos rápidos", desc: "Resposta em até 24h para o seu negócio", icon: "check" },
  { title: "Entrega programada", desc: "Mais agilidade e flexibilidade", icon: "calendar" },
  { title: "Grande variedade", desc: "Tudo em um só fornecedor", icon: "list" },
  { title: "40 anos de tradição", desc: "Confiança que gera parcerias", icon: "medal" },
];

export const BRANDS = [
  "Faber-Castell", "BIC", "Tilibra", "CIS", "HP", "EPSON", "Logitech",
  "Tramontina", "3M", "Acrilex", "Pilot", "Maped", "Stabilo",
];

/* -------------------------------- Helpers -------------------------------- */

const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const slugify = (s: string) => norm(s).replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export const categorySlug = (c: string) => slugify(c);

/* ----- Helpers puros sobre o produto ---- */

export const discountPercent = (p: Product) =>
  p.oldPriceNum ? Math.round((1 - p.priceNum / p.oldPriceNum) * 100) : 0;

/* Preço unitário efetivo: usa o preço de atacado quando a quantidade
   atinge o mínimo do produto; caso contrário, o preço de varejo. */
export const unitPriceFor = (p: Product, qty: number): number =>
  p.wholesalePrice && p.wholesaleMin && qty >= p.wholesaleMin ? p.wholesalePrice : p.priceNum;

export const hasWholesale = (p: Product): p is Product & { wholesalePrice: number; wholesaleMin: number } =>
  Boolean(p.wholesalePrice && p.wholesaleMin);

export type StockLevel = "out" | "low" | "ok";
export const stockLevel = (p: Product): StockLevel =>
  p.stock <= 0 ? "out" : p.stock <= 10 ? "low" : "ok";

export const productDescription = (p: Product) =>
  p.description ||
  `${p.name} — produto da categoria ${p.category} disponível na Paulex Armarinho. ` +
  `Qualidade e preço justo, com retirada na loja ou entrega para todo o Rio de Janeiro.`;

/* ----- Helpers puros sobre uma LISTA (o store passa o catálogo ativo) ----- */

export const findById = (list: Product[], id: string): Product | undefined =>
  list.find((p) => p.id === id);

export const inCategory = (list: Product[], c: Category): Product[] =>
  list.filter((p) => p.category === c);

export const onlyOffers = (list: Product[]): Product[] =>
  list.filter((p) => p.oldPriceNum);

export const searchList = (list: Product[], query: string): Product[] => {
  const q = norm(query);
  if (!q) return [];
  return list.filter((p) => norm(p.name).includes(q) || norm(p.category).includes(q));
};

export const relatedIn = (list: Product[], p: Product, count = 4): Product[] => {
  const same = list.filter((x) => x.id !== p.id && x.category === p.category);
  const rest = list.filter((x) => x.id !== p.id && x.category !== p.category);
  return [...same, ...rest].slice(0, count);
};

export const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* Ícones e tons disponíveis para escolher no painel admin */
export const PRODUCT_ICONS: IconName[] = [
  "pencil", "monitor", "cup", "lipstick", "users", "trash", "backpack", "pot", "stack", "box", "tag",
];
export const TONES: Tone[] = ["blue", "red", "soft", "violet", "teal", "amber"];
