"use server";

// Public write for this feature — anyone may submit a correction (no
// requireAdmin() call here is deliberate; the RLS policy corrections_public_submit
// enforces the narrow insert-only shape). Reviewing corrections is an admin
// action and lives in features/admin/actions.ts instead.
import { createClient } from "@/lib/database/server-client";
import { correctionSchema, type CorrectionInput } from "./schema";

export interface SubmitCorrectionResult {
  success: boolean;
  error?: string;
}

export async function submitCorrection(input: CorrectionInput): Promise<SubmitCorrectionResult> {
  const parsed = correctionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("corrections").insert({
    entity_type: parsed.data.entityType,
    entity_id: parsed.data.entityId,
    field_name: parsed.data.fieldName || null,
    suggested_value: parsed.data.suggestedValue,
    reason: parsed.data.reason,
    submitter_name: parsed.data.submitterName || null,
    submitter_email: parsed.data.submitterEmail || null,
  });

  if (error) return { success: false, error: "Something went wrong submitting your correction. Please try again." };
  return { success: true };
}
