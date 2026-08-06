# 07 — Maps Audit

## Stack

| Piece | Path | Status |
|-------|------|--------|
| HTML map | `components/search/mapHtml.ts` | Leaflet+cluster **inlined**; OSM tiles network |
| Vendor | `mapVendorInline.ts` | MAP-07 Fixed |
| Native host | `SearchResultsMap.tsx` | WebView |
| Web host | `SearchResultsMap.web.tsx` | iframe `allow=geolocation` |
| Pin picker | `MapPinPicker.tsx` | Create/edit |
| Latch | `lib/mapLatch.ts` | Section + Stays |
| Market center | `lib/searchTaxonomy.ts` `marketCountryMapCenter` | **Present** (MASTER-TRACKER “absent” is stale) |
| API | `GET /v1/search/map` | Clusters + price/bookable |
| Engine | **Not** react-native-maps | By design |

## Ownership per section

| Section | Owner | Latch | Notes |
|---------|-------|-------|-------|
| Cars | SectionSearchApp | Yes | Discover chip |
| RE | SectionSearchApp + Discover Explore | Yes | Primary Discover CTA |
| Facilities | SectionSearchApp | Yes | Chip |
| Materials | SectionSearchApp + header | Yes | Chip |
| Stays | BookingStaysApp | Strong | Overlay claim — re-verify live |
| Import | None (browse via cars) | N/A | No shipment geo |
| Banks/supply | None | N/A | — |
| Shared Search | Local map when results | No mapLatch import | FAB → RE |

## Fixed (this workstream + #28)

MAP-01 latch · MAP-02 iframe geo · MAP-03 circle · MAP-04 cluster price/bookable · MAP-05 web near-me · MAP-06 locate Alert · MAP-07 inline vendor · MAP-08 nearest+gate · MAP-09 edit pin · MAP-10 bridge guards

## Remaining

| ID | Gap | Level |
|----|-----|-------|
| MAP-07b | OSM requires network | Medium (design) |
| MAP-08b | Draw-area polygon | Product deferred |
| — | Website map ≠ RN WebView parity (separate components) | Medium |
| — | Shared Search pin always `?focus=booking` for RE | Low/Medium |
| — | No offline tiles | Accepted |

## Permissions / recovery
- Near-me: `requestNearMeCoords` + denied Alert  
- Locate error: Alert on web (MAP-06)  
- Bridge guards: locate_error / viewport / BANCO_MAP (MAP-10)

## Maps score
**Implementation:** 8/10 for browse maps · **Ops/offline:** 5/10 · **Overall:** **7/10**
