// Politician "Election History" tab — the full electoral record, standalone.
import { Card, CardContent } from "@/components/ui/card";
import { ElectoralRecordTable } from "./electoral-record-table";

export function PoliticianElectionsTab({ politicianId }: { politicianId: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <ElectoralRecordTable politicianId={politicianId} />
      </CardContent>
    </Card>
  );
}
