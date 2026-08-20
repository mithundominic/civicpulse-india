# CivicPulse India

An objective, source-verified information platform covering Indian politicians, political parties, constituencies, elections, and government composition — built with Next.js 16, TypeScript, Tailwind CSS 4, and Supabase.

This repository is a working implementation of the attached PRD (`docs/PRD.md`) and Database Specification (`docs/DATABASE_SPEC.md`), following the engineering rules in **[`AGENTS.md`](./AGENTS.md)**. Read `AGENTS.md` first if you're going to extend this codebase — it's the standard every file here was held to.

## Status at a glance

- **Database**: fully implemented and **live** — 15 migrations applied to a real Supabase project (Postgres 17), covering the MVP schema plus a few structurally-necessary additions (see "Deviations from the spec" below). Security & performance advisors are clean. Representative seed data is loaded (all 28 states + 8 UTs, 9 parties, and a deeply-sourced example politician record verified against real ECI results).
- **Frontend**: 30+ routes implemented against real data — directories, detail pages with tabs, search, comparison, parliament dashboards, government pages, a public correction workflow, and an authenticated admin section. `npm run build` and `npm run lint` both pass clean.
- **Not yet built**: admin create/edit forms (the admin section is read-oriented plus the corrections queue), the data-ingestion pipeline itself (the schema for it exists — `data_sources`/`data_imports`/etc. — but no scraper/importer code), and a few PRD pages scoped out deliberately (see "Known gaps").

## Quick start

This project is **already connected to a live Supabase project** with the full schema and seed data applied, and `.env.local` is already populated with that project's URL and anon key.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see real data: 28 states, 9 parties (BJP, INC, CPI(M), AAP, AITC, DMK, BSP, SP, and Independent), and one deeply-populated example politician (Narendra Modi — Prime Minister, BJP, Varanasi MP, with real 2019 and 2024 election results).

> **Note on this build environment:** the sandbox this project was built in has restricted network egress and cannot itself reach `*.supabase.co`, so the running app couldn't be visually verified end-to-end from inside that sandbox (see "How this was verified" below). The database itself *was* fully verified live, via the Supabase MCP connector, which has its own network path. On your machine, with normal internet access, `npm run dev` should just work.

### Bootstrapping an admin account

The public site needs no login, but `/admin` does. To create your first admin:

1. In the Supabase dashboard, **Authentication → Users → Add user**, create a user with an email/password.
2. In the **SQL Editor**, run:
   ```sql
   insert into user_admin_roles (user_id, admin_role_id)
   select '<the new user''s UUID>', id from admin_roles where name = 'SUPER_ADMIN';
   ```
   (No user can grant themselves a role — see `AGENTS.md` Rule 13 — this one step requires the dashboard/service-role access.)
3. Sign in at `/admin/login`.

### Using a different Supabase project

If you'd rather point this at your own project:

```bash
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

Then apply the migrations in order (`supabase/migrations/000001...` through `000015...`) via the Supabase CLI (`supabase db push`) or by pasting each file into the SQL Editor in sequence, and optionally run `supabase/seed.sql` the same way.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5, `strict: true` |
| Styling | Tailwind CSS 4 (CSS-first config), shadcn/ui-style primitives |
| Database | Supabase (PostgreSQL 17, Auth, Row Level Security) |
| Charts | Recharts |
| Icons | lucide-react |
| Validation | Zod |
| Fonts | Inter, self-hosted via `@fontsource/inter` (not `next/font/google` — see below) |

## Project structure

```
civicpulse-india/
├── AGENTS.md                # Engineering rules for this codebase — read this first
├── docs/
│   ├── PRD.md                  # Product Requirements & UI/UX Specification (source spec)
│   ├── DATABASE_SPEC.md        # Supabase/PostgreSQL Database Specification (source spec)
│   └── design/
│       ├── DESIGN.md           # Approved visual design system
│       └── reference/          # Approved Stitch UI export HTML, one folder per screen
├── supabase/
│   ├── migrations/          # 15 sequential SQL migrations — see below
│   └── seed.sql             # Representative example data
└── src/
    ├── proxy.ts             # Session refresh + /admin gate (Next 16 renamed "middleware")
    ├── app/                 # Routes — see "Implemented routes" below
    ├── components/          # ui/ (raw HTML lives here only), layout/, cards/, charts/, search/
    ├── features/            # One folder per bounded context: queries.ts, actions.ts, types.ts, components/
    ├── lib/                 # database/ (Supabase clients + generated types), auth/, constants/, format/, validation/
    └── types/               # Shared UI-facing types
```

## Database

### Migrations

Applied in order; each is self-contained with its own RLS policies (see `AGENTS.md` Rule 14):

| # | File | Contents |
| - | --- | --- |
| 1 | `000001_extensions.sql` | pgcrypto, pg_trgm, unaccent, shared `set_updated_at()` trigger |
| 2 | `000002_enums.sql` | All 34 enum types |
| 3 | `000003_admin_identity.sql` | `admin_roles`, `user_admin_roles`, `profiles`, `is_admin()`/`has_admin_role()` |
| 4 | `000004_geography.sql` | `states`, `union_territories`, `districts`, `constituencies`, `houses`, `parliamentary_terms` |
| 5 | `000005_sources.sql` | `sources`, `source_records`, `entity_sources`, `verification_records`, `documents`, `entity_documents` |
| 6 | `000006_political_entities.sql` | `persons`, `politicians`, `political_parties`, party aliases/recognition/symbols/memberships, `political_positions` taxonomy |
| 7 | `000007_government.sql` | `governments`, `government_parties`, `ministries`, `portfolios`, `minister_assignments`, `politician_house_memberships` |
| 8 | `000008_elections.sql` | `elections`, `election_candidates`, `election_results` |
| 9 | `000009_operational.sql` | `corrections`, `audit_logs`, `data_sources`, `data_imports`, `data_import_records`, `data_quality_issues` |
| 10 | `000010_indexes.sql` | Performance indexes |
| 11 | `000011_functions.sql` | `search_entities()`, `get_current_party()`, `get_current_positions()`, `get_current_government()` |
| 12 | `000012_views.sql` | `current_*` views, `public_politician_overview`, `public_party_overview`, `party_election_results` |
| 13 | `000013_security_hardening.sql` | Fixes from the live security advisor pass (search_path pinning, extension schema) |
| 14 | `000014_performance_hardening.sql` | Fixes from the live performance advisor pass (RLS policy scoping, missing FK indexes) |
| 15 | `000015_party_recognition_ut_scope.sql` | Adds Union Territory support to `party_recognition_history` (found while writing seed data — Delhi/Puducherry recognition had nowhere valid to point) |

### Deviations from the spec (and why)

Documented here rather than left implicit, per `AGENTS.md` Principle 1:

- **Migration ordering** deviates from the DB spec's illustrative numbering. `sources` moved early (migration 5, not near the end) because `source_id` is a foreign key on nearly every later table. Admin identity moved to migration 3 (before any political data) because `is_admin()` is used in every subsequent table's RLS policy, and this codebase's Rule 14 requires RLS to ship in the same migration as the table — which meant the helper function had to exist first.
- **Small, justified table additions beyond the DB spec's MVP list**, each because an MVP table's own design required it: `parliamentary_terms` and `houses` (an FK target of `politician_house_memberships`), `entity_documents` (without it, `documents` has no way to attach to a party/politician at all).
- **`party_election_results` is a plain SQL view**, not a stored table, computed live from `election_candidates`/`election_results` — this can never drift out of sync with its source data, which is more faithful to the spec's own "never a second source of truth" guidance than a stored table would be.
- **Everything lives in the `public` schema**, not a separate `private` schema for ingestion/audit tables as the spec discusses. RLS achieves the same effective isolation (admin-only access to `data_sources`/`data_imports`/`audit_logs`/etc.) without the operational complexity of configuring Supabase's Data API exposed-schemas setting. A real `private` schema is a clean follow-up if this grows.

## Implemented routes

| Route | Notes |
| --- | --- |
| `/` | Homepage with live stats |
| `/parties`, `/parties/[slug]` | Directory (national/state/unrecognised) + detail (Overview, Leadership, Representatives, Election History tabs) |
| `/politicians`, `/politicians/[slug]` | Directory (search/party/house filters, paginated) + profile (Overview with timeline & electoral record, Political Career, Election History tabs) |
| `/states`, `/states/[slug]`, `/union-territories/[slug]` | Directory + detail (current leadership, MPs, constituencies) |
| `/constituencies`, `/constituencies/[slug]` | Directory + detail (current representative, election results by year) |
| `/elections`, `/elections/[slug]` | Directory (grouped by house) + results (summary stats, party seat breakdown, searchable constituency results) |
| `/parliament/lok-sabha`, `/parliament/rajya-sabha` | Composition dashboards (party distribution donut, state-wise table, member directory) |
| `/government`, `/government/union` | PM, council of ministers, coalition composition |
| `/compare/politicians` | Side-by-side comparison |
| `/search` | Full-text search via `search_entities()` |
| `/report` | Public correction submission form |
| `/about`, `/methodology`, `/sources`, `/privacy`, `/terms` | Content pages |
| `/admin/login`, `/admin`, `/admin/politicians`, `/admin/parties`, `/admin/corrections` | Authenticated admin (session-gated by `proxy.ts`, role-checked by `requireAdmin()`) |

## Design system

Implemented per `docs/design/DESIGN.md` and the approved Stitch reference screens in `docs/design/reference/`: Institutional Minimalism — deep navy (`#0F172A`) / slate (`#334155`) / sky-blue (`#0EA5E9`) accent, Inter, flat 1px-bordered cards, 4–8px radii, tabular figures on all vote/date data (`.font-data`). Tokens live in `src/app/globals.css` as CSS variables consumed by Tailwind 4's `@theme inline`. Dark mode variables are defined but not yet wired to a toggle — see "Known gaps."

Inter is self-hosted via `@fontsource/inter` rather than `next/font/google`, so the build never depends on reaching `fonts.googleapis.com` — more robust for CI/sandboxed/offline build environments, with an identical visual result.

## How this was verified

- **Database**: every migration was applied to the live Supabase project via the Supabase MCP connector (not simulated), in order, with zero errors. The Supabase security and performance advisors were run twice (before and after a hardening pass) — the only remaining findings are informational (`unused_index`, expected on a freshly-seeded database) and two deliberately-accepted, documented items. Seed data was verified with direct queries — including confirming the temporal party-membership model works correctly end to end (a party president's row with a past `effective_to` correctly stops appearing as "current" while their successor's open-ended row does).
- **Application code**: `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass with zero errors. A local Postgres instance (with a stubbed `auth` schema) was used mid-build to validate migration SQL syntax before ever touching the live project.
- **Not independently verified**: pixel-level visual rendering of the running app. This build environment's network egress doesn't reach `*.supabase.co` (the Supabase MCP connector has its own separate network path, which is how the database work above was possible), so `npm run dev` couldn't be exercised against live data from inside this sandbox. Two real bugs were caught anyway during this attempt — both in homepage/admin stat-count queries that were silently swallowing errors instead of throwing — and are fixed. Please run `npm run dev` and click through it; if anything looks off, it's the one layer that wasn't directly observed.

## Known gaps

Left out deliberately, not accidentally — flagged per `AGENTS.md` Principle 3 rather than silently missing:

- **Admin create/edit forms.** The admin section can review corrections and browse politicians/parties, but there's no UI yet to create or edit a politician/party/election record by hand. Every schema and RLS policy needed for this already exists (`requireAdmin()`-gated `actions.ts` files following the same pattern as `features/corrections/actions.ts` and `features/admin/actions.ts`) — it's a natural next feature to add per-entity.
- **The data-ingestion pipeline** (`data_sources`/`data_imports`/`data_import_records`/`data_quality_issues`) is schema-only. No scraper or import-runner code exists yet.
- **State filtering on the politician directory** isn't wired up — `public_politician_overview` doesn't currently carry a state column (a Lok Sabha/Assembly member's state lives on their constituency; a Rajya Sabha member's on the house membership itself). Extending the view is a small, clean follow-up.
- **Committee memberships**, shown in the approved politician-profile design reference, have no backing table in the MVP schema and were left out rather than faked.
- **Dark mode** tokens exist in `globals.css` but there's no toggle UI yet.
- **Search-as-you-type** in the header: the header search box submits to `/search` (a full page, real results) rather than showing a live dropdown — a reasonable v1 given `search_entities()` already does the hard part; adding a debounced client-side dropdown on top is straightforward.
- Historical/pre-2024 data for most politicians and pre-2024 government compositions is not backfilled — the seed dataset is intentionally small and focused on demonstrating the schema correctly, not a production import.

## Extending this codebase

Read `AGENTS.md` in full first. In short: new data access goes in `features/<feature>/queries.ts` or `actions.ts`, never inline in a page; new tables get RLS in the same migration that creates them; raw HTML only lives in `components/ui/`; nothing "current" is ever a mutable column — it's a query against `effective_from`/`effective_to`.
