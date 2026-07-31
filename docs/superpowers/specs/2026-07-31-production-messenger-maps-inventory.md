# Production inventory — messenger, notifications, maps (2026-07-31)

**Branch:** `cursor/production-wiring-messenger-maps-1e3d`  
**Rule:** No deletes of product features — complete wiring, report every gap, fix blockers first.  
**Related open drafts (do not close/forget):** #12 #15 #17 #18 #19 #20 #21 #22 #25

## Wave status (this branch)

| ID | Problem | Severity | Status |
|----|---------|----------|--------|
| MSG-01 | Listing→chat dropped `listingId`/`role` (share/offer unwired) | High | **Fixed** |
| MSG-02 | Company→chat same drop | High | **Fixed** |
| MSG-03 | Assistant→chat no `listingId` forward | Medium | **Fixed** (role never invented) |
| MSG-04 | Docs claimed WebSocket; chat is poll-only G47 | Medium | **Fixed** (`DEPLOY_COOLIFY.md`) |
| NOTIF-01 | Message push/in-app missing recipient `role` (mark-sold) | High | **Fixed** (server stamp + router) |
| MAP-01 | `?map=1` latch required page pins → Discover map stuck | High | **Fixed** (open on results) |
| MAP-02 | Web map iframe no geolocation permission | Medium | **Fixed** (`allow="geolocation"`) |

Guards: `test:messenger-wiring` · `test:production-wiring` · existing `test:notification-routing`

---

## A. Messenger — remaining gaps (not deleted; tracked)

| ID | Gap | Severity | Notes |
|----|-----|----------|-------|
| MSG-05 | Poll-only (3s/8s/15s) — no WS/typing/presence | Product | G47; needs Owner decision before rewrite |
| MSG-06 | Send succeeds + refetch fails → duplicate retry risk | High | `messages/[id].tsx` deliver() |
| MSG-07 | Unbounded history fetch every poll | High | API `getMessages` no cursor |
| MSG-08 | No block-user / report-message | High | Trust & safety |
| MSG-09 | Thread error looks like empty chat | Medium | No `isError` UI |
| MSG-10 | Failed reply retry drops `reply_to_id` | Medium | Pending bubble model |
| MSG-11 | Email CTA `/messages/:id` vs website `/workspace/messages` | Medium | Deep link mismatch |
| MSG-12 | Import support opens generic inbox | Medium | No order-context thread |
| MSG-13 | No per-thread mute | Medium | Global prefs only |
| MSG-14 | Video/audio API > mobile renderer (images only) | Medium | |
| MSG-15 | Inbox empty state no browse CTA | Low | Deferred P2 in #22 |
| MSG-16 | No client `maxLength` (server 4k) | Low | |

**Architecture (keep):** HTTP polling · participant auth · listing-anchored conversations · inbox already passes listingId+role.

---

## B. Notifications — remaining gaps

| ID | Gap | Severity | Notes |
|----|-----|----------|-------|
| NOTIF-02 | EAS/APNs/FCM device delivery not certified | Blocker (ops) | External credentials |
| NOTIF-03 | Sign-out may leave registered push token | High | Soft sign-out path |
| NOTIF-04 | No Expo receipt processing / retry queue | High | `PushService` |
| NOTIF-05 | Unread badge capped at newest 100 | Medium | |
| NOTIF-06 | OS badge not in push payload | Medium | Home-tab sync only |
| NOTIF-07 | Push registration single-attempt | Medium | |
| NOTIF-08 | “In-app” toggle also suppresses push | Medium | Label vs semantics |
| NOTIF-09 | Unknown notification tap → null (dead) | Medium | Should fall back to feed |
| NOTIF-10 | API base / Clerk env required for any delivery | Blocker (ops) | Cloud/EAS secrets |

---

## C. Maps — per section

| Section | Map | Latch | Sync filters | Gaps |
|---------|-----|-------|--------------|------|
| Cars | Yes (shared) | Fixed MAP-01 | Yes | No Discover map producer |
| Real estate | Yes + Discover Explore | Fixed MAP-01 | Yes | Off-page pin always `?focus=booking` |
| Booking/Stays | Yes (best latch) | OK | Yes | Off-page pins lose price/bookable |
| Facilities | Yes | Fixed MAP-01 | Yes | No map-first CTA; shared industrial tint |
| Materials | Yes | Fixed MAP-01 | Yes | Same industrial tint; no map-first CTA |
| Car Import hub | Indirect via cars+import engine | N/A | Via cars | No shipment geo map; no `map=1` producer |

### Shared map gaps (tracked, not erased)

| ID | Gap | Severity |
|----|-----|----------|
| MAP-03 | Near-me radius circle removed from `mapHtml` (docs drift) | High |
| MAP-04 | `/search/map` clusters lack `price_display` / `is_bookable` | High |
| MAP-05 | Web near-me criteria unavailable (`requestNearMeCoords` null) | Medium |
| MAP-06 | Web locate failure silent | Medium |
| MAP-07 | CDN Leaflet/OSM dependency | Medium |
| MAP-08 | No draw-area / sort=nearest | Product deferred |
| MAP-09 | Listing **edit** missing MapPinPicker (create has it) | Medium |
| MAP-10 | No E2E pan→cluster→open interaction test | Medium |

**Stack (keep):** Leaflet 1.9.4 + MarkerCluster · WebView/iframe · OSM · server viewport clusters. Not react-native-maps.

---

## D. Open PR ledger (do not forget)

| PR | Topic | Relation |
|----|-------|----------|
| #12 | Phase Zero audit docs | Inventory source |
| #15 | Car import W3 docs upload | Import track |
| #17 | Discover not force cars | Nav honesty |
| #18 | UI density | Chrome |
| #19 | Banks honesty | Honesty |
| #20 | Stay honesty | Honesty |
| #21 | Messenger listing chrome | **Superseded/continued by this branch** |
| #22 | B-PROPERTY + some map/notif fixes | Partial overlap — chrome separate |
| #25 | Materials B-CORE | Separate materials UI |

---

## E. Next precise waves (no deletion)

1. MSG-06 send/refetch atomicity + MSG-07 cursor pagination  
2. MAP-03 restore near-me radius circle + MAP-04 enrich cluster DTO  
3. NOTIF-03 token unregister on soft sign-out + NOTIF-09 fallback route  
4. Per-section map producers (cars/materials/facilities `?map=1` CTAs) when Owner wants  
5. Merge honesty drafts #17–#20 in Owner-chosen order  

## F. Features that ARE connected (show full capability)

- In-app chat: text, image, reply, reactions, receipts, share listing, offer, mark-sold (when role=seller)  
- Inbox + unread badge + hide conversation  
- Push + in-app notification feed + category prefs + deep links (message/rfq/booking/…)  
- Maps in all five browse sections + Stay map + create MapPinPicker + server clusters + near-me filter (server)  
- Materials/Facilities/Cars/RE/Stay filter axes sync into map cluster params  

---

*Additive report — does not replace prior production-verification rounds 01–52.*
