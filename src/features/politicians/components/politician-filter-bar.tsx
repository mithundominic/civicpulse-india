// Search/filter controls for the politician directory — URL state via a GET
// form (AGENTS.md Rule 10).
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { HOUSE_TYPE_LABELS } from "@/lib/constants/labels";

export function PoliticianFilterBar({
  defaultQuery,
  defaultParty,
  defaultHouse,
}: {
  defaultQuery?: string;
  defaultParty?: string;
  defaultHouse?: string;
}) {
  return (
    <form className="grid gap-3 sm:grid-cols-[1fr_auto_auto]" action="/politicians" method="GET">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" defaultValue={defaultQuery} placeholder="Name or constituency..." className="pl-9" />
      </div>
      <Input
        name="party"
        defaultValue={defaultParty}
        placeholder="Party abbr. (e.g. BJP)"
        className="sm:w-48"
      />
      <Select name="house" defaultValue={defaultHouse ?? ""} className="sm:w-56">
        <option value="">All Houses</option>
        {Object.entries(HOUSE_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </form>
  );
}
