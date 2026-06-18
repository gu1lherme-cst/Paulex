export type CategoryId =
  | "papelaria"
  | "utilidades"
  | "descartaveis"
  | "brinquedos"
  | "informatica"
  | "cosmeticos";

export interface Category {
  id: CategoryId;
  nome: string;
  desc: string;
  /** caminho do ícone SVG (string com <path .../>) renderizado via Icon */
  icon: string;
}

export interface Tier {
  de: number;
  ate: number; // use Infinity na última faixa
  preco: number;
  off: string | null;
}

export interface Product {
  id: string;
  nome: string;
  unidade: string;
  preco: number;
  precoAntigo?: number;
  precoAtacado?: number;
  cat: CategoryId;
  desc: string;
  specs: [string, string][];
  /** conteúdo interno do SVG de ilustração (fallback quando não há foto) */
  art: string;
  imagem?: string;
  rating: number;
  avaliacoes: number;
  estoque: number;
  maisVendido?: boolean;
  promo?: boolean;
  novidade?: boolean;
  tiers?: Tier[];
}

export interface Cupom {
  desconto: number;
  descricao: string;
}

export interface OrderItem {
  id: string;
  nome: string;
  qty: number;
  valor: number;
}

export type OrderStatus = "aguardando" | "pago" | "entregue" | "cancelado";

export interface Order {
  numero: string;
  data: string;
  status: OrderStatus;
  total: number;
  itens: OrderItem[];
  pagamento?: "whatsapp" | "pix" | "cartao";
  cliente?: { nome?: string; email?: string };
}

export interface Address {
  nome: string;
  cep: string;
  rua: string;
  bairro: string;
}

export interface User {
  nome: string;
  email: string;
  admin?: boolean;
}

export type CartMap = Record<string, number>;
