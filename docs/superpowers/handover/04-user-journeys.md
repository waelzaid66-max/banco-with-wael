# 04 — User Journey Report

**Method:** Static journey mapping from routes + known defects. Interactive capture: **incomplete** this session.

## Journey matrix

| ID | Journey | Entry | Happy path | Known failures / gaps | Status |
|----|---------|-------|------------|----------------------|--------|
| J01 | Discover → Cars browse → listing → chat | Search Discover / section car | createConversation + listingId/role | Was MSG-01; **Fixed** | OK code |
| J02 | Discover → RE Explore map | Discover map / FAB | Section RE `?map=1` | Latch MAP-01 Fixed; inventory soft overclaim on focus=booking for Section path | OK / verify |
| J03 | Discover → Car Import hub → request → track | `discover-car-import` → `/import` | Order create + stages | Needs DB migrate; auctions placeholder; no ops UI for stage | Partial |
| J04 | Import notification → order | Push/in-app `car_import` | `/import/order/[id]` | NOTIF-02 device delivery uncertified | Code OK / ops gap |
| J05 | Message send → appear once | Thread | POST + cache seed | MSG-06 Fixed; poll-only | OK code |
| J06 | Long thread older history | Thread scroll up | `before=` pages | MSG-07b Fixed with P1 scroll gates | OK code |
| J07 | Hide conversation | Inbox long-press / thread | Soft-hide | Copy was Delete; MSG-08c Fixed | OK code |
| J08 | Report message | Thread sheet | Support ticket abuse | MSG-08 Fixed; no hard block | Partial product |
| J09 | Near-me + nearest sort | FilterSheet | Enable near-me then nearest | Silent fallback scrubbed on client; API still soft-fallback | OK client |
| J10 | Create listing → pin | Create | MapPinPicker | MAP-09 edit also wired | OK code |
| J11 | Guest → gated action | AuthGate | Profile sign-in | Auth only on Profile tab (discoverability) | UX gap |
| J12 | Booking/stays map overlay | `/section/booking` | Stay latch + overlay | Claim StayCard in inventory — re-verify live | Verify |
| J13 | Materials browse | `/section/materials` | Filters + map | Prior screenshots only corpus | OK code |
| J14 | Banks / FI | Discover banks | Membership / awaiting | MASTER-TRACKER “lost awaiting” may be stale if banks.tsx has it | Verify |
| J15 | Website email → messages | Email CTA | `/workspace/messages/:id` | MSG-11 Fixed; attach still mobile-only | Partial |
| J16 | Soft account delete | Settings | Unregister push then signOut | NOTIF-03 Fixed | OK code |
| J17 | Unknown notification tap | Notif router | `/notifications` | NOTIF-09 Fixed | OK code |
| J18 | Wallet top-up | Wallet | Provider flow | Currency locale = device | Risk |
| J19 | Admin advance import stage | — | API PATCH only | **No UI journey** | Missing |
| J20 | Website car import | — | — | **No surface** | Missing |

## Broken / missing transitions (evidence)

1. **No admin journey** for import stage changes — `import-orders.ts` PATCH + `requireAdminRole` only.  
2. **Dealer `/import` ≠ car import** — CSV listings (`dealer-os/.../import.tsx`).  
3. **Website attach media** — thread can open media URLs but cannot upload (mobile-only).  
4. **Saved RE → Search melt** — listed Deferred in early audit doc item 23; status unverified this session.  
5. **Lead → listing vs requests inbox** — Deferred item 22; unverified.

## Duplicated behaviors

| Behavior | Copies |
|----------|--------|
| Near-me toggle | search.tsx, SectionSearchApp, BookingStaysApp |
| Sort cycle (4) | Section + Stays (vs FilterSheet 6) |
| serializeCriteria local | Section + Stays (vs criteriaKey) |
| Website EN re-export vs duplicate home | Mixed twin strategy |

## Validation gaps

- Import request: rely on API validators; live form edge cases not device-tested here  
- Chat maxLength 4000 client — Fixed MSG-16  
- Nearest without coords — client gated; raw API still soft

## Journey audit score

**Code wiring:** 7/10 for consumer mobile happy paths that have guards  
**End-to-end production proof:** 4/10 (ops, push, migrate, full device)  
**Overall journey readiness:** **5.5/10**
