// Party "Leadership" tab — current office bearers.
import { Users } from "lucide-react";
import { getPartyLeadership } from "../detail-queries";
import { Card, CardContent } from "@/components/ui/card";
import { CardGrid } from "@/components/ui/card-grid";
import { formatDate } from "@/lib/format/date";

export async function PartyLeadershipTab({ partyId }: { partyId: string }) {
  const leadership = await getPartyLeadership(partyId);

  return (
    <CardGrid
      items={leadership}
      keyFn={(leader) => leader.party_membership_id!}
      emptyIcon={Users}
      emptyTitle="No current leadership on record"
      emptyDescription="Leadership data for this party hasn't been added yet."
      renderItem={(leader) => (
        <Card>
          <CardContent className="p-5">
            <p className="font-semibold">{leader.office_title ?? "Office Bearer"}</p>
            <p className="mt-1 text-sm text-muted-foreground">Since {formatDate(leader.effective_from)}</p>
          </CardContent>
        </Card>
      )}
    />
  );
}
