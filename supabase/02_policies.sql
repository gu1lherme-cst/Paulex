-- ============================================================================
-- Paulex Armarinho — Row Level Security (RLS)
-- Rode este arquivo depois do 01_schema.sql.
--
-- Regras:
--   - Visitantes (anon) só leem categorias/produtos ATIVOS.
--   - Só administradores (presentes em admin_users) podem criar/editar/excluir
--     produtos e categorias, e ver/alterar pedidos.
--   - Qualquer pessoa pode CRIAR um pedido (checkout não exige login).
-- ============================================================================

alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_users enable row level security;

-- ---------------------------------------------------------------------------
-- is_admin(): função auxiliar usada em todas as políticas de escrita.
-- SECURITY DEFINER faz a consulta ignorar a RLS de admin_users, evitando
-- recursão (a política de admin_users também chama esta função).
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.email = (auth.jwt() ->> 'email')
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public"
  on public.categories for select
  to anon, authenticated
  using (is_active = true or public.is_admin());

drop policy if exists "categories_insert_admin" on public.categories;
create policy "categories_insert_admin"
  on public.categories for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "categories_update_admin" on public.categories;
create policy "categories_update_admin"
  on public.categories for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "categories_delete_admin" on public.categories;
create policy "categories_delete_admin"
  on public.categories for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
  on public.products for select
  to anon, authenticated
  using (is_active = true or public.is_admin());

drop policy if exists "products_insert_admin" on public.products;
create policy "products_insert_admin"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "products_update_admin" on public.products;
create policy "products_update_admin"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "products_delete_admin" on public.products;
create policy "products_delete_admin"
  on public.products for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- orders — cliente cria, só admin lê/altera/apaga
-- ---------------------------------------------------------------------------
drop policy if exists "orders_insert_public" on public.orders;
create policy "orders_insert_public"
  on public.orders for insert
  to anon, authenticated
  with check (true);

drop policy if exists "orders_select_admin" on public.orders;
create policy "orders_select_admin"
  on public.orders for select
  to authenticated
  using (public.is_admin());

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin"
  on public.orders for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "orders_delete_admin" on public.orders;
create policy "orders_delete_admin"
  on public.orders for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- order_items — mesma regra de orders
-- ---------------------------------------------------------------------------
drop policy if exists "order_items_insert_public" on public.order_items;
create policy "order_items_insert_public"
  on public.order_items for insert
  to anon, authenticated
  with check (true);

drop policy if exists "order_items_select_admin" on public.order_items;
create policy "order_items_select_admin"
  on public.order_items for select
  to authenticated
  using (public.is_admin());

drop policy if exists "order_items_delete_admin" on public.order_items;
create policy "order_items_delete_admin"
  on public.order_items for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- admin_users — cada admin só vê a própria linha; escrita só manual
-- (via SQL Editor do Supabase), nunca pelo app.
-- ---------------------------------------------------------------------------
drop policy if exists "admin_users_select_self" on public.admin_users;
create policy "admin_users_select_self"
  on public.admin_users for select
  to authenticated
  using (email = (auth.jwt() ->> 'email') or public.is_admin());
