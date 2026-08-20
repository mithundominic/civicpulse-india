// Public "Data & Sources" page — lists every source this platform cites.
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { listActiveSources } from "@/features/sources/queries";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { SOURCE_TYPE_LABELS } from "@/lib/constants/labels";

export const metadata: Metadata = { title: "Data & Sources" };
export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const sources = await listActiveSources();

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Data & Sources" }]}
        title="Data & Sources"
        description={
          <>
            Every fact on CivicPulse India is traceable to one of the sources below. See{" "}
            <a href="/methodology" className="text-accent hover:underline">our methodology</a> for how we use them.
          </>
        }
      />

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead className="text-right">Website</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((source) => (
              <TableRow key={source.id}>
                <TableCell className="font-medium">{source.name}</TableCell>
                <TableCell className="text-muted-foreground">{SOURCE_TYPE_LABELS[source.source_type]}</TableCell>
                <TableCell className="text-muted-foreground">{source.organization ?? "—"}</TableCell>
                <TableCell className="text-right">
                  {source.base_url && (
                    <a
                      href={source.base_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:underline"
                    >
                      Visit <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}
