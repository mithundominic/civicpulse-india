// Election-results table for a constituency (grouped by election) — see
// docs/design/reference/varanasi_constituency.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatVotes, formatPercent } from "@/lib/format/number";
import { getConstituencyElectionResults } from "../queries";

export async function ConstituencyResultsTable({ constituencyId }: { constituencyId: string }) {
  const records = await getConstituencyElectionResults(constituencyId);
  if (records.length === 0) {
    return <p className="text-sm text-muted-foreground">No election results on record for this constituency yet.</p>;
  }

  const byElection = new Map<string, typeof records>();
  for (const record of records) {
    const key = record.elections?.name ?? "Unknown election";
    if (!byElection.has(key)) byElection.set(key, []);
    byElection.get(key)!.push(record);
  }

  return (
    <div className="flex flex-col gap-6">
      {Array.from(byElection.entries()).map(([electionName, candidates]) => (
        <Card key={electionName}>
          <CardHeader>
            <CardTitle>{electionName} Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead className="text-right">Votes</TableHead>
                  <TableHead className="text-right">Vote %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates
                  .slice()
                  .sort((a, b) => {
                    const ra = Array.isArray(a.election_results) ? a.election_results[0] : a.election_results;
                    const rb = Array.isArray(b.election_results) ? b.election_results[0] : b.election_results;
                    return (ra?.rank ?? 99) - (rb?.rank ?? 99);
                  })
                  .map((candidate) => {
                    const result = Array.isArray(candidate.election_results) ? candidate.election_results[0] : candidate.election_results;
                    return (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">
                          {candidate.candidate_name}
                          {result?.is_winner && <Badge variant="success" className="ml-2">Elected</Badge>}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{candidate.political_parties?.abbreviation ?? "IND"}</TableCell>
                        <TableCell className="text-right font-data">{formatVotes(result?.votes_received)}</TableCell>
                        <TableCell className="text-right font-data">{formatPercent(result?.vote_share_percent)}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
