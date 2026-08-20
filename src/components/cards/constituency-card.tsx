// Directory-listing card for a constituency — used on /constituencies.
import { MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Enums } from "@/lib/database/types";

export interface ConstituencyCardData {
  slug: string;
  name: string;
  constituencyType: Enums<"constituency_type">;
  stateOrUtName: string | null;
  reservedCategory: Enums<"reservation_category">;
  currentRepresentativeName: string | null;
}

export function ConstituencyCard({ constituency }: { constituency: ConstituencyCardData }) {
  const { slug, name, constituencyType, stateOrUtName, reservedCategory, currentRepresentativeName } = constituency;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{name}</h3>
          <Badge variant="secondary">{constituencyType === "LOK_SABHA" ? "Lok Sabha" : "Assembly"}</Badge>
        </div>
        <dl className="space-y-1 text-sm">
          {stateOrUtName && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" /> {stateOrUtName}
            </div>
          )}
          {currentRepresentativeName && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="text-foreground">{currentRepresentativeName}</span>
            </div>
          )}
          {reservedCategory !== "GENERAL" && <Badge variant="outline">{reservedCategory}</Badge>}
        </dl>
        <Button href={`/constituencies/${slug}`} variant="outline" size="sm">
          View Constituency
        </Button>
      </CardContent>
    </Card>
  );
}
