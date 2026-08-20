// Primary navigation and footer link configuration — see AGENTS.md Rule 7
// (config-driven, never inline conditionals in the header/footer).

export const PRIMARY_NAV = [
  { label: "States", href: "/states" },
  { label: "Parties", href: "/parties" },
  { label: "Politicians", href: "/politicians" },
  { label: "Elections", href: "/elections" },
] as const;

export const FOOTER_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Data Methodology", href: "/methodology" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Data & Sources", href: "/sources" },
  { label: "Contact", href: "/about#contact" },
] as const;

export const ADMIN_NAV = [
  {
    section: "Dashboard",
    items: [{ label: "Overview", href: "/admin", icon: "LayoutGrid" as const }],
  },
  {
    section: "Data Management",
    items: [
      { label: "Politicians", href: "/admin/politicians", icon: "Users" as const },
      { label: "Parties", href: "/admin/parties", icon: "Flag" as const },
    ],
  },
  {
    section: "Operations",
    items: [{ label: "Corrections Queue", href: "/admin/corrections", icon: "Inbox" as const }],
  },
] as const;
