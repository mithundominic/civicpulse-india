-- Admin identity & authorization — created early (immediately after enums,
-- before any political data) because is_admin()/has_admin_role() are used in
-- the RLS policy of every single table created from this point on. This lets
-- every later migration satisfy AGENTS.md Rule 14 (RLS + policy live in the
-- SAME migration that creates the table) instead of bolting policies on later.
--
-- Authorization is entirely database-backed (admin_roles / user_admin_roles),
-- never Supabase Auth user_metadata — see AGENTS.md Rule 13.

create table admin_roles (
  id uuid primary key default gen_random_uuid(),
  name admin_role_name not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table user_admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  admin_role_id uuid not null references admin_roles(id) on delete restrict,
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now(),
  unique (user_id, admin_role_id)
);

-- profiles mirrors auth.users for the small set of admin users this platform
-- has — the public product itself is anonymous and needs no user table.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

-- is_admin() / has_admin_role() are SECURITY DEFINER so they can be safely
-- called from *any* other table's RLS policy without that policy needing its
-- own read access to user_admin_roles. `set search_path` is required on every
-- SECURITY DEFINER function to prevent search_path hijacking.
create function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from user_admin_roles where user_id = auth.uid());
$$;

create function has_admin_role(required_role admin_role_name)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from user_admin_roles uar
    join admin_roles ar on ar.id = uar.admin_role_id
    where uar.user_id = auth.uid() and ar.name = required_role
  );
$$;

-- Auto-create a profile row whenever a new Supabase Auth user is created
-- (i.e. whenever an admin account is provisioned).
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

alter table admin_roles enable row level security;
create policy "admin_roles_admin_read" on admin_roles for select using (is_admin());

alter table user_admin_roles enable row level security;
create policy "user_admin_roles_self_or_admin_read" on user_admin_roles
  for select using (user_id = auth.uid() or is_admin());
create policy "user_admin_roles_super_admin_manage" on user_admin_roles
  for all using (has_admin_role('SUPER_ADMIN')) with check (has_admin_role('SUPER_ADMIN'));

alter table profiles enable row level security;
create policy "profiles_self_or_admin_read" on profiles
  for select using (id = auth.uid() or is_admin());
create policy "profiles_self_update" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

comment on function is_admin() is
  'True if the current session user holds any admin role. Bootstrapping the first SUPER_ADMIN requires the service-role key (see README) since no user can grant their own role.';
