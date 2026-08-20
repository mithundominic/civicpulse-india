// State/RUPP-parties table on the directory page, now paginated — see
// docs/design/reference/party_directory. pageParam lets two instances of
// this table coexist on one page (state parties, RUPP parties) without their
// pagination controls colliding.
import { Flag } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import type { PartyOverview } from "../types";
import { PAGE_SIZE } from "../types";

interface StatePartyTableProps {
  result: { parties: PartyOverview[]; total: number; page: number; pageSize: number };
  searchParams: Record<string, string | string[] | undefined>;
  pageParam: string;
}

export function StatePartyTable({ result, searchParams, pageParam }: StatePartyTableProps) {
  const { parties, total, page } = result;

  if (parties.length === 0) {
    return <EmptyState icon={Flag} title="No parties in this category yet" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Party Name</TableHead>
              <TableHead>Abbr.</TableHead>
              <TableHead>President / Leader</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parties.map((party) => (
              <TableRow key={party.party_id}>
                <TableCell className="font-medium">{party.name}</TableCell>
                <TableCell className="text-muted-foreground">{party.abbreviation ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{party.current_president_name ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Button href={`/parties/${party.slug}`} variant="outline" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/parties" searchParams={searchParams} paramName={pageParam} />
    </div>
  );
}
