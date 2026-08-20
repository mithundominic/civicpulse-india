// "Current Leadership" section of the state/UT detail page — extracted so
// state-detail-view.tsx stays within the ~100-line guideline (AGENTS.md Rule 3).
import { Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { CardGrid } from "@/components/ui/card-grid";
import { getStateCurrentLeadership } from "../queries";

export async function CurrentLeadershipSection({ placeId }: { placeId: string }) {
  const leadership = await getStateCurrentLeadership(placeId);

  return (
    <Section title="Current Leadership" spacing="tight">
      <CardGrid
        items={leadership}
        keyFn={(holder) => holder.politician_position_id!}
        columns="3"
        emptyIcon={Landmark}
        emptyTitle="No current leadership on record yet"
        renderItem={(holder) => (
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{holder.position_title}</p>
              <p className="font-semibold">{holder.full_name}</p>
            </CardContent>
          </Card>
        )}
      />
    </Section>
  );
}
