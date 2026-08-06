# 10 — Currency & Country Consistency Report

## Currency paths

| Path | Formatter | Currency source | Issue |
|------|-----------|-----------------|-------|
| Listing cards (API) | Server `BffService.formatMoney` / `price_display` | Listing currency | Good |
| Create preview | `listingPreview.formatPriceDisplay` | **Hardcodes EGP** | **Bug/debt** |
| Create/edit fields | `currencyForMarket(market)` | Market ISO | Good |
| Materials header | `CURRENCY_BY_MARKET` caption | Market | Display only |
| Wallet / billing / invoices | `toLocaleString(undefined, …)` | Device locale | **Not market-bound** |
| Import order amounts | `toLocaleString(undefined)` + suffix | Mixed | Device locale |
| Profile metrics | `ar-EG` / `en-US` by lang | Language not market | Diverges |

## Country × currency contract (Owner decision)

Owner (2026-07-20, cited in MASTER-TRACKER): currency is **display/valuation of market money**, not a search axis; country+currency collapse into one compact control. Applied to Stay; RE/Materials claimed collapsed later — **re-measure** before trusting tracker.

## Inconsistency register

| ID | Issue | Risk | Evidence |
|----|-------|------|----------|
| CC-01 | Preview hardcodes EGP | Medium — seller sees wrong preview | listingPreview.ts |
| CC-02 | Wallet uses device locale | Medium — SA user on EN phone | wallet/billing |
| CC-03 | LocationPicker ≠ marketCountry | Medium — wrong place suggestions | LocationPicker |
| CC-04 | Website nearest missing | Low — sort parity | SearchControls |
| CC-05 | No market timezone | Low/Medium — date honesty | — |
| CC-06 | Server default EG COALESCE | Low — expected | SearchService |

## Recommendation
Single client `formatMoney(amount, currency, locale)` used by preview, wallet, import, profile — currency from market or listing, locale from language (not device alone).
