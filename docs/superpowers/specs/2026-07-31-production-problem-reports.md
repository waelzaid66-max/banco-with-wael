# Per-problem reports — production wiring wave (2026-07-31)

Each item below is a standing problem report. **Nothing listed is deleted from the product** — only completed or tracked.

---

## MSG-01 / MSG-02 — Listing & company chat chrome unwired

**Symptom:** Chat from listing/company felt “updated but not connected”; Share listing / Offer missing.  
**Cause:** `router.push` dropped `listingId`/`role` while inbox passed them.  
**Fix:** Forward `res.data.listing_id` + `viewer_role` from `createConversation`.  
**Files:** `listing/[id].tsx`, `company/[id].tsx`, `messages/[id].tsx`  
**Test:** `test:messenger-wiring`  
**Status:** Fixed

---

## MSG-03 — Assistant→chat listingId

**Symptom:** Assistant open-chat ignored optional listing context.  
**Fix:** Forward `listingId` only; never invent role.  
**Status:** Fixed

---

## MSG-04 — False WebSocket docs

**Symptom:** Deploy docs claimed REST+WebSocket.  
**Fix:** Document poll-only / G47 in `DEPLOY_COOLIFY.md`.  
**Status:** Fixed

---

## MSG-06 — Duplicate send on refetch failure

**Symptom:** Message POSTed, refetch threw → bubble marked failed → retry POSTed again.  
**Cause:** `deliver()` coupled POST success to `await query.refetch()`.  
**Fix:** On POST success: drop pending, seed React Query cache from `sendMessage` response, soft-refetch (errors ignored).  
**Files:** `app/messages/[id].tsx`  
**Status:** Fixed

---

## MSG-07 — Unbounded history every poll

**Symptom:** Every 3s poll re-downloaded the entire thread.  
**Cause:** `getMessages` had no limit/cursor.  
**Fix:** Optional `limit` + `before` query params (OpenAPI + service + controller); mobile polls with `limit=400`. Website keeps full history (no limit).  
**Follow-up MSG-07b:** scroll-up older-page UI using `before=`.  
**Files:** `ConversationService.ts`, `conversationController.ts`, `openapi.yaml`, `api-client-react`, `messages/[id].tsx`  
**Status:** Fixed (page API); load-more UI tracked as MSG-07b

---

## MSG-09 — Thread error looks empty

**Symptom:** Failed thread load showed “Say hello…”.  
**Cause:** Only `isLoading` branched; error → empty list.  
**Fix:** Mirror inbox — `isError && !data` → error + Retry.  
**Status:** Fixed

---

## MSG-10 — Reply retry drops quote

**Symptom:** Failed quoted reply retried as bare body.  
**Cause:** `PendingMessage` omitted `reply_to_id`.  
**Fix:** Store + pass `reply_to_id` on send/retry (offers too).  
**Status:** Fixed

---

## MSG-16 — Client maxLength

**Symptom:** Typing past 4k failed only on server validation.  
**Fix:** `maxLength={4000}` on composer.  
**Status:** Fixed

---

## NOTIF-01 — Push/in-app message missing role

**Symptom:** Seller opening a message notification could not mark sold.  
**Cause:** Notification `data` had conversation + listing only.  
**Fix:** Server stamps `role: isBuyer ? "seller" : "buyer"`; mobile router forwards buyer|seller only (never invents).  
**Files:** `ConversationService.ts`, `notificationRouting.ts`  
**Test:** `test:production-wiring` + notification-routing append  
**Status:** Fixed

---

## NOTIF-03 — Soft sign-out left push token

**Symptom:** ACCOUNT_DELETED soft path signed out without unregistering Expo token.  
**Cause:** `_layout` AuthTokenBridge called `signOut` only; bridge clears local cache after auth dies.  
**Fix:** `unregisterCachedPushTokenBestEffort()` then `signOut`. Profile/settings paths already correct.  
**Files:** `app/_layout.tsx`  
**Status:** Fixed

---

## NOTIF-09 — Unknown tap dead

**Symptom:** Push with incomplete/unknown payload did nothing.  
**Cause:** `routeForNotification` returned `null`; `handleResponse` early-returned.  
**Fix:** Final fallback `/notifications` (typed routes unchanged).  
**Files:** `lib/notificationRouting.ts`  
**Status:** Fixed

---

## MAP-01 — Discover map latch stuck

**Symptom:** `/section/real-estate?map=1` stayed on list when page lacked pins.  
**Cause:** Latch required `hasPagePins` though server clusters need only results.  
**Fix:** Open map when `inResultsView`; clear latch on empty/error.  
**Files:** `SectionSearchApp.tsx`  
**Affects:** Cars, RE, Facilities, Materials (Stay already correct)  
**Status:** Fixed

---

## MAP-02 — Web locate blocked

**Symptom:** Locate control on web map ineffective.  
**Cause:** iframe missing `allow="geolocation"`.  
**Fix:** Add attribute on `SearchResultsMap.web.tsx`.  
**Status:** Fixed

---

## MAP-03 — Near-me radius circle missing

**Symptom:** Docs/MASTER-TRACKER claimed radius circle; map showed none.  
**Cause:** Removed in market-center restore (`a7a4b78`) while FilterSheet radius chips remained.  
**Fix:** Restore optional `near` arg on `buildMapHtml` + `L.circle`/`circleMarker`; pass from native+web hosts when near-me enabled.  
**Files:** `mapHtml.ts`, `SearchResultsMap.tsx`, `SearchResultsMap.web.tsx`  
**Status:** Fixed

---

## MAP-04 — Off-page cluster pins blank

**Symptom:** Zoomed-in single pins off the loaded page had no price / bookable tint.  
**Cause:** `MapCluster` was geo-only; client enriched only from current feed page.  
**Fix:** Server emits `price_display` / `is_bookable` / `category` for count===1; client prefers server fields, page lookup as fallback.  
**Files:** `SearchService.ts`, schemas, OpenAPI, client types, both map hosts  
**Status:** Fixed

---

## MAP-06 — Web locate silent fail

**Symptom:** Web locate deny/timeout only `console.warn`.  
**Fix:** `Alert.alert` parity with native copy.  
**Status:** Fixed

---

---

## MSG-07b — Older messages page

**Symptom:** Threads longer than 400 only showed the newest page.  
**Fix:** Local `older[]` + `getMessages(..., { before })` on scroll-top / Load earlier; poll cache untouched.  
**Status:** Fixed

---

## MSG-11 — Email CTA path

**Symptom:** Message emails linked `/messages/:id` (mobile path on website host).  
**Fix:** `/workspace/messages/:id` (+ `/en/...` when lang=en).  
**Status:** Fixed

---

## MSG-12 — Import support generic inbox

**Symptom:** Support CTA opened empty messenger inbox.  
**Fix:** `createSupportTicket` with order context (order detail) / import category (hub).  
**Status:** Fixed

---

## MSG-15 — Inbox empty browse CTA

**Fix:** Browse listings button → `/(tabs)/search`.  
**Status:** Fixed

---

## MAP-05 — Web near-me

**Fix:** Browser `navigator.geolocation` in `requestNearMeCoords` (native expo-location unchanged).  
**Status:** Fixed

---

## MAP-09 — Edit MapPinPicker

**Fix:** Optional pin tools on edit + PATCH `latitude`/`longitude` (both-or-neither).  
**Status:** Fixed

---

## NOTIF-05 — Unread capped at 100

**Fix:** SQL `count(*)` for unread; home/notifications read `meta.total`.  
**Status:** Fixed

---

## NOTIF-06 — Push badge

**Fix:** Expo payload `badge` = current unread count.  
**Status:** Fixed

---

## NOTIF-07 — Push register single-attempt

**Fix:** Backoff retries 0/2s/5s/15s.  
**Status:** Fixed

---

## Still open

MSG-05/08/13/14 · NOTIF-02/04/08/10 · MAP-07/08/10
