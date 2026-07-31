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
