import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/features/states/queries";
import { StateDetailView } from "@/features/states/components/state-detail-view";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/states/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const state = await getStateBySlug(slug);
  return { title: state?.name ?? "State not found" };
}

export default async function StateDetailPage(props: PageProps<"/states/[slug]">) {
  const { slug } = await props.params;
  const state = await getStateBySlug(slug);
  if (!state) notFound();
  return <StateDetailView place={state} kind="State" />;
}
