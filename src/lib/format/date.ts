// Date formatting — no formatting logic inline in components (AGENTS.md lib/format/).
import { format, parseISO } from "date-fns";

export function formatDate(value: string | null | undefined, pattern = "d MMM yyyy") {
  if (!value) return "—";
  try {
    return format(parseISO(value), pattern);
  } catch {
    return value;
  }
}

export function formatYear(value: string | null | undefined) {
  return formatDate(value, "yyyy");
}

export function formatDateRange(from: string | null | undefined, to: string | null | undefined) {
  const start = formatYear(from);
  const end = to ? formatYear(to) : "Present";
  return `${start} – ${end}`;
}
