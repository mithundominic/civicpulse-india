// Server-only reads for the homepage's "Explore India" stats (AGENTS.md Rule 12).
import "server-only";
import { createClient } from "@/lib/database/server-client";

export async function getHomepageStats() {
  const supabase = await createClient();
  const [statesRes, utsRes, lokSabhaRes, assemblyRes, nationalRes, stateRes] = await Promise.all([
    supabase.from("states").select("*", { count: "exact", head: true }),
    supabase.from("union_territories").select("*", { count: "exact", head: true }),
    supabase.from("constituencies").select("*", { count: "exact", head: true }).eq("constituency_type", "LOK_SABHA"),
    supabase.from("constituencies").select("*", { count: "exact", head: true }).eq("constituency_type", "ASSEMBLY"),
    supabase
      .from("party_recognition_history")
      .select("*", { count: "exact", head: true })
      .eq("recognition_type", "NATIONAL")
      .is("effective_to", null),
    supabase
      .from("party_recognition_history")
      .select("*", { count: "exact", head: true })
      .eq("recognition_type", "STATE")
      .is("effective_to", null),
  ]);

  for (const res of [statesRes, utsRes, lokSabhaRes, assemblyRes, nationalRes, stateRes]) {
    if (res.error) throw res.error;
  }

  return {
    states: statesRes.count ?? 0,
    unionTerritories: utsRes.count ?? 0,
    lokSabhaSeats: lokSabhaRes.count ?? 0,
    assemblySeats: assemblyRes.count ?? 0,
    nationalParties: nationalRes.count ?? 0,
    stateParties: stateRes.count ?? 0,
  };
}
