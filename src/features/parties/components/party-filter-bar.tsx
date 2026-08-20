// Search/filter controls for the party directory — a plain GET form so
// filters are URL state, no client JS required (AGENTS.md Rule 10).
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RECOGNITION_LABELS } from "@/lib/constants/labels";

export function PartyFilterBar({
  defaultQuery,
  defaultRecognition,
}: {
  defaultQuery?: string;
  defaultRecognition?: string;
}) {
  return (
    <form className="grid gap-3 sm:grid-cols-[1fr_auto]" action="/parties" method="GET">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={defaultQuery}
          placeholder="Search by party name or abbreviation..."
          className="pl-9"
        />
      </div>
      <Select name="recognition" defaultValue={defaultRecognition ?? ""} className="sm:w-56">
        <option value="">Recognition Status</option>
        {Object.entries(RECOGNITION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </form>
  );
}
