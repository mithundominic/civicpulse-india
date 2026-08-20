-- Elections, candidates, and results.

create table elections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  election_type election_type not null,
  house_id uuid references houses(id) on delete set null,
  state_id uuid references states(id) on delete restrict,
  union_territory_id uuid references union_territories(id) on delete restrict,
  term_id uuid references parliamentary_terms(id) on delete set null,
  start_date date,
  end_date date,
  status election_status not null default 'UPCOMING',
  total_seats integer,
  phases integer,
  voter_turnout_percent numeric(5, 2),
  source_id uuid references sources(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_elections_updated_at before update on elections
  for each row execute function set_updated_at();

-- politician_id is deliberately nullable: not every historical candidate
-- record has a canonical person match yet, so candidate_name is always
-- stored directly as a display fallback (see DB spec, election_candidates).
create table election_candidates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  constituency_id uuid not null references constituencies(id) on delete restrict,
  politician_id uuid references politicians(id) on delete set null,
  party_id uuid references political_parties(id) on delete set null,
  candidate_name text not null,
  nomination_status candidate_nomination_status not null default 'NOMINATED',
  result_status candidate_result_status,
  deposit_status deposit_status,
  declared_assets numeric,          -- affidavit-sourced — UI must always label this "Declared", never "Verified" (AGENTS.md Rule 18)
  criminal_cases_declared integer,
  education_declared text,
  age_at_nomination integer,
  source_id uuid references sources(id) on delete set null,
  verification_status verification_status not null default 'UNVERIFIED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_election_candidates_updated_at before update on election_candidates
  for each row execute function set_updated_at();

create table election_results (
  id uuid primary key default gen_random_uuid(),
  election_candidate_id uuid not null unique references election_candidates(id) on delete cascade,
  votes_received integer not null default 0,
  vote_share_percent numeric(5, 2),
  rank integer,
  margin integer,
  is_winner boolean not null default false,
  evm_votes integer,
  postal_votes integer,
  source_id uuid references sources(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_election_results_updated_at before update on election_results
  for each row execute function set_updated_at();

-- RLS ------------------------------------------------------------------
alter table elections enable row level security;
create policy "elections_public_read" on elections for select using (true);
create policy "elections_admin_write" on elections for all using (is_admin()) with check (is_admin());

alter table election_candidates enable row level security;
create policy "election_candidates_public_read" on election_candidates for select using (true);
create policy "election_candidates_admin_write" on election_candidates for all using (is_admin()) with check (is_admin());

alter table election_results enable row level security;
create policy "election_results_public_read" on election_results for select using (true);
create policy "election_results_admin_write" on election_results for all using (is_admin()) with check (is_admin());
