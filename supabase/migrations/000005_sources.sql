-- Sources & verification infrastructure.
--
-- Deliberately created BEFORE political_entities/government/elections (deviating
-- from a naive "sources come last" ordering) because source_id is a foreign key
-- on almost every table created after this point — every fact in this platform
-- must be traceable to a source (see AGENTS.md Rule 17 / DB spec "Source First").
-- entity_documents is a small, justified addition beyond the DB spec's MVP list:
-- `documents` has no entity linkage column of its own, so without this join table
-- a document can never actually be attached to a party/politician/etc., which the
-- product spec's "Party Documents" tab requires. It follows the exact same
-- polymorphic (entity_type, entity_id) pattern entity_sources already uses.

create table sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type source_type not null,
  organization text,
  base_url text,
  authority_rank smallint not null default 5,  -- 1 = highest authority (e.g. ECI), used only to resolve conflicting data, never to rank politicians/parties
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_sources_updated_at before update on sources
  for each row execute function set_updated_at();

alter table sources enable row level security;
create policy "sources_public_read" on sources for select using (true);

create table source_records (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete restrict,
  url text not null,
  content_type source_content_type not null default 'HTML',
  content_hash text,
  raw_content text,
  storage_path text,
  fetched_at timestamptz not null default now(),
  http_status integer,
  created_at timestamptz not null default now()
);

alter table source_records enable row level security;
create policy "source_records_public_read" on source_records for select using (true);

create table entity_sources (
  id uuid primary key default gen_random_uuid(),
  entity_type entity_type not null,
  entity_id uuid not null,
  source_record_id uuid not null references source_records(id) on delete cascade,
  relationship entity_source_relationship not null default 'PRIMARY_SOURCE',
  field_name text,
  notes text,
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, source_record_id, field_name)
);

alter table entity_sources enable row level security;
create policy "entity_sources_public_read" on entity_sources for select using (true);

create table verification_records (
  id uuid primary key default gen_random_uuid(),
  entity_type entity_type not null,
  entity_id uuid not null,
  field_name text,
  status verification_status not null default 'UNVERIFIED',
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_verification_records_updated_at before update on verification_records
  for each row execute function set_updated_at();

alter table verification_records enable row level security;
create policy "verification_records_public_read" on verification_records for select using (true);

create table documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  document_type document_type not null,
  source_record_id uuid references source_records(id) on delete set null,
  storage_path text,
  file_url text,
  published_date date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_documents_updated_at before update on documents
  for each row execute function set_updated_at();

alter table documents enable row level security;
create policy "documents_public_read" on documents for select using (true);

create table entity_documents (
  id uuid primary key default gen_random_uuid(),
  entity_type entity_type not null,
  entity_id uuid not null,
  document_id uuid not null references documents(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, document_id)
);

alter table entity_documents enable row level security;
create policy "entity_documents_public_read" on entity_documents for select using (true);

create policy "sources_admin_write" on sources for all using (is_admin()) with check (is_admin());
create policy "source_records_admin_write" on source_records for all using (is_admin()) with check (is_admin());
create policy "entity_sources_admin_write" on entity_sources for all using (is_admin()) with check (is_admin());
create policy "verification_records_admin_write" on verification_records for all using (is_admin()) with check (is_admin());
create policy "documents_admin_write" on documents for all using (is_admin()) with check (is_admin());
create policy "entity_documents_admin_write" on entity_documents for all using (is_admin()) with check (is_admin());
