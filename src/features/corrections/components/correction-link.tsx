// "Found an error?" link surfaced on every entity detail page — links to the
// dedicated /report form rather than an inline modal, keeping this a Server
// Component with no client JS needed (AGENTS.md Rule 9).
import Link from "next/link";
import { Flag } from "lucide-react";
import type { EntityType } from "@/types/domain";

interface CorrectionLinkProps {
  entityType: EntityType;
  entityId: string;
  entityLabel: string;
}

export function CorrectionLink({ entityType, entityId, entityLabel }: CorrectionLinkProps) {
  const params = new URLSearchParams({ entityType, entityId, label: entityLabel });

  return (
    <Link
      href={`/report?${params.toString()}`}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent"
    >
      <Flag className="h-3.5 w-3.5" /> Found incorrect information? Report a correction
    </Link>
  );
}
