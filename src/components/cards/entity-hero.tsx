// Shared hero pattern for party/politician detail pages: image/symbol + title
// + badges + meta rows, with an optional right-side panel (source info,
// dossier button). Built once with slots instead of once per entity type
// (AGENTS.md Rule 6). Constituency pages use a lighter custom header since
// the approved design reference doesn't box that one the same way.
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EntityHeroProps {
  image: React.ReactNode;
  title: string;
  badges?: React.ReactNode;
  metaRows?: React.ReactNode;
  description?: string;
  sidePanel?: React.ReactNode;
  className?: string;
}

export function EntityHero({ image, title, badges, metaRows, description, sidePanel, className }: EntityHeroProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">{image}</div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            {badges && <div className="flex flex-wrap items-center gap-2">{badges}</div>}
            {metaRows && <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">{metaRows}</div>}
            {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {sidePanel && <div className="shrink-0 md:w-64">{sidePanel}</div>}
      </div>
    </Card>
  );
}
