// Server-only reads for the government feature (AGENTS.md Rule 12).
import "server-only";
import { createClient } from "@/lib/database/server-client";

export async function getCurrentUnionGovernment() {
  const supabase = await createClient();
  const { data: government, error } = await supabase
    .from("governments")
    .select("*")
    .eq("level", "UNION")
    .eq("status", "CURRENT")
    .order("formed_date", { ascending: false })
    .maybeSingle();
  if (error) throw error;
  if (!government) return null;

  const [{ data: parties }, { data: ministers }, { data: pm }] = await Promise.all([
    supabase
      .from("government_parties")
      .select("*, political_parties(name, abbreviation)")
      .eq("government_id", government.id),
    supabase.from("current_ministers").select("*").eq("government_id", government.id).order("rank"),
    supabase.from("current_position_holders").select("*").eq("position_title", "Prime Minister").maybeSingle(),
  ]);

  return { government, parties: parties ?? [], ministers: ministers ?? [], primeMinister: pm ?? null };
}
