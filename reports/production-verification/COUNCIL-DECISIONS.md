# COUNCIL-DECISIONS — Adjudication Log

**Chair:** Chief Production Architect  
**Rule:** Disputes stop work. Stronger solution wins on evidence. Rejected approach documented here.

---

## D-2026-07-31-01 — Governing tip

| | |
|--|--|
| **Decision** | PR **#32** / branch `cursor/final-production-acceptance-e37c` is the sole governing engineering tip until merge to `main`. |
| **Adopted** | Absorb+#30 repair + CTO risk reductions (currency, search gates, engines, nearest web, spam fail-closed, prod seed skip). |
| **Rejected** | Continuing feature work on draft **#30**; declaring live production certified while `ops:live-cutover` fails. |
| **Why** | #30 CI was red; tip is green; live DNS is OPS not code fiction. |

---

## D-2026-07-31-02 — Engines SoT

| | |
|--|--|
| **Decision** | `@workspace/search-contract` car engines include facet-gated fuel/transmission chips (parity with mobile Discover). |
| **Adopted** | Sync contract ← mobile (requiresFacet). |
| **Rejected** | Keeping web contract “journey-only” while mobile ships extra chips (drift). |
| **Why** | One product company; dual catalogs create browse divergence at scale. |

---

## D-2026-07-31-03 — Currency display

| | |
|--|--|
| **Decision** | Server display allowlist must cover mobile `CURRENCY_BY_MARKET` codes. |
| **Adopted** | `supportedCurrencies.ts` + Bff/Listing normalize. |
| **Rejected** | Silent rewrite of BHD/IQD/… → EGP. |
| **Why** | Pricing corruption > “safe garbage fallback.” Remaining create-time validation = Reliability REL-01 after Auditor AUD-01. |

---

## D-2026-07-31-04 — Wave 1b repairs (AUD → Approve → REL)

| | |
|--|--|
| **Decision** | Execute REL-01/02/03 on governing tip after Auditor packets. |
| **Adopted** | Write-time currency enforce; readyz `upload_claims`; staging smoke exit 2 if auth skipped. |
| **Rejected** | Wave 1 shared `MARKET_COUNTRIES` package move (AUD-02 deferred); forcing boot-fatal `ensureSchemaPatches` (broader than readyz). |
| **Evidence** | `council/auditor/W1-AUD-01*`, `W1-AUD-11*`, `W1-AUD-12*`; `council/reliability/W1-CHAIR-APPROVE-PLAN.md` |

---

## D-2026-07-31-05 — Reliability re-verify + tip absorb main

| | |
|--|--|
| **Decision** | Reliability seat (`System presence check`) re-verifies Wave 1b on tip and merges `main` (#33/#35/#37) into PR **#32** tip. |
| **Adopted** | REL-00 TIP_HEALTHY (44 wiring · 167 chain · 18 confidence · api typecheck · lint); messenger phone SoT + car-import audit docs on tip. |
| **Rejected** | Starting CAR IMPORT Wave 4/5; MSG-05 WebSocket; claiming Live Certified; competing tips. |
| **Evidence** | `council/reliability/W1-REL-00-tip-reverify.md`, `W1-REL-01-02-03-verify.md` |

---

## D-2026-07-31-06 — Answers to Auditor AUD-00

| # | Ask | Chair answer |
|---|-----|--------------|
| 1 | Absorb path for Wave 1 packets | **Chair absorbs into PR #32 tip.** PR **#36** is superseded for Wave 1 evidence after absorb. New Auditor work follows Wave 2 IDs on tip. |
| 2 | AUD-01 → ALREADY_FIXED_ON_TIP? | **Confirmed.** REL-01 `enforceListingCurrencySpec` is authoritative. Residual Zod `z.record` looseness = **LOW / Wave 2+** only if Auditor opens a concrete exploit path. |
| 3 | AUD-09 dealer free-text currency | **Wave 2.** Policy = **D-07**. Not Wave 1b REL. Architect policy first (done); Reliability implements REL-05. |
| 4 | AUD-08 without screenshots | **Confirmed UNVERIFIED.** No pixel defect list invented. Visual wave needs Owner device/screenshots (AUD-24). |
| 5 | Standby vs Wave 2 | **Wave 2 orders issued** — `64-ENGINEERING-COUNCIL-STANDING-ORDERS-WAVE2.md`. Auditor executes AUD-20→25; Reliability REL-04/05 now. |

---

## D-2026-07-31-07 — Dealer / B2B currency policy (AUD-09)

| | |
|--|--|
| **Decision** | Investment / RFQ / global-supply **write** currencies use the **same allowlist** as listings (`listingCurrencyAllowlist` = market currencies + `EXTRA_CURRENCIES` USD/EUR). |
| **Adopted** | Consistency with mobile create + REL-01; prevents garbage ISO codes in B2B money fields. |
| **Rejected** | Fully free-text exotic quote currencies without product exception; inventing a second allowlist. |
| **Owner** | Reliability **REL-05** (UI + API). |

---

## D-2026-07-31-08 — Markets SoT in `@workspace/taxonomy` (AUD-02)

| | |
|--|--|
| **Decision** | `MARKET_COUNTRIES`, `CURRENCY_BY_MARKET`, `EXTRA_CURRENCIES`, and `listingCurrencyAllowlist()` live in `@workspace/taxonomy/markets`. |
| **Adopted** | Mobile `listingCreateTaxonomy` re-exports; web `search-markets` aliases `WEB_MARKET_COUNTRIES = MARKET_COUNTRIES` (full catalog); API `supportedCurrencies` derives from `listingCurrencyAllowlist()`. |
| **Rejected** | Keeping three divergent catalogs (mobile full / web 8-row subset / hardcoded API array). |
| **Note** | Web market picker expands to full taxonomy list — intentional parity. |

---

## Template for future disputes

```markdown
## D-YYYY-MM-DD-NN — Title
- Parties:
- Question:
- Option A:
- Option B:
- Criteria scores: architecture / maintainability / prod risk / scale / regression / ops
- Adopted:
- Rejected:
- Evidence:
```
