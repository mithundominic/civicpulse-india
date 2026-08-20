import type { Metadata } from "next";
import { Landmark, Building2, type LucideIcon } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Government" };

function GovernmentLinkCard({
  icon: Icon,
  title,
  description,
  href,
  label,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-3 p-6">
        <Icon className="h-6 w-6 text-accent" />
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button href={href} variant="outline" size="sm">{label}</Button>
      </CardContent>
    </Card>
  );
}

export default function GovernmentIndexPage() {
  return (
    <PageContainer>
      <PageHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "Government" }]} title="Government" />
      <div className="grid gap-4 sm:grid-cols-2">
        <GovernmentLinkCard
          icon={Landmark}
          title="Union Government"
          description="Prime Minister, Council of Ministers, and the governing coalition."
          href="/government/union"
          label="View Union Government"
        />
        <GovernmentLinkCard
          icon={Building2}
          title="State Governments"
          description="Chief Ministers, Governors, and cabinets — open a state to see its Government tab."
          href="/states"
          label="Browse States"
        />
      </div>
    </PageContainer>
  );
}
