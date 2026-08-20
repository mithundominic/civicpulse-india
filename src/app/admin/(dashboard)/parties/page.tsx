// Admin parties list — read-only in this build; see README "Known gaps".
import type { Metadata } from "next";
import { listAllPartiesForAdmin } from "@/features/admin/queries";
import { PageHeader } from "@/components/ui/page-header";
import { AdminEntityTable } from "@/features/admin/components/admin-entity-table";
import { RECOGNITION_LABELS } from "@/lib/constants/labels";

export const metadata: Metadata = { title: "Admin — Parties" };
export const dynamic = "force-dynamic";

export default async function AdminPartiesPage() {
  const parties = await listAllPartiesForAdmin();

  return (
    <div>
      <PageHeader size="compact" title="Parties" description={`${parties.length} records`} />
      <AdminEntityTable
        items={parties}
        keyFn={(p) => p.party_id!}
        viewHref={(p) => `/parties/${p.slug}`}
        columns={[
          { header: "Name", render: (p) => <span className="font-medium">{p.name}</span> },
          { header: "Recognition", render: (p) => (p.current_recognition_type ? RECOGNITION_LABELS[p.current_recognition_type] : "—") },
          { header: "President", render: (p) => p.current_president_name ?? "—" },
        ]}
      />
    </div>
  );
}
