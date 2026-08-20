-- Persons, politicians, political parties, and the position taxonomy.
-- This is the core of the knowledge graph.

create table persons (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  slug text not null unique,
  date_of_birth date,
  date_of_death date,
  gender text check (gender in ('MALE', 'FEMALE', 'OTHER')),
  place_of_birth text,
  nationality text not null default 'Indian',
  photo_url text,
  bio text,
  education text,
  occupation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_persons_updated_at before update on persons
  for each row execute function set_updated_at();

create table person_aliases (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references persons(id) on delete cascade,
  alias text not null,
  alias_type person_alias_type not null default 'OTHER',
  language text,
  created_at timestamptz not null default now(),
  unique (person_id, alias)
);

-- 1:1 extension of persons — a politician IS a person, this table only adds
-- the political-profile-specific columns rather than duplicating identity data.
create table politicians (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null unique references persons(id) on delete cascade,
  status political_profile_status not null default 'ACTIVE',
  first_elected_year integer,
  twitter_handle text,
  official_website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_politicians_updated_at before update on politicians
  for each row execute function set_updated_at();

create table political_parties (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  abbreviation text,
  slug text not null unique,
  founded_date date,
  status party_status not null default 'ACTIVE',
  ideology text[],
  headquarters_address text,
  website text,
  logo_url text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_political_parties_updated_at before update on political_parties
  for each row execute function set_updated_at();

create table party_aliases (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references political_parties(id) on delete cascade,
  alias text not null,
  alias_type party_alias_type not null default 'OTHER',
  created_at timestamptz not null default now(),
  unique (party_id, alias)
);

-- Temporal — a party's recognition status changes over time and must never be
-- overwritten (AGENTS.md Rule 17). state_id null = national-level recognition.
create table party_recognition_history (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references political_parties(id) on delete cascade,
  recognition_type recognition_type not null,
  state_id uuid references states(id) on delete restrict,
  effective_from date not null,
  effective_to date,
  order_reference text,
  source_id uuid references sources(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_party_recognition_history_updated_at before update on party_recognition_history
  for each row execute function set_updated_at();

create table party_symbols (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references political_parties(id) on delete cascade,
  symbol_name text not null,
  symbol_status symbol_status not null default 'RESERVED',
  image_url text,
  effective_from date,
  effective_to date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_party_symbols_updated_at before update on party_symbols
  for each row execute function set_updated_at();

-- Temporal — see AGENTS.md Rule 17. is_current is a maintained convenience
-- flag for fast filtering (paired with a partial index in 000010_indexes.sql);
-- the authoritative check for "current" is always effective_from/effective_to.
create table party_memberships (
  id uuid primary key default gen_random_uuid(),
  politician_id uuid not null references politicians(id) on delete cascade,
  party_id uuid not null references political_parties(id) on delete restrict,
  membership_type party_membership_type not null default 'MEMBER',
  office_title text,                            -- e.g. 'President', 'General Secretary' when membership_type is OFFICE_BEARER/LEADER/FOUNDER
  effective_from date not null,
  effective_to date,
  is_current boolean not null default true,
  source_id uuid references sources(id) on delete set null,
  verification_status verification_status not null default 'UNVERIFIED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_party_memberships_updated_at before update on party_memberships
  for each row execute function set_updated_at();

-- Reference/taxonomy table, NOT an enum — new position titles are data, not
-- a schema change. See "Avoid hardcoding positions" in DB spec.
create table political_positions (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,                   -- e.g. 'Prime Minister', 'Chief Minister', 'Cabinet Minister', 'Member of Parliament, Lok Sabha'
  category text not null,                        -- e.g. 'Executive', 'Legislative', 'Party'
  level text not null,                           -- e.g. 'Union', 'State'
  created_at timestamptz not null default now()
);

create table politician_positions (
  id uuid primary key default gen_random_uuid(),
  politician_id uuid not null references politicians(id) on delete cascade,
  position_id uuid not null references political_positions(id) on delete restrict,
  state_id uuid references states(id) on delete set null,
  union_territory_id uuid references union_territories(id) on delete set null,
  constituency_id uuid references constituencies(id) on delete set null,
  house_id uuid references houses(id) on delete set null,
  title_override text,                           -- rarely-needed display override, e.g. a ministry-specific title
  effective_from date not null,
  effective_to date,
  source_id uuid references sources(id) on delete set null,
  verification_status verification_status not null default 'UNVERIFIED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_politician_positions_updated_at before update on politician_positions
  for each row execute function set_updated_at();

-- RLS ------------------------------------------------------------------
alter table persons enable row level security;
create policy "persons_public_read" on persons for select using (true);
create policy "persons_admin_write" on persons for all using (is_admin()) with check (is_admin());

alter table person_aliases enable row level security;
create policy "person_aliases_public_read" on person_aliases for select using (true);
create policy "person_aliases_admin_write" on person_aliases for all using (is_admin()) with check (is_admin());

alter table politicians enable row level security;
create policy "politicians_public_read" on politicians for select using (true);
create policy "politicians_admin_write" on politicians for all using (is_admin()) with check (is_admin());

alter table political_parties enable row level security;
create policy "political_parties_public_read" on political_parties for select using (true);
create policy "political_parties_admin_write" on political_parties for all using (is_admin()) with check (is_admin());

alter table party_aliases enable row level security;
create policy "party_aliases_public_read" on party_aliases for select using (true);
create policy "party_aliases_admin_write" on party_aliases for all using (is_admin()) with check (is_admin());

alter table party_recognition_history enable row level security;
create policy "party_recognition_history_public_read" on party_recognition_history for select using (true);
create policy "party_recognition_history_admin_write" on party_recognition_history for all using (is_admin()) with check (is_admin());

alter table party_symbols enable row level security;
create policy "party_symbols_public_read" on party_symbols for select using (true);
create policy "party_symbols_admin_write" on party_symbols for all using (is_admin()) with check (is_admin());

alter table party_memberships enable row level security;
create policy "party_memberships_public_read" on party_memberships for select using (true);
create policy "party_memberships_admin_write" on party_memberships for all using (is_admin()) with check (is_admin());

alter table political_positions enable row level security;
create policy "political_positions_public_read" on political_positions for select using (true);
create policy "political_positions_admin_write" on political_positions for all using (is_admin()) with check (is_admin());

alter table politician_positions enable row level security;
create policy "politician_positions_public_read" on politician_positions for select using (true);
create policy "politician_positions_admin_write" on politician_positions for all using (is_admin()) with check (is_admin());
