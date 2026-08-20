// Server-only reads for the party DETAIL page's tabs (Leadership,
// Representatives, Election History, Overview) — split from queries.ts
// (directory reads) once that file passed the 100-line guideline
// (AGENTS.md Rule 3). Same Rule 12 constraint applies: the only place these
// specific `.from()` calls live.
import "server-only";
import { createClient } from "@/lib/database/server-client";

export async function getPartyLeadership(partyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("current_party_memberships")
    .select("*")
    .eq("party_id", partyId)
    .in("membership_type", ["OFFICE_BEARER", "LEADER", "FOUNDER"])
    .order("effective_from", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPartyRepresentatives(partyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("current_house_members")
    .select("*")
    .eq("party_id", partyId)
    .order("full_name")
    .limit(24);
  if (error) throw error;
  return data ?? [];
}

export async function getPartyElectionHistory(partyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("party_election_results")
    .select("*")
    .eq("party_id", partyId)
    .order("election_name", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPartyRecognitionHistory(partyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("party_recognition_history")
    .select("id, recognition_type, effective_from, effective_to, states(name), union_territories(name)")
    .eq("party_id", partyId)
    .order("effective_from", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    recognitionType: row.recognition_type,
    effectiveFrom: row.effective_from,
    effectiveTo: row.effective_to,
    scopeName: row.states?.name ?? row.union_territories?.name ?? null,
  }));
}
