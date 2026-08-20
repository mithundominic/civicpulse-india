// Generic stat card — homepage "Explore India" tiles, Lok Sabha dashboard
// summary, admin dashboard summary. One implementation, reused everywhere
// (AGENTS.md Rule 6).
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  href?: string;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, description, href, className }: StatCardProps) {
  const content = (
    <Card className={cn("flex flex-col gap-2 p-5 transition-colors", href && "hover:border-accent", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />}
      </div>
      <p className="font-data text-3xl font-bold tracking-tight">{value}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
