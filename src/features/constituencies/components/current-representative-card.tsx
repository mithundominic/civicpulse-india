// "Current Representative" card — see docs/design/reference/varanasi_constituency.
import { User } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getConstituencyCurrentRepresentative } from "../queries";

export async function CurrentRepresentativeCard({ constituencyId }: { constituencyId: string }) {
  const rep = await getConstituencyCurrentRepresentative(constituencyId);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Current Representative</CardTitle>
        {rep && <Badge variant="success">Incumbent</Badge>}
      </CardHeader>
      <CardContent>
        {!rep ? (
          <p className="text-sm text-muted-foreground">No current representative on record yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {rep.photo_url ? (
                  <Image src={rep.photo_url} alt={rep.full_name!} width={64} height={64} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold">{rep.full_name}</p>
                {rep.party_abbreviation && <Badge variant="outline">{rep.party_abbreviation}</Badge>}
              </div>
            </div>
            <Button href={`/politicians/${rep.person_slug}`} variant="outline" size="sm" className="w-fit">
              View Full Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
