// Labeled horizontal proportion bar — election seat/vote-share breakdowns
// (2024 results "Alliance A/B/Others"). A plain styled div rather than a
// charting library: the visual is a single filled bar, Recharts would be
// overkill for it (AGENTS.md "Simplicity First").
import { cn } from "@/lib/utils";

interface ProportionBarProps {
  label: string;
  value: number;
  max: number;
  valueLabel: string;
  colorClassName?: string;
}

export function ProportionBar({
  label,
  value,
  max,
  valueLabel,
  colorClassName = "bg-primary",
}: ProportionBarProps) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-data text-muted-foreground">{valueLabel}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", colorClassName)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
