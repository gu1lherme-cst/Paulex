/* ============================================================================
 * Catálogo Paulex Armarinho — fonte ÚNICA de dados de produtos e categorias.
 * Para editar a loja, mexa só aqui (produtos, preços, categorias).
 * As imagens são placeholders (ícone + cor); troque por <img> quando tiver fotos.
 * ========================================================================= */

export type Tone = "blue" | "red" | "soft" | "violet" | "teal" | "amber";

export type IconName =
  | "pin" | "medal" | "shield" | "headset" | "store" | "user" | "heart" | "cart"
  | "arrow" | "chevronL" | "chevronR" | "search" | "plus" | "minus" | "stack"
  | "tag" | "truck" | "box" | "check" | "mail" | "up" | "whatsapp" | "instagram"
  | "facebook" | "pencil" | "cup" | "users" | "monitor" | "lipstick" | "trash"
  | "list" | "calendar" | "boxes" | "backpack" | "pot";

export type Category =
  | "Papelaria" | "Utilidades" | "Brinquedos" | "Informática"
  | "Cosméticos" | "Acessórios" | "Casa" | "Descartáveis";

export type Product = {
  id: string;
  sku: string;
  name: string;
  price: string;
  priceNum: number;
  oldPrice?: string;
  oldPriceNum?: number;
  /* Atacado: preço unitário aplicado quando a quantidade atinge wholesaleMin */
  wholesalePrice?: number;
  wholesaleMin?: number;
  stock: number;
  tags?: string[];
  installment: string;
  n: number;
  reviews: string;
  icon: IconName;
  tone: Tone;
  category: Category;
};

/* ------------------------------- Produtos -------------------------------- */

export const DEFAULT_PRODUCTS: Product[] = [
  { id: "px-b1", sku: "PAP-001", name: "Caderno inteligente capa dura A5", price: "R$ 49,90", priceNum: 49.9, oldPrice: "R$ 58,90", oldPriceNum: 58.9, wholesalePrice: 44.9, wholesaleMin: 4, stock: 32, tags: ["escola", "caderno"], installment: "em 3x sem juros", n: 5, reviews: "1.245", icon: "pencil", tone: "blue", category: "Papelaria" },
  { id: "px-b2", sku: "INF-001", name: "Mouse sem fio silencioso USB-C", price: "R$ 89,90", priceNum: 89.9, oldPrice: "R$ 109,90", oldPriceNum: 109.9, wholesalePrice: 79.9, wholesaleMin: 3, stock: 18, tags: ["informática", "acessório"], installment: "em 6x sem juros", n: 4, reviews: "982", icon: "monitor", tone: "violet", category: "Informática" },
  { id: "px-b3", sku: "UTI-001", name: "Organizador modular de mesa", price: "R$ 64,90", priceNum: 64.9, oldPrice: "R$ 79,90", oldPriceNum: 79.9, wholesalePrice: 57.9, wholesaleMin: 4, stock: 25, tags: ["organização", "casa"], installment: "em 4x sem juros", n: 5, reviews: "1.103", icon: "cup", tone: "teal", category: "Utilidades" },
  { id: "px-b4", sku: "COS-001", name: "Kit cuidados diários essencial", price: "R$ 79,90", priceNum: 79.9, wholesalePrice: 71.9, wholesaleMin: 3, stock: 14, tags: ["beleza", "cuidado"], installment: "em 4x sem juros", n: 4, reviews: "875", icon: "lipstick", tone: "red", category: "Cosméticos" },
  { id: "px-b5", sku: "INF-002", name: "Fone de ouvido Bluetooth", price: "R$ 129,90", priceNum: 129.9, oldPrice: "R$ 169,90", oldPriceNum: 169.9, wholesalePrice: 117.9, wholesaleMin: 3, stock: 21, tags: ["informática", "áudio"], installment: "em 6x sem juros", n: 5, reviews: "1.782", icon: "monitor", tone: "violet", category: "Informática" },
  { id: "px-b6", sku: "INF-003", name: "Impressora multifuncional Wi-Fi", price: "R$ 899,10", priceNum: 899.1, oldPrice: "R$ 1.099,00", oldPriceNum: 1099, wholesalePrice: 849, wholesaleMin: 2, stock: 7, tags: ["informática", "escritório"], installment: "em 10x sem juros", n: 4, reviews: "967", icon: "monitor", tone: "soft", category: "Informática" },
  { id: "px-b7", sku: "BRI-001", name: "Jogo de blocos de montar 120 peças", price: "R$ 59,90", priceNum: 59.9, wholesalePrice: 52.9, wholesaleMin: 4, stock: 26, tags: ["infantil", "educativo"], installment: "em 3x sem juros", n: 5, reviews: "734", icon: "users", tone: "amber", category: "Brinquedos" },
  { id: "px-b8", sku: "BRI-002", name: "Pelúcia urso macio 30cm", price: "R$ 44,90", priceNum: 44.9, oldPrice: "R$ 54,90", oldPriceNum: 54.9, wholesalePrice: 39.9, wholesaleMin: 4, stock: 9, tags: ["presente", "infantil"], installment: "em 2x sem juros", n: 4, reviews: "612", icon: "users", tone: "amber", category: "Brinquedos" },
  { id: "px-b9", sku: "DES-001", name: "Copos descartáveis 200ml (100un)", price: "R$ 19,90", priceNum: 19.9, wholesalePrice: 16.9, wholesaleMin: 10, stock: 60, tags: ["festa", "evento"], installment: "em 1x sem juros", n: 4, reviews: "498", icon: "trash", tone: "soft", category: "Descartáveis" },
  { id: "px-b10", sku: "DES-002", name: "Pratos descartáveis 18cm (50un)", price: "R$ 24,90", priceNum: 24.9, oldPrice: "R$ 29,90", oldPriceNum: 29.9, wholesalePrice: 20.9, wholesaleMin: 10, stock: 45, tags: ["festa", "evento"], installment: "em 2x sem juros", n: 5, reviews: "356", icon: "trash", tone: "soft", category: "Descartáveis" },
  { id: "px-b11", sku: "PAP-002", name: "Canetas gel coloridas (12 cores)", price: "R$ 34,90", priceNum: 34.9, oldPrice: "R$ 44,90", oldPriceNum: 44.9, wholesalePrice: 29.9, wholesaleMin: 6, stock: 40, tags: ["escola", "escritório"], installment: "em 2x sem juros", n: 5, reviews: "1.021", icon: "pencil", tone: "blue", category: "Papelaria" },
  { id: "px-b12", sku: "UTI-002", name: "Pano multiuso de limpeza (5un)", price: "R$ 14,90", priceNum: 14.9, wholesalePrice: 12.9, wholesaleMin: 8, stock: 38, tags: ["limpeza", "casa"], installment: "em 1x sem juros", n: 4, reviews: "289", icon: "cup", tone: "teal", category: "Utilidades" },
  { id: "px-b13", sku: "COS-002", name: "Hidratante facial diário 50g", price: "R$ 39,90", priceNum: 39.9, oldPrice: "R$ 49,90", oldPriceNum: 49.9, wholesalePrice: 34.9, wholesaleMin: 6, stock: 23, tags: ["beleza", "hidratação"], installment: "em 2x sem juros", n: 5, reviews: "844", icon: "lipstick", tone: "red", category: "Cosméticos" },
  { id: "px-b14", sku: "ACE-001", name: "Mochila escolar reforçada 30L", price: "R$ 119,90", priceNum: 119.9, oldPrice: "R$ 149,90", oldPriceNum: 149.9, wholesalePrice: 109.9, wholesaleMin: 3, stock: 16, tags: ["escola", "mochila"], installment: "em 6x sem juros", n: 5, reviews: "528", icon: "backpack", tone: "blue", category: "Acessórios" },
  { id: "px-b15", sku: "ACE-002", name: "Estojo escolar 3 divisórias", price: "R$ 29,90", priceNum: 29.9, wholesalePrice: 25.9, wholesaleMin: 6, stock: 8, tags: ["escola", "estojo"], installment: "em 2x sem juros", n: 4, reviews: "401", icon: "backpack", tone: "violet", category: "Acessórios" },
  { id: "px-b16", sku: "CAS-001", name: "Jogo de panelas antiaderente 5 peças", price: "R$ 249,90", priceNum: 249.9, oldPrice: "R$ 319,90", oldPriceNum: 319.9, wholesalePrice: 229.9, wholesaleMin: 2, stock: 11, tags: ["casa", "cozinha"], installment: "em 10x sem juros", n: 5, reviews: "612", icon: "pot", tone: "teal", category: "Casa" },
  { id: "px-b17", sku: "CAS-002", name: "Pote hermético com tampa 1,5L", price: "R$ 22,90", priceNum: 22.9, wholesalePrice: 18.9, wholesaleMin: 8, stock: 34, tags: ["casa", "cozinha"], installment: "em 1x sem juros", n: 4, reviews: "337", icon: "pot", tone: "teal", category: "Casa" },
];

/* Cupons de desconto (percentual). Edite à vontade. */
export const COUPONS: Record<string, { percent: number; label: string }> = {
  PAULEX10: { percent: 10, label: "10% de desconto" },
  RETIRADA5: { percent: 5, label: "5% de desconto na retirada" },
  ATACADO15: { percent: 15, label: "15% de desconto no atacado" },
};

/* ------------------------------ Categorias ------------------------------- */

export type CategoryCard = { name: Category; desc: string; icon: IconName; tone: Tone };

export const CATEGORY_CARDS: CategoryCard[] = [
  { name: "Papelaria", desc: "Cadernos, canetas e material escolar", icon: "pencil", tone: "blue" },
  { name: "Utilidades", desc: "Organização, limpeza e muito mais", icon: "cup", tone: "teal" },
  { name: "Brinquedos", desc: "Diversão para todas as idades", icon: "users", tone: "amber" },
  { name: "Cosméticos", desc: "Cuidados diários com as melhores marcas", icon: "lipstick", tone: "red" },
  { name: "Informática", desc: "Tecnologia que simplifica o seu dia", icon: "monitor", tone: "violet" },
  { name: "Acessórios", desc: "Mochilas, estojos e mais", icon: "backpack", tone: "blue" },
  { name: "Casa", desc: "Praticidade para o seu dia a dia", icon: "pot", tone: "teal" },
  { name: "Descartáveis", desc: "Soluções práticas para o dia a dia", icon: "trash", tone: "soft" },
];

export const CATEGORIES: Category[] = CATEGORY_CARDS.map((c) => c.name);

/* --------------------------- Conteúdo da home ---------------------------- */

export const BENEFITS: { title: string; desc: string; icon: IconName }[] = [
  { title: "Variedade completa", desc: "Para casa, escola e trabalho", icon: "stack" },
  { title: "Preços justos", desc: "Condições que cabem no bolso", icon: "tag" },
  { title: "Compra segura", desc: "Proteção dos seus dados", icon: "shield" },
  { title: "Entrega rápida", desc: "Para todo o Rio de Janeiro", icon: "truck" },
  { title: "Atendimento humano", desc: "Equipe especializada", icon: "headset" },
];

export const CAMPAIGNS: { tag: string; title: string; off: string; cta: string; tone: Tone; category: Category }[] = [
  { tag: "Volta às aulas", title: "Tudo para um novo começo", off: "30%", cta: "Aproveitar ofertas", tone: "blue", category: "Papelaria" },
  { tag: "Home office", title: "Mais produtividade no seu dia", off: "25%", cta: "Ver produtos", tone: "teal", category: "Utilidades" },
  { tag: "Tecnologia", title: "Conecte-se com o futuro", off: "35%", cta: "Ver ofertas", tone: "violet", category: "Informática" },
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

export const categoryFromSlug = (slug: string): Category | undefined =>
  CATEGORIES.find((c) => categorySlug(c) === slug);

/* ----- Helpers puros sobre o produto (independentes do catálogo ativo) ---- */

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

/* ----- Normalização/validação (usado no admin e no carregamento) --------- */

export const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Garante que um objeto vindo do JSON/admin é um Product válido (ou null). */
export function sanitizeProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const name = typeof r.name === "string" ? r.name.trim() : "";
  const priceNum = Number(r.priceNum);
  const category = r.category as Category;
  if (!name || !Number.isFinite(priceNum) || priceNum <= 0 || !CATEGORIES.includes(category)) return null;

  const id = typeof r.id === "string" && r.id ? r.id : `adm-${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;
  const stock = Number.isFinite(Number(r.stock)) ? Math.max(0, Math.floor(Number(r.stock))) : 0;
  const oldPriceNum = Number(r.oldPriceNum) > priceNum ? Number(r.oldPriceNum) : undefined;
  const wholesalePrice = Number(r.wholesalePrice) > 0 && Number(r.wholesalePrice) < priceNum ? Number(r.wholesalePrice) : undefined;
  const wholesaleMin = wholesalePrice && Number(r.wholesaleMin) >= 2 ? Math.floor(Number(r.wholesaleMin)) : undefined;
  const icon = (PRODUCT_ICONS as readonly string[]).includes(r.icon as string) ? (r.icon as IconName) : "stack";
  const tone = (TONES as readonly string[]).includes(r.tone as string) ? (r.tone as Tone) : "blue";

  return {
    id,
    sku: typeof r.sku === "string" && r.sku ? r.sku : "—",
    name,
    priceNum,
    price: fmtBRL(priceNum),
    oldPriceNum,
    oldPrice: oldPriceNum ? fmtBRL(oldPriceNum) : undefined,
    wholesalePrice: wholesalePrice && wholesaleMin ? wholesalePrice : undefined,
    wholesaleMin: wholesalePrice && wholesaleMin ? wholesaleMin : undefined,
    stock,
    tags: Array.isArray(r.tags) ? (r.tags as unknown[]).filter((t): t is string => typeof t === "string") : undefined,
    installment: typeof r.installment === "string" && r.installment ? r.installment : "à vista",
    n: Math.min(5, Math.max(1, Math.round(Number(r.n)) || 5)),
    reviews: typeof r.reviews === "string" ? r.reviews : "0",
    icon,
    tone,
    category,
  };
}

export function sanitizeCatalog(list: unknown): Product[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const item of list) {
    const p = sanitizeProduct(item);
    if (p && !seen.has(p.id)) { seen.add(p.id); out.push(p); }
  }
  return out;
}

/* Ícones e tons disponíveis para escolher no painel admin */
export const PRODUCT_ICONS: IconName[] = [
  "pencil", "monitor", "cup", "lipstick", "users", "trash", "backpack", "pot", "stack", "box", "tag",
];
export const TONES: Tone[] = ["blue", "red", "soft", "violet", "teal", "amber"];
