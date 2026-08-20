import type { Metadata } from "next";
import { HouseDashboardView } from "@/features/parliament/components/house-dashboard-view";

export const metadata: Metadata = { title: "Lok Sabha" };
export const dynamic = "force-dynamic";

export default function LokSabhaPage() {
  return <HouseDashboardView houseType="LOK_SABHA" title="Lok Sabha" />;
}
