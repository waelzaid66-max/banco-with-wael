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
