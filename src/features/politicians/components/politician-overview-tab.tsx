// Politician "Overview" tab — timeline + electoral record + sources sidebar.
import { TrendingUp, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LegislativeTimeline } from "./legislative-timeline";
import { ElectoralRecordTable } from "./electoral-record-table";

export function PoliticianOverviewTab({ politicianId }: { politicianId: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" /> Legislative Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LegislativeTimeline politicianId={politicianId} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-accent" /> Electoral Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ElectoralRecordTable politicianId={politicianId} />
          </CardContent>
        </Card>
      </div>
      <aside>
        <Card className="bg-accent/5">
          <CardHeader>
            <CardTitle className="text-sm">Data Verification &amp; Sources</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This profile is maintained from official Election Commission of India records and other cited
            government sources. Every fact links back to its source record.
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
