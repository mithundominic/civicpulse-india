// Politician directory — see docs/design/reference/politician_directory_civicpulse_india_1.
import type { Metadata } from "next";
import { Users } from "lucide-react";
import { listPoliticians } from "@/features/politicians/queries";
import { PAGE_SIZE } from "@/features/politicians/types";
import { PoliticianCard } from "@/components/cards/politician-card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { CardGrid } from "@/components/ui/card-grid";
import { SourceAttribution } from "@/components/ui/source-attribution";
import { PoliticianFilterBar } from "@/features/politicians/components/politician-filter-bar";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = { title: "Politician Directory" };
export const dynamic = "force-dynamic";

export default async function PoliticiansPage(props: PageProps<"/politicians">) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const partyAbbreviation = typeof searchParams.party === "string" ? searchParams.party : undefined;
  const houseType = typeof searchParams.house === "string" ? searchParams.house : undefined;
  const page = Number(searchParams.page) || 1;

  const { politicians, total } = await listPoliticians({ query, partyAbbreviation, houseType, page });

  return (
    <PageContainer>
      <PageHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "Politicians" }]} title="Politician Directory" />

      <PoliticianFilterBar defaultQuery={query} defaultParty={partyAbbreviation} defaultHouse={houseType} />

      <div className="mt-6">
        <CardGrid
          items={politicians}
          keyFn={(p) => p.politician_id!}
          columns="2-4"
          emptyIcon={Users}
          emptyTitle="No politicians match these filters"
          emptyDescription="Try adjusting your search or filters."
          renderItem={(p) => (
            <PoliticianCard
              politician={{
                slug: p.slug!,
                fullName: p.full_name!,
                photoUrl: p.photo_url,
                positionTitle: p.current_position_title ?? p.current_house_name,
                partyAbbreviation: p.current_party_abbreviation,
                constituencyName: p.current_constituency_name,
              }}
            />
          )}
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/politicians" searchParams={searchParams} />
        <SourceAttribution sourceName="Election Commission of India" />
      </div>
    </PageContainer>
  );
}
