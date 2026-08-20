// Party "Election History" tab — seats won per election, from the
// party_election_results view (a derived aggregation, never a second source
// of truth — see the view's own comment in supabase/migrations).
import { TrendingUp } from "lucide-react";
import { getPartyElectionHistory } from "../detail-queries";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { formatVotes } from "@/lib/format/number";

export async function PartyElectionHistoryTab({ partyId }: { partyId: string }) {
  const results = await getPartyElectionHistory(partyId);

  if (results.length === 0) {
    return <EmptyState icon={TrendingUp} title="No election history on record yet" />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Election</TableHead>
            <TableHead className="text-right">Seats Won</TableHead>
            <TableHead className="text-right">Candidates Contested</TableHead>
            <TableHead className="text-right">Total Votes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((row) => (
            <TableRow key={`${row.election_id}-${row.party_id}`}>
              <TableCell className="font-medium">{row.election_name}</TableCell>
              <TableCell className="text-right font-data">{row.seats_won}</TableCell>
              <TableCell className="text-right font-data">{row.candidates_contested}</TableCell>
              <TableCell className="text-right font-data">{formatVotes(row.total_votes)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
