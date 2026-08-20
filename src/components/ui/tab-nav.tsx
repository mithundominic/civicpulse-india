// Server-rendered tab navigation driven entirely by a URL search param — no
// client-side state. Deep-linkable and shareable, consistent with AGENTS.md
// Rule 10 ("tabs on a directory/detail page -> URL search params").
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TabDefinition } from "@/types/domain";

interface TabNavProps {
  tabs: TabDefinition[];
  activeValue: string;
  basePath: string;
  paramName?: string;
}

export function TabNav({ tabs, activeValue, basePath, paramName = "tab" }: TabNavProps) {
  return (
    <nav className="flex gap-6 overflow-x-auto border-b border-border">
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;
        const href = tab.value === tabs[0].value ? basePath : `${basePath}?${paramName}=${tab.value}`;
        return (
          <Link
            key={tab.value}
            href={href}
            className={cn(
              "whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors",
              isActive
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
