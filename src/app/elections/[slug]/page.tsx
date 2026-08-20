// Election results page — see docs/design/reference/2024_general_election_results.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getElectionBySlug } from "@/features/elections/queries";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { SourceAttribution } from "@/components/ui/source-attribution";
import { ELECTION_STATUS_LABELS } from "@/lib/constants/labels";
import { Badge } from "@/components/ui/badge";
import { ElectionSummaryStats } from "@/features/elections/components/election-summary-stats";
import { PartySeatsBreakdown } from "@/features/elections/components/party-seats-breakdown";
import { ConstituencyResultsSearch } from "@/features/elections/components/constituency-results-search";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/elections/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const election = await getElectionBySlug(slug);
  return { title: election?.name ?? "Election not found" };
}

export default async function ElectionDetailPage(props: PageProps<"/elections/[slug]">) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;

  const election = await getElectionBySlug(slug);
  if (!election) notFound();

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Elections", href: "/elections" }, { label: election.name }]}
        title={election.name}
        titleSuffix={<Badge variant="outline">{ELECTION_STATUS_LABELS[election.status]}</Badge>}
        description={
          election.total_seats ? `Final tabulation of ${election.total_seats} Parliamentary Constituencies.` : undefined
        }
      />

      <ElectionSummaryStats election={election} />

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Seats by Party</CardTitle>
          </CardHeader>
          <CardContent>
            <PartySeatsBreakdown electionId={election.id} totalSeats={election.total_seats} />
          </CardContent>
          <CardFooter>
            <SourceAttribution sourceName="Election Commission of India" />
          </CardFooter>
        </Card>
      </div>

      <Section title="Constituency Results">
        <ConstituencyResultsSearch electionId={election.id} slug={slug} query={query} />
      </Section>
    </PageContainer>
  );
}
