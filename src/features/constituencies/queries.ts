// Server-only reads for the constituencies feature (AGENTS.md Rule 12).
import "server-only";
import { createClient } from "@/lib/database/server-client";
import { PAGE_SIZE, type ConstituencyFilters } from "./types";

export async function listConstituencies(filters: ConstituencyFilters = {}) {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("constituencies")
    .select("*, states(name), union_territories(name)", { count: "exact" })
    .order("name");

  if (filters.query) query = query.ilike("name", `%${filters.query}%`);
  if (filters.constituencyType) {
    query = query.eq("constituency_type", filters.constituencyType as "LOK_SABHA" | "ASSEMBLY");
  }

  const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;
  return { constituencies: data ?? [], total: count ?? 0, page, pageSize: PAGE_SIZE };
}

export async function getConstituencyBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("constituencies")
    .select("*, states(name, slug), union_territories(name, slug), districts(name)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getConstituencyCurrentRepresentative(constituencyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("current_house_members")
    .select("*")
    .eq("constituency_id", constituencyId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getConstituencyElectionResults(constituencyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("election_candidates")
    .select("*, elections(name, start_date), political_parties(name, abbreviation), election_results(*)")
    .eq("constituency_id", constituencyId)
    .order("election_id", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
