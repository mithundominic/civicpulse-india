import type { Metadata } from "next";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} title="Privacy Policy" />
      <div className="flex flex-col gap-4 text-muted-foreground">
        <p>
          CivicPulse India&apos;s public directory and profile pages require no account and collect no personal
          data about visitors beyond standard, anonymized web server logs.
        </p>
        <p>
          If you submit a correction, we store the information you provide (and your name/email if you choose
          to share them) solely to review and follow up on that submission.
        </p>
        <p>
          Political and biographical data published on profile pages concerns public figures in their public
          capacity and is compiled from official public records, as described in our{" "}
          <a href="/methodology" className="text-accent hover:underline">Data Methodology</a>.
        </p>
      </div>
    </PageContainer>
  );
}
