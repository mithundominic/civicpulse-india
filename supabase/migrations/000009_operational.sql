-- Public corrections queue, the audit trail, and the data-ingestion pipeline's
-- bookkeeping tables. Nothing in this file is public-readable — see each
-- table's RLS policy — except that anyone may *submit* a correction.

create table corrections (
  id uuid primary key default gen_random_uuid(),
  entity_type entity_type not null,
  entity_id uuid not null,
  field_name text,
  current_value text,
  suggested_value text not null,
  reason text not null,
  submitter_name text,
  submitter_email text,
  status correction_status not null default 'PENDING',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_corrections_updated_at before update on corrections
  for each row execute function set_updated_at();

-- Append-only by design: no update/delete policy is granted to anyone,
-- including admins, through the API — an audit trail that can be edited from
-- the client isn't a trail. Corrections/rollbacks are new rows, not edits.
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type entity_type,
  entity_id uuid,
  action audit_action not null,
  actor_id uuid references auth.users(id) on delete set null,
  diff jsonb,
  notes text,
  created_at timestamptz not null default now()
);

create table data_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_id uuid references sources(id) on delete set null,
  ingestion_method text,                        -- e.g. 'API', 'SCRAPER', 'MANUAL', 'CSV_UPLOAD'
  schedule_cron text,
  is_active boolean not null default true,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_data_sources_updated_at before update on data_sources
  for each row execute function set_updated_at();

create table data_imports (
  id uuid primary key default gen_random_uuid(),
  data_source_id uuid not null references data_sources(id) on delete cascade,
  status import_status not null default 'PENDING',
  started_at timestamptz,
  completed_at timestamptz,
  records_processed integer not null default 0,
  records_created integer not null default 0,
  records_updated integer not null default 0,
  records_failed integer not null default 0,
  initiated_by uuid references auth.users(id) on delete set null,
  error_summary text,
  created_at timestamptz not null default now()
);

create table data_import_records (
  id uuid primary key default gen_random_uuid(),
  data_import_id uuid not null references data_imports(id) on delete cascade,
  entity_type entity_type,
  entity_id uuid,
  match_status import_match_status not null default 'NEW',
  raw_data jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

create table data_quality_issues (
  id uuid primary key default gen_random_uuid(),
  entity_type entity_type not null,
  entity_id uuid not null,
  issue_type data_quality_issue_type not null,
  severity data_quality_severity not null default 'MEDIUM',
  description text,
  is_resolved boolean not null default false,
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- RLS ------------------------------------------------------------------
alter table corrections enable row level security;
create policy "corrections_public_submit" on corrections
  for insert with check (status = 'PENDING' and reviewed_by is null and reviewed_at is null);
create policy "corrections_admin_manage" on corrections
  for all using (is_admin()) with check (is_admin());

alter table audit_logs enable row level security;
create policy "audit_logs_admin_read" on audit_logs for select using (is_admin());
create policy "audit_logs_admin_insert" on audit_logs for insert with check (is_admin());

alter table data_sources enable row level security;
create policy "data_sources_admin_only" on data_sources for all using (is_admin()) with check (is_admin());

alter table data_imports enable row level security;
create policy "data_imports_admin_only" on data_imports for all using (is_admin()) with check (is_admin());

alter table data_import_records enable row level security;
create policy "data_import_records_admin_only" on data_import_records for all using (is_admin()) with check (is_admin());

alter table data_quality_issues enable row level security;
create policy "data_quality_issues_admin_only" on data_quality_issues for all using (is_admin()) with check (is_admin());
