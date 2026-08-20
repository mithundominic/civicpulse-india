// Server-only reads for the states/UTs feature (AGENTS.md Rule 12).
import "server-only";
import { createClient } from "@/lib/database/server-client";

export async function listStates() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("states").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function listUnionTerritories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("union_territories").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getStateBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("states").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getUnionTerritoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("union_territories").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getStateCurrentLeadership(stateId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("current_position_holders")
    .select("*")
    .eq("state_id", stateId)
    .in("position_category", ["Executive"]);
  if (error) throw error;
  return data ?? [];
}

export async function getStateConstituencies(stateId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("constituencies")
    .select("*")
    .eq("state_id", stateId)
    .order("constituency_type")
    .order("number");
  if (error) throw error;
  return data ?? [];
}

export async function getStateMps(stateId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("current_house_members")
    .select("*")
    .eq("state_id", stateId)
    .order("full_name");
  if (error) throw error;
  return data ?? [];
}
