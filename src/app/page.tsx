// Homepage — see docs/design/reference/homepage_civicpulse_india_1. The hero
// section is intentionally a one-off, full-bleed treatment (not reused
// anywhere else), so it stays page-local rather than forcing PageHeader.
import { Map, Globe, Landmark, Users, Flag, type LucideIcon } from "lucide-react";
import { getHomepageStats } from "@/features/home/queries";
import { SearchBar } from "@/components/search/search-bar";
import { StatCard } from "@/components/cards/stat-card";
import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function PartyCategoryCard({
  icon: Icon,
  title,
  description,
  href,
  linkLabel,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-2 p-6">
        <Icon className="h-6 w-6 text-accent" />
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button href={href} variant="link" size="sm" className="px-0">
          {linkLabel} →
        </Button>
      </CardContent>
    </Card>
  );
}

export default async function HomePage() {
  const stats = await getHomepageStats();

  return (
    <div>
      <section className="border-b border-border bg-muted/40 px-4 py-16 text-center sm:px-6">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          India&apos;s Political Information
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Explore politicians, parties, governments, constituencies and elections.
        </p>
        <div className="mx-auto mt-8 max-w-xl">
          <SearchBar size="lg" />
        </div>
      </section>

      <div className="mx-auto max-w-(--container-page) px-4 sm:px-6">
        <Section title="Explore India" spacing="tight" className="pt-12">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Map} label="States" value={stats.states} description="Explore political data across India's states." href="/states" />
            <StatCard icon={Globe} label="Union Territories" value={stats.unionTerritories} description="Federally administered territories." href="/states" />
            <StatCard icon={Landmark} label="Lok Sabha Constituencies" value={stats.lokSabhaSeats} description="Lower house parliamentary seats." href="/parliament/lok-sabha" />
            <StatCard icon={Users} label="Assembly Constituencies" value={stats.assemblySeats} description="State-level legislative seats." href="/constituencies" />
          </div>
        </Section>

        <Section title="Political Parties" className="pb-16">
          <div className="grid gap-4 sm:grid-cols-3">
            <PartyCategoryCard
              icon={Flag}
              title="National Parties"
              description="Recognized parties with significant presence across multiple states."
              href="/parties?recognition=NATIONAL"
              linkLabel={`View ${stats.nationalParties} Parties`}
            />
            <PartyCategoryCard
              icon={Flag}
              title="State Parties"
              description="Recognized parties with significant presence in specific states."
              href="/parties?recognition=STATE"
              linkLabel={`View ${stats.stateParties} Parties`}
            />
            <PartyCategoryCard
              icon={Flag}
              title="Registered Unrecognised"
              description="Newly formed or without sufficient vote share for recognition."
              href="/parties?recognition=REGISTERED_UNRECOGNISED"
              linkLabel="View Directory"
            />
          </div>
        </Section>
      </div>
    </div>
  );
}
