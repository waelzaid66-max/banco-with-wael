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
| MSG-06 | Send OK + refetch fail → duplicate retry | High | **Fixed** (commit on POST + seed cache) |
| MSG-07 | Unbounded history every poll | High | **Fixed** (`limit`/`before` + mobile page 400) |
| MSG-09 | Thread error looks like empty chat | Medium | **Fixed** (`isError` + retry) |
| MSG-10 | Reply retry drops `reply_to_id` | Medium | **Fixed** (pending stores reply) |
| MSG-16 | No client `maxLength` (server 4k) | Low | **Fixed** (`maxLength={4000}`) |
| NOTIF-01 | Message push/in-app missing recipient `role` (mark-sold) | High | **Fixed** (server stamp + router) |
| NOTIF-03 | Soft sign-out left push token | High | **Fixed** (unregister before soft signOut) |
| NOTIF-09 | Unknown notification tap → null | Medium | **Fixed** (fallback `/notifications`) |
| MAP-01 | `?map=1` latch required page pins → Discover map stuck | High | **Fixed** (open on results) |
| MAP-02 | Web map iframe no geolocation permission | Medium | **Fixed** (`allow="geolocation"`) |
| MAP-03 | Near-me radius circle removed from `mapHtml` | High | **Fixed** (restore circle + hosts) |
| MAP-04 | `/search/map` clusters lack price/bookable | High | **Fixed** (server emits + client prefer) |
| MAP-06 | Web locate failure silent | Medium | **Fixed** (Alert parity) |

Guards: `test:messenger-wiring` · `test:production-wiring` · existing `test:notification-routing`

---

## A. Messenger — remaining gaps (not deleted; tracked)

| ID | Gap | Severity | Notes |
|----|-----|----------|-------|
| MSG-05 | Poll-only (3s/8s/15s) — no WS/typing/presence | Product | G47; needs Owner decision before rewrite |
| MSG-07b | Older-than-page scroll-up load (`before=`) UI | Medium | API ready; mobile still newest-400 only |
| MSG-08 | No block-user / report-message | High | Trust & safety |
| MSG-11 | Email CTA `/messages/:id` vs website `/workspace/messages` | Medium | Deep link mismatch |
| MSG-12 | Import support opens generic inbox | Medium | No order-context thread |
| MSG-13 | No per-thread mute | Medium | Global prefs only |
| MSG-14 | Video/audio API > mobile renderer (images only) | Medium | |
| MSG-15 | Inbox empty state no browse CTA | Low | Deferred P2 in #22 |

**Architecture (keep):** HTTP polling · participant auth · listing-anchored conversations · inbox already passes listingId+role.

---

## B. Notifications — remaining gaps

| ID | Gap | Severity | Notes |
|----|-----|----------|-------|
| NOTIF-02 | EAS/APNs/FCM device delivery not certified | Blocker (ops) | External credentials |
| NOTIF-04 | No Expo receipt processing / retry queue | High | `PushService` |
| NOTIF-05 | Unread badge capped at newest 100 | Medium | |
| NOTIF-06 | OS badge not in push payload | Medium | Home-tab sync only |
| NOTIF-07 | Push registration single-attempt | Medium | |
| NOTIF-08 | “In-app” toggle also suppresses push | Medium | Label vs semantics |
| NOTIF-10 | API base / Clerk env required for any delivery | Blocker (ops) | Cloud/EAS secrets |

---

## C. Maps — per section

**Stack (all browse maps):** Leaflet 1.9.4 + MarkerCluster 1.5.3 + OSM tiles via unpkg · WebView/iframe · `GET /v1/search/map` · **not** react-native-maps.

| Section | Map | Latch | Sync filters | Features shown | Gaps |
|---------|-----|-------|--------------|----------------|------|
| Cars | Yes (shared) | Fixed MAP-01 | Yes | Pins, clusters, locate, near circle, filters | No Discover map producer |
| Real estate | Yes + Discover Explore | Fixed MAP-01 | Yes | Same + Discover CTA | Off-page open always `?focus=booking` |
| Booking/Stays | Yes (best latch) | OK | Yes | Rent filters + bookable emerald pins | — |
| Facilities | Yes | Fixed MAP-01 | Yes | Industrial tint | No map-first CTA |
| Materials | Yes | Fixed MAP-01 | Yes | Industrial tint | No map-first CTA |
| Car Import hub | Indirect via cars+import engine | N/A | Via cars | Cars map when `?engine=import` | No shipment geo map; no `map=1` producer |

### Shared map gaps (tracked, not erased)

| ID | Gap | Severity |
|----|-----|----------|
| MAP-05 | Web near-me criteria unavailable (`requestNearMeCoords` null) | Medium |
| MAP-07 | CDN Leaflet/OSM dependency | Medium |
| MAP-08 | No draw-area / sort=nearest | Product deferred |
| MAP-09 | Edit listing missing MapPinPicker | Medium |
| MAP-10 | No E2E map interaction tests | Low |

---

## D. Open draft PR ledger (do not forget)

| PR | Topic |
|----|--------|
| #12 | Phase Zero audit docs |
| #15 | Car import W3 docs upload |
| #17 | Discover no force cars |
| #18 | UI density |
| #19 | Banks honesty |
| #20 | Stay honesty |
| #21 | Messenger listing chrome (continued by this branch) |
| #22 | B-PROPERTY (+ some map/notif overlap) |
| #25 | Materials B-CORE |
| #26 | This production wiring wave |

---

## E. Features & capabilities matrix (keep — never erase)

### Messenger
- Inbox poll 8s · thread poll 3s · tab unread 15s  
- Listing-anchored conversations · share listing card · price offer / accept-decline  
- Reactions · reply quotes · image attach · mark-sold (seller + listingId)  
- Soft-hide conversation · participant auth  

### Notifications
- In-app feed · push registration (Expo) · typed deep links · mute prefs  
- Message role stamp for mark-sold · car_import / booking / billing routes  

### Maps
- Per-section browse maps · market-country framing · locate-me · near-me radius chips + **circle**  
- Page pins + server clusters · price/bookable on singles · FilterSheet sync  
- Create flow MapPinPicker (not edit yet)  
