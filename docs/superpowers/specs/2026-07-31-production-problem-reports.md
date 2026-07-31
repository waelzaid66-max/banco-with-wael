# Per-problem reports — production wiring wave (2026-07-31)

Each item below is a standing problem report. **Nothing listed is deleted from the product** — only completed or tracked.

---

## MSG-01 / MSG-02 — Listing & company chat chrome unwired

**Symptom:** Chat from listing/company felt “updated but not connected”; Share listing / Offer missing.  
**Cause:** `router.push` dropped `listingId`/`role` while inbox passed them.  
**Fix:** Forward `res.data.listing_id` + `viewer_role` from `createConversation`.  
**Files:** `listing/[id].tsx`, `company/[id].tsx`, `messages/[id].tsx`  
**Test:** `test:messenger-wiring`

---

## NOTIF-01 — Push/in-app message missing role

**Symptom:** Seller opening a message notification could not mark sold.  
**Cause:** Notification `data` had conversation + listing only.  
**Fix:** Server stamps `role: isBuyer ? "seller" : "buyer"`; mobile router forwards buyer|seller only (never invents).  
**Files:** `ConversationService.ts`, `notificationRouting.ts`  
**Test:** `test:production-wiring` + notification-routing append

---

## MAP-01 — Discover map latch stuck

**Symptom:** `/section/real-estate?map=1` stayed on list when page lacked pins.  
**Cause:** Latch required `hasPagePins` though server clusters need only results.  
**Fix:** Open map when `inResultsView`; clear latch on empty/error.  
**Files:** `SectionSearchApp.tsx`  
**Affects:** Cars, RE, Facilities, Materials (Stay already correct)

---

## MAP-02 — Web locate blocked

**Symptom:** Locate control on web map ineffective.  
**Cause:** iframe missing `allow="geolocation"`.  
**Fix:** Add attribute on `SearchResultsMap.web.tsx`.

---

## MSG-04 — False WebSocket docs

**Symptom:** Deploy docs claimed REST+WebSocket.  
**Fix:** Document poll-only / G47 in `DEPLOY_COOLIFY.md`.

---

## Open tracked (next waves — reports only here)

See inventory §A–C for MSG-05…MSG-16, NOTIF-02…10, MAP-03…10. Highest next code wave: MSG-06, MSG-07, MAP-03, MAP-04, NOTIF-03, NOTIF-09.
