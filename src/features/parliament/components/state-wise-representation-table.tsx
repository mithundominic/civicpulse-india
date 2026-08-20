// "State-wise Representation" table — extracted from house-dashboard-view.tsx
// to stay within the ~100-line guideline (AGENTS.md Rule 3).
import { Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getStateWiseRepresentation } from "../queries";

export async function StateWiseRepresentationTable({ houseId }: { houseId: string }) {
  const stateWise = await getStateWiseRepresentation(houseId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>State-wise Representation</CardTitle>
      </CardHeader>
      <CardContent>
        {stateWise.length === 0 ? (
          <EmptyState icon={Landmark} title="No members on record yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State / UT</TableHead>
                <TableHead className="text-right">Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stateWise.slice(0, 8).map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-right font-data">{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
