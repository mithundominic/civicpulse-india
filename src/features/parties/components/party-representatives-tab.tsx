// Party "Representatives" tab — current MPs/MLAs for this party.
import { Users } from "lucide-react";
import { getPartyRepresentatives } from "../detail-queries";
import { PoliticianCard } from "@/components/cards/politician-card";
import { CardGrid } from "@/components/ui/card-grid";

export async function PartyRepresentativesTab({ partyId }: { partyId: string }) {
  const representatives = await getPartyRepresentatives(partyId);

  return (
    <CardGrid
      items={representatives}
      keyFn={(rep) => rep.house_membership_id!}
      columns="2-4"
      emptyIcon={Users}
      emptyTitle="No current representatives on record"
      renderItem={(rep) => (
        <PoliticianCard
          politician={{
            slug: rep.person_slug!,
            fullName: rep.full_name!,
            photoUrl: rep.photo_url,
            positionTitle: rep.house_name,
            partyAbbreviation: rep.party_abbreviation,
            constituencyName: rep.constituency_name,
          }}
        />
      )}
    />
  );
}
