// Constituency detail page — see docs/design/reference/varanasi_constituency_civicpulse_india.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getConstituencyBySlug } from "@/features/constituencies/queries";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CorrectionLink } from "@/features/corrections/components/correction-link";
import { CurrentRepresentativeCard } from "@/features/constituencies/components/current-representative-card";
import { ConstituencyResultsTable } from "@/features/constituencies/components/constituency-results-table";
import { HOUSE_TYPE_LABELS } from "@/lib/constants/labels";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/constituencies/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const constituency = await getConstituencyBySlug(slug);
  return { title: constituency?.name ?? "Constituency not found" };
}

export default async function ConstituencyDetailPage(props: PageProps<"/constituencies/[slug]">) {
  const { slug } = await props.params;
  const constituency = await getConstituencyBySlug(slug);
  if (!constituency) notFound();

  const placeName = constituency.states?.name ?? constituency.union_territories?.name ?? "";
  const houseLabel = constituency.constituency_type === "LOK_SABHA" ? HOUSE_TYPE_LABELS.LOK_SABHA : "Assembly";

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: placeName, href: constituency.states ? `/states/${constituency.states.slug}` : `/union-territories/${constituency.union_territories?.slug}` },
          { label: constituency.name },
        ]}
        title={constituency.name}
        description={
          <>
            {houseLabel} Parliamentary Constituency
            {constituency.number && ` (Constituency No. ${constituency.number})`} located in {placeName}.
            {constituency.reserved_category !== "GENERAL" && (
              <> Reserved for <Badge variant="outline" className="ml-1">{constituency.reserved_category}</Badge>.</>
            )}
            <div className="mt-2">
              <CorrectionLink entityType="CONSTITUENCY" entityId={constituency.id} entityLabel={constituency.name} />
            </div>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CurrentRepresentativeCard constituencyId={constituency.id} />
        <Card>
          <CardHeader>
            <CardTitle>Constituency Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Total Electors</dt>
                <dd className="font-data font-semibold">{constituency.total_electors?.toLocaleString("en-IN") ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Reserved Category</dt>
                <dd className="font-semibold">{constituency.reserved_category}</dd>
              </div>
              {constituency.districts && (
                <div>
                  <dt className="text-muted-foreground">District</dt>
                  <dd className="font-semibold">{constituency.districts.name}</dd>
                </div>
              )}
              {constituency.delimitation_year && (
                <div>
                  <dt className="text-muted-foreground">Delimitation Year</dt>
                  <dd className="font-data font-semibold">{constituency.delimitation_year}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      <Section title="Election Results">
        <ConstituencyResultsTable constituencyId={constituency.id} />
      </Section>
    </PageContainer>
  );
}
