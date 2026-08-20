// Feature-local types for states/UTs, derived from lib/database/types.ts.
import type { Tables } from "@/lib/database/types";

export type StateRow = Tables<"states">;
export type UnionTerritoryRow = Tables<"union_territories">;
