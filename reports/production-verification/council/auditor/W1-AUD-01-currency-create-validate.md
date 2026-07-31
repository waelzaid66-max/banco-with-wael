# W1-AUD-01 — Create-time currency vs display allowlist

## Finding AUD-01
- Severity: **HIGH**
- Status: **OPEN_IN_REPO**
- Evidence:
  - Create schema: `CreateListingSchema.specs` = `z.record(z.unknown())` (`artifacts/api-server/src/validators/schemas.ts` ~307) — no currency enum.
  - `createListing` persists `input.specs` via normalize without currency allowlist (`ListingService.ts`).
  - Mobile writes `specsClean.currency = listingCurrency` from `CURRENCY_BY_MARKET` / override (`app/listings/create.tsx`).
  - Display path already uses `normalizeListingCurrency` (`supportedCurrencies.ts`) — **display fixed on tip**; **write path still open**.
- User impact: Malicious/buggy client can store `currency=XYZ`; feed may fall back to EGP or show inconsistent codes depending on path.
- Regressions if wrong fix: Rejecting legacy empty currency on update; over-strict ISO list blocking real markets.
- Recommended owner: **Reliability**
- Recommended fix shape: On create/update, if `specs.currency` present → must be in `SUPPORTED_LISTING_CURRENCY_SET` or **400**; if absent → default `"EGP"`. Reuse shared helper; do not fork allowlists.

## Chair note
Display repair D-2026-07-31-03 already landed. This finding is the remaining write-side half.
