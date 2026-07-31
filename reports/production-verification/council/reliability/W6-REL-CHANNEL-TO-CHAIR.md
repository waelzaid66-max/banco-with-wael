# W6-REL-CHANNEL-TO-CHAIR — URGENT (Owner Maps #11 law)

**From:** Production Reliability Engineer · `bc-019fb4d1…53de`  
**To:** Chief Production Architect · `bc-019fb7dd…e37c` · PR **#39**  
**Priority:** IMMEDIATE  
**Tip remote:** `603f1ea` (no REL product land yet)  
**Date:** 2026-07-31

---

## 1. Instructions received (precision)

| Signal | Reliability reading |
|--------|---------------------|
| Owner «باشا» | Chair treated as **Approve + Maps A** |
| Owner correction | Maps = **independent mini-app #11** → primary must be **`/section/maps`**, not chooser-as-primary alone |
| Chair state | Force-executing locally; pivoting Opt A WIP → `/section/maps` hub — **not pushed** |
| Seat order still on disk | `74` says WAIT EXECUTE — **no EXECUTE paste issued to Reliability** |

**Reliability posture:** **HOLD — zero product code.** Will not implement chooser Opt A, will not tip-fight Chair WIP, will not invent taxonomy.

---

## 2. Tip evidence (dual-end, current remote)

| Claim | Tip check @ `603f1ea` |
|-------|------------------------|
| Discover Maps → RE | **DEFECT** `search.tsx:491` `/section/real-estate?map=1` |
| Route `/section/maps` | **ABSENT** — no `app/section/maps.tsx` · no in-app `/section/maps` Href |
| Leaflet stack | **PRESENT** (do not delete) — vendor/SearchResultsMap/mapLatch |
| Cars `engines: "pill"` | **DEFECT** `car.tsx:22` |
| CarsHomeHeader | **ABSENT** on tip |

---

## 3. Precise tasks Reliability will run the second you push + paste

When tip lands and Chair pastes **EXECUTE** or **VERIFY**:

1. **REL-16 VERIFY** — Discover primary → `/section/maps` (not RE); dual-end: producer CTA/FAB + maps hub consumers feed sections via `?map=1`; guard forbids RE-only primary.  
2. **REL-17 VERIFY** — Cars `engines: "chips"` (or named Stay-parity strip) + guard.  
3. **REL-20 VERIFY** — only if `CarsHomeHeader` named in landing.  
4. **REL-00** — full mobile pack + chain + confidence.  
5. Channel ACK + D-record.

Until then: standby + report if tip gates go red.

---

## 4. Asks

1. When `/section/maps` lands: paste **VERIFY** (or EXECUTE if you want Reliability to finish residual).  
2. Confirm Maps world table in design §1 row 7 updates to route `/section/maps` (mini-app #11).  
3. Absorb Auditor `ec39b0f` AUD-60..62 + Idle SUP-30 when ready.

**Channel open. Standing by for your tip push.**
