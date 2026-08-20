// Union Government page — PM, coalition composition, current ministers.
import type { Metadata } from "next";
import { Landmark, User, Users } from "lucide-react";
import { getCurrentUnionGovernment } from "@/features/government/queries";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { CardGrid } from "@/components/ui/card-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format/date";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Union Government" };
export const dynamic = "force-dynamic";

export default async function UnionGovernmentPage() {
  const result = await getCurrentUnionGovernment();

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Government" }]}
        title="Government of India"
        description={
          result &&
          `${result.government.term_number ? `${result.government.term_number}th Lok Sabha administration, ` : ""}formed ${formatDate(result.government.formed_date)}`
        }
      />

      {!result ? (
        <EmptyState icon={Landmark} title="No current Union government on record yet" />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4 text-accent" /> Prime Minister
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.primeMinister ? (
                  <>
                    <p className="text-lg font-semibold">{result.primeMinister.full_name}</p>
                    <Button href={`/politicians/${result.primeMinister.person_slug}`} variant="outline" size="sm" className="mt-3">
                      View Profile
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Not yet on record.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" /> Governing Coalition
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.parties.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No coalition data on record yet.</p>
                ) : (
                  result.parties.map((p) => (
                    <Badge key={p.id} variant={p.role === "LEAD_PARTY" ? "default" : "outline"}>
                      {p.political_parties?.abbreviation ?? p.political_parties?.name}
                      {p.role === "LEAD_PARTY" && " (Lead)"}
                    </Badge>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Section title="Council of Ministers">
            <CardGrid
              items={result.ministers}
              keyFn={(m) => m.minister_assignment_id!}
              emptyIcon={Users}
              emptyTitle="No ministers on record yet"
              renderItem={(minister) => (
                <Card>
                  <CardContent className="p-5">
                    <p className="font-semibold">{minister.full_name}</p>
                    <p className="text-sm text-muted-foreground">{minister.ministry_name ?? "Minister"}</p>
                    {minister.portfolio_name && <p className="text-xs text-muted-foreground">{minister.portfolio_name}</p>}
                  </CardContent>
                </Card>
              )}
            />
          </Section>
        </>
      )}
    </PageContainer>
  );
}
