-- ============================================================================
-- Paulex Armarinho — evolução v2 do banco (e-commerce completo)
-- Rode este arquivo DEPOIS de 01_schema.sql, 02_policies.sql e
-- 03_seed_categories.sql. Migration aditiva: não apaga nem altera dados
-- existentes, só adiciona tabelas/colunas e ajusta constraints.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. brands — marcas dos produtos
-- ---------------------------------------------------------------------------
create table if not exists public.brands (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  logo_url   text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products
  add column if not exists brand_id uuid references public.brands (id) on delete set null;

create index if not exists products_brand_id_idx on public.products (brand_id);
create index if not exists brands_is_active_idx on public.brands (is_active);

-- ---------------------------------------------------------------------------
-- 2. product_images — galeria de fotos por produto
--    (products.image_url continua sendo a foto de capa; a galeria complementa)
-- ---------------------------------------------------------------------------
create table if not exists public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url  text not null,
  alt_text   text,
  sort_order integer not null default 0,
  is_main    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on public.product_images (product_id);

-- ---------------------------------------------------------------------------
-- 3. product_variants — variações (cor, tamanho, voltagem…) com preço e
--    estoque próprios; atributos livres em JSONB (ex.: {"cor":"azul"}).
-- ---------------------------------------------------------------------------
create table if not exists public.product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products (id) on delete cascade,
  name           text not null,
  sku            text unique,
  price          numeric(10,2) not null check (price > 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  attributes     jsonb not null default '{}'::jsonb,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

create index if not exists product_variants_product_id_idx on public.product_variants (product_id);

-- ---------------------------------------------------------------------------
-- 4. customers — clientes (deduplicados por telefone via upsert_customer)
-- ---------------------------------------------------------------------------
create table if not exists public.customers (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  phone                text not null unique,
  email                text,
  document             text,
  address_street       text,
  address_number       text,
  address_complement   text,
  address_neighborhood text,
  address_city         text,
  address_state        text,
  address_zip          text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. inventory_movements — histórico imutável de estoque.
--    type: 'in' soma, 'out' subtrai, 'adjustment' define o valor absoluto.
-- ---------------------------------------------------------------------------
create table if not exists public.inventory_movements (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  type       text not null check (type in ('in', 'out', 'adjustment')),
  quantity   integer not null check (quantity >= 0),
  reason     text,
  created_by text default (auth.jwt() ->> 'email'),
  created_at timestamptz not null default now()
);

create index if not exists inventory_movements_product_id_idx on public.inventory_movements (product_id);
create index if not exists inventory_movements_created_at_idx on public.inventory_movements (created_at desc);

-- ---------------------------------------------------------------------------
-- 6. orders / order_items — pedido completo (cliente, entrega, desconto, frete)
-- ---------------------------------------------------------------------------
alter table public.orders
  add column if not exists customer_id     uuid references public.customers (id) on delete set null,
  add column if not exists fulfillment     text not null default 'retirada',
  add column if not exists subtotal_amount numeric(10,2),
  add column if not exists discount_amount numeric(10,2) not null default 0,
  add column if not exists shipping_fee    numeric(10,2) not null default 0,
  add column if not exists coupon_code     text;

alter table public.orders drop constraint if exists orders_fulfillment_check;
alter table public.orders
  add constraint orders_fulfillment_check check (fulfillment in ('retirada', 'entrega'));

-- Status mais detalhado (inclui "pronto para retirada")
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check check (status in
    ('pendente', 'confirmado', 'em_preparo', 'pronto_retirada', 'a_caminho', 'entregue', 'cancelado'));

alter table public.order_items
  add column if not exists variant_id   uuid references public.product_variants (id) on delete set null,
  add column if not exists variant_name text;

create index if not exists orders_customer_id_idx on public.orders (customer_id);

-- ---------------------------------------------------------------------------
-- 7. coupons — cupons de desconto gerenciados pelo admin.
--    (substitui os cupons fixos que viviam no código do frontend)
-- ---------------------------------------------------------------------------
create table if not exists public.coupons (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique,
  type             text not null check (type in ('percentage', 'fixed')),
  value            numeric(10,2) not null check (value > 0),
  min_order_amount numeric(10,2) not null default 0,
  starts_at        timestamptz,
  expires_at       timestamptz,
  usage_limit      integer check (usage_limit is null or usage_limit > 0),
  used_count       integer not null default 0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

-- Mantém funcionando os códigos que a loja já divulgava
insert into public.coupons (code, type, value) values
  ('PAULEX10',  'percentage', 10),
  ('RETIRADA5', 'percentage', 5),
  ('ATACADO15', 'percentage', 15)
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- 8. store_settings — configurações da loja (linha única, id = 1)
-- ---------------------------------------------------------------------------
create table if not exists public.store_settings (
  id               smallint primary key default 1 check (id = 1),
  whatsapp_number  text not null default '5521987578187',
  address          text,
  opening_hours    text,
  delivery_fee     numeric(10,2) not null default 0,
  min_order_amount numeric(10,2) not null default 0,
  updated_at       timestamptz not null default now()
);

insert into public.store_settings (id) values (1) on conflict do nothing;

drop trigger if exists store_settings_set_updated_at on public.store_settings;
create trigger store_settings_set_updated_at
  before update on public.store_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 9. upsert_customer — chamada pelo checkout (anon). SECURITY DEFINER para
--    deduplicar por telefone sem dar ao público permissão de ler customers.
--    Retorna só o id do cliente (nenhum dado pessoal vaza).
-- ---------------------------------------------------------------------------
create or replace function public.upsert_customer(
  p_name    text,
  p_phone   text,
  p_email   text default null,
  p_address text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_phone is null or length(regexp_replace(p_phone, '\D', '', 'g')) < 8 then
    return null; -- telefone inválido/não informado: pedido segue sem vínculo
  end if;
  insert into customers (name, phone, email, address_street)
  values (
    coalesce(nullif(trim(p_name), ''), 'Cliente do site'),
    trim(p_phone),
    nullif(trim(coalesce(p_email, '')), ''),
    nullif(trim(coalesce(p_address, '')), '')
  )
  on conflict (phone) do update set
    name           = excluded.name,
    email          = coalesce(excluded.email, customers.email),
    address_street = coalesce(excluded.address_street, customers.address_street)
  returning id into v_id;
  return v_id;
end;
$$;

grant execute on function public.upsert_customer(text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 10. register_inventory_movement — movimentação de estoque atômica (admin).
--     SECURITY INVOKER (padrão): a RLS garante que só admin consegue executar,
--     pois exige UPDATE em products/variants e INSERT em inventory_movements.
-- ---------------------------------------------------------------------------
create or replace function public.register_inventory_movement(
  p_product_id uuid,
  p_variant_id uuid,
  p_type       text,
  p_quantity   integer,
  p_reason     text default null
)
returns void
language plpgsql
set search_path = public
as $$
begin
  if p_type not in ('in', 'out', 'adjustment') then
    raise exception 'Tipo de movimentação inválido: %', p_type;
  end if;
  if p_quantity < 0 then
    raise exception 'Quantidade não pode ser negativa';
  end if;

  if p_variant_id is not null then
    update product_variants set stock_quantity = case p_type
      when 'in'  then stock_quantity + p_quantity
      when 'out' then greatest(0, stock_quantity - p_quantity)
      else p_quantity end
    where id = p_variant_id;
  else
    update products set stock_quantity = case p_type
      when 'in'  then stock_quantity + p_quantity
      when 'out' then greatest(0, stock_quantity - p_quantity)
      else p_quantity end
    where id = p_product_id;
  end if;

  insert into inventory_movements (product_id, variant_id, type, quantity, reason)
  values (p_product_id, p_variant_id, p_type, p_quantity, p_reason);
end;
$$;

grant execute on function public.register_inventory_movement(uuid, uuid, text, integer, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 11. Triggers de negócio
-- ---------------------------------------------------------------------------

-- Baixa automática de estoque + log quando um item de pedido é criado.
-- SECURITY DEFINER: o cliente (anon) não tem permissão de UPDATE em products,
-- mas a baixa precisa acontecer mesmo assim.
create or replace function public.handle_order_item_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.variant_id is not null then
    update product_variants
      set stock_quantity = greatest(0, stock_quantity - new.quantity)
      where id = new.variant_id;
  elsif new.product_id is not null then
    update products
      set stock_quantity = greatest(0, stock_quantity - new.quantity)
      where id = new.product_id;
  end if;

  insert into inventory_movements (product_id, variant_id, type, quantity, reason, created_by)
  values (new.product_id, new.variant_id, 'out', new.quantity,
          'Pedido ' || new.order_id, coalesce(auth.jwt() ->> 'email', 'loja'));
  return new;
end;
$$;

drop trigger if exists order_items_stock on public.order_items;
create trigger order_items_stock
  after insert on public.order_items
  for each row execute function public.handle_order_item_stock();

-- Contabiliza o uso do cupom quando um pedido é criado com coupon_code.
create or replace function public.handle_order_coupon()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.coupon_code is not null then
    update coupons set used_count = used_count + 1 where code = new.coupon_code;
  end if;
  return new;
end;
$$;

drop trigger if exists orders_coupon on public.orders;
create trigger orders_coupon
  after insert on public.orders
  for each row execute function public.handle_order_coupon();
