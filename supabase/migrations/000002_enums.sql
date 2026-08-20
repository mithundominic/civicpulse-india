-- All enumerated types used across the schema, grouped by the domain area
-- that introduces them. Enums are used only for genuinely closed, stable
-- value sets. Open-ended taxonomies (e.g. political position names) are
-- deliberately modeled as data rows in a reference table instead — see
-- political_positions in 000004_political_entities.sql and DB spec "Avoid
-- hardcoding positions" guidance.

-- Geography ------------------------------------------------------------
create type geography_status as enum ('ACTIVE', 'INACTIVE', 'HISTORICAL');
create type constituency_type as enum ('LOK_SABHA', 'ASSEMBLY');
create type reservation_category as enum ('GENERAL', 'SC', 'ST');

-- Political parties ------------------------------------------------------
create type party_status as enum ('ACTIVE', 'DISSOLVED', 'MERGED', 'INACTIVE');
create type recognition_type as enum ('NATIONAL', 'STATE', 'REGISTERED_UNRECOGNISED');
create type symbol_status as enum ('RESERVED', 'FREE', 'HISTORICAL');
create type party_membership_type as enum ('MEMBER', 'OFFICE_BEARER', 'FOUNDER', 'LEADER', 'OTHER');
create type party_alias_type as enum ('ABBREVIATION', 'TRANSLITERATION', 'LOCAL_LANGUAGE', 'FORMER_NAME', 'OTHER');

-- Persons & politicians ----------------------------------------------------
create type political_profile_status as enum ('ACTIVE', 'FORMER', 'DECEASED', 'INACTIVE');
create type person_alias_type as enum ('COMMON_NAME', 'INITIALS', 'TRANSLITERATION', 'LOCAL_LANGUAGE', 'FORMER_NAME', 'OTHER');

-- Houses & legislative membership -----------------------------------------
create type house_type as enum ('LOK_SABHA', 'RAJYA_SABHA', 'STATE_LEGISLATIVE_ASSEMBLY', 'STATE_LEGISLATIVE_COUNCIL');
create type house_membership_type as enum ('ELECTED', 'NOMINATED', 'BY_ELECTION');

-- Government & ministries -------------------------------------------------
create type government_level as enum ('UNION', 'STATE', 'UNION_TERRITORY');
create type government_status as enum ('CURRENT', 'FORMER');
create type government_party_role as enum ('LEAD_PARTY', 'COALITION_PARTNER', 'SUPPORTING_PARTY', 'OTHER');
create type minister_rank as enum ('CABINET', 'INDEPENDENT_CHARGE', 'STATE_MINISTER');

-- Elections -----------------------------------------------------------------
create type election_type as enum ('LOK_SABHA', 'ASSEMBLY', 'RAJYA_SABHA', 'PRESIDENTIAL', 'VICE_PRESIDENTIAL', 'BY_ELECTION', 'OTHER');
create type election_status as enum ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');
create type candidate_nomination_status as enum ('NOMINATED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'CONTESTED');
create type candidate_result_status as enum ('ELECTED', 'RUNNER_UP', 'LOST', 'WITHDRAWN', 'DISQUALIFIED');
create type deposit_status as enum ('SAVED', 'FORFEITED');

-- Sources, verification & documents ---------------------------------------
create type source_type as enum (
  'ECI', 'PARLIAMENT', 'CENTRAL_GOVERNMENT', 'STATE_GOVERNMENT', 'UT_GOVERNMENT',
  'POLITICAL_PARTY', 'LEGISLATIVE_BODY', 'OFFICIAL_PERSONAL', 'SECONDARY', 'USER_SUBMITTED', 'OTHER'
);
create type source_content_type as enum ('HTML', 'PDF', 'JSON', 'CSV', 'XML', 'IMAGE', 'OTHER');
create type verification_status as enum ('UNVERIFIED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED', 'STALE');
create type entity_source_relationship as enum ('PRIMARY_SOURCE', 'SUPPORTING_SOURCE', 'HISTORICAL_SOURCE', 'DOCUMENT_SOURCE', 'IMAGE_SOURCE');
create type document_type as enum (
  'PARTY_CONSTITUTION', 'ECI_ORDER', 'ELECTION_RESULT', 'AFFIDAVIT', 'EXPENDITURE_REPORT',
  'CONTRIBUTION_REPORT', 'GOVERNMENT_DOCUMENT', 'PARLIAMENT_DOCUMENT', 'OTHER'
);

-- Shared polymorphic "which table does this row point at" tag, used by
-- entity_sources, entity_documents, corrections and audit_logs so all four
-- reuse one vocabulary instead of drifting into four different ones.
create type entity_type as enum (
  'PERSON', 'POLITICIAN', 'POLITICAL_PARTY', 'CONSTITUENCY', 'ELECTION',
  'ELECTION_CANDIDATE', 'GOVERNMENT', 'MINISTRY', 'STATE', 'UNION_TERRITORY',
  'DISTRICT', 'HOUSE'
);

-- Admin, corrections, audit --------------------------------------------------
create type admin_role_name as enum ('SUPER_ADMIN', 'DATA_ADMIN', 'DATA_REVIEWER', 'EDITOR', 'READ_ONLY');
create type correction_status as enum ('PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'DUPLICATE');
create type audit_action as enum ('CREATE', 'UPDATE', 'DELETE', 'VERIFY', 'REJECT', 'IMPORT', 'PUBLISH', 'ARCHIVE', 'RESTORE');

-- Data ingestion pipeline -----------------------------------------------------
create type import_status as enum ('PENDING', 'RUNNING', 'COMPLETED', 'PARTIAL', 'FAILED', 'CANCELLED');
create type import_match_status as enum ('NEW', 'MATCHED', 'POTENTIAL_DUPLICATE', 'UNMATCHED', 'REJECTED');
create type data_quality_issue_type as enum (
  'MISSING_SOURCE', 'DUPLICATE', 'INVALID_DATE', 'INVALID_RELATIONSHIP', 'STALE_RECORD',
  'CONFLICTING_SOURCE', 'MISSING_REQUIRED_FIELD', 'PARSER_ERROR', 'OTHER'
);
create type data_quality_severity as enum ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
