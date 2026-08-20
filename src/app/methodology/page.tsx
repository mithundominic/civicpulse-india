import type { Metadata } from "next";
import { ShieldCheck, GitBranch, ScanSearch, Scale } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Data Methodology" };

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Source First",
    body: "Every fact links back to a cited source record — an ECI order, a Parliament document, an official gazette notification, or a party's own filing. Nothing is published without one.",
  },
  {
    icon: GitBranch,
    title: "History Is Never Overwritten",
    body: "Party membership, elected positions, and government composition are modeled with effective_from/effective_to date ranges. A change in party or office creates a new record; it never replaces the old one.",
  },
  {
    icon: Scale,
    title: "Political Neutrality",
    body: "We don't rank or score politicians or parties. Verification-status labels (Verified, Pending Review, Unverified) describe our confidence in a fact's sourcing, never an editorial judgment.",
  },
  {
    icon: ScanSearch,
    title: "Community Corrections",
    body: "Anyone can flag a possible error from any profile page. Every submission is reviewed by our data team against a cited source before it's accepted.",
  },
];

export default function MethodologyPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "Data Methodology" }]} title="Data Methodology" />
      <div className="flex flex-col gap-4">
        {PRINCIPLES.map((p) => (
          <Card key={p.title}>
            <CardContent className="flex gap-4 p-5">
              <p.icon className="h-5 w-5 shrink-0 text-accent" />
              <div>
                <h2 className="font-semibold">{p.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
