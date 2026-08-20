// Politician "Political Career" tab — full party membership history.
import { getPoliticianPartyHistory } from "../queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/format/date";

export async function PoliticianCareerTab({ politicianId }: { politicianId: string }) {
  const history = await getPoliticianPartyHistory(politicianId);

  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">No party affiliation history on record yet.</p>;
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        {history.map((row) => (
          <div key={row.id} className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
            <div>
              <p className="font-semibold">
                {row.office_title ? `${row.office_title}, ` : ""}
                {row.political_parties?.name}
              </p>
              <p className="text-sm text-muted-foreground">{row.membership_type.replace("_", " ")}</p>
            </div>
            <Badge variant="outline" className="font-data shrink-0">
              {formatDateRange(row.effective_from, row.effective_to)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
