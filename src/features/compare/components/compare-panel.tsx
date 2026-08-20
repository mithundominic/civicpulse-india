// One politician's comparison column.
import Image from "next/image";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { getPoliticianCompareProfile } from "../queries";

type Profile = NonNullable<Awaited<ReturnType<typeof getPoliticianCompareProfile>>>;

export function ComparePanel({ profile }: { profile: Profile }) {
  const { overview, contested, wins } = profile;
  const winRate = contested > 0 ? Math.round((wins / contested) * 100) : null;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted">
            {overview.photo_url ? (
              <Image src={overview.photo_url} alt={overview.full_name!} width={56} height={56} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold">{overview.full_name}</p>
            {overview.current_party_abbreviation && <Badge variant="outline">{overview.current_party_abbreviation}</Badge>}
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Current Position</dt>
          <dd className="text-right font-medium">{overview.current_position_title ?? "—"}</dd>
          <dt className="text-muted-foreground">Constituency</dt>
          <dd className="text-right font-medium">{overview.current_constituency_name ?? "—"}</dd>
          <dt className="text-muted-foreground">Elections Contested</dt>
          <dd className="text-right font-data font-medium">{contested}</dd>
          <dt className="text-muted-foreground">Elections Won</dt>
          <dd className="text-right font-data font-medium">{wins}</dd>
          <dt className="text-muted-foreground">Win Rate</dt>
          <dd className="text-right font-data font-medium">{winRate !== null ? `${winRate}%` : "—"}</dd>
        </dl>
      </CardContent>
    </Card>
  );
}
