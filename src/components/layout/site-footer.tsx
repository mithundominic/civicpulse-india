import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/constants/nav";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-(--container-page) flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-lg font-bold tracking-tight">CivicPulse India</p>
          <p className="mt-1 text-sm text-muted-foreground">
            © {new Date().getFullYear()} CivicPulse India. Objective Political Data Archive.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
