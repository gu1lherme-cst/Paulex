-- ============================================================================
-- Paulex Armarinho — schema do banco (Supabase / PostgreSQL)
-- Rode este arquivo primeiro no SQL Editor do Supabase.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  -- Extras para preservar o visual atual (ícone + cor por categoria).
  icon        text not null default 'stack',
  tone        text not null default 'blue',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists categories_is_active_idx on public.categories (is_active);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  slug               text not null unique,
  description        text,
  -- price = preço cheio; promotional_price = preço com desconto (opcional).
  -- Preço efetivo de venda = coalesce(promotional_price, price).
  price              numeric(10,2) not null check (price > 0),
  promotional_price  numeric(10,2) check (promotional_price is null or (promotional_price > 0 and promotional_price < price)),
  category_id        uuid references public.categories (id) on delete set null,
  image_url          text,
  stock_quantity     integer not null default 0 check (stock_quantity >= 0),
  sku                text unique,
  is_featured        boolean not null default false,
  is_active          boolean not null default true,
  -- Extras para preservar recursos já em produção no site:
  icon               text not null default 'stack',              -- placeholder visual quando não há foto
  tone               text not null default 'blue',                -- placeholder visual quando não há foto
  installment_label  text not null default 'à vista',             -- texto de parcelamento exibido no card
  wholesale_price    numeric(10,2) check (wholesale_price is null or wholesale_price > 0), -- preço de atacado
  wholesale_min_qty  integer check (wholesale_min_qty is null or wholesale_min_qty >= 2),  -- qtd. mínima p/ atacado
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_is_active_idx on public.products (is_active);
create index if not exists products_is_featured_idx on public.products (is_featured);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  customer_address text,
  total_amount     numeric(10,2) not null check (total_amount >= 0),
  status           text not null default 'pendente'
                     check (status in ('pendente', 'confirmado', 'em_preparo', 'a_caminho', 'entregue', 'cancelado')),
  payment_method   text not null default 'a_combinar'
                     check (payment_method in ('dinheiro', 'pix', 'cartao', 'a_combinar')),
  notes            text,
  created_at       timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- ---------------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------------
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  product_id   uuid references public.products (id) on delete set null,
  -- snapshot no momento da compra (preço/nome não mudam se o produto mudar depois)
  product_name text not null,
  quantity     integer not null check (quantity > 0),
  unit_price   numeric(10,2) not null check (unit_price >= 0),
  subtotal     numeric(10,2) not null check (subtotal >= 0)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ---------------------------------------------------------------------------
-- admin_users
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  role       text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);
