// Constituency directory — Lok Sabha / Assembly, filterable.
import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { listConstituencies } from "@/features/constituencies/queries";
import { PAGE_SIZE } from "@/features/constituencies/types";
import { ConstituencyCard } from "@/components/cards/constituency-card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { CardGrid } from "@/components/ui/card-grid";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export const metadata: Metadata = { title: "Constituencies" };
export const dynamic = "force-dynamic";

export default async function ConstituenciesPage(props: PageProps<"/constituencies">) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const constituencyType = typeof searchParams.type === "string" ? searchParams.type : undefined;
  const page = Number(searchParams.page) || 1;

  const { constituencies, total } = await listConstituencies({ query, constituencyType, page });

  return (
    <PageContainer>
      <PageHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "Constituencies" }]} title="Constituency Directory" />

      <form className="grid gap-3 sm:grid-cols-[1fr_auto]" action="/constituencies" method="GET">
        <Input name="q" defaultValue={query} placeholder="Search by constituency name..." />
        <Select name="type" defaultValue={constituencyType ?? ""} className="sm:w-56">
          <option value="">All Types</option>
          <option value="LOK_SABHA">Lok Sabha</option>
          <option value="ASSEMBLY">Assembly</option>
        </Select>
      </form>

      <div className="mt-6">
        <CardGrid
          items={constituencies}
          keyFn={(c) => c.id}
          emptyIcon={MapPin}
          emptyTitle="No constituencies match these filters"
          renderItem={(c) => (
            <ConstituencyCard
              constituency={{
                slug: c.slug,
                name: c.name,
                constituencyType: c.constituency_type,
                stateOrUtName: c.states?.name ?? c.union_territories?.name ?? null,
                reservedCategory: c.reserved_category,
                currentRepresentativeName: null,
              }}
            />
          )}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/constituencies" searchParams={searchParams} />
      </div>
    </PageContainer>
  );
}
