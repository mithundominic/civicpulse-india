-- Fixes for the 'multiple_permissive_policies' performance warnings raised by
-- Supabase's advisor: every reference/canonical table had an admin policy
-- scoped 'for all' (which includes SELECT) stacked on top of the public-read
-- policy's SELECT grant, so every anon/authenticated SELECT evaluated two
-- permissive policies (and paid for an is_admin() call) instead of one. Admins
-- already read through *_public_read like everyone else, so the write policy is
-- split into three single-command policies (Postgres's FOR clause takes exactly
-- one of SELECT/INSERT/UPDATE/DELETE/ALL, not a list; INSERT only accepts WITH
-- CHECK, DELETE only accepts USING) so none of them touch SELECT.

drop policy "states_admin_write" on states;
create policy "states_admin_insert" on states for insert with check (is_admin());
create policy "states_admin_update" on states for update using (is_admin()) with check (is_admin());
create policy "states_admin_delete" on states for delete using (is_admin());

drop policy "union_territories_admin_write" on union_territories;
create policy "union_territories_admin_insert" on union_territories for insert with check (is_admin());
create policy "union_territories_admin_update" on union_territories for update using (is_admin()) with check (is_admin());
create policy "union_territories_admin_delete" on union_territories for delete using (is_admin());

drop policy "districts_admin_write" on districts;
create policy "districts_admin_insert" on districts for insert with check (is_admin());
create policy "districts_admin_update" on districts for update using (is_admin()) with check (is_admin());
create policy "districts_admin_delete" on districts for delete using (is_admin());

drop policy "constituencies_admin_write" on constituencies;
create policy "constituencies_admin_insert" on constituencies for insert with check (is_admin());
create policy "constituencies_admin_update" on constituencies for update using (is_admin()) with check (is_admin());
create policy "constituencies_admin_delete" on constituencies for delete using (is_admin());

drop policy "houses_admin_write" on houses;
create policy "houses_admin_insert" on houses for insert with check (is_admin());
create policy "houses_admin_update" on houses for update using (is_admin()) with check (is_admin());
create policy "houses_admin_delete" on houses for delete using (is_admin());

drop policy "parliamentary_terms_admin_write" on parliamentary_terms;
create policy "parliamentary_terms_admin_insert" on parliamentary_terms for insert with check (is_admin());
create policy "parliamentary_terms_admin_update" on parliamentary_terms for update using (is_admin()) with check (is_admin());
create policy "parliamentary_terms_admin_delete" on parliamentary_terms for delete using (is_admin());

drop policy "sources_admin_write" on sources;
create policy "sources_admin_insert" on sources for insert with check (is_admin());
create policy "sources_admin_update" on sources for update using (is_admin()) with check (is_admin());
create policy "sources_admin_delete" on sources for delete using (is_admin());

drop policy "source_records_admin_write" on source_records;
create policy "source_records_admin_insert" on source_records for insert with check (is_admin());
create policy "source_records_admin_update" on source_records for update using (is_admin()) with check (is_admin());
create policy "source_records_admin_delete" on source_records for delete using (is_admin());

drop policy "entity_sources_admin_write" on entity_sources;
create policy "entity_sources_admin_insert" on entity_sources for insert with check (is_admin());
create policy "entity_sources_admin_update" on entity_sources for update using (is_admin()) with check (is_admin());
create policy "entity_sources_admin_delete" on entity_sources for delete using (is_admin());

drop policy "verification_records_admin_write" on verification_records;
create policy "verification_records_admin_insert" on verification_records for insert with check (is_admin());
create policy "verification_records_admin_update" on verification_records for update using (is_admin()) with check (is_admin());
create policy "verification_records_admin_delete" on verification_records for delete using (is_admin());

drop policy "documents_admin_write" on documents;
create policy "documents_admin_insert" on documents for insert with check (is_admin());
create policy "documents_admin_update" on documents for update using (is_admin()) with check (is_admin());
create policy "documents_admin_delete" on documents for delete using (is_admin());

drop policy "entity_documents_admin_write" on entity_documents;
create policy "entity_documents_admin_insert" on entity_documents for insert with check (is_admin());
create policy "entity_documents_admin_update" on entity_documents for update using (is_admin()) with check (is_admin());
create policy "entity_documents_admin_delete" on entity_documents for delete using (is_admin());

drop policy "persons_admin_write" on persons;
create policy "persons_admin_insert" on persons for insert with check (is_admin());
create policy "persons_admin_update" on persons for update using (is_admin()) with check (is_admin());
create policy "persons_admin_delete" on persons for delete using (is_admin());

drop policy "person_aliases_admin_write" on person_aliases;
create policy "person_aliases_admin_insert" on person_aliases for insert with check (is_admin());
create policy "person_aliases_admin_update" on person_aliases for update using (is_admin()) with check (is_admin());
create policy "person_aliases_admin_delete" on person_aliases for delete using (is_admin());

drop policy "politicians_admin_write" on politicians;
create policy "politicians_admin_insert" on politicians for insert with check (is_admin());
create policy "politicians_admin_update" on politicians for update using (is_admin()) with check (is_admin());
create policy "politicians_admin_delete" on politicians for delete using (is_admin());

drop policy "political_parties_admin_write" on political_parties;
create policy "political_parties_admin_insert" on political_parties for insert with check (is_admin());
create policy "political_parties_admin_update" on political_parties for update using (is_admin()) with check (is_admin());
create policy "political_parties_admin_delete" on political_parties for delete using (is_admin());

drop policy "party_aliases_admin_write" on party_aliases;
create policy "party_aliases_admin_insert" on party_aliases for insert with check (is_admin());
create policy "party_aliases_admin_update" on party_aliases for update using (is_admin()) with check (is_admin());
create policy "party_aliases_admin_delete" on party_aliases for delete using (is_admin());

drop policy "party_recognition_history_admin_write" on party_recognition_history;
create policy "party_recognition_history_admin_insert" on party_recognition_history for insert with check (is_admin());
create policy "party_recognition_history_admin_update" on party_recognition_history for update using (is_admin()) with check (is_admin());
create policy "party_recognition_history_admin_delete" on party_recognition_history for delete using (is_admin());

drop policy "party_symbols_admin_write" on party_symbols;
create policy "party_symbols_admin_insert" on party_symbols for insert with check (is_admin());
create policy "party_symbols_admin_update" on party_symbols for update using (is_admin()) with check (is_admin());
create policy "party_symbols_admin_delete" on party_symbols for delete using (is_admin());

drop policy "party_memberships_admin_write" on party_memberships;
create policy "party_memberships_admin_insert" on party_memberships for insert with check (is_admin());
create policy "party_memberships_admin_update" on party_memberships for update using (is_admin()) with check (is_admin());
create policy "party_memberships_admin_delete" on party_memberships for delete using (is_admin());

drop policy "political_positions_admin_write" on political_positions;
create policy "political_positions_admin_insert" on political_positions for insert with check (is_admin());
create policy "political_positions_admin_update" on political_positions for update using (is_admin()) with check (is_admin());
create policy "political_positions_admin_delete" on political_positions for delete using (is_admin());

drop policy "politician_positions_admin_write" on politician_positions;
create policy "politician_positions_admin_insert" on politician_positions for insert with check (is_admin());
create policy "politician_positions_admin_update" on politician_positions for update using (is_admin()) with check (is_admin());
create policy "politician_positions_admin_delete" on politician_positions for delete using (is_admin());

drop policy "governments_admin_write" on governments;
create policy "governments_admin_insert" on governments for insert with check (is_admin());
create policy "governments_admin_update" on governments for update using (is_admin()) with check (is_admin());
create policy "governments_admin_delete" on governments for delete using (is_admin());

drop policy "government_parties_admin_write" on government_parties;
create policy "government_parties_admin_insert" on government_parties for insert with check (is_admin());
create policy "government_parties_admin_update" on government_parties for update using (is_admin()) with check (is_admin());
create policy "government_parties_admin_delete" on government_parties for delete using (is_admin());

drop policy "ministries_admin_write" on ministries;
create policy "ministries_admin_insert" on ministries for insert with check (is_admin());
create policy "ministries_admin_update" on ministries for update using (is_admin()) with check (is_admin());
create policy "ministries_admin_delete" on ministries for delete using (is_admin());

drop policy "portfolios_admin_write" on portfolios;
create policy "portfolios_admin_insert" on portfolios for insert with check (is_admin());
create policy "portfolios_admin_update" on portfolios for update using (is_admin()) with check (is_admin());
create policy "portfolios_admin_delete" on portfolios for delete using (is_admin());

drop policy "minister_assignments_admin_write" on minister_assignments;
create policy "minister_assignments_admin_insert" on minister_assignments for insert with check (is_admin());
create policy "minister_assignments_admin_update" on minister_assignments for update using (is_admin()) with check (is_admin());
create policy "minister_assignments_admin_delete" on minister_assignments for delete using (is_admin());

drop policy "politician_house_memberships_admin_write" on politician_house_memberships;
create policy "politician_house_memberships_admin_insert" on politician_house_memberships for insert with check (is_admin());
create policy "politician_house_memberships_admin_update" on politician_house_memberships for update using (is_admin()) with check (is_admin());
create policy "politician_house_memberships_admin_delete" on politician_house_memberships for delete using (is_admin());

drop policy "elections_admin_write" on elections;
create policy "elections_admin_insert" on elections for insert with check (is_admin());
create policy "elections_admin_update" on elections for update using (is_admin()) with check (is_admin());
create policy "elections_admin_delete" on elections for delete using (is_admin());

drop policy "election_candidates_admin_write" on election_candidates;
create policy "election_candidates_admin_insert" on election_candidates for insert with check (is_admin());
create policy "election_candidates_admin_update" on election_candidates for update using (is_admin()) with check (is_admin());
create policy "election_candidates_admin_delete" on election_candidates for delete using (is_admin());

drop policy "election_results_admin_write" on election_results;
create policy "election_results_admin_insert" on election_results for insert with check (is_admin());
create policy "election_results_admin_update" on election_results for update using (is_admin()) with check (is_admin());
create policy "election_results_admin_delete" on election_results for delete using (is_admin());

-- corrections: corrections_admin_manage was 'for all', overlapping with the
-- public INSERT policy on the INSERT command specifically.
drop policy "corrections_admin_manage" on corrections;
create policy "corrections_admin_select" on corrections for select using (is_admin());
create policy "corrections_admin_update" on corrections for update using (is_admin()) with check (is_admin());
create policy "corrections_admin_delete" on corrections for delete using (is_admin());

-- user_admin_roles: the super-admin manage policy overlapped the self-or-admin
-- read policy on SELECT specifically.
drop policy "user_admin_roles_super_admin_manage" on user_admin_roles;
create policy "user_admin_roles_super_admin_insert" on user_admin_roles for insert with check (has_admin_role('SUPER_ADMIN'));
create policy "user_admin_roles_super_admin_update" on user_admin_roles for update using (has_admin_role('SUPER_ADMIN')) with check (has_admin_role('SUPER_ADMIN'));
create policy "user_admin_roles_super_admin_delete" on user_admin_roles for delete using (has_admin_role('SUPER_ADMIN'));

-- auth_rls_initplan: wrap auth.uid() in a scalar subselect so Postgres
-- evaluates it once per query (an InitPlan) instead of once per row.
alter policy "user_admin_roles_self_or_admin_read" on user_admin_roles
  using (user_id = (select auth.uid()) or is_admin());

alter policy "profiles_self_or_admin_read" on profiles
  using (id = (select auth.uid()) or is_admin());

alter policy "profiles_self_update" on profiles
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- unindexed_foreign_keys: source_id and a handful of admin/audit FKs were
-- missed in 000010_indexes.sql.
create index idx_corrections_reviewed_by on corrections(reviewed_by);
create index idx_data_imports_initiated_by on data_imports(initiated_by);
create index idx_data_quality_issues_resolved_by on data_quality_issues(resolved_by);
create index idx_data_sources_source on data_sources(source_id);
create index idx_election_candidates_source on election_candidates(source_id);
create index idx_election_results_source on election_results(source_id);
create index idx_elections_house on elections(house_id);
create index idx_elections_source on elections(source_id);
create index idx_elections_term on elections(term_id);
create index idx_elections_ut on elections(union_territory_id);
create index idx_minister_assignments_ministry on minister_assignments(ministry_id);
create index idx_minister_assignments_portfolio on minister_assignments(portfolio_id);
create index idx_minister_assignments_source on minister_assignments(source_id);
create index idx_party_memberships_source on party_memberships(source_id);
create index idx_party_recognition_history_source on party_recognition_history(source_id);
create index idx_house_memberships_source on politician_house_memberships(source_id);
create index idx_house_memberships_state on politician_house_memberships(state_id);
create index idx_house_memberships_term on politician_house_memberships(term_id);
create index idx_politician_positions_house on politician_positions(house_id);
create index idx_politician_positions_source on politician_positions(source_id);
create index idx_politician_positions_ut on politician_positions(union_territory_id);
create index idx_user_admin_roles_role on user_admin_roles(admin_role_id);
create index idx_user_admin_roles_granted_by on user_admin_roles(granted_by);
create index idx_verification_records_verified_by on verification_records(verified_by);
