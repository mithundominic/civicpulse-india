// Server-only reads for the search feature — wraps the search_entities() SQL
// function (AGENTS.md Rule 12).
import "server-only";
import { createClient } from "@/lib/database/server-client";

const ENTITY_PATH: Record<string, string> = {
  politician: "/politicians",
  party: "/parties",
  constituency: "/constituencies",
  state: "/states",
};

export async function searchEntities(query: string, limit = 20) {
  if (!query || query.trim().length < 2) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_entities", { search_query: query, result_limit: limit });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...row,
    href: `${ENTITY_PATH[row.entity_type ?? ""] ?? ""}/${row.slug}`,
  }));
}
