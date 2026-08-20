// Server-rendered pagination — preserves existing filters via searchParams,
// no client JS needed. Used by every paginated directory. paramName defaults
// to "page" but can be overridden so two independent paginated lists can
// coexist on one route (e.g. state parties + RUPP parties on /parties).
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
  paramName?: string;
}

function buildHref(
  basePath: string,
  searchParams: PaginationProps["searchParams"],
  page: number,
  paramName: string
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === paramName || value === undefined) continue;
    params.set(key, Array.isArray(value) ? value[0] : value);
  }
  if (page > 1) params.set(paramName, String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ page, pageSize, total, basePath, searchParams, paramName = "page" }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const showing = [1, page - 1, page, page + 1, totalPages].filter(
    (p, i, arr) => p >= 1 && p <= totalPages && arr.indexOf(p) === i
  );

  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      <Link
        href={buildHref(basePath, searchParams, Math.max(1, page - 1), paramName)}
        aria-disabled={page === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-border",
          page === 1 ? "pointer-events-none opacity-40" : "hover:bg-muted"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {showing.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && p - showing[i - 1] > 1 && <span className="px-1 text-muted-foreground">…</span>}
          <Link
            href={buildHref(basePath, searchParams, p, paramName)}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm font-data",
              p === page ? "border-accent bg-accent/10 font-semibold text-accent" : "border-border hover:bg-muted"
            )}
          >
            {p}
          </Link>
        </span>
      ))}
      <Link
        href={buildHref(basePath, searchParams, Math.min(totalPages, page + 1), paramName)}
        aria-disabled={page === totalPages}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-border",
          page === totalPages ? "pointer-events-none opacity-40" : "hover:bg-muted"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
