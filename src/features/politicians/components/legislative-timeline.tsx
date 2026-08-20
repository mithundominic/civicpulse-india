// "Legislative Timeline" — merges position + house-membership history into
// one chronological list. Matches docs/design/reference/politician_profile_civicpulse_india_1.
import { getPoliticianPositionHistory, getPoliticianHouseMemberships } from "../queries";
import { formatDateRange } from "@/lib/format/date";

interface TimelineEntry {
  title: string;
  detail: string | null;
  from: string;
  to: string | null;
}

export async function LegislativeTimeline({ politicianId }: { politicianId: string }) {
  const [positions, houseMemberships] = await Promise.all([
    getPoliticianPositionHistory(politicianId),
    getPoliticianHouseMemberships(politicianId),
  ]);

  const entries: TimelineEntry[] = [
    ...positions.map((p) => ({
      title: p.title_override ?? p.political_positions?.title ?? "Position",
      detail: p.political_positions?.category ?? null,
      from: p.effective_from,
      to: p.effective_to,
    })),
    ...houseMemberships.map((h) => ({
      title: `Member, ${h.houses?.name ?? "House"}`,
      detail: h.constituencies?.name ? `Elected from ${h.constituencies.name}` : null,
      from: h.start_date,
      to: h.end_date,
    })),
  ].sort((a, b) => (a.from < b.from ? 1 : -1));

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No legislative history on record yet.</p>;
  }

  return (
    <ol className="relative flex flex-col gap-6 border-l border-border pl-6">
      {entries.map((entry, index) => (
        <li key={`${entry.title}-${entry.from}-${index}`} className="relative">
          <span
            className={`absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full border-2 border-background ${
              index === 0 ? "bg-accent" : "bg-border"
            }`}
          />
          <p className="font-data text-xs text-muted-foreground">{formatDateRange(entry.from, entry.to)}</p>
          <p className="font-semibold">{entry.title}</p>
          {entry.detail && <p className="text-sm text-muted-foreground">{entry.detail}</p>}
        </li>
      ))}
    </ol>
  );
}
