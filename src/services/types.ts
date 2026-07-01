/* Tipos das linhas do banco (Supabase), espelhando supabase/01_schema.sql. */

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string;
  tone: string;
  is_active: boolean;
  created_at: string;
};

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  promotional_price: number | null;
  category_id: string | null;
  brand_id: string | null;
  image_url: string | null;
  stock_quantity: number;
  sku: string | null;
  is_featured: boolean;
  is_active: boolean;
  icon: string;
  tone: string;
  installment_label: string;
  wholesale_price: number | null;
  wholesale_min_qty: number | null;
  created_at: string;
  updated_at: string;
  /* presentes quando a consulta faz join */
  categories?: { name: string } | null;
  product_images?: ProductImageRow[];
};

export type BrandRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_main: boolean;
  created_at: string;
};

export type ProductVariantRow = {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number;
  stock_quantity: number;
  attributes: Record<string, string>;
  is_active: boolean;
  created_at: string;
};

export type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  document: string | null;
  address_street: string | null;
  address_number: string | null;
  address_complement: string | null;
  address_neighborhood: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  created_at: string;
  updated_at: string;
};

export type InventoryMovementType = "in" | "out" | "adjustment";

export type InventoryMovementRow = {
  id: string;
  product_id: string | null;
  variant_id: string | null;
  type: InventoryMovementType;
  quantity: number;
  reason: string | null;
  created_by: string | null;
  created_at: string;
  /* presente quando a consulta faz join com products(name) */
  products?: { name: string } | null;
};

export type CouponType = "percentage" | "fixed";

export type CouponRow = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  min_order_amount: number;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
};

export type StoreSettingsRow = {
  id: number;
  whatsapp_number: string;
  address: string | null;
  opening_hours: string | null;
  delivery_fee: number;
  min_order_amount: number;
  updated_at: string;
};

export type OrderStatus =
  | "pendente" | "confirmado" | "em_preparo" | "pronto_retirada"
  | "a_caminho" | "entregue" | "cancelado";
export type PaymentMethod = "dinheiro" | "pix" | "cartao" | "a_combinar";
export type Fulfillment = "retirada" | "entrega";

export type OrderRow = {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string | null;
  fulfillment: Fulfillment;
  subtotal_amount: number | null;
  discount_amount: number;
  shipping_fee: number;
  coupon_code: string | null;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  notes: string | null;
  created_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type OrderWithItems = OrderRow & { order_items: OrderItemRow[] };
