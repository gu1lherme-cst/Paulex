import { supabase } from "../lib/supabaseClient";
import { fmtBRL, type IconName, type Product, type Tone } from "../data/catalog";
import type { ProductRow } from "./types";

/* ----------------------------------------------------------------------------
 * Acesso à tabela `products`. Leitura pública respeita RLS (só produtos
 * ativos para quem não é admin); escrita exige sessão de administrador
 * (ver supabase/02_policies.sql).
 * ------------------------------------------------------------------------- */

const SELECT_WITH_CATEGORY = "*, categories ( name )";

/* Converte uma linha do banco para o `Product` que a loja já sabe renderizar. */
export function rowToProduct(row: ProductRow): Product {
  const effectivePrice = row.promotional_price ?? row.price;
  const hasDiscount = row.promotional_price != null;
  return {
    id: row.id,
    sku: row.sku ?? "—",
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    price: fmtBRL(effectivePrice),
    priceNum: effectivePrice,
    oldPrice: hasDiscount ? fmtBRL(row.price) : undefined,
    oldPriceNum: hasDiscount ? row.price : undefined,
    wholesalePrice: row.wholesale_price ?? undefined,
    wholesaleMin: row.wholesale_min_qty ?? undefined,
    stock: row.stock_quantity,
    installment: row.installment_label,
    n: 5,
    reviews: "Novo",
    icon: row.icon as IconName,
    tone: row.tone as Tone,
    imageUrl: row.image_url ?? undefined,
    category: row.categories?.name ?? "Outros",
    isFeatured: row.is_featured,
  };
}

export async function listActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_WITH_CATEGORY)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(rowToProduct);
}

export type AdminProductRow = ProductRow;

export async function listAllProducts(): Promise<AdminProductRow[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_WITH_CATEGORY)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as AdminProductRow[];
}

export type ProductInput = {
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  promotional_price?: number | null;
  category_id: string;
  image_url?: string | null;
  stock_quantity: number;
  sku?: string | null;
  is_featured: boolean;
  is_active: boolean;
  icon: string;
  tone: string;
  installment_label: string;
  wholesale_price?: number | null;
  wholesale_min_qty?: number | null;
};

export async function createProduct(input: ProductInput): Promise<void> {
  const { error } = await supabase.from("products").insert(input);
  if (error) throw error;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  const { error } = await supabase.from("products").update(input).eq("id", id);
  if (error) throw error;
}

export async function setProductActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
}
