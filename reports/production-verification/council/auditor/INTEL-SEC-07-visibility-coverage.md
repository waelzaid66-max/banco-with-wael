# INTEL-SEC-07 — `publicVisibilityConditions()` coverage audit

- Master ID: **SEC-07** (`88` Track B · P1)  
- Seat: **Production Intelligence** (read-only) → hand-off PE-API on GAPs  
- SoT tip: `main` @ **`7e3b40a`**  
- Helper: `artifacts/api-server/src/lib/feedVisibility.ts`  
- Stamp: `2026-07-31T18:40Z`  
- Mode: grep matrix · **zero product code** · no Approve Plan invent

---

## 0. Channel (`89` §3)

```text
SEAT: Intelligence
PACKET: INTEL-SEC-07
TIP: 7e3b40a
FLOORS: OK
VERDICT: PASS_WITH_WATCH
EVIDENCE: public surfaces Feed/Search/SEO/detail/company listings use VIS or equivalent; HTTP insights+availability gated via listingIsPubliclyVisible; GAPs = service-layer getListingDealInsights + getListingAvailability lack in-fn VIS (controller-only); CompanyProfile latest_listing_id omits seller deletedAt/shadow (profile already 404s shadow); similar seed loads target without VIS
ASK_DIRECTOR: assign PE-API Approve Plan for GAP-01/02 defense-in-depth OR accept controller gate; keep SEC-07 OPEN until GAPs closed or WONTFIX stamped
```

---

## 1. Contract (what VIS enforces)

`publicVisibilityConditions()` returns SQL[]:

1. `listings.isFlagged IS NOT TRUE`  
2. `users.isShadowBanned IS NOT TRUE`  
3. `users.deletedAt IS NULL`  

Requires `listings` + joined `users`. Call sites that only check `isFlagged` are **PARTIAL**.

**Equivalent (accepted):** `getListingDetail` post-fetch gate mirrors the three rules for non-owners (inline, not helper call) + owner bypass — covered by `ListingService.detailVisibility.test.ts`.

---

## 2. Matrix — public / id-keyed surfaces

| Surface | File / symbol | Uses `publicVisibilityConditions()` | Equivalent gate | HTTP public? | Verdict |
|---------|---------------|-------------------------------------|-----------------|--------------|---------|
| Feed list | `FeedService` | **YES** | — | YES | **PASS** |
| Search / facets / map | `SearchService` (browse paths) | **YES** | — | YES | **PASS** |
| Similar results | `computeSimilarListings` result query | **YES** | — | YES | **PASS** |
| Similar **seed** target | `computeSimilarListings` L910 `eq(listings.id)` | **NO** | none on seed | YES | **WATCH** GAP-03 |
| Listing detail | `getListingDetail` | NO helper | inline flagged/shadow/deletedAt | YES | **PASS** equiv |
| `listingIsPubliclyVisible` | `ListingService` | **YES** | — | helper | **PASS** |
| SEO page | `getSeoListing` | **YES** | — | YES | **PASS** |
| Sitemap | `getSitemapListings` | **YES** (expected) | — | YES | **PASS** |
| Company public listings | `CompanyService` | **YES** | — | YES | **PASS** |
| Company seller stats | `getSellerStats` | **YES** | — | YES | **PASS** |
| Company profile load | shadow/deleted check | mirror | 404 if shadow/deleted | YES | **PASS** |
| Company `latest_listing_id` | L160–168 | **PARTIAL** (`isFlagged` only) | profile already suppresses shadow seller | YES | **WATCH** GAP-04 |
| Comments list/create | `CommentService` | **YES** | — | YES | **PASS** |
| Comment delete | `deleteComment` | **NO** | authz owner/author | auth | **OK** (not public browse) |
| Leads / contact | `LeadService` | **YES** | — | gated | **PASS** |
| Saves (public check paths) | `SaveService` | **YES** on vis checks | — | auth | **PASS** |
| Listing links | `ListingLinkService` | **YES** | — | YES | **PASS** |
| Ads public | `AdsService` | **YES** | — | YES | **PASS** |
| Booking create | `createBooking` | **YES** + lock recheck | — | auth | **PASS** |
| Availability service | `getListingAvailability` | **NO** | — | — | see HTTP |
| Availability HTTP | `getAvailabilityHandler` | via `listingIsPubliclyVisible` | YES | YES | **PASS** controller |
| Insights service | `getListingDealInsights` | **NO** | — | — | see HTTP |
| Insights HTTP | `getListingInsightsHandler` | via `listingIsPubliclyVisible` | YES | YES | **PASS** controller |
| Upload listing media join | `uploadController` | **YES** | — | gated | **PASS** |
| Conversations listing attach | `ConversationService` | **YES** on public paths | — | auth | **PASS** |
| Weekly reports job | `weeklyReports` | **YES** | — | job | **PASS** |
| Admin / moderate | `AdminService` | N/A | admin authz | NO | **OK** |
| Report create | `ReportService` | N/A | must resolve id to report | auth | **OK** |
| Owner mutate / delete | `ListingService` owner `userId` | N/A | ownership | auth | **OK** |

---

## 3. GAPs (for Director → PE-API Approve Plan)

| GAP | Severity | Issue | Recommended fix (plan only) |
|-----|----------|-------|------------------------------|
| **GAP-01** | P2 defense-in-depth | `getListingDealInsights` loads by id with **no** VIS; safe today only because controller calls `listingIsPubliclyVisible` first | Move gate into service **or** document controller-only contract + test that direct service call on flagged id returns null |
| **GAP-02** | P2 defense-in-depth | `getListingAvailability` same pattern | Same as GAP-01 |
| **GAP-03** | P3 WATCH | Similar seed reads target category/price without VIS; result set is filtered | Optional: abort similar if `!listingIsPubliclyVisible(id)` |
| **GAP-04** | P3 WATCH | `latest_listing_id` on company profile filters `isFlagged` only (not seller tombstones); mitigated because shadow/deleted profiles 404 earlier | Align query with full VIS for consistency |

**No P0 “flagged listing readable by guest getById” found on primary detail/SEO/feed/search HTTP paths.**

---

## 4. Tests already anchoring the contract

| Test | Role |
|------|------|
| `feedVisibility.test.ts` | helper SQL behavior |
| `ListingService.detailVisibility.test.ts` | getListingDetail Round 10 flagged/banned → null for non-owner |

Missing: service-level tests that **insights/availability** refuse flagged ids without relying on controller (supports GAP-01/02 CLOSE).

---

## 5. ASK_DIRECTOR

1. Stamp SEC-07 **PASS_WITH_WATCH** and open PE-API Approve Plan for GAP-01/02 only?  
2. Or leave SEC-07 **OPEN** until defense-in-depth lands?  
3. GAP-03/04 → WONTFIX vs include in same plan?

— Intelligence · SEC-07
