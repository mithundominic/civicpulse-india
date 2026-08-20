// A plain GET form — no client JS required. Works as a Server Component,
// submits straight to /search?q=..., and degrades to a normal HTML form if
// JS fails to load. Reused on the homepage hero and the /search page itself.
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  size?: "default" | "lg";
}

export function SearchBar({
  defaultValue,
  placeholder = "Search politicians, parties, states, constituencies...",
  size = "default",
}: SearchBarProps) {
  return (
    <form action="/search" method="GET" className="relative w-full">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={size === "lg" ? "h-14 pl-11 text-base" : "h-11 pl-11"}
        aria-label="Search CivicPulse India"
      />
    </form>
  );
}
