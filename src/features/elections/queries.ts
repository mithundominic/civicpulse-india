// Server-only reads for the elections feature (AGENTS.md Rule 12).
import "server-only";
import { createClient } from "@/lib/database/server-client";

export async function listElections() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("elections").select("*").order("start_date", { ascending: false });
  if (error) throw error;

  const lokSabha = (data ?? []).filter((e) => e.election_type === "LOK_SABHA");
  const assembly = (data ?? []).filter((e) => e.election_type === "ASSEMBLY");
  const other = (data ?? []).filter((e) => !["LOK_SABHA", "ASSEMBLY"].includes(e.election_type));
  return { lokSabha, assembly, other, all: data ?? [] };
}

export async function getElectionBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("elections").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getElectionPartyResults(electionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("party_election_results")
    .select("*")
    .eq("election_id", electionId)
    .order("seats_won", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getElectionConstituencyResults(electionId: string, searchQuery?: string) {
  const supabase = await createClient();
  const query = supabase
    .from("election_candidates")
    .select("*, constituencies(name, states(name)), political_parties(abbreviation), election_results(*)")
    .eq("election_id", electionId)
    .eq("result_status", "ELECTED")
    .order("constituency_id");

  const { data, error } = await query;
  if (error) throw error;

  const winners = data ?? [];
  if (!searchQuery) return winners.slice(0, 50);
  const q = searchQuery.toLowerCase();
  return winners.filter((w) => w.constituencies?.name?.toLowerCase().includes(q)).slice(0, 50);
}
