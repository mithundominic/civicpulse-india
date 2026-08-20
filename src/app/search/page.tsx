// Advanced/global search results page.
import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { searchEntities } from "@/features/search/queries";
import { SearchBar } from "@/components/search/search-bar";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Search" };
export const dynamic = "force-dynamic";

const ENTITY_LABEL: Record<string, string> = {
  politician: "Politician",
  party: "Party",
  constituency: "Constituency",
  state: "State",
};

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const results = query ? await searchEntities(query) : [];

  return (
    <PageContainer width="narrow">
      <PageHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]} title="Search CivicPulse India" />

      <SearchBar defaultValue={query} size="lg" />

      <div className="mt-8">
        {!query ? (
          <p className="text-sm text-muted-foreground">
            Search across politicians, parties, states, and constituencies.
          </p>
        ) : results.length === 0 ? (
          <EmptyState icon={SearchX} title={`No results for "${query}"`} description="Try a different spelling or a broader term." />
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              {results.length} result{results.length === 1 ? "" : "s"} for &quot;{query}&quot;
            </p>
            {results.map((result) => (
              <Card key={`${result.entity_type}-${result.entity_id}`}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-semibold">{result.title}</p>
                    <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{ENTITY_LABEL[result.entity_type ?? ""] ?? result.entity_type}</Badge>
                    <Button href={result.href} variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
