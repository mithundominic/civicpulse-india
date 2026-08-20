// Feature-local types for parties, derived from lib/database/types.ts.
import type { Tables } from "@/lib/database/types";

export type PartyOverview = Tables<"public_party_overview">;
export type PartyRow = Tables<"political_parties">;
export type PartyRecognitionRow = Tables<"party_recognition_history">;
export type PartyMembershipRow = Tables<"party_memberships">;

export interface PartyFilters {
  query?: string;
  recognitionType?: string;
  stateSlug?: string;
  activeOnly?: boolean;
  page?: number;
}

export const PAGE_SIZE = 24;
