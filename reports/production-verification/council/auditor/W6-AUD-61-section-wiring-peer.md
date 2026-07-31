# W6-AUD-61 — Maps stack dual-end inventory (World 7)

- Seat: Production Auditor · World: **Maps** only
- SoT: `main` @ `6ad7a484cf5dcf6fa35f281212c2509bfdbd1274`
- Orders: `74` AUD-61 · design §2 Maps stack · `73` §1
- Mode: evidence only · **DO NOT DELETE** any listed asset

## A. Stack present (do not gut)

| Asset | Path | Role |
|-------|------|------|
| Leaflet + CSS | `assets/map-vendor/leaflet.js` · `leaflet.css` | Offline vendor |
| MarkerCluster | `assets/map-vendor/leaflet.markercluster.js` · `MarkerCluster*.css` | Clusters |
| Vendor inline | `components/search/mapVendorInline.ts` | Bridge |
| HTML bridge | `components/search/mapHtml.ts` | WebView HTML |
| Results map | `SearchResultsMap.tsx` / `.web.tsx` | Map UI |
| Overlay | `MapOverlayChrome.tsx` | Count + pin preview |
| Latch helpers | `lib/mapLatch.ts` | `wantsMapFromParam` · `openOrLatchMap` · `resolveMapLatch` |
| Seller pin | `components/MapPinPicker.tsx` | Create/edit (World 10 adjacent) |

## B. Producers (Discover — World 1 → Maps)

| Control | Destination | Dual-end | Verdict |
|---------|-------------|----------|---------|
| Primary `exploreOnMap` / `discover-explore-map` | `/section/real-estate?map=1` | `search.tsx:488-491` + `SearchDiscover.tsx:279-306` | **DEFECT HIGH** — Maps≠RE law broken |
| FAB `discover-map-toggle` | same `exploreOnMap()` | `search.tsx:1084-1087` | **DEFECT** (same) |
| Portal car | `/section/car?map=1` | `SearchDiscover.tsx:333` | **OK** |
| Portal materials | `/section/materials?map=1` | `:339` | **OK** |
| Portal factories | `/section/factories?map=1` | `:345` | **OK** |
| Portal stays | `/section/booking?map=1` | `:351` | **OK** |
| Copy | `exploreMapSub` = properties | `i18n.ts:520` / AR `:2803` | **DEFECT** (RE identity) |
| Route `/section/maps` | — | absent | N/A (Opt B future) |

## C. Consumers per section (`?map=1`)

| World | Host | Latch / map open | Verdict |
|-------|------|------------------|---------|
| B-oom Car | `SectionSearchApp` category=`car` | `mapLatch` + `params.map` (`SectionSearchApp.tsx:308-315`, `:386+`) · `SearchResultsMap` | **OK consumer** |
| B-PROPERTIES | same + `PropertyHomeHeader` map | `re-header-map` → `openOrLatchMap` | **OK consumer** |
| Materials | `MaterialsHomeHeader` | `materials-header-map` | **OK consumer** |
| Factories | `SectionSearchApp` | shared latch | **OK consumer** |
| BOOM STAY | `BookingStaysApp` | same `mapLatch` helpers (`:54`, `:310-347`, `:707`) · `stays-header-map` | **OK consumer** |

**Judgment:** Maps **tech stack intact**; Maps **identity mis-surfaced** via Discover primary → RE. Repair = REL-16 (Approve-gated), not vendor rewrite.

## D. Peer of Chair HIGH (#1)

**CONFIRM** producer primary defect; consumer latch **not** the break. Align design Opt **A** recommended.
