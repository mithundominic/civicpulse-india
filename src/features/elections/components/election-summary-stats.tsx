// National-summary stat row for the election detail page.
import { StatCard } from "@/components/cards/stat-card";
import type { ElectionRow } from "../types";

export function ElectionSummaryStats({ election }: { election: ElectionRow }) {
  const majorityMark = election.total_seats ? Math.floor(election.total_seats / 2) + 1 : null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard label="Total Seats" value={election.total_seats ?? "—"} />
      <StatCard label="Majority Mark" value={majorityMark ?? "—"} description="Required for government formation" />
      <StatCard label="Turnout" value={election.voter_turnout_percent ? `${election.voter_turnout_percent}%` : "—"} />
      <StatCard label="Phases" value={election.phases ?? "—"} />
    </div>
  );
}
