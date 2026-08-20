import type { Metadata } from "next";
import { HouseDashboardView } from "@/features/parliament/components/house-dashboard-view";

export const metadata: Metadata = { title: "Rajya Sabha" };
export const dynamic = "force-dynamic";

export default function RajyaSabhaPage() {
  return <HouseDashboardView houseType="RAJYA_SABHA" title="Rajya Sabha" />;
}
