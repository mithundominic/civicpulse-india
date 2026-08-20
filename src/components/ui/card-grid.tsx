// Generic responsive card grid with a built-in empty state — the
// "grid gap-4 sm:grid-cols-N + empty-state ternary" pattern was duplicated
// 18 times across 14 files (a Rule 6 violation caught in review). Uses
// Fragment (not a wrapper div) for keys so grid-item sizing is unaffected.
import { Fragment } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";

const COLUMN_CLASSES = {
  "2-3": "sm:grid-cols-2 lg:grid-cols-3",
  "2-4": "sm:grid-cols-2 lg:grid-cols-4",
  "3": "sm:grid-cols-3",
} as const;

interface CardGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyFn: (item: T) => string;
  columns?: keyof typeof COLUMN_CLASSES;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription?: string;
  className?: string;
}

export function CardGrid<T>({
  items,
  renderItem,
  keyFn,
  columns = "2-3",
  emptyIcon,
  emptyTitle,
  emptyDescription,
  className,
}: CardGridProps<T>) {
  if (items.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cn("grid gap-4", COLUMN_CLASSES[columns], className)}>
      {items.map((item) => (
        <Fragment key={keyFn(item)}>{renderItem(item)}</Fragment>
      ))}
    </div>
  );
}
