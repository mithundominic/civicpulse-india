"use client";

// Mobile hamburger menu — the one piece of genuinely ephemeral client UI
// state in the header (AGENTS.md Rule 10: local useState, kept as local as
// possible, no global state library).
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { PRIMARY_NAV } from "@/lib/constants/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-muted"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-border bg-background p-4 shadow-sm">
          <nav className="flex flex-col gap-1">
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              <Search className="h-4 w-4" /> Search
            </Link>
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
