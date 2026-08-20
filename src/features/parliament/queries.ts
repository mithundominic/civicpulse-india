// Server-only reads for the parliament dashboards (AGENTS.md Rule 12).
import "server-only";
import { createClient } from "@/lib/database/server-client";
import type { Enums } from "@/lib/database/types";

export async function getHouseByType(houseType: Enums<"house_type">) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("houses").select("*").eq("house_type", houseType).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getHouseMembers(houseId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("current_house_members")
    .select("*")
    .eq("house_id", houseId)
    .order("full_name");
  if (error) throw error;
  return data ?? [];
}

export async function getHousePartyDistribution(houseId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("current_house_members")
    .select("party_name, party_abbreviation")
    .eq("house_id", houseId);
  if (error) throw error;

  const counts = new Map<string, { name: string; value: number }>();
  for (const row of data ?? []) {
    const key = row.party_abbreviation ?? "Independent";
    const existing = counts.get(key);
    if (existing) existing.value += 1;
    else counts.set(key, { name: key, value: 1 });
  }
  return Array.from(counts.values()).sort((a, b) => b.value - a.value);
}

export async function getStateWiseRepresentation(houseId: string) {
  const supabase = await createClient();
  // Queries the base table (not current_house_members) because PostgREST's
  // relationship embedding needs a real foreign key — the view exposes
  // state_id but was never joined to states(name) in its own definition.
  const { data, error } = await supabase
    .from("politician_house_memberships")
    .select("states(name)")
    .eq("house_id", houseId)
    .is("end_date", null);
  if (error) throw error;

  const counts = new Map<string, { name: string; total: number }>();
  for (const row of data ?? []) {
    const name = row.states?.name ?? "Unspecified";
    const existing = counts.get(name);
    if (existing) existing.total += 1;
    else counts.set(name, { name, total: 1 });
  }
  return Array.from(counts.values()).sort((a, b) => b.total - a.total);
}
