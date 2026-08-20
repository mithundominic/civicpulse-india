import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Union Territories" };

// The directory itself lives at /states (which lists both states and UTs
// together, matching the approved design's single "Explore India" section).
export default function UnionTerritoriesIndexPage() {
  redirect("/states");
}
