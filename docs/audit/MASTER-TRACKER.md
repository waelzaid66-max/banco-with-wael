# BANCO — Master Production Tracker (anti-forgetting ledger)

> Single ledger for the Master Production Recovery Program. Every owner instruction, every module, every open task lands here so nothing is lost between sessions.
> Source of truth repo: **`bancostormainvirgen` / main**. Mirror: `bancoo` branch `claude/facebook-oauth-e1` (PR #8) — used to run CI.

## 0. Standing rules (owner-set, always apply)
1. **Study before touching.** Read the module, its history, its dependencies — never experiment on production code.
2. **Test before AND after every change**, plus everything around it, so nothing else breaks.
3. **Evidence only.** No guessing. Unproven → **UNKNOWN**, never a claimed fix.
4. **Never redesign.** Polish only; the product identity and existing UI stay as they are.
5. **See it with the user's eye** before and after — icons, spacing, states, RTL.
6. **No large refactors, no blind merges, no deleting code that isn't proven dead.**
7. Work **one module at a time**: complete → verify → lock → next.
8. **Push after each command/step** to both repos.

## 1. Modules (one at a time)
| # | Module | State |
|---|---|---|
| **M1** | Accounts & Authentication (7 types) | **LOCKED** — audit `docs/audit/M1-ACCOUNTS-AUTH-MODULE-AUDIT.md`; 2 real gaps fixed, 3 proven non-defects, 1 UNKNOWN |
| **M1.5** | Accessibility pass on account screens | **DONE** — profile (`ccc882a`), onboarding + verification (`3647bb7`) |
| **M2** | Search + the 5 section mini-apps (isolation, filters, chrome) | **NEXT** |
| **M3** | Maps — per-section, radius/area draw (Nawy-class), pins, clustering, geocoding, tool offices | pending |
| **M4** | Listing create → publish → lifecycle | pending |
| **M5** | Messenger + notifications + emails | pending |
| **M6** | Payments / subscriptions / wallet / FI | pending |
| **M7** | Deployment: Coolify · Docker · EAS Android + iOS | pending |

## 2. Open tasks carried forward (do NOT drop)
- **enterprise / staff journeys** — never audited (M1 declared them out of scope).
- **UNKNOWN M1-F5** — are non-field Clerk errors (rate limit, network, existing session) invisible? Needs the official Clerk 3.3.1 contract or a live trial.
- **Accessibility beyond the account screens** — only 16 of 62 mobile files use accessibility props; the same silent-icon-button pattern likely repeats elsewhere. Sweep per module as each module is opened.
- **Uploads (images/video/documents)** — audit every upload point per module (picker → claim → verify → storage → cleanup).
- **Countries/currencies still "spread"** in RE + Materials matrices — owner wants them collapsed to the compact icon like Stay, BUT the current spread layout is locked by two guard assertions (owner-approved earlier). **Needs an explicit owner decision before touching.**
- **Vercel preview failures** on the PR (`bancoo-api-server`, one `admin-os` variant) — pre-existing infra, non-required checks; the real API target is Coolify. Confirm they also fail on `main` before spending effort.

## 2a. FULL census of the Search/Discover page — 10 rectangles, none missed
Read end-to-end from `components/SearchDiscover.tsx` (render ends line 476; styles start 480 — the banks card is the last one, and the host `app/(tabs)/search.tsx` adds no cards while Discover is showing). `SECTIONS = ["car","real_estate","facilities","materials"]` → exactly 4 grid cards.

| # | Rectangle | testID | Destination | Group |
|---|---|---|---|---|
| 1 | Cars | `section-card-car` | `/section/car` | 2×2 photo grid |
| 2 | Real estate | `section-card-real_estate` | `/section/real-estate` | grid |
| 3 | Factories | `section-card-facilities` | `/section/factories` | grid |
| 4 | Materials | `section-card-materials` | `/section/materials` | grid |
| 5 | Booking & Stays | `section-card-booking` | `/section/booking` | 5th wide portal |
| 6 | **Maps** | `discover-explore-map` | `/section/real-estate?map=1` | standalone |
| 7 | **Import your car** | `discover-car-import` | `/section/car?engine=import` | standalone |
| 8 | **Global supply** | `discover-supply-portal` | `/business/global-supply` | Business & supply |
| 9 | **Suppliers hub** | `discover-importers-hub` | `/business/supply-hub` | Business & supply |
| 10 | **Banks & financiers** | `discover-banks-hub` | `/business/banks` | Business & supply |

| **11** | **Map FAB (floating)** | `discover-map-toggle` | in-place map on the shared Search | **rendered by the HOST**, not by SearchDiscover |

### ✅ Verified against the RUNNING app (first successful Expo web export in this environment)
`npx expo export --platform web` succeeded (11 MB, `web-preview/`), served on `localhost:8099`, and the app **boots**: title "BANCO", category tabs, the bottom bar (Feed · Search · Messages · Saved · Profile) and "Post Asset". Opening the Search tab rendered all the cards above — which is how the following three findings were caught. **Reading the code alone would have missed them.**

#### Finding A — an 11th rectangle exists that the code census missed
`app/(tabs)/search.tsx:1131-1160` renders a floating **map FAB** over the Discover view (`viewState === "discover"` only). It was invisible to the earlier grep because it is in the host and its testID carries no card/portal/hub keyword.

#### Finding B — two different map entries with different destinations
| Entry | Goes to |
|---|---|
| Card `discover-explore-map` | `/section/real-estate?map=1` — the **real-estate section** map |
| FAB `discover-map-toggle` | stays on the shared Search, commits a search and flips map mode on, with `category "all" → "car"` — i.e. effectively a **cars** map |
Both are legitimate flows, but on one screen two map affordances lead to two different worlds. **Owner decision** for the Maps wave — not changed unilaterally.

#### Finding C — two cards read as the same thing in English
"**Global supply portal**" (→ `/business/global-supply`, *RFQs, suppliers & industrial import — Alibaba-style hub*) sits directly above "**Global supply & importers**" (→ `/business/supply-hub`, *Source products, match importers & close export deals*). The owner treats them as distinct worlds (العالمية vs الموردين), but both labels open with "Global supply", so the list reads as a duplicate. Copy-only clarification (no layout change) — **owner decision on the wording**.

### Identity rules encoded in the design (any new/edited rectangle MUST follow these)
1. **Per-section gradients stay inside the BANCO red/charcoal family** — each card reads as its own world without leaving the brand.
2. **Red-family fallback fills sit behind the section photos** — stated in-code as the identity rule: *logo red*.
3. **A faint BANCO wordmark is embossed behind each card's content** — white-tinted, very low opacity, above the scrim but below the badge/label/chevron so it never fights legibility.

### Layer model (how the work cycle stays in harmony with the sections)
```
L1  Search host  → Discover = the 10 rectangles
L2  5 section mini-apps (4 share SectionSearchApp + Booking standalone)
L3  5 business/tool mini-apps (maps · import · global supply · suppliers · banks)
L4  Each mini-app's own system (inner screens + API + notifications)
```

### Observation the owner did not raise (surfaced during the census)
The **Maps** card opens the real-estate map only. That is a documented, deliberate choice (the destination is "honest" — it falls back to the list when a browse has no coordinates), but it is a real functional limit: cars/factories/materials also carry coordinates. Flagged for the Maps wave — **owner decision**, not changed unilaterally.

## 2b. Portal destinations — connection audit
Portal inventory read from `components/SearchDiscover.tsx` — **every destination file exists, so no dead buttons**:

| Portal (testID) | Owner's name | Destination | Route exists |
|---|---|---|---|
| `discover-explore-map` | الخرايط | `/section/real-estate?map=1` (via `onExploreMap`) | ✅ |
| `discover-car-import` | استورد عربيتك مع بانكو | `/section/car?engine=import` | ✅ |
| `discover-banks-hub` | البنوك والممولين | `/business/banks` | ✅ |
| `discover-importers-hub` | الموردين | `/business/supply-hub` | ✅ |
| `discover-supply-portal` | الحاجات العالمية | `/business/global-supply` | ✅ |
| `section-card-booking` | الإقامات | `/section/booking` | ✅ |

### 🔴 OPEN GAP — car-import entry is disconnected from the import system
The car-import card only **browses** imported cars. The live import flow that now exists end-to-end (L1–L7: `import_orders` → API → `/import/request` → `/import-tracking` → `car_import` notifications) is reachable **only from a Profile menu item** (`profile.tsx:943`); `/import/request` is reachable only from inside the tracking screen. A user standing on the Search page who wants to actually import a car cannot get there.

**Why this is not fixed unilaterally:** the card's destination is locked by an owner-approved guard — `tests/section-miniapp-guard.test.mjs:492` asserts the Discover file keeps `SECTION_ROUTE.car … engine=import`. Doc 09's original plan was to turn the card into an **Import hub** (`app/import/index.tsx`) offering: browse imported cars · request an import · my import orders.

**Owner decision needed — options:**
1. **Import hub** (doc 09's plan): card → `app/import/index.tsx` with the three paths; browse path preserved inside it. Requires updating that one guard assertion (it was written for the old behaviour).
2. **Additive, guard-safe:** keep the card on browse, and surface "Request an import / My orders" inside the car section's import view — no guard change.
3. Leave as-is (import stays a Profile-menu feature).

## 2c. Cross-repo archaeology (5 repos, all branches) — 2026-07-26
Repos mapped: `b.deals` (2 branches) · `aws-virgen` (1) · `B-OOM` (1) · **`-BANCO-CA-OOM-` (61 branches — where the two prior engineers worked)** · `bancoo` (9).

### The decisive discovery: the previous engineers were environment-blocked
Their own `KnownIssues.md` (2026-07-21): **`KI-ENV-01 | OPEN | npm registry ECONNRESET — no node_modules`**, and their #1 pending repair was *"Unblock KI-ENV-01 → frozen install → typecheck/lint/build/tests"*. **They could never install dependencies, so they never ran typecheck, build, or a single test.** That explains the documentation-heavy output and the doc-over-claim pattern recorded in [[banco-recon-docs-fiction]]. Every one of those blockers is now cleared: full install ✅, tsc 0 ✅, 81 test files green on CI ✅, `expo export` build ✅, app driven live ✅.

### Their official "MissingFeatures" list vs today
| Their item | Status now |
|---|---|
| Facebook Login provider | ✅ **built + verified** (`6778e65`) |
| FI auto-create | open — needs study (`audit/production-gates/FACEBOOK-LOGIN-AND-FI-AUTOCREATE-SECURITY-…`) |
| Google Maps as live map engine | open — owner decision (today: Leaflet/OSM in a WebView) |
| bancooom content (repo empty) | ✅ effectively closed — `virgen/main` now carries the full version |
| Live OTP/magic-link certification | open — needs a live run |

### Code-completeness verdict (reassuring)
102 files exist in CA-OOM but not here: **97 are docs/reports, 5 are report-generator scripts — zero application code.** The current version carries all app code.

### 🔴 THREE genuinely lost features (found by diffing CA-OOM against us)
| # | Feature | Evidence here | Impact |
|---|---|---|---|
| 1 | **Banks/FI “awaiting-admin link” state** | no `awaiting`/`adminLink` anywhere in `app/business/banks.tsx`; CA-OOM has it **plus a guard test** we don't | an FI user without membership never sees that an admin still has to link them |
| 2 | **Profile role must prefer `/me` over Clerk `publicMetadata`** | ours reads `user.publicMetadata?.role` at `profile.tsx:800` and `:1195`; CA-OOM guards *“Profile role prefers /me over Clerk publicMetadata”* | **real defect** — `syncRoleToClerk` swallows its errors by design, so when the mirror fails the profile shows a stale/wrong role for any of the 4 account types. The DB is the source of truth. |
| 3 | **`marketCountryMapCenter`** | absent from our tree; CA restored it after it was wiped in `93b650b` (orig `b68c8af`), wired into `lib/searchTaxonomy.ts` + `SearchResultsMap.tsx` + `.web.tsx` + `mapHtml.ts` | switching market country does not recenter the map |

Guard parity: ours **46** section-guard tests vs CA-OOM **48** — the two missing ones are exactly the guards for lost features #1 and #2.

### Correction to an earlier claim of mine
I previously reported the **radius draw/select** map tool as *missing*. Their `MAPS-ACCOUNTS-COMPLETE-MISSING` doc shows it is **deliberately deferred**, not forgotten: *“لم يُشحن كاملاً — يزاحم FilterSheet المضغوط”*. Also deferred by decision: `sort=nearest`, full web viewport clusters, near-me on web. **Not gaps — owner-level decisions.**

### Their accounts verdict matches mine independently
*"سلسلة الحسابات في المصدر مكتملة… أي عَرَض برودكشن بعد deploy = P1 Ops لا إعادة تصميم UX"* — the same conclusion my M1 audit reached from the code alone.

## 3. Product decisions to honour
- **The AI assistant is “B”** — the same **B** as the B-reaction that replaces like/heart (B‑OOM identity). It should feel **human**, not robotic.
  **Constraint from the owner: it is already programmed to a high standard — apply only a light, safe polish (tone/persona/naming). No rewrite, no behavioural risk.**
- **B‑OOM = B(anco) + Owners Opportunity Market.** Never alter the original logo/design.
- Rent model: furnished/daily = hotel-style booking (dates/nights/pay-through-us); long-term = plain listing (no dates, no payment).
- FI (banks) is an ads + financing-inbox surface — deliberately **not** a dealer storefront.

## 4. OPS gate (owner-side, not code)
1. Merge PR #8 (or treat `virgen/main` as canonical).
2. Coolify: deploy → run **once** `docker compose --profile migrate run --rm migrate` (creates `import_orders`) → set `OBJECT_STORAGE_PROVIDER=s3` + secrets.
3. Clerk prod: real `pk_live` + Allowed Origins + enable Google / Apple / **Facebook** (Meta app).
4. **Rotate the GitHub token** shared in chat.

## 5. Verification standard used on every change
`mobile tsc` + **all 7 mobile gates** (section-guard 46/46, icons, i18n-usage, lib-hardening, resilience, session-restore, universal-links) + `api-server tsc` when the server is touched + **CI on PR #8** (API tests on real Postgres, typecheck, mobile regression, web build) as the authoritative run.
