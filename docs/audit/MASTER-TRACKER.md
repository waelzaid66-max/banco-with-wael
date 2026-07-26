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

## 2b. The Search-page mini-apps (owner: top priority, "layers under the 5 sections")
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
