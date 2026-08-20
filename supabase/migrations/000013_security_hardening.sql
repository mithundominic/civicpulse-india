-- Fixes for warnings raised by Supabase's security advisor after applying
-- 000001-000012 against the live project. Kept as its own migration rather
-- than rewriting earlier files, consistent with "migrations are sequential
-- and never edited after the fact" (AGENTS.md Rule 14).

-- 1) set_updated_at had no pinned search_path (every other function got this;
--    this one was missed). A mutable search_path on a function that runs as
--    part of DML on every table is exactly the kind of thing worth pinning.
alter function set_updated_at() set search_path = public;

-- 2) pg_trgm and unaccent were installed into `public` by 000001. Supabase's
--    linter flags extensions living alongside application tables — move them
--    to a dedicated schema. ALTER EXTENSION ... SET SCHEMA carries the
--    operator classes/functions with it, so existing gin_trgm_ops indexes
--    keep working; search_entities() is updated below to look in both
--    schemas since it pins its own search_path.
create schema if not exists extensions;
alter extension pg_trgm set schema extensions;
alter extension unaccent set schema extensions;

alter function search_entities(text, integer) set search_path = public, extensions;

-- 3) is_admin()/has_admin_role() are safe to leave publicly callable (they
--    only ever answer "is the CALLING session an admin", never take a target
--    user, so there's no cross-user information disclosure) — documented
--    rather than revoked, since Postgres has no "callable from SQL policies
--    only" grant. handle_new_user() is trigger-only by design (it references
--    the trigger-context `new` record, so direct RPC calls simply error) —
--    still, tighten the grant so it isn't advertised as a callable RPC.
revoke execute on function handle_new_user() from public, anon, authenticated;
