// "Electoral Record" table — election_candidates + election_results per
// politician. Matches docs/design/reference/politician_profile_civicpulse_india_1.
import { getPoliticianElectionHistory } from "../queries";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CANDIDATE_RESULT_LABELS } from "@/lib/constants/labels";
import { formatVotes } from "@/lib/format/number";
import { formatYear } from "@/lib/format/date";

const RESULT_VARIANT: Record<string, "success" | "secondary" | "destructive"> = {
  ELECTED: "success",
  RUNNER_UP: "secondary",
  LOST: "secondary",
  WITHDRAWN: "secondary",
  DISQUALIFIED: "destructive",
};

export async function ElectoralRecordTable({ politicianId }: { politicianId: string }) {
  const records = await getPoliticianElectionHistory(politicianId);

  if (records.length === 0) {
    return <p className="text-sm text-muted-foreground">No electoral record on file yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Year</TableHead>
          <TableHead>Election</TableHead>
          <TableHead>Constituency</TableHead>
          <TableHead className="text-right">Votes</TableHead>
          <TableHead>Result</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => {
          const result = Array.isArray(record.election_results) ? record.election_results[0] : record.election_results;
          return (
            <TableRow key={record.id}>
              <TableCell className="font-data">{formatYear(record.elections?.start_date) || "—"}</TableCell>
              <TableCell>{record.elections?.name}</TableCell>
              <TableCell>{record.constituencies?.name}</TableCell>
              <TableCell className="text-right font-data">{formatVotes(result?.votes_received)}</TableCell>
              <TableCell>
                {record.result_status && (
                  <Badge variant={RESULT_VARIANT[record.result_status] ?? "secondary"}>
                    {CANDIDATE_RESULT_LABELS[record.result_status]}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
