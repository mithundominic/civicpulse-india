// Feature-local types for politicians, derived from lib/database/types.ts.
import type { Tables } from "@/lib/database/types";

export type PoliticianOverview = Tables<"public_politician_overview">;

export interface PoliticianFilters {
  query?: string;
  partyAbbreviation?: string;
  houseType?: string;
  // State filtering isn't wired up yet — public_politician_overview doesn't
  // carry a state column (Lok Sabha/Assembly members' state lives on their
  // constituency, Rajya Sabha members' on the house membership itself).
  // Extending the view to surface one cleanly is a natural follow-up; see
  // README "Known gaps".
  page?: number;
}

export const PAGE_SIZE = 24;
