"use client";

// Party-distribution donut — Lok Sabha/Rajya Sabha dashboards. Recharts
// requires the client boundary; the page around it stays a Server Component.
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export interface SeatSlice {
  name: string;
  value: number;
  color: string;
}

const FALLBACK_COLORS = ["#0F172A", "#334155", "#64748B", "#94A3B8", "#CBD5E1", "#E2E8F0"];

export function SeatDistributionDonut({ data, totalLabel }: { data: SeatSlice[]; totalLabel: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="relative h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="90%"
            paddingAngle={1}
            strokeWidth={0}
          >
            {data.map((slice, index) => (
              <Cell key={slice.name} fill={slice.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: "var(--border)", fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-data text-3xl font-bold">{total}</span>
        <span className="text-xs text-muted-foreground">{totalLabel}</span>
      </div>
    </div>
  );
}
