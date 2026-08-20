// Server-only reads for the politicians feature (AGENTS.md Rule 12).
import "server-only";
import { createClient } from "@/lib/database/server-client";
import { PAGE_SIZE, type PoliticianFilters } from "./types";

export async function listPoliticians(filters: PoliticianFilters = {}) {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase.from("public_politician_overview").select("*", { count: "exact" }).order("full_name");

  if (filters.query) query = query.ilike("full_name", `%${filters.query}%`);
  if (filters.partyAbbreviation) query = query.eq("current_party_abbreviation", filters.partyAbbreviation);
  if (filters.houseType) {
    query = query.eq(
      "current_house_type",
      filters.houseType as
        | "LOK_SABHA"
        | "RAJYA_SABHA"
        | "STATE_LEGISLATIVE_ASSEMBLY"
        | "STATE_LEGISLATIVE_COUNCIL"
    );
  }

  const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;

  return { politicians: data ?? [], total: count ?? 0, page, pageSize: PAGE_SIZE };
}

export async function getPoliticianBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_politician_overview")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPersonDetailsBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("persons").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPoliticianPositionHistory(politicianId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("politician_positions")
    .select("*, political_positions(title, category, level)")
    .eq("politician_id", politicianId)
    .order("effective_from", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPoliticianHouseMemberships(politicianId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("politician_house_memberships")
    .select("*, houses(name, house_type), constituencies(name)")
    .eq("politician_id", politicianId)
    .order("start_date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPoliticianPartyHistory(politicianId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("party_memberships")
    .select("*, political_parties(name, abbreviation)")
    .eq("politician_id", politicianId)
    .order("effective_from", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPoliticianElectionHistory(politicianId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("election_candidates")
    .select("*, elections(name, start_date), constituencies(name), political_parties(abbreviation), election_results(*)")
    .eq("politician_id", politicianId)
    .order("election_id", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
