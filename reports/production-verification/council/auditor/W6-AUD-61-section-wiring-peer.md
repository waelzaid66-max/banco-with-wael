# W6-AUD-61 — Peer Chair section-wiring truth (`73`)

- Seat: Production Auditor · Protocol **`68`** (producer + consumer)
- SoT: `main` @ **`6ad7a484cf5dcf6fa35f281212c2509bfdbd1274`**
- Chair evidence: `73-SECTION-WIRING-TRUTH-AUDIT.md` · Approve Plan `W6-CHAIR-APPROVE-PLAN-MAPS-CARS.md`
- Mode: **independent dual-end peer** · **zero product code** · await Owner Maps pick

## Peer results

| # | Chair claim | Auditor dual-end | Severity | Peer |
|---|-------------|------------------|----------|------|
| 1 | Discover Maps primary → RE | Producer `exploreOnMap` → `/section/real-estate?map=1` (`search.tsx:488-491`); FAB `discover-map-toggle` same (`:1084-1087`); copy `exploreMapSub` = properties (`i18n.ts:520` / AR `:2803`); UI `discover-explore-map` (`SearchDiscover.tsx:279-306`). Secondary portals car/materials/factories/booking `?map=1` (`:333-352`) **OK**. Consumer `mapLatch` / `SectionSearchApp` **OK**. **No** `/section/maps`. | **HIGH** | **CONFIRM DEFECT** |
| 2 | RE header ≠ Owner mock | `PropertyHomeHeader` exists (Chair inventory). No Owner reference in repo → cannot invent defect pixels. | MEDIUM / PRODUCT | **CONFIRM HOLD** |
| 3 | Cars tertiary “deleted” | `car.tsx:22` `engines: "pill"`; `SectionSearchApp:1658-1675` → single `FilterPillSelect` `section-engine` (not `engine-*` chips). Contract still has new/used/import + fuel/trans (`search-contract` `CAR_ENGINES`). Factories still `engines: "chips"`. | **HIGH** | **CONFIRM DEFECT** (buried ≠ deleted) |
| 4 | Brands first-paint empty / country-like | Strip = one `car-brand-btn` (`SectionSearchApp:1807-1854`); taxonomy ~100+ / **16** popular; FilterSheet popular-only (Chair). | **HIGH** / UX | **CONFIRM** |
| 5 | Location/maps buried | FilterSheet location/nearMe + section latch OK; Discover primary wrong (#1). | MEDIUM | **CONFIRM RISK** |
| 6 | Sections “unstable” | Asymmetric chrome intentional; locks/REL-10/12 strong. | MEDIUM | **CONFIRM MIXED** |
| 7 | Banks incomplete | Brochure + inbox; D-11 intentional (`banks.tsx:496`). | LOW | **CONFIRM INTENDED** — not defect |

## Anti-pollution (binding)

| Prior stamp | Action |
|-------------|--------|
| Zone A Explore-on-map → RE as healthy wiring | **SUPERSEDED / WRONG PRODUCT** under Owner order + `68` |
| Zone B MOB-B-02 “Explore-on-map CTA → RE = HEALTHY” | **RETRACT for map primary product** — latch consumer remains OK; **producer primary is the defect** |
| Accept #32 staging | **Still valid** — these are post-Accept chrome defects, not Accept blockers for Coolify tip |

## Align with Approve Plan

| ID | Auditor stance |
|----|----------------|
| **REL-16** | **SUPPORT** — Owner pick A/B/C first; default A if Owner silent (Chair). Peer after force-exec only. |
| **REL-17** | **SUPPORT** — restore chips visibility; keep FilterSheet; no API enum invent. |
| **REL-18** | **SUPPORT** after REL-17 — popular chip row + picker UX per Owner. |
| **PROD-RE-HEADER** | **HOLD** until Owner reference. |
| Banks directory | **HOLD** (D-11). |

## Forbidden this seat

Product repairs · invent RE mock · Coolify/DNS · Live Certified · CAR IMPORT W4/5 · tip fight · currency SoT.

## Auditor JUDGMENT

Chair `73` is **evidence-true** on `main`. Auditor peers **HIGH** on Maps→RE and Cars pill burial. Standing by for Owner Maps pick + Chair Approve paste → then VERIFY/peer only.
