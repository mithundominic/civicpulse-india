-- Performance indexes. Split from the table-creating migrations so the
-- "what does this table look like" and "how is it queried" concerns stay
-- readable separately. PK/UNIQUE constraints already index themselves —
-- everything here is a FK, a temporal "current row" partial index, or a
-- search-support trigram index.

-- Geography ---------------------------------------------------------------
create index idx_districts_state on districts(state_id);
create index idx_districts_ut on districts(union_territory_id);
create index idx_constituencies_state on constituencies(state_id);
create index idx_constituencies_ut on constituencies(union_territory_id);
create index idx_constituencies_district on constituencies(district_id);
create index idx_constituencies_type on constituencies(constituency_type);
create index idx_houses_state on houses(state_id);
create index idx_parliamentary_terms_house on parliamentary_terms(house_id);

-- Sources & verification ----------------------------------------------------
create index idx_source_records_source on source_records(source_id);
create index idx_entity_sources_entity on entity_sources(entity_type, entity_id);
create index idx_entity_sources_source_record on entity_sources(source_record_id);
create index idx_verification_records_entity on verification_records(entity_type, entity_id);
create index idx_documents_source_record on documents(source_record_id);
create index idx_entity_documents_entity on entity_documents(entity_type, entity_id);
create index idx_entity_documents_document on entity_documents(document_id);

-- Political entities ----------------------------------------------------------
create index idx_person_aliases_person on person_aliases(person_id);
create index idx_politicians_status on politicians(status);
create index idx_political_parties_status on political_parties(status);
create index idx_party_aliases_party on party_aliases(party_id);
create index idx_party_recognition_history_party on party_recognition_history(party_id);
create index idx_party_recognition_history_state on party_recognition_history(state_id);
create index idx_party_recognition_history_current on party_recognition_history(party_id) where effective_to is null;
create index idx_party_symbols_party on party_symbols(party_id);
create index idx_party_memberships_politician on party_memberships(politician_id);
create index idx_party_memberships_party on party_memberships(party_id);
create index idx_party_memberships_current on party_memberships(politician_id) where is_current = true;
create index idx_politician_positions_politician on politician_positions(politician_id);
create index idx_politician_positions_position on politician_positions(position_id);
create index idx_politician_positions_state on politician_positions(state_id);
create index idx_politician_positions_constituency on politician_positions(constituency_id);
create index idx_politician_positions_current on politician_positions(politician_id) where effective_to is null;

-- Government --------------------------------------------------------------------
create index idx_governments_state on governments(state_id);
create index idx_governments_ut on governments(union_territory_id);
create index idx_governments_status on governments(status);
create index idx_government_parties_government on government_parties(government_id);
create index idx_government_parties_party on government_parties(party_id);
create index idx_ministries_state on ministries(state_id);
create index idx_portfolios_ministry on portfolios(ministry_id);
create index idx_minister_assignments_politician on minister_assignments(politician_id);
create index idx_minister_assignments_government on minister_assignments(government_id);
create index idx_minister_assignments_current on minister_assignments(government_id) where effective_to is null;
create index idx_house_memberships_politician on politician_house_memberships(politician_id);
create index idx_house_memberships_house on politician_house_memberships(house_id);
create index idx_house_memberships_constituency on politician_house_memberships(constituency_id);
create index idx_house_memberships_party on politician_house_memberships(party_id);
create index idx_house_memberships_current on politician_house_memberships(house_id) where end_date is null;

-- Elections -----------------------------------------------------------------------
create index idx_elections_type on elections(election_type);
create index idx_elections_state on elections(state_id);
create index idx_elections_status on elections(status);
create index idx_election_candidates_election on election_candidates(election_id);
create index idx_election_candidates_constituency on election_candidates(constituency_id);
create index idx_election_candidates_politician on election_candidates(politician_id);
create index idx_election_candidates_party on election_candidates(party_id);
create index idx_election_results_winner on election_results(is_winner) where is_winner = true;

-- Operational -----------------------------------------------------------------------
create index idx_corrections_entity on corrections(entity_type, entity_id);
create index idx_corrections_status on corrections(status);
create index idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index idx_audit_logs_actor on audit_logs(actor_id);
create index idx_audit_logs_created_at on audit_logs(created_at desc);
create index idx_data_imports_data_source on data_imports(data_source_id);
create index idx_data_import_records_import on data_import_records(data_import_id);
create index idx_data_quality_issues_entity on data_quality_issues(entity_type, entity_id);
create index idx_data_quality_issues_unresolved on data_quality_issues(severity) where is_resolved = false;

-- Trigram search support (used by search_entities() in 000011_functions.sql) ---------
create index idx_persons_full_name_trgm on persons using gin (full_name gin_trgm_ops);
create index idx_political_parties_name_trgm on political_parties using gin (name gin_trgm_ops);
create index idx_constituencies_name_trgm on constituencies using gin (name gin_trgm_ops);
create index idx_states_name_trgm on states using gin (name gin_trgm_ops);
