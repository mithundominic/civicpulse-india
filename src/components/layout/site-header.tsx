// Global site header — public-facing chrome. No raw HTML beyond this and
// components/ui/ (AGENTS.md Rule 5); layout shells are the one exception.
import Link from "next/link";
import { Landmark, Search } from "lucide-react";
import { PRIMARY_NAV } from "@/lib/constants/nav";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-(--container-page) items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <Landmark className="h-5 w-5 text-accent" aria-hidden />
          CivicPulse India
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground sm:flex"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
