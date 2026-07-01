-- ============================================================================
-- Paulex Armarinho — RLS das tabelas v2
-- Rode este arquivo DEPOIS de 04_ecommerce_v2.sql.
--
-- Regras (mesma filosofia da v1):
--   - Público só lê dados ativos (marcas, variações, imagens de produtos
--     ativos, cupons válidos, configurações da loja).
--   - Só admins criam/editam/apagam.
--   - Clientes não têm leitura de customers/inventory (dados sensíveis);
--     a criação de cliente no checkout passa pela função upsert_customer
--     (SECURITY DEFINER), que não expõe nenhum dado.
--   - inventory_movements é um log imutável: nem admin tem UPDATE/DELETE.
-- ============================================================================

alter table public.brands              enable row level security;
alter table public.product_images      enable row level security;
alter table public.product_variants    enable row level security;
alter table public.customers           enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.coupons             enable row level security;
alter table public.store_settings      enable row level security;

-- ---------------------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------------------
drop policy if exists "brands_select_public" on public.brands;
create policy "brands_select_public"
  on public.brands for select
  to anon, authenticated
  using (is_active = true or public.is_admin());

drop policy if exists "brands_insert_admin" on public.brands;
create policy "brands_insert_admin"
  on public.brands for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "brands_update_admin" on public.brands;
create policy "brands_update_admin"
  on public.brands for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "brands_delete_admin" on public.brands;
create policy "brands_delete_admin"
  on public.brands for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- product_images — público só vê imagens de produtos ativos
-- ---------------------------------------------------------------------------
drop policy if exists "product_images_select_public" on public.product_images;
create policy "product_images_select_public"
  on public.product_images for select
  to anon, authenticated
  using (
    exists (select 1 from public.products p where p.id = product_id and p.is_active = true)
    or public.is_admin()
  );

drop policy if exists "product_images_insert_admin" on public.product_images;
create policy "product_images_insert_admin"
  on public.product_images for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "product_images_update_admin" on public.product_images;
create policy "product_images_update_admin"
  on public.product_images for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "product_images_delete_admin" on public.product_images;
create policy "product_images_delete_admin"
  on public.product_images for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- product_variants — público só vê variações ativas de produtos ativos
-- ---------------------------------------------------------------------------
drop policy if exists "product_variants_select_public" on public.product_variants;
create policy "product_variants_select_public"
  on public.product_variants for select
  to anon, authenticated
  using (
    (is_active = true and exists
      (select 1 from public.products p where p.id = product_id and p.is_active = true))
    or public.is_admin()
  );

drop policy if exists "product_variants_insert_admin" on public.product_variants;
create policy "product_variants_insert_admin"
  on public.product_variants for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "product_variants_update_admin" on public.product_variants;
create policy "product_variants_update_admin"
  on public.product_variants for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "product_variants_delete_admin" on public.product_variants;
create policy "product_variants_delete_admin"
  on public.product_variants for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- customers — dados pessoais: só admin lê/edita. Criação pelo checkout
-- acontece via upsert_customer (SECURITY DEFINER), sem policy pública.
-- ---------------------------------------------------------------------------
drop policy if exists "customers_select_admin" on public.customers;
create policy "customers_select_admin"
  on public.customers for select
  to authenticated
  using (public.is_admin());

drop policy if exists "customers_update_admin" on public.customers;
create policy "customers_update_admin"
  on public.customers for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "customers_delete_admin" on public.customers;
create policy "customers_delete_admin"
  on public.customers for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- inventory_movements — log imutável: admin lê e insere; ninguém altera/apaga.
-- (a baixa automática de pedidos usa trigger SECURITY DEFINER, que não
-- depende destas policies)
-- ---------------------------------------------------------------------------
drop policy if exists "inventory_movements_select_admin" on public.inventory_movements;
create policy "inventory_movements_select_admin"
  on public.inventory_movements for select
  to authenticated
  using (public.is_admin());

drop policy if exists "inventory_movements_insert_admin" on public.inventory_movements;
create policy "inventory_movements_insert_admin"
  on public.inventory_movements for insert
  to authenticated
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- coupons — público só enxerga cupons válidos (ativos, dentro da vigência e
-- com limite de uso disponível); admin vê e gerencia todos.
-- ---------------------------------------------------------------------------
drop policy if exists "coupons_select_public" on public.coupons;
create policy "coupons_select_public"
  on public.coupons for select
  to anon, authenticated
  using (
    (is_active = true
      and (starts_at  is null or starts_at  <= now())
      and (expires_at is null or expires_at >  now())
      and (usage_limit is null or used_count < usage_limit))
    or public.is_admin()
  );

drop policy if exists "coupons_insert_admin" on public.coupons;
create policy "coupons_insert_admin"
  on public.coupons for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "coupons_update_admin" on public.coupons;
create policy "coupons_update_admin"
  on public.coupons for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "coupons_delete_admin" on public.coupons;
create policy "coupons_delete_admin"
  on public.coupons for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- store_settings — leitura pública (WhatsApp, frete, pedido mínimo aparecem
-- na loja); escrita só admin. Sem INSERT/DELETE: a linha única já existe.
-- ---------------------------------------------------------------------------
drop policy if exists "store_settings_select_public" on public.store_settings;
create policy "store_settings_select_public"
  on public.store_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "store_settings_update_admin" on public.store_settings;
create policy "store_settings_update_admin"
  on public.store_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
