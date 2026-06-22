-- Simplify the catalog hierarchy to: product type -> product -> variant.

create or replace function public.normalize_type_code(value text)
returns text
language sql
immutable
set search_path = public
as $$
  select trim(both '_' from upper(regexp_replace(
    translate(coalesce(value, ''),
      'àáâãäåçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ',
      'aaaaaaceeeeiiiinooooouuuuyyAAAAAACEEEEIIIINOOOOOUUUUY'),
    '[^a-zA-Z0-9]+', '_', 'g'
  )));
$$;

alter table public.product_types add column code text;

-- Remove the temporary integration-test type before dropping its former family.
delete from public.product_types
where name = 'TYPE TEMPORAIRE'
  and not exists (select 1 from public.products where products.type_id = product_types.id);

update public.product_types
set code = public.normalize_type_code(name);

alter table public.product_types
  alter column code set not null,
  add constraint product_types_code_not_empty check (length(code) > 0),
  add constraint product_types_code_key unique (code);

drop index if exists public.product_types_family_name_idx;
create unique index product_types_name_lower_idx on public.product_types (lower(name));

alter table public.product_types drop column family_id;
drop table public.product_families;

create or replace function public.set_product_type_code()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.code is null or btrim(new.code) = '' then
    new.code = public.normalize_type_code(new.name);
  else
    new.code = public.normalize_type_code(new.code);
  end if;
  return new;
end;
$$;

create trigger product_types_set_code
before insert or update of name, code on public.product_types
for each row execute function public.set_product_type_code();
