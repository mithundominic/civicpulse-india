// Party detail page — hero + tabbed sections. See
// docs/design/reference/bjp_party_detail_civicpulse_india for the hero
// pattern; tab content follows docs/PRD.md Party Detail spec.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Flag } from "lucide-react";
import { getPartyBySlug } from "@/features/parties/queries";
import { EntityHero } from "@/components/cards/entity-hero";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageContainer } from "@/components/ui/page-container";
import { SourceAttribution } from "@/components/ui/source-attribution";
import { TabSection } from "@/components/ui/tab-section";
import { RECOGNITION_LABELS } from "@/lib/constants/labels";
import { CorrectionLink } from "@/features/corrections/components/correction-link";
import { PartyOverviewTab } from "@/features/parties/components/party-overview-tab";
import { PartyLeadershipTab } from "@/features/parties/components/party-leadership-tab";
import { PartyRepresentativesTab } from "@/features/parties/components/party-representatives-tab";
import { PartyElectionHistoryTab } from "@/features/parties/components/party-election-history-tab";

export const dynamic = "force-dynamic";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "leadership", label: "Leadership" },
  { value: "representatives", label: "Representatives" },
  { value: "elections", label: "Election History" },
];

export async function generateMetadata(props: PageProps<"/parties/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const party = await getPartyBySlug(slug);
  return { title: party?.name ?? "Party not found" };
}

export default async function PartyDetailPage(props: PageProps<"/parties/[slug]">) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const activeTab = typeof searchParams.tab === "string" ? searchParams.tab : "overview";

  const party = await getPartyBySlug(slug);
  if (!party || !party.party_id) notFound();

  return (
    <PageContainer>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Parties", href: "/parties" }, { label: party.name! }]}
        className="mb-4"
      />

      <EntityHero
        image={
          party.logo_url ? (
            <Image
              src={party.logo_url}
              alt={`${party.name} symbol`}
              width={112}
              height={112}
              className="h-full w-full object-contain p-4"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Flag className="h-10 w-10 text-muted-foreground" />
            </div>
          )
        }
        title={`${party.name}${party.abbreviation ? ` (${party.abbreviation})` : ""}`}
        badges={
          <>
            {party.current_recognition_type && (
              <Badge variant="outline">{RECOGNITION_LABELS[party.current_recognition_type]}</Badge>
            )}
          </>
        }
        metaRows={
          <CorrectionLink
            entityType="POLITICAL_PARTY"
            entityId={party.party_id}
            entityLabel={party.name ?? "this party"}
          />
        }
        sidePanel={<SourceAttribution sourceName="Party & ECI records" className="justify-end" />}
      />

      <TabSection tabs={TABS} activeValue={activeTab} basePath={`/parties/${slug}`}>
        {activeTab === "overview" && <PartyOverviewTab partyId={party.party_id} />}
        {activeTab === "leadership" && <PartyLeadershipTab partyId={party.party_id} />}
        {activeTab === "representatives" && <PartyRepresentativesTab partyId={party.party_id} />}
        {activeTab === "elections" && <PartyElectionHistoryTab partyId={party.party_id} />}
      </TabSection>
    </PageContainer>
  );
}
