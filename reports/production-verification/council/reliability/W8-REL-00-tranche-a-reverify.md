# W8-REL-00 — Post–Tranche A tip re-verify (`main`)

**Seat:** Production Reliability Engineer · `bc-019fb4d1…53de`  
**Orders:** `82` / `81` §6 — REL-00 after Chair lands D-W8-01/02 · zero product code  
**SoT:** `main` @ `f3b9911` (handoff) · merge Tranche A `a80de8c` · fix `b4aa364`  
**Date:** 2026-07-31  
**Priority:** IMMEDIATE (Owner → Chair NOW)

---

## Dual-end VERIFY — Tranche A

| ID | Claim | Tip evidence | Pass |
|----|-------|--------------|------|
| D-W8-01 | One `section-sort-cycle` in Car tree | Only `SectionSearchApp.tsx:1619` · **absent** from `CarsHomeHeader.tsx` | **YES** |
| D-W8-01 | Market SoT = primary strip | Strip still mounts `MarketCountryButton` for car (`!isRE && !isMaterials`) · header comment W8 D-W8-01 | **YES** |
| D-W8-01 | Engines chips preserved (REL-17) | Strip still shows engines for car · no Import melt | **YES** |
| D-W8-02 | One `materials-origin-strip` | Count = **1** at `SectionSearchApp.tsx:1962` (legacy row gone) | **YES** |
| Sacred | Stay / RE / Import / Banks | No Tranche A edits outside Car header + SectionSearchApp + guards | **YES** |

## Gates @ `f3b9911`

| Gate | Result |
|------|--------|
| section-miniapp-guard | **77/77** (was 76; +W8 dual-seat asserts) |
| materials-core-guard | **8/8** |
| stay-honesty-guard | **4/4** |
| create-listing-market | **7/7** |
| lib-hardening | **32/32** |
| production-wiring | **47/47** |
| chain-integrity | **167/167** |
| confidence `--skip-typecheck` | **18/18** |
| api-server typecheck | **PASS** |
| `ops:live-cutover` | **NOT_CUTOVER 0/6** (OPS / Owner) |

**ACK:** Wave 8 REL-00 complete. No product code. Standby per `81` §6 — ASK Chair before any new World.

Studies absorbed: W8-STUDY-01..03 · Approve Plan Tranche A · `81`/`82`/`83`.
