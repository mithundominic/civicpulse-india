// Feature-local types for elections, derived from lib/database/types.ts.
import type { Tables } from "@/lib/database/types";

export type ElectionRow = Tables<"elections">;
export type PartyElectionResultRow = Tables<"party_election_results">;
