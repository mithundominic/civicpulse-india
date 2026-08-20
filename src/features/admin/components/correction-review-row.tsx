"use client";

// One row in the corrections queue — a Client Component only so the
// accept/reject buttons can show pending state while the Server Action runs.
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reviewCorrection } from "../actions";
import type { Tables } from "@/lib/database/types";
import { formatDate } from "@/lib/format/date";

export function CorrectionReviewRow({ correction }: { correction: Tables<"corrections"> }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{correction.entity_type}</Badge>
            {correction.field_name && <span className="text-sm text-muted-foreground">{correction.field_name}</span>}
          </div>
          <p className="mt-1 text-sm">
            <span className="font-medium">Suggested:</span> {correction.suggested_value}
          </p>
          <p className="text-sm text-muted-foreground">{correction.reason}</p>
          {correction.submitter_email && (
            <p className="text-xs text-muted-foreground">Submitted by {correction.submitter_name || "anonymous"} ({correction.submitter_email})</p>
          )}
        </div>
        <span className="shrink-0 font-data text-xs text-muted-foreground">{formatDate(correction.created_at)}</span>
      </div>
      {correction.status === "PENDING" ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            disabled={isPending}
            onClick={() => startTransition(() => reviewCorrection(correction.id, "ACCEPTED"))}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => startTransition(() => reviewCorrection(correction.id, "REJECTED"))}
          >
            Reject
          </Button>
        </div>
      ) : (
        <Badge variant={correction.status === "ACCEPTED" ? "success" : "secondary"}>{correction.status}</Badge>
      )}
    </div>
  );
}
