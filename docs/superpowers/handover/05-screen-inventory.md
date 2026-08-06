# 05 — Screen Inventory

**Complete filesystem + router inventory.** Counts are unique route files / registered paths.  
**Evidence roots:** `artifacts/*/app` · `artifacts/*/src/App.tsx` · Expo `_layout.tsx`.

## Totals

| App | Count | Mechanism |
|-----|------:|-----------|
| banco-mobile | 58 screens (+2 layouts) | Expo Router |
| banco-website | 50 page.tsx | Next App Router AR+EN |
| banco-web | 48 page.tsx | Twin; **no workspace/settings** |
| landing | 1 live (+1 orphan) | SPA |
| dealer-os | 15 pages + 2 auth | Wouter |
| admin-os | 18 pages + 2 auth | Wouter |
| mockup-sandbox | 2 surfaces | Preview (empty mockups) |
| **≈** | **~198** | Including EN twins |

---

## 5.1 banco-mobile routes

### Tabs
| Route | File | Purpose |
|-------|------|---------|
| `/` | `(tabs)/index.tsx` | Feed |
| `/search` | `(tabs)/search.tsx` | Discover + search |
| `/messages` | `(tabs)/messages.tsx` | Inbox |
| `/saved` | `(tabs)/saved.tsx` | Saved |
| `/profile` | `(tabs)/profile.tsx` | Profile + Clerk auth |

### Stack / file routes
| Route | File | Purpose |
|-------|------|---------|
| `/listing/[id]` | `listing/[id].tsx` | Listing detail |
| `/l/[id]` | `l/[id].tsx` | Share shim → listing |
| `/search-results` | `search-results.tsx` | Legacy redirect |
| `/section/car` | `section/car.tsx` | Cars mini-app |
| `/section/real-estate` | `section/real-estate.tsx` | RE mini-app |
| `/section/factories` | `section/factories.tsx` | Facilities |
| `/section/materials` | `section/materials.tsx` | Materials B-CORE |
| `/section/booking` | `section/booking.tsx` | Stays |
| `/legal/privacy` | `legal/privacy.tsx` | Privacy |
| `/legal/terms` | `legal/terms.tsx` | Terms |
| `/listings/mine` | `listings/mine.tsx` | My listings |
| `/listings/create` | `listings/create.tsx` | Create |
| `/listings/edit/[id]` | `listings/edit/[id].tsx` | Edit |
| `/rentals/hub` | `rentals/hub.tsx` | Host rentals hub |
| `/business/onboarding` | `business/onboarding.tsx` | Biz onboarding |
| `/business/verification` | `business/verification.tsx` | Verification |
| `/business/banks` | `business/banks.tsx` | Banks/FI |
| `/business/analytics` | `business/analytics.tsx` | Analytics |
| `/business/rfq-inbox` | `business/rfq-inbox.tsx` | Seller RFQ |
| `/business/requests` | `business/requests.tsx` | Requests |
| `/business/supply-hub` | `business/supply-hub.tsx` | Supply hub |
| `/business/investments` | `business/investments/index.tsx` | Investments |
| `/business/investments/[id]` | `…/[id].tsx` | Investment detail |
| `/business/investments/create` | `…/create.tsx` | Create investment |
| `/business/suppliers` | `business/suppliers/index.tsx` | Suppliers |
| `/business/company/[id]` | `business/company/[id].tsx` | Company public |
| `/business/company/edit` | `business/company/edit.tsx` | Edit company (auto route) |
| `/business/global-supply` | `global-supply/index.tsx` | Global supply |
| `/business/global-supply/[id]` | `…/[id].tsx` | Detail |
| `/business/global-supply/create` | `…/create.tsx` | Create |
| `/business/market` | `business/market/index.tsx` | Market intel |
| `/billing` | `billing.tsx` | Billing |
| `/wallet` | `wallet.tsx` | Wallet |
| `/invoices` | `invoices.tsx` | Invoices |
| `/invoices/[id]` | `invoices/[id].tsx` | Invoice detail |
| `/plans` | `plans.tsx` | Plans |
| `/messages/[id]` | `messages/[id].tsx` | Thread |
| `/notifications` | `notifications.tsx` | Notifications |
| `/bookings` | `bookings.tsx` | Trips/host inbox |
| `/import-tracking` | `import-tracking.tsx` | Import tracking |
| `/import` | `import/index.tsx` | Import hub |
| `/import/request` | `import/request.tsx` | Request |
| `/import/calculator` | `import/calculator.tsx` | Calculator |
| `/import/auctions` | `import/auctions.tsx` | Auctions shell |
| `/import/documents` | `import/documents.tsx` | Checklist |
| `/import/order/[id]` | `import/order/[id].tsx` | Order detail |
| `/rfq` | `rfq/index.tsx` | Buyer RFQs |
| `/rfq/[id]` | `rfq/[id].tsx` | RFQ detail |
| `/rfq/create` | `rfq/create.tsx` | Create RFQ |
| `/industry` | `industry/index.tsx` | Industry hub |
| `/assistant` | `assistant.tsx` | AI assistant (auto) |
| `/settings` | `settings.tsx` | Settings (auto) |
| `*` | `+not-found.tsx` | 404 |

### Modal / sheet surfaces (not routes)
FilterSheet · MapPinPicker · LocationPicker · MarketCountryPicker · CountryCodePicker · CarPicker · FilterPillSelect · AuthGateModal · DeleteAccountModal · PermissionRationaleModal · ImageCropModal · FullscreenImageViewer · EmojiPicker · CinematicIntro · OrderDocuments · wallet/plans Modals · Alert.alert (28 files)

### Stack vs file gaps
Explicit `Stack.Screen` missing (still file-routed): `assistant`, `settings`, `business/company/edit`, `l/[id]`, `+not-found`.

---

## 5.2 banco-website (AR + EN)

**Public:** `/`, `/search`, `/cars`, `/real-estate`, `/industrial`, `/directory`, `/listing/[id]`, `/saved`, `/maintenance`, `/sign-in`, `/sign-up` (+ `/en/...` twins)  
**Workspace:** `/workspace`, `/listings`, `/listings/new`, `/listings/[id]/edit`, `/leads`, `/bookings`, `/messages`, `/messages/[id]`, `/wallet`, `/analytics`, `/b2b`, `/b2b/rfqs`, `/b2b/supply`, `/settings` (+ EN re-exports)

---

## 5.3 banco-web
Same as website **except missing** `/workspace/settings` (+ EN).

---

## 5.4 landing
`/` live in `App.tsx`. Orphan: `src/pages/not-found.tsx`.

---

## 5.5 dealer-os
`/dashboard`, `/listings`, `/leads`, `/analytics`, `/ads`, `/import` (**CSV**), `/rfqs`, `/global-supply`, `/investments`, `/company`, `/wallet`, `/subscription`, `/privacy`, `/terms`, auth, 404.

---

## 5.6 admin-os
`/overview`, `/users`, `/listings`, `/moderation`, `/reports`, `/support`, `/leads`, `/financing`, `/ads`, `/revenue`, `/analytics`, `/fraud`, `/monitoring`, `/alerts`, `/plans`, `/promo`, `/settings`, auth, 404.  
**Missing:** import-order stage console.

---

## 5.7 mockup-sandbox
`/` Gallery · `/preview/:path` — **no mockup components on disk**.
