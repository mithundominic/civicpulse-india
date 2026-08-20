// Public correction-submission page — linked from every entity detail page's
// CorrectionLink. A dedicated page rather than a modal keeps this shareable
// and JS-independent for the initial render.
import type { Metadata } from "next";
import { PageContainer } from "@/components/ui/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CorrectionForm } from "@/features/corrections/components/correction-form";
import type { EntityType } from "@/types/domain";

export const metadata: Metadata = { title: "Report a Correction" };

const VALID_ENTITY_TYPES = new Set<EntityType>([
  "PERSON", "POLITICIAN", "POLITICAL_PARTY", "CONSTITUENCY", "ELECTION",
  "ELECTION_CANDIDATE", "GOVERNMENT", "MINISTRY", "STATE", "UNION_TERRITORY", "DISTRICT", "HOUSE",
]);

export default async function ReportPage(props: PageProps<"/report">) {
  const searchParams = await props.searchParams;
  const entityType = String(searchParams.entityType || "");
  const entityId = String(searchParams.entityId || "");
  const label = String(searchParams.label || "this record");

  const isValid = VALID_ENTITY_TYPES.has(entityType as EntityType) && /^[0-9a-f-]{36}$/i.test(entityId);

  return (
    <PageContainer width="form">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Report a Correction" }]} className="mb-6" />
      <Card>
        <CardHeader>
          <CardTitle>Report a Correction</CardTitle>
          <CardDescription>
            {isValid
              ? `Suggest a correction for "${label}". Every submission is reviewed by our data team against a cited source before publishing.`
              : "This link is missing the record it refers to. Please go back to the page you were viewing and use its \u201cReport a correction\u201d link."}
          </CardDescription>
        </CardHeader>
        {isValid && (
          <CardContent>
            <CorrectionForm entityType={entityType as EntityType} entityId={entityId} />
          </CardContent>
        )}
      </Card>
    </PageContainer>
  );
}
