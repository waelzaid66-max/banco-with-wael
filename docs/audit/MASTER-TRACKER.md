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

## 2d. The engineers' MissingFeatures list — now fully resolved
Their `audit/production-gates/FACEBOOK-LOGIN-AND-FI-AUTOCREATE-SECURITY` marks both remaining items **INTENTIONALLY NOT IMPLEMENTED (security + tenant truth)**, which changes what "missing" meant:

| Item | Resolution |
|---|---|
| Facebook Login | Their own prescribed path was: (1) owner enables it in Clerk + Meta, (2) **add `oauth_facebook` beside Google/Apple with the same redirect contract**, (3) update tenant memory. The owner did (1) and asked for it; `6778e65` is exactly (2) — a real strategy, not a stub; (3) is now done. **Closed.** |
| **FI auto-create** | **Must never be built.** Auto-creating a financing intermediary at signup would mint a privileged org with no admin review = permission escalation. Their own "already product-complete" table shows the only missing link was the **awaiting-admin-link UI** — which is exactly what R2 restored. **Closed by R2.** |
| Google Maps as engine | still an owner decision (today: Leaflet/OSM) |
| bancooom content | closed — `virgen/main` carries the full version |
| Live OTP/magic-link certification | needs a live run on a real device |

### ⚠️ Launch blocker recorded (not a code defect)
`.agents/memory/banco-auth-tenant-limits.md` carries a live probe from 2026-07-21: the **production** Clerk instance (`clerk.banco.today`, `pk_live`) had **no social providers at all** — `social` empty, `identification_strategies = ["email_address"]`. That means **Google and Apple were already dead paths on production too**, not just Facebook. All three start working with **zero code changes** the moment each provider is configured in the Clerk Dashboard. **Before any store submission, confirm each enabled provider actually resolves on `pk_live` — shipping a visible social button that always errors is a review risk.**

## 2e. Performance & media pipeline (owner: cache · CDN · image/video processing)
Audited from code, not assumed.

| Concern | Reality today | Verdict |
|---|---|---|
| Profile-open cycle (signup → profile) | 4 queries fire **in parallel**, every one `enabled: !!user` (a guest never fires an authed call) with `staleTime` 60s (me / metrics / social) and 30s (listings). The DB row is created lazily on the first authed call, race-safe, and the welcome email is fire-and-forget so it can never delay the screen. | ✅ already optimised |
| Image caching in-app | `expo-image` on 12 surfaces (disk + memory cache built in) | ✅ |
| Media cache headers | S3 layer sets `Cache-Control: public\|private, max-age=3600` per object visibility | ✅ CDN-ready |
| Upload compression | Cover + avatar picked at `quality: 0.6` before upload | ✅ |
| Upload security | Presigned S3 PUT; serving URLs promoted/verified server-side | ✅ |
| **CDN** | **Not configured anywhere** — absent from `.env.example`, the Coolify compose, the nginx config and the deploy doc. Every image is served from a single origin. | 🔴 **real gap — ops, not code** |

**Why the CDN gap matters at this scale:** users in the Gulf, Morocco and Europe all pull media from one origin, so latency and egress both scale with traffic. **The app is already CDN-ready** — the correct cache headers exist — so this is a deployment/config task (point a CDN at the media origin, publish media through the CDN hostname), not an application rewrite. Recorded here so it is not mistaken for a code defect.

### The rest of the media pipeline — now audited (was listed as pending)
| Concern | Reality | Verdict |
|---|---|---|
| Listing upload compression | images `quality: 0.7`, profile cover/avatar `0.6` | ✅ |
| Video | modern `expo-video` (not deprecated `expo-av`); duration capped via `videoMaxDuration` + `allowsEditing`, so an over-long clip is **trimmed in-app instead of rejected**; a server-side size guard test exists | ✅ well handled |
| Thumbnail selection | `pickListingThumbnailUrl`: explicit cover → first image → **video poster**, with an explicit guarantee that a raw video file never reaches an `<Image>` (a real bug class, prevented) | ✅ |
| Feed prefetch | batched `Image.prefetch` with a Set that de-dupes, run both on load and for upcoming items while scrolling, non-blocking | ✅ |
| **Image resizing** | **None.** The thumbnail picker returns the **original** upload URL, so a feed card downloads a full-resolution image. | 🔴 gap |

**These two gaps are one problem.** Modern platforms do resizing **at the CDN edge** (Cloudflare Images / imgix / CloudFront). Adding a CDN with image transformation closes both the caching gap and the resizing gap **without touching app code** — the cache headers already exist and every media URL is built from one origin. At feed scale (≈20 cards × full-resolution images) this is the single highest-impact performance item for mobile networks across EG/Gulf/MA/EU.

## 2f. Full-cycle rule (owner, standing)
Any task is only finished when its **whole journey** is inspected end to end — e.g. signup → account created → **profile actually opens fast** — not just the file that was edited. Applies to every module below.

## 2g. M4 — the publish journey (highest-value cycle, audited end to end)
Prioritised above the remaining polish because a marketplace with no successful publish has no inventory. Audited from the create wizard through to the listing appearing in the feed.

| Stage | What the code actually does | Verdict |
|---|---|---|
| Draft | Multi-step wizard persists a draft and restores the step on return | ✅ |
| Submit guard | Re-runs `validateStep` for **every prior step** and jumps back to the first failure, so a deep-linked or edited draft can't post an invalid body | ✅ |
| Requests vs sales | A buyer request omits `base_price_cash` entirely so the server applies request rules instead of storing a 0 price; photos optional for requests, required for sales | ✅ subtle and correct |
| Thumbnail | Flags the **first image** (never a leading video) as `is_thumbnail`, mirroring the server's `pickListingThumbnailUrl` — the feed renders it in an `<Image>` | ✅ contract honoured on both sides |
| Media race | Re-checks every tile is `uploaded` even though the button is already gated, "so a race can never POST a half-uploaded set" | ✅ |
| Phones | Normalised to E.164 per country | ✅ |
| Payment plans | Cash always present; installment plans validated (monthly + duration required, profit rate bounded 0–100) | ✅ |
| Market stamp | `market_country` + `currency` written into specs; origin (local/imported) only for car + industrial, never for a request | ✅ |
| **Failure** | 402/403 → explicit quota copy; otherwise the **real API reason** is extracted from the error and shown, instead of a silent generic retry | ✅ |
| **After success** | Clears the stale draft, then `bumpListings()` bumps `listingsVersion` in SessionContext — consumed by the home feed and the profile grid, so the new listing appears **with no manual pull-to-refresh** | ✅ cycle closes |

**Verdict: the publish path is production-grade; no defects found.**

### Bonus: an old known bug is confirmed FIXED
The historical "#1 publish failure" (mobile sent the Arabic location *label* while the backend fuzzy-matches the English taxonomy → 400 on every publish) is resolved: create now sends `(locationValue ?? location).trim()` with an explanatory comment, and dealer-os listings moved from a free-text input to a controlled `<Select>`. dealer-os **investments** still take free text, and that is correct — `InvestmentService` never normalises location (plain `ILIKE`), so it does not use the listing taxonomy. **Standing rule kept:** location has no Arabic alias map and the `locations` table has no Arabic column, so any NEW location field must submit the controlled English value.

## 2h. M3 — Maps (foundation module, audited before the flows that sit on it)
Re-ordered at the owner's direction: maps and the mini-apps are the base that publishing, notifications and messaging build on, so they are completed first.

### What the map already is — a two-layer, production-grade surface
| Layer | Implementation | Verdict |
|---|---|---|
| Instant paint | The loaded page's markers render immediately as **price pills**, so the map is never blank while the first viewport query is in flight | ✅ |
| Live data | **Server-side viewport clusters** via `GET /search/map`; the page reports its bounds on load and after every pan/zoom (`{type:"viewport"}`) and the host injects the clusters back | ✅ |
| Pin content | The **localized, pre-formatted price** sits on the pin; furnished/daily rentals get a **📅 bookable** prefix | ✅ |
| Section colour | `.pill.car` / `.real_estate` / `.industrial` — and that is **complete**, because the DB enum has exactly three categories; "facilities" and "materials" are UI views of `industrial` (hence `apiCategoryForUi`). All stay inside the BANCO red family per the identity rule stated in-code; bookable emerald is a *status* colour that deliberately wins over the section tint | ✅ no gap |
| Coverage | Coordinates resolve as `COALESCE(listing.lat, location.lat)`, so a listing with no precise pin still maps from its city/area — **nothing is unmappable** | ✅ |
| Per section | `showMapChrome = inResultsView` — the map is available in **all five sections**, not real-estate only | ✅ |
| Market framing | `marketCountryMapCenter` (restored, R3) | ✅ |
| Near-me | radius circle + centre dot, with the 5/10/25/50/100 km control | ✅ (this wave) |

### Genuine remaining gaps
| Gap | Nature |
|---|---|
| The Discover "Explore on the map" card opens the **real-estate** map only, although every category is mappable | **owner decision** — the destination is deliberate today |
| Draw-an-area / polygon select | deferred by the previous engineers (would crowd the compact FilterSheet); the km-radius control now covers the common case |
| `sort=nearest` | deferred — changes result ordering |
| Full web viewport clusters | deferred to a `.web.tsx`-only wave |

**Verdict: the map is not a weak spot — it is one of the stronger subsystems.** The remaining items are two deferred decisions and one owner choice, not defects.

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
