-- ============================================================================
-- Paulex Armarinho — endurecimento de segurança dos pedidos (v2.1)
-- Rode este arquivo DEPOIS de 04_ecommerce_v2.sql e 05_policies_v2.sql.
--
-- O que muda e por quê:
--   1. Pedidos passam a ser criados SÓ pela função create_order (SECURITY
--      DEFINER), que valida tudo no servidor: produto ativo, preço real do
--      banco (não o enviado pelo cliente), quantidade limitada ao estoque e
--      cupom validado server-side. Isso fecha:
--        - forja de totais/preços (o cliente não define mais o valor);
--        - dreno de estoque por atacante (não dá mais para inserir order_items
--          direto e derrubar o estoque via trigger);
--        - griefing de cupom (used_count só sobe por pedido legítimo).
--   2. Revoga o INSERT público direto em orders/order_items — ninguém escreve
--      nessas tabelas sem passar pela função.
--   3. upsert_customer deixa de sobrescrever o nome já cadastrado.
--   4. CHECKs de integridade: cupom percentual <= 100%, nomes não vazios.
-- Migration aditiva e idempotente: pode rodar mais de uma vez.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Fecha a criação direta de pedidos por anon.
--    A partir daqui, orders/order_items só recebem escrita via create_order
--    (SECURITY DEFINER, que roda como owner e ignora estas policies).
-- ---------------------------------------------------------------------------
drop policy if exists "orders_insert_public" on public.orders;
drop policy if exists "order_items_insert_public" on public.order_items;

-- ---------------------------------------------------------------------------
-- 2. upsert_customer: não sobrescreve dados já preenchidos (evita vandalismo
--    de cadastro por quem enumere telefones). Só completa campos vazios.
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
    -- só completa o que estava vazio; nunca sobrescreve dado já existente
    name           = coalesce(nullif(customers.name, ''), excluded.name),
    email          = coalesce(customers.email, excluded.email),
    address_street = coalesce(customers.address_street, excluded.address_street),
    updated_at     = now()
  returning id into v_id;
  return v_id;
end;
$$;

grant execute on function public.upsert_customer(text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. create_order — única porta de entrada de pedidos.
--    Recebe um JSONB com os dados do cliente + itens (só product_id e
--    quantity são confiáveis; preço/nome/subtotal são recalculados aqui).
--    Retorna o id do pedido criado.
-- ---------------------------------------------------------------------------
create or replace function public.create_order(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id   uuid;
  v_customer_id uuid;
  v_item       jsonb;
  v_prod       public.products%rowtype;
  v_qty        integer;
  v_unit       numeric(10,2);
  v_line       numeric(10,2);
  v_subtotal   numeric(10,2) := 0;
  v_discount   numeric(10,2) := 0;
  v_shipping   numeric(10,2) := 0;
  v_coupon     public.coupons%rowtype;
  v_fulfillment text;
  v_payment    text;
  v_settings   public.store_settings%rowtype;
begin
  -- Validação básica do payload
  if payload is null or jsonb_typeof(payload->'items') <> 'array'
     or jsonb_array_length(payload->'items') = 0 then
    raise exception 'Pedido sem itens.';
  end if;

  v_fulfillment := coalesce(payload->>'fulfillment', 'retirada');
  if v_fulfillment not in ('retirada', 'entrega') then
    v_fulfillment := 'retirada';
  end if;

  v_payment := coalesce(payload->>'payment_method', 'a_combinar');
  if v_payment not in ('dinheiro', 'pix', 'cartao', 'a_combinar') then
    v_payment := 'a_combinar';
  end if;

  -- Cliente (deduplicado por telefone; falha aqui não impede o pedido)
  v_customer_id := public.upsert_customer(
    payload->>'customer_name', payload->>'customer_phone',
    payload->>'customer_email', payload->>'customer_address');

  -- Cabeçalho (totais preenchidos no final, após validar os itens)
  insert into orders (
    customer_id, customer_name, customer_phone, customer_email, customer_address,
    fulfillment, payment_method, notes, total_amount, subtotal_amount,
    discount_amount, shipping_fee
  ) values (
    v_customer_id,
    coalesce(nullif(trim(payload->>'customer_name'), ''), 'Cliente do site'),
    coalesce(nullif(trim(payload->>'customer_phone'), ''), 'não informado'),
    nullif(trim(coalesce(payload->>'customer_email', '')), ''),
    case when v_fulfillment = 'entrega'
         then nullif(trim(coalesce(payload->>'customer_address', '')), '') end,
    v_fulfillment, v_payment,
    nullif(trim(coalesce(payload->>'notes', '')), ''),
    0, 0, 0, 0
  ) returning id into v_order_id;

  -- Itens: preço e nome vêm SEMPRE do banco; quantidade limitada ao estoque.
  for v_item in select * from jsonb_array_elements(payload->'items') loop
    select * into v_prod from public.products
      where id = (v_item->>'product_id')::uuid and is_active = true;
    if not found then
      raise exception 'Produto inválido ou inativo: %', v_item->>'product_id';
    end if;

    v_qty := floor(coalesce((v_item->>'quantity')::numeric, 0))::int;
    v_qty := greatest(1, least(v_qty, v_prod.stock_quantity));  -- 1..estoque
    if v_prod.stock_quantity <= 0 then
      continue; -- produto esgotado: ignora o item
    end if;

    -- preço de atacado quando aplicável, senão promocional/cheio (tudo do banco)
    if v_prod.wholesale_price is not null and v_prod.wholesale_min_qty is not null
       and v_qty >= v_prod.wholesale_min_qty then
      v_unit := v_prod.wholesale_price;
    else
      v_unit := coalesce(v_prod.promotional_price, v_prod.price);
    end if;

    v_line := round(v_unit * v_qty, 2);
    v_subtotal := v_subtotal + v_line;

    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
    values (v_order_id, v_prod.id, v_prod.name, v_qty, v_unit, v_line);
  end loop;

  if v_subtotal <= 0 then
    -- nenhum item válido (tudo esgotado/ inválido): desfaz o pedido
    raise exception 'Nenhum item disponível para este pedido.';
  end if;

  -- Cupom validado server-side (mesma regra da policy pública)
  if coalesce(payload->>'coupon_code', '') <> '' then
    select * into v_coupon from public.coupons
      where code = upper(trim(payload->>'coupon_code'))
        and is_active = true
        and (starts_at  is null or starts_at  <= now())
        and (expires_at is null or expires_at >  now())
        and (usage_limit is null or used_count < usage_limit)
        and v_subtotal >= min_order_amount;
    if found then
      v_discount := case v_coupon.type
                      when 'percentage' then round(v_subtotal * v_coupon.value / 100, 2)
                      else v_coupon.value end;
      v_discount := least(v_discount, v_subtotal);
      update public.coupons set used_count = used_count + 1 where id = v_coupon.id;
      update public.orders set coupon_code = v_coupon.code where id = v_order_id;
    end if;
  end if;

  -- Frete: taxa de entrega das configurações da loja (não vem do cliente)
  if v_fulfillment = 'entrega' then
    select * into v_settings from public.store_settings where id = 1;
    v_shipping := coalesce(v_settings.delivery_fee, 0);
  end if;

  update public.orders set
    subtotal_amount = v_subtotal,
    discount_amount = v_discount,
    shipping_fee    = v_shipping,
    total_amount    = greatest(0, v_subtotal - v_discount) + v_shipping
  where id = v_order_id;

  return v_order_id;
end;
$$;

grant execute on function public.create_order(jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. CHECKs de integridade (idempotentes).
-- ---------------------------------------------------------------------------

-- Cupom percentual não pode passar de 100%.
alter table public.coupons drop constraint if exists coupons_percentage_max_check;
alter table public.coupons
  add constraint coupons_percentage_max_check
  check (type <> 'percentage' or value <= 100);

-- Nomes não podem ser vazios/whitespace.
alter table public.products drop constraint if exists products_name_not_blank_check;
alter table public.products
  add constraint products_name_not_blank_check check (char_length(trim(name)) > 0);

alter table public.categories drop constraint if exists categories_name_not_blank_check;
alter table public.categories
  add constraint categories_name_not_blank_check check (char_length(trim(name)) > 0);

alter table public.brands drop constraint if exists brands_name_not_blank_check;
alter table public.brands
  add constraint brands_name_not_blank_check check (char_length(trim(name)) > 0);

-- URLs de imagem, quando informadas, devem ser http(s).
alter table public.products drop constraint if exists products_image_url_scheme_check;
alter table public.products
  add constraint products_image_url_scheme_check
  check (image_url is null or image_url ~* '^https?://');

alter table public.product_images drop constraint if exists product_images_url_scheme_check;
alter table public.product_images
  add constraint product_images_url_scheme_check
  check (image_url ~* '^https?://');

alter table public.brands drop constraint if exists brands_logo_url_scheme_check;
alter table public.brands
  add constraint brands_logo_url_scheme_check
  check (logo_url is null or logo_url ~* '^https?://');
