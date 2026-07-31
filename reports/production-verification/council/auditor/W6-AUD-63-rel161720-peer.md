# W6-AUD-63 — Peer VERIFY REL-16/17/20 @ EXECUTE tip `85cfe7f`

- Seat: Production Auditor · Protocol `68` dual-end  
- Tip: `cursor/section-wiring-audit-e37c` @ **`85cfe7faeae52214307f7c73eb83483d829b8c67`**  
- Chair EXECUTE: `75-WAVE6-MAPS-MINIAPP-11-EXECUTE.md`  
- Orders: `74` AUD-63 · Owner Maps mini-app **#11**  
- Stamp: `2026-07-31T15:01:45Z`  
- Mode: **VERIFY only** — zero product code

## REL-16 — Maps primary → `/section/maps` (not RE)

| Check | Evidence | Pass |
|-------|----------|------|
| Producer `exploreOnMap` | `search.tsx:488-491` `router.push("/section/maps")` | **YES** |
| No RE hardcode in primary | comment `:485-486` · guard forbids `real-estate?map=1` in exploreOnMap | **YES** |
| FAB same producer | `discover-map-toggle` → `exploreOnMap()` `:1087` | **YES** |
| CTA present | `SearchDiscover` `discover-explore-map` | **YES** |
| Route mini-app #11 | `app/section/maps.tsx` → `MapsHubApp` | **YES** |
| Stack registered | `_layout.tsx` `name="section/maps"` | **YES** |
| Hub reuses Leaflet map | `MapsHubApp` imports `SearchResultsMap` · `testID="maps-hub"` | **YES** |
| Hub feeds sections (intentional dup) | world tabs → car/RE/materials/factories/booking `?map=1` | **YES** |
| Discover secondary portals kept | car + **properties** + materials + factories + stays `?map=1` | **YES** |
| Copy not property-only | `exploreMapSub` = “Open BANCO Maps — every catalogue…” / AR maps section | **YES** |
| Guard MOB-07 retargeted | `section-miniapp-guard` exploreOnMap → `/section/maps` | **YES** |
| Vendor not deleted | `assets/map-vendor/*` present | **YES** |

**AUD-63 REL-16: PASS**

## REL-17 — Cars tertiary chips visible

| Check | Evidence | Pass |
|-------|----------|------|
| Car chrome | `car.tsx` `engines: "chips"` (was pill) | **YES** |
| Strip renders chips | `SectionSearchApp` `testID={\`engine-${e.key}\`}` path when not pill | **YES** |
| Guard chrome contract | car file must match `listingMode:"pill"` + `engines:"chips"` | **YES** |
| FilterSheet kept | still wired in SectionSearchApp | **YES** |
| API enums untouched | no invent — existing CAR_ENGINES | **YES** |

**AUD-63 REL-17: PASS**

## REL-20 — CarsHomeHeader Stay-parity (named in EXECUTE)

| Check | Evidence | Pass |
|-------|----------|------|
| Header component | `components/search/car/CarsHomeHeader.tsx` `cars-home-header` | **YES** |
| Mounted for car | `SectionSearchApp:1375-1411` `<CarsHomeHeader …>` | **YES** |
| Map affordance | `cars-header-map` → `openOrLatchMap` | **YES** |
| Guard | mounts CarsHomeHeader + BOOM brand markers | **YES** |
| Car ≠ Import | Discover still `discover-car-import` → `/import`; car.tsx comments forbid melt | **YES** |

**AUD-63 REL-20: PASS** (present on tip; visual UNVERIFIED)

## Forbidden honored

| Forbidden | Observed |
|-----------|----------|
| Delete Leaflet/clusters/FilterSheet/Import/Stay | **Not deleted** |
| Banks directory / RE header freestyle | **Not touched** |
| Live Certified | **Not claimed** |

## HOLD remains

REL-21 vehicle taxonomy · OPS cutover NOT_CUTOVER · device visuals.

## Auditor JUDGMENT

**ALREADY_FIXED_ON_TIP** · peer **PASS** for REL-16 + REL-17 + REL-20.  
Do **not** re-implement. Absorb Auditor evidence onto #39; merge when Reliability REL-00 green.

**Does not equal Live Certified.**
