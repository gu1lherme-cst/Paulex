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
  /* presente quando a consulta faz join com categories(name) */
  categories?: { name: string } | null;
};

export type OrderStatus = "pendente" | "confirmado" | "em_preparo" | "a_caminho" | "entregue" | "cancelado";
export type PaymentMethod = "dinheiro" | "pix" | "cartao" | "a_combinar";

export type OrderRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string | null;
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
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type OrderWithItems = OrderRow & { order_items: OrderItemRow[] };
