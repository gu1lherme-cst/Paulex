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
  name: string;
  price: string;
  priceNum: number;
  oldPrice?: string;
  oldPriceNum?: number;
  installment: string;
  n: number;
  reviews: string;
  icon: IconName;
  tone: Tone;
  category: Category;
};

/* ------------------------------- Produtos -------------------------------- */

export const PRODUCTS: Product[] = [
  { id: "px-b1", name: "Caderno inteligente capa dura A5", price: "R$ 49,90", priceNum: 49.9, oldPrice: "R$ 58,90", oldPriceNum: 58.9, installment: "em 3x sem juros", n: 5, reviews: "1.245", icon: "pencil", tone: "blue", category: "Papelaria" },
  { id: "px-b2", name: "Mouse sem fio silencioso USB-C", price: "R$ 89,90", priceNum: 89.9, oldPrice: "R$ 109,90", oldPriceNum: 109.9, installment: "em 6x sem juros", n: 4, reviews: "982", icon: "monitor", tone: "violet", category: "Informática" },
  { id: "px-b3", name: "Organizador modular de mesa", price: "R$ 64,90", priceNum: 64.9, oldPrice: "R$ 79,90", oldPriceNum: 79.9, installment: "em 4x sem juros", n: 5, reviews: "1.103", icon: "cup", tone: "teal", category: "Utilidades" },
  { id: "px-b4", name: "Kit cuidados diários essencial", price: "R$ 79,90", priceNum: 79.9, installment: "em 4x sem juros", n: 4, reviews: "875", icon: "lipstick", tone: "red", category: "Cosméticos" },
  { id: "px-b5", name: "Fone de ouvido Bluetooth", price: "R$ 129,90", priceNum: 129.9, oldPrice: "R$ 169,90", oldPriceNum: 169.9, installment: "em 6x sem juros", n: 5, reviews: "1.782", icon: "monitor", tone: "violet", category: "Informática" },
  { id: "px-b6", name: "Impressora multifuncional Wi-Fi", price: "R$ 899,10", priceNum: 899.1, oldPrice: "R$ 1.099,00", oldPriceNum: 1099, installment: "em 10x sem juros", n: 4, reviews: "967", icon: "monitor", tone: "soft", category: "Informática" },
  { id: "px-b7", name: "Jogo de blocos de montar 120 peças", price: "R$ 59,90", priceNum: 59.9, installment: "em 3x sem juros", n: 5, reviews: "734", icon: "users", tone: "amber", category: "Brinquedos" },
  { id: "px-b8", name: "Pelúcia urso macio 30cm", price: "R$ 44,90", priceNum: 44.9, oldPrice: "R$ 54,90", oldPriceNum: 54.9, installment: "em 2x sem juros", n: 4, reviews: "612", icon: "users", tone: "amber", category: "Brinquedos" },
  { id: "px-b9", name: "Copos descartáveis 200ml (100un)", price: "R$ 19,90", priceNum: 19.9, installment: "em 1x sem juros", n: 4, reviews: "498", icon: "trash", tone: "soft", category: "Descartáveis" },
  { id: "px-b10", name: "Pratos descartáveis 18cm (50un)", price: "R$ 24,90", priceNum: 24.9, oldPrice: "R$ 29,90", oldPriceNum: 29.9, installment: "em 2x sem juros", n: 5, reviews: "356", icon: "trash", tone: "soft", category: "Descartáveis" },
  { id: "px-b11", name: "Canetas gel coloridas (12 cores)", price: "R$ 34,90", priceNum: 34.9, oldPrice: "R$ 44,90", oldPriceNum: 44.9, installment: "em 2x sem juros", n: 5, reviews: "1.021", icon: "pencil", tone: "blue", category: "Papelaria" },
  { id: "px-b12", name: "Pano multiuso de limpeza (5un)", price: "R$ 14,90", priceNum: 14.9, installment: "em 1x sem juros", n: 4, reviews: "289", icon: "cup", tone: "teal", category: "Utilidades" },
  { id: "px-b13", name: "Hidratante facial diário 50g", price: "R$ 39,90", priceNum: 39.9, oldPrice: "R$ 49,90", oldPriceNum: 49.9, installment: "em 2x sem juros", n: 5, reviews: "844", icon: "lipstick", tone: "red", category: "Cosméticos" },
  { id: "px-b14", name: "Mochila escolar reforçada 30L", price: "R$ 119,90", priceNum: 119.9, oldPrice: "R$ 149,90", oldPriceNum: 149.9, installment: "em 6x sem juros", n: 5, reviews: "528", icon: "backpack", tone: "blue", category: "Acessórios" },
  { id: "px-b15", name: "Estojo escolar 3 divisórias", price: "R$ 29,90", priceNum: 29.9, installment: "em 2x sem juros", n: 4, reviews: "401", icon: "backpack", tone: "violet", category: "Acessórios" },
  { id: "px-b16", name: "Jogo de panelas antiaderente 5 peças", price: "R$ 249,90", priceNum: 249.9, oldPrice: "R$ 319,90", oldPriceNum: 319.9, installment: "em 10x sem juros", n: 5, reviews: "612", icon: "pot", tone: "teal", category: "Casa" },
  { id: "px-b17", name: "Pote hermético com tampa 1,5L", price: "R$ 22,90", priceNum: 22.9, installment: "em 1x sem juros", n: 4, reviews: "337", icon: "pot", tone: "teal", category: "Casa" },
];

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

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
export const productById = (id: string): Product | undefined => byId.get(id);

export const productsByCategory = (c: Category) =>
  PRODUCTS.filter((p) => p.category === c);

export const offers = () => PRODUCTS.filter((p) => p.oldPriceNum);

export const discountPercent = (p: Product) =>
  p.oldPriceNum ? Math.round((1 - p.priceNum / p.oldPriceNum) * 100) : 0;

export const searchProducts = (query: string) => {
  const q = norm(query);
  if (!q) return [];
  return PRODUCTS.filter(
    (p) => norm(p.name).includes(q) || norm(p.category).includes(q)
  );
};

export const relatedProducts = (p: Product, count = 4) => {
  const same = PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category);
  const rest = PRODUCTS.filter((x) => x.id !== p.id && x.category !== p.category);
  return [...same, ...rest].slice(0, count);
};

/* Descrição curta gerada (editável quando houver descrições reais) */
export const productDescription = (p: Product) =>
  `${p.name} — produto da categoria ${p.category} disponível na Paulex Armarinho. ` +
  `Qualidade e preço justo, com retirada na loja ou entrega para todo o Rio de Janeiro.`;
