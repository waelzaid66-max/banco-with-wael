# 11 — Previous Agent Pollution Report

## Definition
Pollution = docs/code that **overclaim**, **mislabel**, **duplicate**, leave **dead paths**, or leave **temporary workarounds** that mislead successors.

## Doc pollution (high severity)

| Item | Pollution | Truth | Evidence |
|------|-----------|-------|----------|
| MASTER-TRACKER Discover car-import gap | Says card only browses | Card → `/import` hub | SearchDiscover + guard |
| MASTER-TRACKER nearest deferred | Says deferred | MAP-08 Fixed + gate | FilterSheet + SearchService |
| MASTER-TRACKER marketCountryMapCenter absent | Says absent | Present in searchTaxonomy | code |
| MASTER-TRACKER Discover FAB → cars | Historical | Now RE Explore | search.tsx |
| PRODUCTION-STATE map “pins only” | 2026-07-25 | Circle+clusters+inline | mapHtml |
| production-wiring-audit-notifs item 16 | Discover map only RE Deferred | Chips exist | SearchDiscover |
| Same audit items 22–24 | Deferred list | Some fixed (MSG-15); others unverified | — |
| Reconstruction docs fiction | Claimed commits that never existed | Documented historically | PRODUCTION-DELIVERY-ACCEPTANCE |

## Code pollution cleaned by this workstream (MSG/MAP/NOTIF)

| Was | Now |
|-----|-----|
| Soft-hide labeled Delete | Hide copy |
| nearest silent recommended | Client gate |
| Website thread text-only / length mark-read | Media + newest-id + soft-send |
| Inventory claimed missing Discover chips | Corrected |
| CDN Leaflet | Inlined vendor |
| Duplicate send on refetch fail | MSG-06 cache seed |

## Remaining code / architecture pollution

| Item | Notes | Severity |
|------|-------|----------|
| Shared Search CLEAR_* drift | Not using CLEAR_SECTION_ATTRS | Medium |
| Triplicated near-me / sort cycle | Section/Stays/tab | Medium |
| Local serializeCriteria | vs criteriaKey | Low |
| banco-web missing settings | Twin drift | Medium |
| landing orphan not-found | Dead file | Low |
| ReServiceDesks orphan | Dead component | Low |
| mockup-sandbox empty | Dead preview target | Low |
| Dealer `/import` name collision | CSV vs car import | High confusion |
| ensureSchema ≠ full migrate | False sense tables exist | **High** |
| API nearest soft-fallback | Server still lies if client bypassed | Medium |
| Early audit “Deferred” left unreconciled | Doc debt | Medium |

## Temporary / abandoned (this agent memory)

| Item | Fate |
|------|------|
| PR #27 | Closed; continued as #30 |
| Partial inbox hide edit mid-wave | Completed wave 7 |
| Offer useState mid-component | Hoisted |
| InvalidCredentials prune attempt | Rejected; DeviceNotRegistered-only |
| WebSocket chat | Explicitly NOT built (G47) |
| Hard block-user | Not invented (needs schema) |
| Draw-area map | Deferred MAP-08b |

## Prior multi-repo archaeology pollution
Multiple stale app copies on Owner machines historically (`MASTER-TRACKER`); only current monorepo tip matters. Do not merge CA-OOM wholesale.

## Pollution cleanup priority for successor
1. Rewrite/stamp MASTER-TRACKER stale sections or archive with banner  
2. Reconcile early wiring-audit Deferred table  
3. Fix CLEAR_* drift (safe code)  
4. Rename or subtitle dealer Import to “Bulk CSV”  
5. Deploy note: drizzle required for import tables
