// Server-only reads for the parties DIRECTORY (list + lookup) — the ONLY
// place `.from()` calls for these read shapes live (AGENTS.md Rule 12).
// Detail-page/tab reads live in detail-queries.ts — split by responsibility
// once this file passed the 100-line guideline (AGENTS.md Rule 3).
import "server-only";
import { createClient } from "@/lib/database/server-client";
import { PAGE_SIZE, type PartyFilters } from "./types";

// National recognition is, by ECI definition, a small closed set (historically
// never more than a handful at once) — unbounded here is a deliberate, safe
// choice, unlike state/unrecognised parties below which can realistically
// number in the hundreds and must be paginated.
export async function listNationalParties(query?: string) {
  const supabase = await createClient();
  let q = supabase
    .from("public_party_overview")
    .select("*")
    .eq("current_recognition_type", "NATIONAL")
    .order("name");
  if (query) q = q.ilike("name", `%${query}%`);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function listPartiesByRecognitionPaginated(
  recognitionType: "STATE" | "REGISTERED_UNRECOGNISED",
  filters: PartyFilters = {}
) {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("public_party_overview")
    .select("*", { count: "exact" })
    .eq("current_recognition_type", recognitionType)
    .order("name");
  if (filters.query) query = query.ilike("name", `%${filters.query}%`);

  const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;
  return { parties: data ?? [], total: count ?? 0, page, pageSize: PAGE_SIZE };
}

export async function getTotalPartyCount() {
  const supabase = await createClient();
  const { count, error } = await supabase.from("political_parties").select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function getPartyBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("public_party_overview").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}
