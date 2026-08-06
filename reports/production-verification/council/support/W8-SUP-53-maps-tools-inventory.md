# W8-SUP-53 — Maps §7 tools inventory + Tranche C peer (Idle)

**Seat:** Idle / Support · `bc-019fb4d4…1e3d`  
**Orders:** `82` (A+B+C CLOSED) · Idle SUP-50 · Owner: مهام متبقية · تحديثات · أدوات الخرائط  
**SoT:** `main` @ `7e3b40a` (Wave9 E · NO-DELETE still binding)  
**Date:** 2026-07-31  
**Mode:** Docs only · **zero product code** · no Leaflet delete  

---

## 1. Chair orders reviewed (Maps-relevant)

| Doc | Idle reading |
|-----|----------------|
| `87` §1 | NO-DELETE Leaflet / FilterSheet / mapLatch **PRESENT** on tip |
| D-W9-01 | Maps gold → `sectionAccent("all")` **CLOSED E** |
| D-W9-05 | world-tabs `flexGrow:0` **CLOSED E** |
| `85` Wave9 | Idle SUP-50 board only · Replit confirms Maps RED |

---

## 2. Peer VERIFY Tranche C @ tip

| ID | Check | Result |
|----|-------|--------|
| D-W8-04 | No `const applySaved` / `function applySaved` in `search.tsx` | **PASS** (comment-only warn remains — intentional) |
| D-W8-05 | `maps.tsx` · `MapsHubApp` · Discover/search prose say **§7** | **PASS** |
| D-W8-05 | Guards MOB-07 / Discover FAB titles → Maps §7 not RE | **PASS** |
| D-W8-06 | lib-hardening forbids reintroducing `applySaved` | **PASS** (assert present) |
| Maps primary | `router.push("/section/maps")` | **PASS** |

---

## 3. Maps tools stack (do-not-delete · verified present)

### Vendor (offline Leaflet — MAP-07)

| Path | Role |
|------|------|
| `assets/map-vendor/leaflet.js` | Leaflet core |
| `assets/map-vendor/leaflet.css` | Leaflet CSS |
| `assets/map-vendor/leaflet.markercluster.js` | MarkerCluster |
| `assets/map-vendor/MarkerCluster.css` | Cluster CSS |
| `assets/map-vendor/MarkerCluster.Default.css` | Cluster default |

### Bridge + render

| Path | Role |
|------|------|
| `components/search/mapVendorInline.ts` | Inlined CSS/JS exports for WebView |
| `components/search/mapHtml.ts` | `buildMapHtml` · `feedItemsToMarkers` |
| `components/search/SearchResultsMap.tsx` | Native WebView map |
| `components/search/SearchResultsMap.web.tsx` | Web iframe map |
| `components/search/MapOverlayChrome.tsx` | Count + pin preview chrome |
| `components/MapPinPicker.tsx` | Listing geo pin (create/edit) |
| `lib/mapLatch.ts` | `wantsMapFromParam` · `openOrLatchMap` · `resolveMapLatch` |

### §7 hub

| Path | Role |
|------|------|
| `app/section/maps.tsx` | Route → `MapsHubApp` |
| `components/search/maps/MapsHubApp.tsx` | Hub UI · world tabs · reuses `SearchResultsMap` |

### Hub tools (behavior — present · re-verified `6999915`)

| Tool | Evidence |
|------|----------|
| World tabs All/Car/RE/Materials/Factories/Stays | `WORLD_TABS` · `testID=maps-hub-world-tabs` |
| Open section with `?map=1` | `maps-hub-open-section` → `/section/{car\|real-estate\|materials\|factories\|booking}?map=1` |
| List / map toggle | `maps-hub-list-toggle` · `maps-hub-list` |
| Map render | `SearchResultsMap` inside hub · brand `maps-hub-brand` |
| Listing open | `SearchResultsMap` → `/listing/{id}` |
| Retry | `maps-hub-retry` |
| Discover CTA | `SearchDiscover onExploreMap` → `router.push("/section/maps")` |
| Section latch (non-hub) | `SectionSearchApp` / `BookingStaysApp` use `wantsMapFromParam` |
| Hub self-`?map=1` | **not** wired (`MapsHubApp` has zero `mapLatch` import) — HOLD only |

**Forbidden:** delete/gut any row above without Chair Approve naming §7 + blast radius.

---

## 4. Remaining Maps-adjacent gaps (honest — not freestyle fixes)

| ID | Item | Class |
|----|------|-------|
| H-MAP-HUB-LATCH | `MapsHubApp` does not call `wantsMapFromParam` — `/section/maps?map=1` would no-op | **HOLD** (no live broken producer; Discover uses bare `/section/maps`) |
| H-OSM | OSM tiles still need network (MAP-07 vendor is JS/CSS only) | Known · not a delete ticket |
| C-77-AGE | Older inventory docs may still say “#11” in places | Docs rebind when Chair next pass |
| Live cutover | Coolify/DNS | Owner ops |

**Open product DEFECT on Maps tools:** **none** after Tranche C.

---

## 5. Idle posture

SUP-50 board updated for Tranche C. SUP-52 D-W8-01 adjudication still awaits Chair Opt A/B/C.  
**STANDBY** · ask before World · zero product code.
