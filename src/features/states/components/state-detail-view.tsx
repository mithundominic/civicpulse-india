// Shared detail view for both /states/[slug] and /union-territories/[slug] —
// the two routes are structurally identical, so this is built once
// (AGENTS.md Rule 6) and parameterized by the resolved row + kind.
import { MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { CardGrid } from "@/components/ui/card-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PoliticianCard } from "@/components/cards/politician-card";
import { ConstituencyCard } from "@/components/cards/constituency-card";
import type { StateRow, UnionTerritoryRow } from "../types";
import { getStateConstituencies, getStateMps } from "../queries";
import { CurrentLeadershipSection } from "./current-leadership-section";

interface StateDetailViewProps {
  place: StateRow | UnionTerritoryRow;
  kind: "State" | "Union Territory";
}

export async function StateDetailView({ place, kind }: StateDetailViewProps) {
  if (!place) notFound();
  const [constituencies, mps] = await Promise.all([getStateConstituencies(place.id), getStateMps(place.id)]);
  const basePath = kind === "State" ? "/states" : "/union-territories";

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: kind === "State" ? "States" : "Union Territories", href: basePath }, { label: place.name }]}
        title={place.name}
        description={
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> Capital: {place.capital ?? "—"}
          </span>
        }
      />

      <CurrentLeadershipSection placeId={place.id} />

      <Section title="Members of Parliament">
        <CardGrid
          items={mps}
          keyFn={(mp) => mp.house_membership_id!}
          columns="2-4"
          emptyIcon={Users}
          emptyTitle="No MPs on record for this state yet"
          renderItem={(mp) => (
            <PoliticianCard
              politician={{
                slug: mp.person_slug!,
                fullName: mp.full_name!,
                photoUrl: mp.photo_url,
                positionTitle: mp.house_name,
                partyAbbreviation: mp.party_abbreviation,
                constituencyName: mp.constituency_name,
              }}
            />
          )}
        />
      </Section>

      <Section title="Constituencies">
        <Card>
          <CardHeader>
            <CardTitle>Constituencies ({constituencies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <CardGrid
              items={constituencies}
              keyFn={(c) => c.id}
              emptyIcon={MapPin}
              emptyTitle="No constituencies on record yet"
              renderItem={(c) => (
                <ConstituencyCard
                  constituency={{
                    slug: c.slug,
                    name: c.name,
                    constituencyType: c.constituency_type,
                    stateOrUtName: place.name,
                    reservedCategory: c.reserved_category,
                    currentRepresentativeName: null,
                  }}
                />
              )}
            />
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
