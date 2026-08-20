// Election directory — see docs/design/reference/election_directory_civicpulse_india.
import type { Metadata } from "next";
import { Vote } from "lucide-react";
import { listElections } from "@/features/elections/queries";
import { ElectionCard } from "@/components/cards/election-card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { CardGrid } from "@/components/ui/card-grid";
import type { ElectionRow } from "@/features/elections/types";

export const metadata: Metadata = { title: "Election Directory" };
export const dynamic = "force-dynamic";

function renderElectionCard(e: ElectionRow) {
  return (
    <ElectionCard
      election={{ slug: e.slug, name: e.name, status: e.status, startDate: e.start_date, endDate: e.end_date, totalSeats: e.total_seats }}
    />
  );
}

export default async function ElectionsPage() {
  const { lokSabha, assembly, other } = await listElections();

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Elections" }]}
        title="Election Directory"
        description="Comprehensive archive of Indian elections, categorized by legislative body."
      />

      <Section title="Lok Sabha (General Elections)" spacing="tight">
        <CardGrid
          items={lokSabha}
          keyFn={(e) => e.id}
          emptyIcon={Vote}
          emptyTitle="No Lok Sabha elections on record yet"
          renderItem={renderElectionCard}
        />
      </Section>

      {assembly.length > 0 && (
        <Section title="State Assembly Elections">
          <CardGrid items={assembly} keyFn={(e) => e.id} emptyIcon={Vote} emptyTitle="" renderItem={renderElectionCard} />
        </Section>
      )}

      {other.length > 0 && (
        <Section title="Other Elections">
          <CardGrid items={other} keyFn={(e) => e.id} emptyIcon={Vote} emptyTitle="" renderItem={renderElectionCard} />
        </Section>
      )}
    </PageContainer>
  );
}
