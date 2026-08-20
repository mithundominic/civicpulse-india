// Directory-listing card for an election — used on /elections.
import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ELECTION_STATUS_LABELS } from "@/lib/constants/labels";
import { formatDate } from "@/lib/format/date";
import type { Enums } from "@/lib/database/types";

export interface ElectionCardData {
  slug: string;
  name: string;
  status: Enums<"election_status">;
  startDate: string | null;
  endDate: string | null;
  totalSeats: number | null;
}

const STATUS_VARIANT: Record<Enums<"election_status">, "info" | "success" | "secondary" | "destructive"> = {
  UPCOMING: "info",
  ONGOING: "info",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

export function ElectionCard({ election }: { election: ElectionCardData }) {
  const { slug, name, status, startDate, endDate, totalSeats } = election;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{name}</h3>
          <Badge variant={STATUS_VARIANT[status]}>{ELECTION_STATUS_LABELS[status]}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {startDate && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> {formatDate(startDate, "MMM yyyy")}
              {endDate && ` – ${formatDate(endDate, "MMM yyyy")}`}
            </span>
          )}
          {totalSeats && <span className="font-data">{totalSeats} Seats</span>}
        </div>
        <Button href={`/elections/${slug}`} variant="outline" size="sm">
          View Results
        </Button>
      </CardContent>
    </Card>
  );
}
