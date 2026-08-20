// Two-politician selector — plain GET form with datalist-based autocomplete,
// no client JS required (AGENTS.md "Simplicity First": a <datalist> gives a
// native suggestion dropdown without a custom combobox component).
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CompareSelectorProps {
  names: { full_name: string; slug: string }[];
  defaultA?: string;
  defaultB?: string;
}

export function CompareSelector({ names, defaultA, defaultB }: CompareSelectorProps) {
  return (
    <form action="/compare/politicians" method="GET" className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr_auto]">
      <div>
        <label htmlFor="a" className="mb-1.5 block text-sm font-medium">Select Politician A</label>
        <Input id="a" name="a" list="politician-names" defaultValue={defaultA} placeholder="Type a name..." />
      </div>
      <span className="hidden pb-2.5 text-sm font-semibold text-muted-foreground sm:block">vs</span>
      <div>
        <label htmlFor="b" className="mb-1.5 block text-sm font-medium">Select Politician B</label>
        <Input id="b" name="b" list="politician-names" defaultValue={defaultB} placeholder="Type a name..." />
      </div>
      <Button type="submit">Compare</Button>
      <datalist id="politician-names">
        {names.map((n) => (
          <option key={n.slug} value={n.full_name} />
        ))}
      </datalist>
    </form>
  );
}
