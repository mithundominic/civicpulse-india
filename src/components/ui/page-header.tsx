// Breadcrumbs + title + optional description/actions — every route was
// hand-writing this block directly (Rule 5/6 violation caught in review).
// description/titleSuffix accept ReactNode, not just string, since a few
// pages embed a Badge inline (e.g. election status next to the title).
import { Breadcrumbs } from "./breadcrumbs";
import { cn } from "@/lib/utils";
import type { Breadcrumb } from "@/types/domain";

const TITLE_SIZE_CLASSES = {
  default: "text-3xl",
  compact: "text-2xl",
} as const;

interface PageHeaderProps {
  breadcrumbs?: Breadcrumb[];
  title: string;
  titleSuffix?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  size?: keyof typeof TITLE_SIZE_CLASSES;
  className?: string;
}

export function PageHeader({
  breadcrumbs,
  title,
  titleSuffix,
  description,
  actions,
  size = "default",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-4" />}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className={cn("font-bold tracking-tight", TITLE_SIZE_CLASSES[size])}>{title}</h1>
          {titleSuffix}
        </div>
        {actions}
      </div>
      {description && <div className="mt-1 max-w-2xl text-muted-foreground">{description}</div>}
    </div>
  );
}
