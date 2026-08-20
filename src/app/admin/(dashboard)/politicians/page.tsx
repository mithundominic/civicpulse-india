// Admin politicians list — read-only in this build; see README "Known gaps"
// for the create/edit forms this would grow into.
import type { Metadata } from "next";
import { listAllPoliticiansForAdmin } from "@/features/admin/queries";
import { PageHeader } from "@/components/ui/page-header";
import { AdminEntityTable } from "@/features/admin/components/admin-entity-table";

export const metadata: Metadata = { title: "Admin — Politicians" };
export const dynamic = "force-dynamic";

export default async function AdminPoliticiansPage() {
  const politicians = await listAllPoliticiansForAdmin();

  return (
    <div>
      <PageHeader size="compact" title="Politicians" description={`${politicians.length} records`} />
      <AdminEntityTable
        items={politicians}
        keyFn={(p) => p.politician_id!}
        viewHref={(p) => `/politicians/${p.slug}`}
        columns={[
          { header: "Name", render: (p) => <span className="font-medium">{p.full_name}</span> },
          { header: "Current Party", render: (p) => p.current_party_abbreviation ?? "—" },
          { header: "Position", render: (p) => p.current_position_title ?? "—" },
          { header: "Status", render: (p) => p.status },
        ]}
      />
    </div>
  );
}
