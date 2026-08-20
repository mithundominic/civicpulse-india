-- Extensions required by the platform (DB spec §4), plus one shared piece of
-- infrastructure (set_updated_at) that every later migration's triggers depend on.
-- It lives here rather than in 000011_functions.sql because it must exist before
-- any table in 000003+ attaches an `updated_at` trigger to it.

create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists pg_trgm;    -- trigram search (DB spec §89-92)
create extension if not exists unaccent;   -- accent-insensitive search

-- PostGIS is deliberately NOT enabled (DB spec §4, §207) until a real
-- spatial-query requirement (e.g. constituency boundary maps) justifies it.

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function set_updated_at() is
  'Shared BEFORE UPDATE trigger: stamps updated_at on every mutable canonical table.';
