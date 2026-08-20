# CivicPulse India — Agent Rules & Codebase Standards

> **These rules are absolute and non-negotiable.**
> Apply every rule to every file, every time — no exceptions, no shortcuts.
> When in doubt, read this file before writing a single line.

**CivicPulse India is one Next.js codebase** — App Router, TypeScript, a single deployable application — backed by **one Postgres database via Supabase**. Unlike a split frontend/backend project, there is no separate API server: Server Components, Route Handlers, and Server Actions *are* the backend. There is no `frontend/`+`backend/` split and no workspace monorepo — rules below apply to the one tree, with **[Server-only]** marking anything that must never ship to the browser.

---

## Before you touch anything

- **Read the specs first.** `docs/PRD.md` (Product Requirements & UI/UX Specification) and `docs/DATABASE_SPEC.md` (Supabase/PostgreSQL Database Specification) are the source of truth for what this platform is and how its data is modeled. This file governs **how** to write code against that spec — it does not restate the spec, and where this file is silent, the two docs win.
- **This is a civic-data platform, not a typical CRUD app.** The subject matter (Indian politicians, parties, elections, governments) makes two concerns load-bearing in a way most codebases never encounter: **historical accuracy** (Rule 17) and **political neutrality** (Rule 18). Check every schema decision, query, and piece of UI copy against them, not just against "does it work."
- **Design system fidelity matters.** `docs/design/DESIGN.md` and the reference exports in `docs/design/reference/` are the approved visual system for the "CivicPulse India" brand — Institutional Minimalism: deep navy/slate/sky-blue, Inter, flat 1px-bordered cards and tables, 4–8px radii, no partisan color, no gradients. This is an execution brief, not a blank canvas — match it rather than reinterpreting it.
- **Verify reachability before trusting a file as a pattern.** Before copying the structure of an existing file, confirm it's actually imported from a mounted route (`grep` the import chain up to `src/app/**/page.tsx` or `layout.tsx`). Dead code documented in this repo's `README.md` "Known gaps" section is not a pattern to extend.

---

## The Five Principles

1. **Think Before Coding** — Don't assume, don't hide confusion. State assumptions explicitly. If a simpler approach exists, say so.
2. **Simplicity First** — Minimum code that solves the problem. No abstractions for single-use code, no speculative configurability.
3. **Surgical Changes** — Touch only what you must. Match existing style even if you'd do it differently. Mention unrelated dead code in your response instead of deleting it, unless it's the specific dead code you were asked to remove.
4. **Goal-Driven Execution** — Define success criteria, then verify against them (`npm run build`, `npm run lint`, and — where present — tests, before calling a change done).
5. **Source & Neutrality Integrity** — No other principle overrides Rules 17–19. A fast or elegant implementation that hardcodes a political fact, silently drops a source, or overwrites history is a defect, not a shortcut.

| Instead of...                   | Transform to...                                                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| "Add a filter to the directory"  | "Write the empty-result case first, then the filtered-result case, then wire the control"                                          |
| "Fix the bug"                    | "Reproduce it first (failing request, script, or test), then make it pass"                                                         |
| "Show the current minister"      | "Query `effective_from <= now() AND (effective_to IS NULL OR effective_to >= now())` — never a cached `current_minister_id` column" |

---

## Stack

| Layer      | Technology                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router). No Pages Router files, ever.                                                      |
| Language   | TypeScript 5, `strict: true` from day one — this is a new codebase, there is no "opt in later."             |
| UI         | Tailwind CSS 4 (CSS-first config in `globals.css`), shadcn/ui-style primitives in `components/ui/`          |
| Data       | PostgreSQL 17 via Supabase — anon client, per-user authenticated client, and service-role client all in use; see Rule 12 |
| Auth       | Supabase Auth (admin users only — the public product requires no account; see PRD §83)                      |
| Validation | Zod at every server boundary (Route Handlers, Server Actions, forms)                                        |
| Charts     | Recharts, wrapped in `components/charts/` — never imported directly into a page                             |
| Icons      | `lucide-react`                                                                                              |
| Deployment | Single Vercel (or equivalent Node host) deployment; Supabase project for Postgres/Auth/Storage               |

---

## Folder Structure

```
civicpulse-india/
├── docs/
│   ├── PRD.md                     # Product Requirements & UI/UX Specification — source of truth
│   ├── DATABASE_SPEC.md           # Supabase/PostgreSQL Database Specification — source of truth
│   └── design/                    # Approved Stitch UI exports + DESIGN.md token system
├── supabase/
│   ├── migrations/                # ✅ Sequential, numbered SQL only — see Rule 14
│   └── seed.sql                   # Representative sample data — never real bulk political data by hand
├── src/
│   ├── proxy.ts                   # Supabase session refresh + /admin route gate — the ONLY proxy file (Next.js 16 renamed "middleware" to "proxy")
│   ├── app/                       # Routes only. No business logic in a page.tsx beyond composing features/.
│   │   ├── (marketing pages, entity directories/detail pages — see docs/PRD.md §59 URL Architecture)
│   │   ├── api/                   # Route Handlers — thin; delegate to features/*/queries.ts or actions.ts
│   │   └── admin/                 # Gated admin surface — see Rule 13
│   │
│   ├── components/
│   │   ├── ui/                    # ✅ RAW HTML LIVES HERE AND ONLY HERE — see Rule 5
│   │   ├── layout/                # SiteHeader, SiteFooter, AdminSidebar — no raw HTML, composed from ui/
│   │   ├── cards/                 # PoliticianCard, PartyCard, StateCard, ConstituencyCard, ElectionCard, StatCard
│   │   ├── tables/                # Reusable table shells (election results, seat tables)
│   │   ├── charts/                # Recharts wrappers only — no data fetching inside a chart component
│   │   └── search/                # SearchBar, autocomplete UI
│   │
│   ├── features/                  # ✅ THE STANDARD — one folder per bounded context (parties, politicians, states, constituencies, elections, parliament, government, search, corrections, admin)
│   │   └── <feature>/
│   │       ├── queries.ts          # Server-only reads — the ONLY place Supabase `select` calls for this feature live
│   │       ├── actions.ts          # Server Actions — the ONLY place this feature's `insert`/`update` calls live
│   │       ├── types.ts            # Feature-local types derived from `lib/database/types.ts`
│   │       └── schema.ts           # Zod schema(s) for this feature's forms/inputs
│   │
│   ├── lib/
│   │   ├── database/
│   │   │   ├── server-client.ts    # Per-request server client (cookies-based session) — see Rule 12
│   │   │   ├── browser-client.ts   # Anon browser client — auth only, see Rule 12
│   │   │   ├── admin-client.ts     # [Server-only] service-role client — narrow, deliberate use only
│   │   │   └── types.ts            # Hand-authored `Database` type matching `supabase/migrations/`
│   │   ├── auth/                   # [Server-only] requireAdmin(), getAdminSession() — exactly one of each, see Rule 13
│   │   ├── validation/             # Shared Zod primitives (slug, date range, etc.)
│   │   ├── format/                 # Date/number/vote-share formatters — no formatting logic inline in components
│   │   ├── constants/              # Nav config, position-taxonomy labels — config objects, not inline conditionals
│   │   └── utils.ts                # `cn()` and other tiny, genuinely cross-cutting helpers
│   │
│   └── types/
│       └── domain.ts               # Shared UI-facing types (EntityType, SourceConfidence, etc.)
```

---

## Rule 1 — Feature Modularity: Features Must Be Deletable

- Every feature's data-access logic lives entirely inside `features/<feature>/`.
- Deleting a feature folder plus its `app/` route segment should remove that capability with as close to zero residual code elsewhere as possible.
- Features **never** import another feature's internals directly — only `components/` (shared UI) and `lib/` (shared infrastructure). If `features/politicians` needs party data, it calls `features/parties/queries.ts`'s exported functions, not a private helper inside that file.
- New feature-owned Route Handlers live in `app/api/<feature>/`, not a shared catch-all.

## Rule 2 — One File, One Responsibility

State the file's single responsibility in a one-line comment at the top.

| File pattern                  | Sole responsibility                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| `page.tsx`                     | Compose `features/*` + `components/*` for one route. No Supabase calls inline.              |
| `layout.tsx`                   | Shared chrome for a route segment. No data mutations.                                       |
| `route.ts`                     | Parse the request, call one `features/*` function, return a response. No business logic.    |
| `*.queries.ts` / `queries.ts`  | Reads for one feature — calls the Supabase client, returns typed domain objects.            |
| `*.actions.ts` / `actions.ts`  | Server Actions for one feature's writes — validates with Zod, calls the client, revalidates. |
| `*Card.tsx`, `*Table.tsx`      | Render one reusable UI unit. No fetching.                                                   |
| `use<Name>.ts`                 | One piece of stateful or async client-side logic.                                           |
| `*.schema.ts`                  | Zod validation schema for one form/input shape.                                             |
| `*.types.ts` / `types.ts`      | Type definitions for one feature. Derived from `lib/database/types.ts`, not redefined.       |
| `index.ts` barrel              | Re-exports only — zero logic.                                                               |

**Violations to refuse:** a `page.tsx` with an inline `.from("politicians").select(...)` call (extract to `queries.ts`); a card component that fetches its own data; a Server Action without Zod validation; a file exporting two unrelated things.

## Rule 3 — 100-Line Guideline

**No `.ts`/`.tsx` file should exceed 100 lines**, including imports, blank lines, and comments, for all production code (components, queries, actions, hooks, utilities).

**Exempt:** `*.test.ts(x)`; `supabase/migrations/*.sql` and `supabase/seed.sql`; `docs/**`; config files (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`); auto-generated files (`lib/database/types.ts` may run long since it mirrors the schema — keep it generated/mechanical, never hand-add business logic there).

Extraction order when a file approaches the limit: inline sub-component → its own file in the same folder → a `use<Name>` hook for stateful/async logic → a `.utils.ts` for pure transforms → a shared `components/` unit for repeated structure. Do not compress code to fit — the limit forces decomposition, not minification. A politician profile page is not one 400-line file; it's a `page.tsx` that composes `<OverviewTab>`, `<CareerTimeline>`, `<ElectionHistoryTable>`, `<SourcesPanel>` from `features/politicians/components/`.

## Rule 4 — DRY: Zero Duplication Tolerance

| Duplication                                                                       | Resolution                                                                       |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| JSX structure used more than once                                                    | Extract a component into `components/`                                            |
| A "current X" query (current minister, current party, current CM) written inline more than once | Extract to `features/<feature>/queries.ts` as a named function reused everywhere    |
| Status/recognition/verification badge styling reimplemented per page                 | One `<StatusBadge>` / `<SourceBadge>` in `components/ui/`, config-driven (Rule 7)   |
| Tailwind class strings repeated across files                                         | Extract via `cn()` into the component, or a shared class constant                  |
| The same entity-type icon/label mapping written twice                                | One config object in `lib/constants/`                                             |

## Rule 5 — Raw HTML Constraint

Raw HTML elements (`<div>`, `<p>`, `<span>`, `<button>`, `<input>`, `<a>`, `<table>`, `<img>`, etc.) are permitted **only** inside `components/ui/`. Everywhere else composes from `components/ui/` primitives.

```tsx
// ❌ FORBIDDEN — raw HTML outside components/ui/
// components/cards/PartyCard.tsx
export function PartyCard({ party }: Props) {
  return <div className="border rounded-sm p-4">{party.name}</div>;
}

// ✅ CORRECT
// components/ui/card.tsx
export function Card({ className, ...props }: CardProps) {
  return <div className={cn("border border-border rounded-sm bg-card", className)} {...props} />;
}
// components/cards/PartyCard.tsx
import { Card } from "@/components/ui/card";
export function PartyCard({ party }: Props) {
  return <Card>{party.name}</Card>;
}
```

**Exception:** `next/image`, `next/link` are not "raw HTML" and may be used anywhere — they are the framework's typed primitives. `components/layout/` shells may use semantic structural tags (`<main>`, `<header>`, `<footer>`, `<nav>`) directly since they are the layout root, not a feature component.

## Rule 6 — No Repeated JSX

If the same JSX structure appears more than once anywhere, extract it — config-driven, not copy-pasted. The entity hero pattern (photo/symbol + title + status pills + "Source & Verification" panel) repeats across party, politician, and constituency detail pages: build it once as `<EntityHero>` with slots, not three times.

## Rule 7 — Configuration-Driven Everything

Anywhere a list, mapping, or set of variants drives rendering or routing, use a config object — never inline conditionals.

```tsx
// ✅ lib/constants/nav.ts
export const PRIMARY_NAV = [
  { label: "States", href: "/states" },
  { label: "Parties", href: "/parties" },
  { label: "Politicians", href: "/politicians" },
  { label: "Elections", href: "/elections" },
] as const;
```

Applies to: nav links, the position taxonomy (PRD §54), recognition-status labels, verification-status labels, source-authority-level labels, tab definitions, footer links.

## Rule 8 — TypeScript

- `strict: true` in `tsconfig.json`, unmodified, from the first commit.
- Never use `any`. Use `unknown` and narrow with a type guard, or derive from a Zod schema with `z.infer<typeof schema>`.
- Validate all external input (form submissions, Route Handler bodies, search params used in queries) with Zod at the boundary — the database enforces integrity, the application enforces user-friendly validation; neither substitutes for the other (DB spec §196–197).
- Domain types are derived from `lib/database/types.ts`, never hand-duplicated per feature.

## Rule 9 — Component & Hook Anatomy

```tsx
import { cn } from "@/lib/utils";                    // 1. external / lib
import { Badge } from "@/components/ui/badge";        // 2. internal — ui/, hooks, utils, types
import type { PoliticianSummary } from "../types";

interface PoliticianCardProps {
  politician: PoliticianSummary;
}

export function PoliticianCard({ politician }: PoliticianCardProps) {
  // derived values → early returns → JSX using only ui/ or composed components
}
```

Props interface: `<ComponentName>Props`. Event handler props: `on<Action>`; internal handlers: `handle<Action>`.

Never fetch data inside a Client Component's `useEffect`. Server Components fetch via `features/*/queries.ts`; a Client Component that needs live/interactive data receives it as a prop from its Server Component parent, or calls a Route Handler explicitly (e.g. search-as-you-type).

## Rule 10 — State Management

- **Canonical political data** → Server Components calling `features/*/queries.ts`. This is the default for every entity directory/detail page.
- **Filters, pagination, tabs on a directory page** → URL search params (`?state=&party=&house=`), read via `searchParams` in the Server Component. Do not reach for client state to represent something that should be a shareable/bookmarkable URL.
- **Genuinely ephemeral client UI** (an open/closed mobile menu, a comparison-picker's local selection before submit) → `useState` in a Client Component, kept as local as possible.
- **No global client state library.** This app does not need Redux/Zustand — public pages are anonymous and stateless per PRD §83, and admin state belongs to the server. If a genuine cross-cutting client state need appears, it goes through React Context, added deliberately and documented here first.

## Rule 11 — Server Layering

Target: `Route (page.tsx / route.ts) → features/*/queries.ts or actions.ts → Supabase client → Postgres`.

A page or Route Handler never calls `.from(...)` directly. If a route needs data that doesn't have a query function yet, add one to the relevant `features/<feature>/queries.ts` — don't inline it "just this once."

## Rule 12 — Supabase Client & Data-Access Rules

This is the most security- and integrity-sensitive rule in the codebase.

- **Three clients, three purposes — know which one you're using:**
  - `lib/database/browser-client.ts` — anon key, browser-safe. Used **only** for Supabase Auth methods (`signInWithPassword`, `signOut`, `onAuthStateChange`) in the admin login flow. Never used to query political data directly from a Client Component.
  - `lib/database/server-client.ts` — built per-request from the incoming request's cookies (`@supabase/ssr`), respects RLS as either `anon` or the authenticated admin user. This is what every `features/*/queries.ts` and public-facing `actions.ts` uses.
  - `lib/database/admin-client.ts` — **[Server-only]** service-role key, bypasses RLS entirely. Used only inside `features/admin/` and `features/*/actions.ts` writes that are explicitly gated behind `requireAdmin()` first. Never imported into anything that runs in response to an unauthenticated request.
- **Never cache a Supabase client instance across requests/users.** Build clients fresh per call/request, exactly as `lib/database/server-client.ts` already does by reading `cookies()`. A client built for one user must never be reused for another user's request.
- **Public tables are read through RLS, not through the service-role client "for convenience."** If a public page can't get the data it needs under the anon-role RLS policy, the fix is the RLS policy or a `security_invoker` view — not switching that query to `admin-client.ts`.
- **The frontend never queries Supabase directly from a Client Component.** All political data flows through a Server Component calling `features/*/queries.ts`.

## Rule 13 — Auth & Admin Authorization

- Exactly one `requireAdmin()` and one `getAdminSession()`, both in `lib/auth/`. Never reimplement a session/role check inside a page or Route Handler.
- Admin authorization is **database-backed** (`admin_roles` / `user_admin_roles`, per DB spec §75), never read from Supabase Auth's user metadata — user-editable metadata must never gate a write.
- `src/proxy.ts` (Next.js 16's renamed "middleware") refreshes the Supabase session on every request and redirects unauthenticated requests to `/admin/*` (other than `/admin/login`) to the login page. It does not itself decide *role* — that's `requireAdmin()`'s job inside the route, checked again server-side even though proxy also gates the path (defense in depth, not redundant).
- A Server Action that mutates data checks `requireAdmin()` (or, for public corrections, validates the narrow public-insert shape) before doing anything else — first line of the function body, not an afterthought.

## Rule 14 — Migrations

- **Sequential, numbered files only**, applied in order, following `supabase/migrations/000NNN_description.sql`. No ad-hoc/manual patch files.
- **Every table gets `ENABLE ROW LEVEL SECURITY` and at least one policy in the same migration that creates it** (DB spec §113, §175). There is no allowlist elsewhere backstopping this.
- Prefer a reusable Postgres function (`is_admin()`, `has_admin_role()`) over repeating an authorization check inline in every policy.
- Views exposed to `anon`/`authenticated` are created `WITH (security_invoker = true)` so they respect the underlying table's RLS (DB spec §94, and Rule 19 below).

## Rule 15 — Environment Variables

All `process.env.*` reads are confined to `lib/database/*-client.ts` (for Supabase keys) and one `lib/env.ts` for anything else — never scattered through pages, components, or feature files. Add new variables to `.env.example` in the same change that introduces them.

## Rule 16 — Dead Code & Superseded Flows

When a flow is replaced, delete the old one in the same change — don't leave both. If you notice unrelated dead code while working nearby, mention it in your response rather than silently deleting it (Principle 3).

## Rule 17 — Historical & Temporal Data (Domain-Critical)

This mirrors DB spec §211 Rules 4–10 and is non-negotiable for this domain:

- **Never model a "current" relationship as a mutable column on a canonical entity** (no `politicians.current_party_id`, no `states.current_chief_minister_id`). Party membership, positions, minister assignments, government composition, and party recognition are **temporal relationship tables** with `effective_from`/`effective_to`. "Current" is always a query (`effective_to IS NULL OR effective_to >= CURRENT_DATE`), optionally exposed through a `security_invoker` view for convenience — the view is a read shortcut, never the write target.
- **Never overwrite a historical row.** A change in party, position, recognition status, or constituency representation is a new row with a new `effective_from`, closing out the previous row's `effective_to`. Corrections to a genuinely wrong historical value go through the audit-logged correction workflow (Rule 19), not a silent `UPDATE`.
- A query answering "who holds X now" and a query answering "who held X on date D" should be the same shape with a different date parameter — if they diverge in structure, the schema is wrong.

## Rule 18 — Political Neutrality (Domain-Critical)

This mirrors PRD §5.1, §99, §100, §208 and applies to seed data, UI copy, error/empty states, and code comments alike:

- No subjective or ranking language anywhere in the product surface — no "best/worst politician," no scored "accuracy" or "trust" number, no party ranking. Verification/source labels use the fixed vocabulary in `lib/constants/` (`Official Source`, `Government Source`, `Secondary Source`, `User Submitted`), never a free-text editorial judgment.
- Keep **allegation**, **case**, **conviction**, **disqualification**, and **official declaration** visually and textually distinct wherever candidate/politician records surface any of them. Never render an allegation with the same styling/weight as a verified fact.
- Affidavit-sourced figures (declared assets, criminal cases, education) are always labeled "Declared" — never presented as independently verified unless a second, higher-authority source is attached.
- Party symbols/colors appear only within that party's own card/detail context (a swatch or a monochrome symbol tile) and never bleed into global chrome (header, nav, buttons, status colors).

## Rule 19 — No Hardcoded Political Data in the Frontend

- No politician, party, election, constituency, or government data as a JS/TS array/object literal anywhere under `src/`. If you catch yourself writing `const parties = [{ name: "..." }]` in a component, stop — that data belongs in `supabase/migrations` (reference/taxonomy data: position types, election types, source types) or `supabase/seed.sql` (example records), fetched at request time.
- The **only** acceptable hardcoded domain-shaped values are the fixed taxonomies that PRD §54 and the DB spec explicitly call reference data (position categories, enum label maps for display) — and those live in `lib/constants/`, not scattered per-component, and are display-label maps for values that still originate from the database (e.g. mapping the `recognition_type` enum value to its display string), never a stand-in for real records.

---

## Quick Reference: What Goes Where

| What you want to add                                  | Where it goes                                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| A new public route                                        | `app/<route>/page.tsx` + data via a new/existing `features/<feature>/queries.ts`   |
| A new entity detail tab                                    | `features/<feature>/components/<Tab>.tsx`, composed from `page.tsx`               |
| A shared UI primitive (raw HTML)                            | `components/ui/<name>.tsx`                                                        |
| A shared card/table/chart                                    | `components/{cards,tables,charts}/<Name>.tsx`                                     |
| A new Supabase read                                            | `features/<feature>/queries.ts`                                                 |
| A new Supabase write (admin or public correction)                | `features/<feature>/actions.ts`, `requireAdmin()` or public-insert-only         |
| A new table                                                        | A new numbered migration in `supabase/migrations/`, RLS in the same file        |
| A nav link, taxonomy label, or status color mapping                  | `lib/constants/`                                                               |
| A cross-request formatter (dates, vote share, INR)                     | `lib/format/`                                                                |

---

## Antipattern Checklist — Refuse These Every Time

- [ ] Raw HTML outside `components/ui/` or `components/layout/`
- [ ] The same JSX structure in more than one file
- [ ] A production `.ts`/`.tsx` file that keeps growing past ~100 lines instead of being decomposed
- [ ] `any` anywhere
- [ ] A page or Route Handler calling `supabase.from(...)` directly instead of going through `features/*/queries.ts`
- [ ] A Supabase client built once and reused across requests/users
- [ ] `admin-client.ts` (service role) imported anywhere reachable by an unauthenticated request
- [ ] A new `requireAdmin`/session-check reimplementation instead of importing the shared one
- [ ] Admin authorization read from `user_metadata` instead of `admin_roles`/`user_admin_roles`
- [ ] A "current X" field written directly instead of derived from a temporal query/view
- [ ] A historical row overwritten instead of superseded by a new row with `effective_from`
- [ ] Subjective/ranking language, a numeric "trust score," or unlabeled affidavit data in any UI copy or seed data
- [ ] Political data (politicians/parties/elections/etc.) as a hardcoded array/object in `src/`
- [ ] A new table without RLS enabled in the same migration
- [ ] An ad-hoc/undated migration file
- [ ] A superseded flow left in the tree instead of deleted alongside its replacement

---

## Existing Reference Documents

| Document                  | What it's for                                                              |
| --------------------------- | ------------------------------------------------------------------------------ |
| `docs/PRD.md`                | Full product requirements, information architecture, UI/UX specification    |
| `docs/DATABASE_SPEC.md`       | Full Supabase/PostgreSQL database specification                           |
| `docs/design/DESIGN.md`         | Approved visual design system (colors, type, spacing, components)       |
| `docs/design/reference/`          | Approved Stitch UI exports referenced when building/extending a screen |
| `README.md`                         | Setup instructions, current implementation status, and known gaps    |

---

_Line limit: ~100 for production code. This supersedes any other limit referenced elsewhere in the repo._
