-- Geography: states, union territories, districts, constituencies.
-- These are the stable "container" entities everything else hangs off.

create table states (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  code text unique,                          -- e.g. 'KA', 'UP'
  capital text,
  formation_date date,
  status geography_status not null default 'ACTIVE',
  population bigint,
  area_sq_km numeric,
  official_languages text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_states_updated_at before update on states
  for each row execute function set_updated_at();

create table union_territories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  code text unique,
  capital text,
  has_legislature boolean not null default false,
  formation_date date,
  status geography_status not null default 'ACTIVE',
  population bigint,
  area_sq_km numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_uts_updated_at before update on union_territories
  for each row execute function set_updated_at();

create table districts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state_id uuid references states(id) on delete restrict,
  union_territory_id uuid references union_territories(id) on delete restrict,
  headquarters text,
  formation_date date,
  status geography_status not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint districts_belong_to_one_parent check (
    (state_id is not null and union_territory_id is null) or
    (state_id is null and union_territory_id is not null)
  )
);
create trigger trg_districts_updated_at before update on districts
  for each row execute function set_updated_at();

create table constituencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  constituency_type constituency_type not null,
  number integer,                              -- seat number, e.g. Varanasi = 77
  state_id uuid references states(id) on delete restrict,
  union_territory_id uuid references union_territories(id) on delete restrict,
  district_id uuid references districts(id) on delete set null,
  reserved_category reservation_category not null default 'GENERAL',
  total_electors integer,
  delimitation_year integer,
  status geography_status not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint constituencies_belong_to_one_parent check (
    (state_id is not null and union_territory_id is null) or
    (state_id is null and union_territory_id is not null)
  )
);
create trigger trg_constituencies_updated_at before update on constituencies
  for each row execute function set_updated_at();

comment on table constituencies is
  'Both Lok Sabha (constituency_type=LOK_SABHA) and Assembly (ASSEMBLY) seats live in one table, distinguished by type — see DB spec constituencies section.';

-- Legislative houses live in this migration (not in government.sql) purely for
-- dependency ordering: political_positions/politician_positions (next migration)
-- need to reference houses(id), while houses itself needs nothing from
-- political_entities or government — it only depends on states, which already
-- exists above. Keeping a table with its natural dependents is worth a small
-- naming mismatch with "geography" (houses aren't geography, but neither do
-- they belong later than their first consumer).
create table houses (
  id uuid primary key default gen_random_uuid(),
  name text not null,                          -- e.g. '18th Lok Sabha', 'Rajya Sabha', 'Karnataka Legislative Assembly'
  house_type house_type not null,
  state_id uuid references states(id) on delete restrict,  -- null for Lok Sabha / Rajya Sabha
  total_seats integer,
  is_permanent boolean not null default false, -- Rajya Sabha / Legislative Councils are continuous bodies, not dissolved/re-elected as a whole
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_houses_updated_at before update on houses
  for each row execute function set_updated_at();

create table parliamentary_terms (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references houses(id) on delete cascade,
  term_number integer,                          -- e.g. 18 for the 18th Lok Sabha
  start_date date,
  end_date date,                                -- null = ongoing
  created_at timestamptz not null default now(),
  unique (house_id, term_number)
);

-- RLS: geography is public reference data — readable by everyone, writable
-- only by admins. This public-read + admin-write pair is the standard shape
-- used for every reference/canonical table in this schema (AGENTS.md Rule 12).
alter table states enable row level security;
create policy "states_public_read" on states for select using (true);
create policy "states_admin_write" on states for all using (is_admin()) with check (is_admin());

alter table union_territories enable row level security;
create policy "union_territories_public_read" on union_territories for select using (true);
create policy "union_territories_admin_write" on union_territories for all using (is_admin()) with check (is_admin());

alter table districts enable row level security;
create policy "districts_public_read" on districts for select using (true);
create policy "districts_admin_write" on districts for all using (is_admin()) with check (is_admin());

alter table constituencies enable row level security;
create policy "constituencies_public_read" on constituencies for select using (true);
create policy "constituencies_admin_write" on constituencies for all using (is_admin()) with check (is_admin());

alter table houses enable row level security;
create policy "houses_public_read" on houses for select using (true);
create policy "houses_admin_write" on houses for all using (is_admin()) with check (is_admin());

alter table parliamentary_terms enable row level security;
create policy "parliamentary_terms_public_read" on parliamentary_terms for select using (true);
create policy "parliamentary_terms_admin_write" on parliamentary_terms for all using (is_admin()) with check (is_admin());
