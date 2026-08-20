// Wraps TabNav with its content spacing — this exact
// `<div className="mt-6"><TabNav/><div className="py-6">...</div></div>`
// shell was copy-pasted identically across the party and politician detail
// pages (a Rule 6 violation caught in review).
import { TabNav } from "./tab-nav";
import type { TabDefinition } from "@/types/domain";

interface TabSectionProps {
  tabs: TabDefinition[];
  activeValue: string;
  basePath: string;
  children: React.ReactNode;
}

export function TabSection({ tabs, activeValue, basePath, children }: TabSectionProps) {
  return (
    <div className="mt-6">
      <TabNav tabs={tabs} activeValue={activeValue} basePath={basePath} />
      <div className="py-6">{children}</div>
    </div>
  );
}
