// Directory-listing card for a party — see docs/design/reference/party_directory_civicpulse_india.
import { Flag } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RECOGNITION_LABELS } from "@/lib/constants/labels";
import type { Enums } from "@/lib/database/types";

export interface PartyCardData {
  slug: string;
  name: string;
  abbreviation: string | null;
  logoUrl: string | null;
  recognitionType: Enums<"recognition_type"> | null;
  presidentName: string | null;
  foundedDate: string | null;
}

export function PartyCard({ party }: { party: PartyCardData }) {
  const { slug, name, abbreviation, logoUrl, recognitionType, presidentName, foundedDate } = party;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-accent/10">
          {logoUrl ? (
            <Image src={logoUrl} alt={`${name} symbol`} width={36} height={36} />
          ) : (
            <Flag className="h-6 w-6 text-accent" aria-hidden />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold leading-tight">{name}</h3>
          {abbreviation && <p className="text-sm text-muted-foreground">{abbreviation}</p>}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {recognitionType && <Badge variant="outline">{RECOGNITION_LABELS[recognitionType]}</Badge>}
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
          {presidentName && (
            <>
              <dt className="text-muted-foreground">President</dt>
              <dd className="font-medium">{presidentName}</dd>
            </>
          )}
          {foundedDate && (
            <>
              <dt className="text-muted-foreground">Founded</dt>
              <dd className="font-medium font-data">{new Date(foundedDate).getFullYear()}</dd>
            </>
          )}
        </dl>
        <Button href={`/parties/${slug}`} variant="primary" size="sm" className="mt-auto w-full">
          View Party Profile
        </Button>
      </CardContent>
    </Card>
  );
}
