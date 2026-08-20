"use client";

// Admin dashboard sidebar — see docs/design/reference/admin_dashboard_civicpulse_india.
// A Client Component solely so usePathname() can drive active-link styling
// accurately across every /admin/* subpage — the sidebar itself does no
// data fetching (AGENTS.md Rule 9).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, Flag, MapPin, Inbox } from "lucide-react";
import { ADMIN_NAV } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";

const ICONS = { LayoutGrid, Users, Flag, MapPin, Inbox } as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border p-4">
      {ADMIN_NAV.map((section) => (
        <div key={section.section} className="mb-6">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {section.section}
          </p>
          <nav className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const Icon = ICONS[item.icon];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium",
                    isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </aside>
  );
}
