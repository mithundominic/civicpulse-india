import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUnionTerritoryBySlug } from "@/features/states/queries";
import { StateDetailView } from "@/features/states/components/state-detail-view";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/union-territories/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const ut = await getUnionTerritoryBySlug(slug);
  return { title: ut?.name ?? "Union Territory not found" };
}

export default async function UnionTerritoryDetailPage(props: PageProps<"/union-territories/[slug]">) {
  const { slug } = await props.params;
  const ut = await getUnionTerritoryBySlug(slug);
  if (!ut) notFound();
  return <StateDetailView place={ut} kind="Union Territory" />;
}
