// Politician comparison — see docs/design/reference/compare_politicians_civicpulse_india.
import type { Metadata } from "next";
import { Users } from "lucide-react";
import { listPoliticianNamesForCompare, getPoliticianCompareProfile } from "@/features/compare/queries";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { CompareSelector } from "@/features/compare/components/compare-selector";
import { ComparePanel } from "@/features/compare/components/compare-panel";

export const metadata: Metadata = { title: "Compare Politicians" };
export const dynamic = "force-dynamic";

async function findBySlugOrName(names: { full_name: string; slug: string }[], query: string) {
  const bySlug = names.find((n) => n.slug === query);
  const byName = names.find((n) => n.full_name.toLowerCase() === query.toLowerCase());
  const slug = bySlug?.slug ?? byName?.slug;
  return slug ? getPoliticianCompareProfile(slug) : null;
}

export default async function ComparePoliticiansPage(props: PageProps<"/compare/politicians">) {
  const searchParams = await props.searchParams;
  const a = typeof searchParams.a === "string" ? searchParams.a : undefined;
  const b = typeof searchParams.b === "string" ? searchParams.b : undefined;

  const names = await listPoliticianNamesForCompare();
  const [profileA, profileB] = await Promise.all([
    a ? findBySlugOrName(names, a) : null,
    b ? findBySlugOrName(names, b) : null,
  ]);

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Politicians", href: "/politicians" }, { label: "Compare" }]}
        title="Politician Comparison"
        description="Analyze factual records, legislative history, and electoral performance of political figures side-by-side. Data is sourced from official legislative archives and electoral commissions."
      />

      <CompareSelector names={names} defaultA={a} defaultB={b} />

      <div className="mt-8">
        {!profileA && !profileB ? (
          <EmptyState icon={Users} title="Choose two politicians to compare" description="Start typing a name in either box above." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {profileA ? <ComparePanel profile={profileA} /> : <EmptyState icon={Users} title={`"${a}" not found`} />}
            {profileB ? <ComparePanel profile={profileB} /> : <EmptyState icon={Users} title={`"${b}" not found`} />}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
