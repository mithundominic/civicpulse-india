-- Governments (union/state/UT administrations), ministries, portfolios,
-- minister assignments, and house membership. Depends on political_entities
-- (politicians, political_parties) and geography/houses, so it comes after both.

create table governments (
  id uuid primary key default gen_random_uuid(),
  level government_level not null,
  state_id uuid references states(id) on delete restrict,
  union_territory_id uuid references union_territories(id) on delete restrict,
  term_number integer,
  status government_status not null default 'CURRENT',
  formed_date date not null,
  dissolved_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint governments_parent_matches_level check (
    (level = 'UNION' and state_id is null and union_territory_id is null) or
    (level = 'STATE' and state_id is not null and union_territory_id is null) or
    (level = 'UNION_TERRITORY' and state_id is null and union_territory_id is not null)
  )
);
create trigger trg_governments_updated_at before update on governments
  for each row execute function set_updated_at();

create table government_parties (
  id uuid primary key default gen_random_uuid(),
  government_id uuid not null references governments(id) on delete cascade,
  party_id uuid not null references political_parties(id) on delete restrict,
  role government_party_role not null default 'COALITION_PARTNER',
  seats_contributed integer,
  effective_from date not null,
  effective_to date,
  created_at timestamptz not null default now(),
  unique (government_id, party_id, effective_from)
);

create table ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level government_level not null,
  state_id uuid references states(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_ministries_updated_at before update on ministries
  for each row execute function set_updated_at();

create table portfolios (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references ministries(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- Temporal — see AGENTS.md Rule 17.
create table minister_assignments (
  id uuid primary key default gen_random_uuid(),
  politician_id uuid not null references politicians(id) on delete cascade,
  government_id uuid not null references governments(id) on delete cascade,
  ministry_id uuid references ministries(id) on delete set null,
  portfolio_id uuid references portfolios(id) on delete set null,
  rank minister_rank not null default 'CABINET',
  is_primary boolean not null default true,
  effective_from date not null,
  effective_to date,
  source_id uuid references sources(id) on delete set null,
  verification_status verification_status not null default 'UNVERIFIED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_minister_assignments_updated_at before update on minister_assignments
  for each row execute function set_updated_at();

-- Temporal — see AGENTS.md Rule 17.
create table politician_house_memberships (
  id uuid primary key default gen_random_uuid(),
  politician_id uuid not null references politicians(id) on delete cascade,
  house_id uuid not null references houses(id) on delete restrict,
  term_id uuid references parliamentary_terms(id) on delete set null,
  constituency_id uuid references constituencies(id) on delete set null,
  party_id uuid references political_parties(id) on delete set null,
  state_id uuid references states(id) on delete set null,   -- Rajya Sabha members represent a state without necessarily having a single constituency row
  membership_type house_membership_type not null default 'ELECTED',
  start_date date not null,
  end_date date,
  source_id uuid references sources(id) on delete set null,
  verification_status verification_status not null default 'UNVERIFIED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_politician_house_memberships_updated_at before update on politician_house_memberships
  for each row execute function set_updated_at();

-- RLS ------------------------------------------------------------------
alter table governments enable row level security;
create policy "governments_public_read" on governments for select using (true);
create policy "governments_admin_write" on governments for all using (is_admin()) with check (is_admin());

alter table government_parties enable row level security;
create policy "government_parties_public_read" on government_parties for select using (true);
create policy "government_parties_admin_write" on government_parties for all using (is_admin()) with check (is_admin());

alter table ministries enable row level security;
create policy "ministries_public_read" on ministries for select using (true);
create policy "ministries_admin_write" on ministries for all using (is_admin()) with check (is_admin());

alter table portfolios enable row level security;
create policy "portfolios_public_read" on portfolios for select using (true);
create policy "portfolios_admin_write" on portfolios for all using (is_admin()) with check (is_admin());

alter table minister_assignments enable row level security;
create policy "minister_assignments_public_read" on minister_assignments for select using (true);
create policy "minister_assignments_admin_write" on minister_assignments for all using (is_admin()) with check (is_admin());

alter table politician_house_memberships enable row level security;
create policy "politician_house_memberships_public_read" on politician_house_memberships for select using (true);
create policy "politician_house_memberships_admin_write" on politician_house_memberships for all using (is_admin()) with check (is_admin());
