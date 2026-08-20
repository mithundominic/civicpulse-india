// Party directory — national parties grid + state parties table + RUPP link.
// See docs/design/reference/party_directory_civicpulse_india.
import type { Metadata } from "next";
import { Flag } from "lucide-react";
import {
  listNationalParties,
  listPartiesByRecognitionPaginated,
  getTotalPartyCount,
} from "@/features/parties/queries";
import { PartyCard } from "@/components/cards/party-card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { CardGrid } from "@/components/ui/card-grid";
import { PartyFilterBar } from "@/features/parties/components/party-filter-bar";
import { StatePartyTable } from "@/features/parties/components/state-party-table";

export const metadata: Metadata = { title: "Political Parties" };
export const dynamic = "force-dynamic";

export default async function PartiesPage(props: PageProps<"/parties">) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const recognitionType = typeof searchParams.recognition === "string" ? searchParams.recognition : undefined;
  const statePage = Number(searchParams.state_page) || 1;
  const ruppPage = Number(searchParams.rupp_page) || 1;

  const [national, statePaginated, ruppPaginated, total] = await Promise.all([
    recognitionType && recognitionType !== "NATIONAL" ? [] : listNationalParties(query),
    listPartiesByRecognitionPaginated("STATE", { query, page: statePage }),
    listPartiesByRecognitionPaginated("REGISTERED_UNRECOGNISED", { query, page: ruppPage }),
    getTotalPartyCount(),
  ]);

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Parties" }]}
        title="Political Parties"
        actions={
          <p className="font-data rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground">
            Total Registered: {total}
          </p>
        }
      />

      <PartyFilterBar defaultQuery={query} defaultRecognition={recognitionType} />

      {(!recognitionType || recognitionType === "NATIONAL") && (
        <Section title="National Parties" spacing="tight">
          <CardGrid
            items={national}
            keyFn={(party) => party.party_id!}
            emptyIcon={Flag}
            emptyTitle="No national parties found"
            renderItem={(party) => (
              <PartyCard
                party={{
                  slug: party.slug!,
                  name: party.name!,
                  abbreviation: party.abbreviation,
                  logoUrl: party.logo_url,
                  recognitionType: party.current_recognition_type,
                  presidentName: party.current_president_name,
                  foundedDate: party.founded_date,
                }}
              />
            )}
          />
        </Section>
      )}

      {(!recognitionType || recognitionType === "STATE") && (
        <Section title="State Parties">
          <StatePartyTable result={statePaginated} searchParams={searchParams} pageParam="state_page" />
        </Section>
      )}

      {(!recognitionType || recognitionType === "REGISTERED_UNRECOGNISED") && ruppPaginated.total > 0 && (
        <Section title="Registered Unrecognised Parties">
          <StatePartyTable result={ruppPaginated} searchParams={searchParams} pageParam="rupp_page" />
        </Section>
      )}
    </PageContainer>
  );
}
