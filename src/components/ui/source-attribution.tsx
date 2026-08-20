// "Source: ECI | Last verified: ..." attribution strip — appears on nearly
// every directory and detail page per the approved design reference. This is
// the one place that pattern is implemented (AGENTS.md Rule 6).
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format/date";

interface SourceAttributionProps {
  sourceName: string;
  lastVerified?: string | null;
  className?: string;
}

export function SourceAttribution({ sourceName, lastVerified, className }: SourceAttributionProps) {
  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <ShieldCheck className="h-3.5 w-3.5 text-accent" />
      <span>
        Source: {sourceName}
        {lastVerified && <> | Last verified: {formatDate(lastVerified, "MMM yyyy")}</>}
      </span>
    </div>
  );
}
