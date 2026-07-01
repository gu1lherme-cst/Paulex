-- ============================================================================
-- Paulex Armarinho — categorias padrão (estrutura, não "produto de demonstração")
-- Rode este arquivo depois do 02_policies.sql.
-- Mesmo nome/ícone/tom que a loja já usa hoje, para não mudar o visual.
-- ============================================================================

insert into public.categories (name, slug, description, icon, tone) values
  ('Papelaria',    'papelaria',    'Cadernos, canetas e material escolar',        'pencil',   'blue'),
  ('Utilidades',   'utilidades',   'Organização, limpeza e muito mais',           'cup',      'teal'),
  ('Brinquedos',   'brinquedos',   'Diversão para todas as idades',               'users',    'amber'),
  ('Cosméticos',   'cosmeticos',   'Cuidados diários com as melhores marcas',     'lipstick', 'red'),
  ('Informática',  'informatica',  'Tecnologia que simplifica o seu dia',         'monitor',  'violet'),
  ('Acessórios',   'acessorios',   'Mochilas, estojos e mais',                    'backpack', 'blue'),
  ('Casa',         'casa',         'Praticidade para o seu dia a dia',            'pot',      'teal'),
  ('Descartáveis', 'descartaveis', 'Soluções práticas para o dia a dia',          'trash',    'soft')
on conflict (slug) do nothing;
