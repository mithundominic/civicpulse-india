// Directory-listing card for a state/UT — used on /states.
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface StateCardData {
  slug: string;
  name: string;
  capital: string | null;
  kind: "State" | "Union Territory";
  chiefMinisterName?: string | null;
}

export function StateCard({ state }: { state: StateCardData }) {
  const { slug, name, capital, kind, chiefMinisterName } = state;
  const basePath = kind === "State" ? "/states" : "/union-territories";

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{name}</h3>
          <Badge variant="secondary">{kind}</Badge>
        </div>
        <dl className="space-y-1 text-sm">
          {capital && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              Capital: <span className="text-foreground">{capital}</span>
            </div>
          )}
          {chiefMinisterName && (
            <div className="text-muted-foreground">
              Chief Minister: <span className="text-foreground">{chiefMinisterName}</span>
            </div>
          )}
        </dl>
        <Button href={`${basePath}/${slug}`} variant="outline" size="sm">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
