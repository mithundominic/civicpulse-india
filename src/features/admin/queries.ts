// Server-only reads for the admin dashboard — all gated behind requireAdmin()
// having already been called in the layout (AGENTS.md Rule 13).
import "server-only";
import { createClient } from "@/lib/database/server-client";

export async function getAdminDashboardStats() {
  const supabase = await createClient();
  const [politiciansRes, partiesRes, constituenciesRes, correctionsRes] = await Promise.all([
    supabase.from("politicians").select("*", { count: "exact", head: true }),
    supabase.from("political_parties").select("*", { count: "exact", head: true }).eq("status", "ACTIVE"),
    supabase.from("constituencies").select("*", { count: "exact", head: true }),
    supabase.from("corrections").select("*", { count: "exact", head: true }).eq("status", "PENDING"),
  ]);

  for (const res of [politiciansRes, partiesRes, constituenciesRes, correctionsRes]) {
    if (res.error) throw res.error;
  }

  return {
    politicians: politiciansRes.count ?? 0,
    parties: partiesRes.count ?? 0,
    constituencies: constituenciesRes.count ?? 0,
    pendingCorrections: correctionsRes.count ?? 0,
  };
}

export async function getRecentAuditLogs(limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function listAllPoliticiansForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_politician_overview")
    .select("*")
    .order("full_name")
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function listAllPartiesForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("public_party_overview").select("*").order("name").limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function listPendingCorrections() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("corrections")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}
