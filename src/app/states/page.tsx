// States & Union Territories directory.
import type { Metadata } from "next";
import { Map } from "lucide-react";
import { listStates, listUnionTerritories } from "@/features/states/queries";
import { StateCard } from "@/components/cards/state-card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { CardGrid } from "@/components/ui/card-grid";

export const metadata: Metadata = { title: "States & Union Territories" };
export const dynamic = "force-dynamic";

export default async function StatesPage() {
  const [states, uts] = await Promise.all([listStates(), listUnionTerritories()]);

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "States" }]}
        title="States & Union Territories"
        description={`${states.length} states and ${uts.length} union territories that make up the Republic of India.`}
      />

      <Section title="States" spacing="tight">
        <CardGrid
          items={states}
          keyFn={(s) => s.id}
          columns="3"
          emptyIcon={Map}
          emptyTitle="No states on record"
          renderItem={(state) => (
            <StateCard state={{ slug: state.slug, name: state.name, capital: state.capital, kind: "State" }} />
          )}
        />
      </Section>

      <Section title="Union Territories">
        <CardGrid
          items={uts}
          keyFn={(ut) => ut.id}
          columns="3"
          emptyIcon={Map}
          emptyTitle="No union territories on record"
          renderItem={(ut) => (
            <StateCard state={{ slug: ut.slug, name: ut.name, capital: ut.capital, kind: "Union Territory" }} />
          )}
        />
      </Section>
    </PageContainer>
  );
}
