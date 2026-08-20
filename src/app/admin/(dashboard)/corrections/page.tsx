// Admin corrections review queue.
import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import { listPendingCorrections } from "@/features/admin/queries";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CorrectionReviewRow } from "@/features/admin/components/correction-review-row";

export const metadata: Metadata = { title: "Admin — Corrections Queue" };
export const dynamic = "force-dynamic";

export default async function AdminCorrectionsPage() {
  const corrections = await listPendingCorrections();

  return (
    <div>
      <PageHeader size="compact" title="Corrections Queue" description={`${corrections.length} submissions`} />

      <Card>
        <CardContent className="p-5">
          {corrections.length === 0 ? (
            <EmptyState icon={Inbox} title="No corrections submitted yet" />
          ) : (
            corrections.map((correction) => <CorrectionReviewRow key={correction.id} correction={correction} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
