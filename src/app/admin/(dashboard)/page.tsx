// Admin dashboard overview — see docs/design/reference/admin_dashboard_civicpulse_india.
import type { Metadata } from "next";
import { Users, Flag, MapPin, Inbox, History } from "lucide-react";
import { getAdminDashboardStats, getRecentAuditLogs } from "@/features/admin/queries";
import { StatCard } from "@/components/cards/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format/date";

export const metadata: Metadata = { title: "Admin Overview" };
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [stats, auditLogs] = await Promise.all([getAdminDashboardStats(), getRecentAuditLogs()]);

  return (
    <div>
      <PageHeader size="compact" title="System Overview" description="Institutional Data Health & Metrics" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Politicians" value={stats.politicians} href="/admin/politicians" />
        <StatCard icon={Flag} label="Active Parties" value={stats.parties} href="/admin/parties" />
        <StatCard icon={MapPin} label="Constituencies" value={stats.constituencies} />
        <StatCard
          icon={Inbox}
          label="Pending Corrections"
          value={stats.pendingCorrections}
          href="/admin/corrections"
          className={stats.pendingCorrections > 0 ? "border-warning/40" : undefined}
        />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-4 w-4 text-accent" /> Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            {auditLogs.length === 0 ? (
              <EmptyState icon={History} title="No audit activity yet" description="Actions taken in the admin dashboard will appear here." />
            ) : (
              <ol className="flex flex-col gap-3">
                {auditLogs.map((log) => (
                  <li key={log.id} className="flex items-start justify-between gap-4 border-b border-border pb-3 text-sm last:border-0">
                    <div>
                      <span className="font-medium">{log.action}</span>
                      {log.entity_type && <span className="text-muted-foreground"> · {log.entity_type}</span>}
                      {log.notes && <p className="text-muted-foreground">{log.notes}</p>}
                    </div>
                    <span className="shrink-0 font-data text-xs text-muted-foreground">{formatDate(log.created_at, "d MMM, HH:mm")}</span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
