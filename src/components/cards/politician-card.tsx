// Directory-listing card for a politician — see docs/design/reference/politician_directory_civicpulse_india_1.
import { User, Landmark, MapPin } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PoliticianCardData {
  slug: string;
  fullName: string;
  photoUrl: string | null;
  positionTitle: string | null;
  partyAbbreviation: string | null;
  constituencyName: string | null;
  stateName?: string | null;
}

export function PoliticianCard({ politician }: { politician: PoliticianCardData }) {
  const { slug, fullName, photoUrl, positionTitle, partyAbbreviation, constituencyName, stateName } = politician;

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative flex aspect-square items-center justify-center bg-muted">
        {photoUrl ? (
          <Image src={photoUrl} alt={fullName} fill className="object-cover" />
        ) : (
          <User className="h-12 w-12 text-muted-foreground" aria-hidden />
        )}
        {partyAbbreviation && (
          <Badge variant="outline" className="absolute right-2 top-2 bg-card">
            {partyAbbreviation}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-tight">{fullName}</h3>
        {positionTitle && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Landmark className="h-3.5 w-3.5 shrink-0" /> {positionTitle}
          </p>
        )}
        {(constituencyName || stateName) && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" /> {constituencyName ?? stateName}
          </p>
        )}
        <Button href={`/politicians/${slug}`} variant="outline" size="sm" className="mt-auto w-full">
          View Profile
        </Button>
      </div>
    </Card>
  );
}
