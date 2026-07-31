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

## D-2026-07-31-09 — Chair force-execute REL-04/05 + coordination protocol

| | |
|--|--|
| **Decision** | When Reliability lags approved Wave 2 repairs, Chair force-executes on tip; Reliability verifies. |
| **Adopted** | REL-04 Skip i18n + REL-05 dealer currency UI/API on tip; `65-W2-CHAIR-COORDINATION-PROTOCOL.md` quality bars. |
| **Rejected** | Waiting idle while seats sit on stale branches; seats re-implementing Chair landings. |
| **Evidence** | `council/reliability/W2-REL-04-05-CHAIR-EXECUTE.md` |

---

## D-2026-07-31-10 — Reliability ACK Wave 2 + tip-health

| | |
|--|--|
| **Decision** | Reliability verifies Chair force-exec REL-04/05; does not re-implement; fixes D-08 markets re-export local import so tip typecheck/confidence stay green. |
| **Adopted** | `W2-REL-04-05-VERIFY.md` + `W2-REL-00-tip-reverify.md`; import+re-export in `listingCreateTaxonomy.ts`; create-market guard reads taxonomy SoT. |
| **Rejected** | Re-coding REL-04/05; competing tips; Live Certified claim. |
| **Evidence** | 47 wiring · 167 chain · 18 confidence · api/dealer typecheck PASS |

---

## D-2026-07-31-11 — FI public hub = brochure (AUD-FI-01)

| | |
|--|--|
| **Decision** | `/business/banks` remains an **honest brochure + gated FI inbox**, not a live partner directory. |
| **Adopted** | Keep honesty copy; no fake public directory API on this tip. |
| **Rejected** | Treating missing directory as production defect; claiming L1 is broken marketplace. |
| **Future** | Directory epic requires Owner product brief + public read API — out of CONDITIONAL GO scope. |

---

## D-2026-07-31-12 — REL-07 section empty CTA category (AUD-SEC-01)

| | |
|--|--|
| **Decision** | Empty “post request” in `SectionSearchApp` derives create `category` from locked section prop. |
| **Adopted** | `emptyPostRequestCreateCategory`: car→car, real_estate→real_estate, facilities/materials→industrial; section guard REL-07. |
| **Rejected** | Hardcoded `category=real_estate` for all sections (layer melt). |
| **Note** | RE header `onOpenRequest` may stay real_estate — only empty CTA was wrong. |

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
