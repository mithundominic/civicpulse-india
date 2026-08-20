// Party "Overview" tab — recognition history timeline.
import { getPartyRecognitionHistory } from "../detail-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/format/date";
import { RECOGNITION_LABELS } from "@/lib/constants/labels";

export async function PartyOverviewTab({ partyId }: { partyId: string }) {
  const history = await getPartyRecognitionHistory(partyId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recognition History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recognition history on record yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {history.map((row) => (
              <li
                key={row.id}
                className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{RECOGNITION_LABELS[row.recognitionType]}</p>
                  <p className="text-sm text-muted-foreground">{row.scopeName ?? "National scope"}</p>
                </div>
                <Badge variant="outline" className="font-data shrink-0">
                  {formatDateRange(row.effectiveFrom, row.effectiveTo)}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
