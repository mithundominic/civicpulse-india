// Constituency-results table with a search box — election detail page.
import { MapPin } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { formatVotes } from "@/lib/format/number";
import { getElectionConstituencyResults } from "../queries";

export async function ConstituencyResultsSearch({ electionId, slug, query }: { electionId: string; slug: string; query?: string }) {
  const winners = await getElectionConstituencyResults(electionId, query);

  return (
    <div className="flex flex-col gap-4">
      <form action={`/elections/${slug}`} method="GET" className="max-w-sm">
        <Input name="q" defaultValue={query} placeholder="Search constituency..." />
      </form>
      {winners.length === 0 ? (
        <EmptyState icon={MapPin} title="No results found" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Constituency</TableHead>
                <TableHead>Winning Candidate</TableHead>
                <TableHead>Party</TableHead>
                <TableHead className="text-right">Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {winners.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="text-muted-foreground">{w.constituencies?.states?.name ?? "—"}</TableCell>
                  <TableCell className="font-medium">{w.constituencies?.name}</TableCell>
                  <TableCell>{w.candidate_name}</TableCell>
                  <TableCell className="text-muted-foreground">{w.political_parties?.abbreviation ?? "IND"}</TableCell>
                  <TableCell className="text-right font-data">
                    {formatVotes(Array.isArray(w.election_results) ? w.election_results[0]?.margin : w.election_results?.margin)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
