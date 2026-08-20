// Server-only reads for the public "Data & Sources" page (AGENTS.md Rule 12).
import "server-only";
import { createClient } from "@/lib/database/server-client";

export async function listActiveSources() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("sources").select("*").eq("is_active", true).order("authority_rank");
  if (error) throw error;
  return data ?? [];
}
