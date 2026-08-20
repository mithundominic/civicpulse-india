import type { Metadata } from "next";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} title="Terms of Service" />
      <div className="flex flex-col gap-4 text-muted-foreground">
        <p>
          CivicPulse India is provided as a public-interest information resource. Content is compiled from
          official public sources and is provided &quot;as is&quot; without warranty of completeness or
          real-time accuracy — always verify time-sensitive facts against the cited primary source.
        </p>
        <p>
          You may cite, link to, and share content from this site for non-commercial and journalistic purposes
          with attribution. Bulk scraping or republishing of the full dataset requires permission.
        </p>
        <p>
          This platform does not endorse, rank, or express opinions about any politician or political party.
        </p>
      </div>
    </PageContainer>
  );
}
