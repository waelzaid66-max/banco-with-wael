# W2-AUD-23 — REL-05 peer-review (UPDATED tip `865e94c`)

## Finding AUD-23
- Severity: **MEDIUM** (closed)
- Status: **ALREADY_FIXED_ON_TIP**
- Evidence:
  - `dealer-os/src/components/currency-select.tsx` uses `listingCurrencyAllowlist()`
  - Investment / RFQ / global-supply forms use `<CurrencySelect>` (free-text Inputs gone on those write surfaces)
  - API `listingCurrencyInputZ` wired in schemas for offer/investment/global-supply currencies
  - Aligns D-07 + D-09
- User impact: B2B currency writes constrained to market allowlist
- Recommended owner: none
- Recommended fix shape: none — do not invent second catalog

Supersedes earlier OPEN status against `34aef42`.
