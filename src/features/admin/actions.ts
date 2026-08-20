"use server";

// Admin writes for the corrections queue — requireAdmin() is the first thing
// every function does (AGENTS.md Rule 13). Every decision is also recorded
// to the append-only audit_logs table.
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/database/server-client";

export async function reviewCorrection(correctionId: string, decision: "ACCEPTED" | "REJECTED") {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { data: correction, error: fetchError } = await supabase
    .from("corrections")
    .select("entity_type, entity_id")
    .eq("id", correctionId)
    .single();
  if (fetchError) throw fetchError;

  const { error } = await supabase
    .from("corrections")
    .update({ status: decision, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq("id", correctionId);
  if (error) throw error;

  await supabase.from("audit_logs").insert({
    entity_type: correction.entity_type,
    entity_id: correction.entity_id,
    action: decision === "ACCEPTED" ? "VERIFY" : "REJECT",
    actor_id: user.id,
    notes: `Correction ${correctionId} ${decision.toLowerCase()}`,
  });

  revalidatePath("/admin/corrections");
  revalidatePath("/admin");
}
