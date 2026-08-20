// Server-only reads for the politician-comparison feature (AGENTS.md Rule 12).
import "server-only";
import { createClient } from "@/lib/database/server-client";

export async function listPoliticianNamesForCompare() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("public_politician_overview").select("full_name, slug").order("full_name").limit(200);
  if (error) throw error;
  return (data ?? []).filter(
    (row): row is { full_name: string; slug: string } => Boolean(row.full_name && row.slug)
  );
}

export async function getPoliticianCompareProfile(slug: string) {
  const supabase = await createClient();
  const { data: overview, error } = await supabase
    .from("public_politician_overview")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!overview?.politician_id) return null;

  const { data: elections } = await supabase
    .from("election_candidates")
    .select("result_status, election_results(votes_received)")
    .eq("politician_id", overview.politician_id);

  const contested = elections?.length ?? 0;
  const wins = elections?.filter((e) => e.result_status === "ELECTED").length ?? 0;

  return { overview, contested, wins };
}
