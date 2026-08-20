// A titled section with the border-b heading treatment used throughout
// directory pages ("National Parties", "Members of Parliament", etc.) — this
// exact h2 + border pattern was duplicated across every directory/detail
// page (Rule 6 violation caught in review).
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  action?: React.ReactNode;
  spacing?: "default" | "tight";
  className?: string;
  children: React.ReactNode;
}

export function Section({ title, action, spacing = "default", className, children }: SectionProps) {
  return (
    <section className={cn(spacing === "default" ? "mt-10" : "mt-8", className)}>
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-border pb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
