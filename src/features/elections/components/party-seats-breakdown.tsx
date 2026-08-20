// Party-by-party seat breakdown, as proportion bars.
import { ProportionBar } from "@/components/charts/proportion-bar";
import { getElectionPartyResults } from "../queries";

const BAR_COLORS = ["bg-primary", "bg-accent", "bg-secondary", "bg-muted-foreground/60"];

export async function PartySeatsBreakdown({ electionId, totalSeats }: { electionId: string; totalSeats: number | null }) {
  const results = (await getElectionPartyResults(electionId)).filter((r) => r.seats_won && r.seats_won > 0).slice(0, 8);

  if (results.length === 0) {
    return <p className="text-sm text-muted-foreground">Party-wise results haven&apos;t been tabulated yet.</p>;
  }

  const max = totalSeats ?? Math.max(...results.map((r) => r.seats_won ?? 0));

  return (
    <div className="flex flex-col gap-4">
      {results.map((result, index) => (
        <ProportionBar
          key={result.party_id}
          label={result.party_name ?? "Unknown"}
          value={result.seats_won ?? 0}
          max={max}
          valueLabel={`${result.seats_won} Seats`}
          colorClassName={BAR_COLORS[index % BAR_COLORS.length]}
        />
      ))}
    </div>
  );
}
