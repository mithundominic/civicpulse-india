// Feature-local types for constituencies, derived from lib/database/types.ts.
import type { Tables } from "@/lib/database/types";

export type ConstituencyRow = Tables<"constituencies">;

export interface ConstituencyFilters {
  query?: string;
  constituencyType?: string;
  page?: number;
}

export const PAGE_SIZE = 24;
