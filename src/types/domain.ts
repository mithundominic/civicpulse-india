// Shared UI-facing types that aren't a 1:1 table row — composed/derived
// shapes used across multiple features. Table-shaped types are derived from
// lib/database/types.ts in each feature's own types.ts, not redefined here.

export type EntityType =
  | "PERSON"
  | "POLITICIAN"
  | "POLITICAL_PARTY"
  | "CONSTITUENCY"
  | "ELECTION"
  | "ELECTION_CANDIDATE"
  | "GOVERNMENT"
  | "MINISTRY"
  | "STATE"
  | "UNION_TERRITORY"
  | "DISTRICT"
  | "HOUSE";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface TabDefinition {
  value: string;
  label: string;
}

export interface SourceAttribution {
  label: string;
  lastVerified?: string | null;
}
