"use client";

// The correction submission form — a Client Component because it needs
// pending/success state, calling the submitCorrection Server Action directly
// (AGENTS.md Rule 9: Client Component receives data as props, calls a Server
// Action explicitly — no Route Handler round-trip needed for a form action).
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitCorrection } from "../actions";
import type { EntityType } from "@/types/domain";

interface CorrectionFormProps {
  entityType: EntityType;
  entityId: string;
}

export function CorrectionForm({ entityType, entityId }: CorrectionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const response = await submitCorrection({
        entityType,
        entityId,
        fieldName: String(formData.get("fieldName") || ""),
        suggestedValue: String(formData.get("suggestedValue") || ""),
        reason: String(formData.get("reason") || ""),
        submitterName: String(formData.get("submitterName") || ""),
        submitterEmail: String(formData.get("submitterEmail") || ""),
      });
      setResult(response);
    });
  }

  if (result?.success) {
    return (
      <p className="rounded-md border border-success/30 bg-success/10 p-4 text-sm text-success">
        Thank you — your correction has been submitted for review by our data team.
      </p>
    );
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="fieldName" className="mb-1.5 block text-sm font-medium">
          Which field is incorrect? <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input id="fieldName" name="fieldName" placeholder="e.g. Date of birth, Party affiliation" />
      </div>
      <div>
        <label htmlFor="suggestedValue" className="mb-1.5 block text-sm font-medium">
          What should it say instead?
        </label>
        <Input id="suggestedValue" name="suggestedValue" required />
      </div>
      <div>
        <label htmlFor="reason" className="mb-1.5 block text-sm font-medium">
          How do you know this? Please share a source if possible.
        </label>
        <textarea
          id="reason"
          name="reason"
          required
          rows={4}
          className="w-full rounded-md border border-input bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="submitterName" className="mb-1.5 block text-sm font-medium">
            Your name <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input id="submitterName" name="submitterName" />
        </div>
        <div>
          <label htmlFor="submitterEmail" className="mb-1.5 block text-sm font-medium">
            Email <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input id="submitterEmail" name="submitterEmail" type="email" />
        </div>
      </div>
      {result?.error && <p className="text-sm text-destructive">{result.error}</p>}
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Submitting..." : "Submit Correction"}
      </Button>
    </form>
  );
}
