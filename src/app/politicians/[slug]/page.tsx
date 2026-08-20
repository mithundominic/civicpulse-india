// Politician profile page — hero + tabbed sections. See
// docs/design/reference/politician_profile_civicpulse_india_1.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { User, Landmark, Users, MapPin } from "lucide-react";
import { getPoliticianBySlug } from "@/features/politicians/queries";
import { EntityHero } from "@/components/cards/entity-hero";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageContainer } from "@/components/ui/page-container";
import { TabSection } from "@/components/ui/tab-section";
import { CorrectionLink } from "@/features/corrections/components/correction-link";
import { PoliticianOverviewTab } from "@/features/politicians/components/politician-overview-tab";
import { PoliticianCareerTab } from "@/features/politicians/components/politician-career-tab";
import { PoliticianElectionsTab } from "@/features/politicians/components/politician-elections-tab";

export const dynamic = "force-dynamic";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "career", label: "Political Career" },
  { value: "elections", label: "Election History" },
];

export async function generateMetadata(props: PageProps<"/politicians/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const politician = await getPoliticianBySlug(slug);
  return { title: politician?.full_name ?? "Politician not found" };
}

export default async function PoliticianDetailPage(props: PageProps<"/politicians/[slug]">) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const activeTab = typeof searchParams.tab === "string" ? searchParams.tab : "overview";

  const politician = await getPoliticianBySlug(slug);
  if (!politician || !politician.politician_id) notFound();

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Politicians", href: "/politicians" },
          { label: politician.full_name! },
        ]}
        className="mb-4"
      />

      <EntityHero
        image={
          politician.photo_url ? (
            <Image src={politician.photo_url} alt={politician.full_name!} width={112} height={112} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
          )
        }
        title={politician.full_name!}
        badges={politician.status === "ACTIVE" && <Badge variant="success">Active</Badge>}
        metaRows={
          <>
            {politician.current_position_title && (
              <span className="flex items-center gap-1.5">
                <Landmark className="h-3.5 w-3.5" /> {politician.current_position_title}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {politician.current_party_name ?? "Independent / Unaffiliated"}
            </span>
            {politician.current_constituency_name && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Constituency: {politician.current_constituency_name}
              </span>
            )}
            <CorrectionLink
              entityType="POLITICIAN"
              entityId={politician.politician_id}
              entityLabel={politician.full_name ?? "this politician"}
            />
          </>
        }
      />

      <TabSection tabs={TABS} activeValue={activeTab} basePath={`/politicians/${slug}`}>
        {activeTab === "overview" && <PoliticianOverviewTab politicianId={politician.politician_id} />}
        {activeTab === "career" && <PoliticianCareerTab politicianId={politician.politician_id} />}
        {activeTab === "elections" && <PoliticianElectionsTab politicianId={politician.politician_id} />}
      </TabSection>
    </PageContainer>
  );
}
