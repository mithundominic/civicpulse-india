import type { Metadata } from "next";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]} title="About CivicPulse India" />
      <div className="flex flex-col gap-4 text-muted-foreground">
        <p>
          CivicPulse India is an objective, source-verified information archive covering Indian politicians,
          political parties, constituencies, elections, and government composition. Every fact on this platform
          is traceable to a cited primary source — the Election Commission of India, Parliament, state
          legislatures, or official government and party records.
        </p>
        <p>
          We do not rank, score, or editorialize. Political affiliation, election results, and declared
          affidavit data are presented as reported, with allegations kept visually and textually distinct from
          verified facts.
        </p>
        <p>
          Found something that looks wrong? Every profile has a &quot;Report a correction&quot; link — corrections
          are reviewed by our data team against a cited source before publishing.
        </p>
        <h2 id="contact" className="mt-4 text-lg font-semibold text-foreground">Contact</h2>
        <p>For data corrections, partnerships, or press inquiries, reach us via the correction form on any entity page.</p>
      </div>
    </PageContainer>
  );
}
