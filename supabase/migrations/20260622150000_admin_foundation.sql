-- Admin foundation for StockFlow. Operational stock, sales and finance tables
-- will be introduced in their dedicated implementation phases.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code in ('admin', 'magasin', 'commercial', 'caisse')),
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table public.app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  role_id uuid not null references public.roles(id),
  full_name text not null,
  email text not null,
  agent_code text not null unique,
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  first_login_required boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index app_users_email_lower_idx on public.app_users (lower(email));

create table public.unit_of_measure (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code in ('carton', 'kilo')),
  name text not null,
  symbol text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index product_families_name_lower_idx on public.product_families (lower(name));

create table public.product_types (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.product_families(id) on delete restrict,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index product_types_family_name_idx on public.product_types (family_id, lower(name));

create table public.products (
  id uuid primary key default gen_random_uuid(),
  type_id uuid not null references public.product_types(id) on delete restrict,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index products_type_name_idx on public.products (type_id, lower(name));

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  unit_id uuid not null references public.unit_of_measure(id) on delete restrict,
  sku text not null unique,
  default_sale_price numeric(14, 2) not null default 0 check (default_sale_price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, unit_id)
);

create table public.warehouses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  is_primary boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index warehouses_single_primary_idx on public.warehouses (is_primary) where is_primary = true;

create table public.app_settings (
  id smallint primary key default 1 check (id = 1),
  company_name text not null default '',
  company_contact text not null default '',
  default_low_stock_threshold numeric(14, 3) not null default 10 check (default_low_stock_threshold >= 0),
  sales_prefix text not null default 'VTE-',
  receipt_prefix text not null default 'REC-',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references public.app_users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.roles (code, name, description) values
  ('admin', 'Admin', 'Configuration globale, catalogue et gestion des agents'),
  ('magasin', 'Magasin', 'Receptions, stock et validation des sorties'),
  ('commercial', 'Commercial', 'Clients et creation des ventes'),
  ('caisse', 'Caisse', 'Encaissements et mouvements de caisse');

insert into public.permissions (code, description) values
  ('catalog.manage', 'Gerer les references du catalogue'),
  ('users.manage', 'Gerer les agents et leurs acces'),
  ('settings.manage', 'Gerer les parametres globaux'),
  ('purchases.receive', 'Enregistrer et confirmer une reception'),
  ('stock.read', 'Consulter le stock'),
  ('stock.adjust', 'Ajuster le stock'),
  ('stock.release_sale', 'Valider la sortie physique d une vente'),
  ('sales.create', 'Creer une vente'),
  ('sales.read', 'Consulter les ventes'),
  ('sales.cancel', 'Annuler une vente'),
  ('cash.collect', 'Enregistrer un encaissement'),
  ('cash.disburse', 'Enregistrer un decaissement'),
  ('finance.read', 'Consulter la synthese financiere');

insert into public.role_permissions (role_id, permission_id)
select roles.id, permissions.id
from public.roles
cross join public.permissions
where roles.code = 'admin';

insert into public.role_permissions (role_id, permission_id)
select roles.id, permissions.id
from public.roles
join public.permissions on permissions.code in ('purchases.receive', 'stock.read', 'stock.adjust', 'stock.release_sale', 'sales.read')
where roles.code = 'magasin';

insert into public.role_permissions (role_id, permission_id)
select roles.id, permissions.id
from public.roles
join public.permissions on permissions.code in ('sales.create', 'sales.read')
where roles.code = 'commercial';

insert into public.role_permissions (role_id, permission_id)
select roles.id, permissions.id
from public.roles
join public.permissions on permissions.code in ('sales.read', 'cash.collect', 'cash.disburse', 'finance.read')
where roles.code = 'caisse';

insert into public.unit_of_measure (code, name, symbol) values
  ('carton', 'Carton', 'ctn'),
  ('kilo', 'Kilogramme', 'kg');

insert into public.app_settings (id) values (1);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_users
    join public.roles on roles.id = app_users.role_id
    where app_users.auth_user_id = auth.uid()
      and app_users.status = 'active'
      and roles.code = 'admin'
      and roles.is_active = true
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'roles', 'permissions', 'role_permissions', 'app_users', 'unit_of_measure',
    'product_families', 'product_types', 'products', 'product_variants',
    'warehouses', 'app_settings', 'audit_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      'admin_full_access_' || table_name,
      table_name
    );
  end loop;
end;
$$;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create trigger roles_set_updated_at before update on public.roles for each row execute function public.set_updated_at();
create trigger app_users_set_updated_at before update on public.app_users for each row execute function public.set_updated_at();
create trigger unit_of_measure_set_updated_at before update on public.unit_of_measure for each row execute function public.set_updated_at();
create trigger product_families_set_updated_at before update on public.product_families for each row execute function public.set_updated_at();
create trigger product_types_set_updated_at before update on public.product_types for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger product_variants_set_updated_at before update on public.product_variants for each row execute function public.set_updated_at();
create trigger warehouses_set_updated_at before update on public.warehouses for each row execute function public.set_updated_at();
create trigger app_settings_set_updated_at before update on public.app_settings for each row execute function public.set_updated_at();
