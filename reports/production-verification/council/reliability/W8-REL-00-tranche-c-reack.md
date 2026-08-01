# W8-REL-00 — Post–Tranche C tip re-ack (`main`)

**Seat:** Production Reliability · `bc-019fb4d1…53de`  
**Orders:** `82` — REL-00 re-ack on tip · then STANDBY  
**SoT:** `main` @ `ddb9371` (handoff) · Tranche C CLOSED `db0d329` · land `fb81f92` · PR **#43**  
**Date:** 2026-07-31  
**Mode:** VERIFY + narrow chain-gate hygiene (complete Chair D-W8-06 miss)

---

## Dual-end Tranche C

| ID | Claim | Tip evidence | Pass |
|----|-------|--------------|------|
| D-W8-04 | Dead `applySaved` gone | No `const applySaved` in `search.tsx` · comment points Saved→nav | **YES** |
| D-W8-04 | Saved dual-end alive | `saved.tsx` → `searchCriteriaToNavParams` · host `hasIncoming`+`parseMobile`+`commit(next)` | **YES** |
| D-W8-05 | Maps prose §7 | Discover/search/MapsHubApp/guards say **§7** · push `/section/maps` | **YES** |
| D-W8-06 | lib-hardening | asserts parse/hasIncoming · forbids `const applySaved` | **YES** |

## Incomplete found + closed this seat

| Gap | Finding | Action |
|-----|---------|--------|
| **G-REL-CHAIN-01** | `chain-integrity` `P-saved-search-nav-consume` still required `/s\.criteria/` from deleted `applySaved` → **166/167 FAIL** after Tranche C | **FIXED** gate to match D-W8-06 intent (nav consume + forbid applySaved) → **167/167** |
| Absorb #40/#41/#38 | Still OPEN | ASK Chair |
| D-W8-01 Stay-parity | STUDY inversion ASK | No freestyle |
| Live cutover | NOT_CUTOVER 0/6 | Owner ops |
| API Vitest / mockup-sandbox | Chair honest gaps | HOLD |

## Gates @ `ddb9371` (+ chain hygiene on this PR)

| Gate | Result |
|------|--------|
| section-miniapp-guard | **77/77** |
| materials-core | **8/8** |
| stay-honesty | **4/4** |
| create-market | **7/7** |
| lib-hardening | **32/32** |
| production-wiring | **47/47** |
| messenger-wiring | **11/11** |
| chain-integrity | **167/167** (after G-REL-CHAIN-01) |
| confidence | **18/18** |
| api tsc | **PASS** |
| live-cutover | **NOT_CUTOVER 0/6** |

**ACK:** REL-00 re-ack PASS. Product code this seat = **chain gate only** (scripts). STANDBY after Chair absorb.
