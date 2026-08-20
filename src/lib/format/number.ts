// Number/vote-share/currency formatting for the Indian numbering system
// (lakh/crore separators) — no formatting logic inline in components.

const INDIAN_NUMBER_FORMAT = new Intl.NumberFormat("en-IN");

export function formatVotes(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return INDIAN_NUMBER_FORMAT.format(value);
}

export function formatPercent(value: number | null | undefined, digits = 2) {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatCompactNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(2)} L`;
  return INDIAN_NUMBER_FORMAT.format(value);
}

export function formatInrCrore(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `₹${(value / 10000000).toFixed(2)} Cr`;
}
