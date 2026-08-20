// Shared dashboard view for Lok Sabha / Rajya Sabha — see
// docs/design/reference/lok_sabha_dashboard_civicpulse_india. Built once and
// parameterized (AGENTS.md Rule 6) since both houses render identically.
import { notFound } from "next/navigation";
import { Users, Landmark } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { CardGrid } from "@/components/ui/card-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/cards/stat-card";
import { PoliticianCard } from "@/components/cards/politician-card";
import { SeatDistributionDonut } from "@/components/charts/seat-distribution-donut";
import { EmptyState } from "@/components/ui/empty-state";
import { getHouseByType, getHouseMembers, getHousePartyDistribution } from "../queries";
import { StateWiseRepresentationTable } from "./state-wise-representation-table";
import type { Enums } from "@/lib/database/types";

const CHART_COLORS = ["#0F172A", "#0EA5E9", "#334155", "#64748B", "#94A3B8", "#CBD5E1"];

export async function HouseDashboardView({ houseType, title }: { houseType: Enums<"house_type">; title: string }) {
  const house = await getHouseByType(houseType);
  if (!house) notFound();

  const [members, distribution] = await Promise.all([
    getHouseMembers(house.id),
    getHousePartyDistribution(house.id),
  ]);

  const women = 0; // Gender isn't tracked on the house-membership row itself yet — see README "Known gaps".

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Elections", href: "/elections" }, { label: title }]}
        title={`${title} Analytics Console`}
        description="Current Composition and Legislative Overview"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard icon={Landmark} label="Total Seats" value={house.total_seats ?? members.length} />
        <StatCard label="Filled Seats" value={members.length} description={house.total_seats ? `of ${house.total_seats}` : undefined} />
        {women > 0 && <StatCard icon={Users} label="Women Members" value={women} />}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Party Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {distribution.length === 0 ? (
              <EmptyState icon={Users} title="No members on record yet" />
            ) : (
              <SeatDistributionDonut
                totalLabel="Total Members"
                data={distribution.map((d, i) => ({ ...d, color: CHART_COLORS[i % CHART_COLORS.length] }))}
              />
            )}
          </CardContent>
        </Card>

        <StateWiseRepresentationTable houseId={house.id} />
      </div>

      <Section title="Member Directory">
        <CardGrid
          items={members.slice(0, 12)}
          keyFn={(member) => member.house_membership_id!}
          columns="2-4"
          emptyIcon={Users}
          emptyTitle="No members on record yet"
          renderItem={(member) => (
            <PoliticianCard
              politician={{
                slug: member.person_slug!,
                fullName: member.full_name!,
                photoUrl: member.photo_url,
                positionTitle: title,
                partyAbbreviation: member.party_abbreviation,
                constituencyName: member.constituency_name,
              }}
            />
          )}
        />
      </Section>
    </PageContainer>
  );
}
