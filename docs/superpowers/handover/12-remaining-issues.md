# 12 — Remaining Production Issues

Consolidated from ledgers + this audit. **Not fixed in handover session.**

## P0 / Blocker (ops)

| ID | Issue |
|----|-------|
| OPS-01 | Confirm `import_orders` + `import_order_documents` migrated on prod |
| OPS-02 | OBJECT_STORAGE / S3 for document uploads |
| NOTIF-02 | EAS/APNs/FCM delivery certification |
| NOTIF-10 | API base + Clerk env secrets for push |

## P1

| ID | Issue |
|----|-------|
| MSG-08b | Hard block-user needs schema |
| ADMIN-01 | No admin UI for import stage advances |
| CC-01 | listingPreview EGP hardcode |
| SEARCH-01 | Shared Search CLEAR_* drift |
| RTL-01 | No I18nManager.forceRTL |
| ROLE-01 | Profile role may prefer Clerk metadata over `/me` (MASTER-TRACKER; re-verify) |
| WEB-01 | banco-web missing workspace settings |
| WEB-02 | Website nearest sort missing |
| VIS-01 | No full visual screenshot corpus |

## P2

| ID | Issue |
|----|-------|
| MSG-05 | WS/typing/presence |
| MSG-13 | Per-thread mute |
| MSG-14c | Voice recorder |
| NOTIF-04b | Durable push queue |
| MAP-07b | OSM network |
| MAP-08b | Draw-area |
| SEARCH-02 | Sort strip vs sheet inconsistency |
| CC-02 | Wallet device locale money |
| CC-03 | LocationPicker ≠ marketCountry |
| IMPORT-01 | Live auctions |
| IMPORT-02 | VIN/insurance/payments |
| IMPORT-03 | Shipment geo map |
| IMPORT-04 | Website car-import surface |
| DOC-01 | Stale MASTER-TRACKER / PRODUCTION-STATE |

## P3

| ID | Issue |
|----|-------|
| DEAD-01 | landing orphan not-found |
| DEAD-02 | ReServiceDesks orphan |
| DEAD-03 | mockup-sandbox empty |
| UX-01 | Auth only inside Profile tab |
