// Guarded admin shell — requireAdmin() here is the real authorization check
// (proxy only gated the path). Every page under this route group is an
// admin page by construction (AGENTS.md Rule 13).
import { requireAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminDashboardLayout(props: LayoutProps<"/admin">) {
  await requireAdmin();

  return (
    <div className="mx-auto flex max-w-(--container-page)">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-6">{props.children}</div>
    </div>
  );
}
