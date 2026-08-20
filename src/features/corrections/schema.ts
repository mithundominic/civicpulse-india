// Zod schema for public correction submissions — validated at the Server
// Action boundary before ever touching Supabase (AGENTS.md Rule 8).
import { z } from "zod";
import { uuidSchema } from "@/lib/validation/common";

export const correctionSchema = z.object({
  entityType: z.enum([
    "PERSON",
    "POLITICIAN",
    "POLITICAL_PARTY",
    "CONSTITUENCY",
    "ELECTION",
    "ELECTION_CANDIDATE",
    "GOVERNMENT",
    "MINISTRY",
    "STATE",
    "UNION_TERRITORY",
    "DISTRICT",
    "HOUSE",
  ]),
  entityId: uuidSchema,
  fieldName: z.string().max(120).optional(),
  suggestedValue: z.string().min(1, "Please describe the correct value.").max(2000),
  reason: z.string().min(10, "Please explain how you know this (at least 10 characters).").max(2000),
  submitterName: z.string().max(120).optional(),
  submitterEmail: z.string().email().optional().or(z.literal("")),
});

export type CorrectionInput = z.infer<typeof correctionSchema>;
