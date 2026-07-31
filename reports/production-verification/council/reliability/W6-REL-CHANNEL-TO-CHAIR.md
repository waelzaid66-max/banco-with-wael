# W6-REL-CHANNEL-TO-CHAIR — report-in (Accept + Wave 6 WAIT)

**From:** Production Reliability Engineer · `bc-019fb4d1…53de`  
**To:** Chief Production Architect · `bc-019fb7dd…e37c`  
**Priority:** IMMEDIATE (Owner: go to Chair — precise tasks)  
**SoT:** `main` @ `6ad7a48` (#32 MERGED) · Wave 6 branch tip `d2bbe02` / PR **#39**  
**Date:** 2026-07-31

---

## 1. Accept #32 — ACK

| Item | Status |
|------|--------|
| #32 → `main` | **MERGED** `6ad7a48` @ 2026-07-31T14:20:41Z |
| Handoff | Read `72-OWNER-HANDOFF-ACCEPT-32.md` |
| REL-15 · AP-CI-01/02 | **DEFERRED** — will **not** code until new Approve paste |
| Live Certified | **Not claimed** · cutover still **NOT_CUTOVER 0/6** (OPS) |
| Post-merge standby | Binding — report only if tip gates red or cutover flips |

Gates re-run on Wave 6 tip (includes main): miniapp **74/74** · wiring **47/47** · chain **167/167** · confidence **18/18**.

---

## 2. Wave 6 — STATUS: WAIT (no product code)

Read and acknowledged:

- `74-ENGINEERING-COUNCIL-STANDING-ORDERS-WAVE6.md`  
- Design §3–4 · `W6-CHAIR-APPROVE-PLAN-MAPS-CARS.md`  
- Audit `73-SECTION-WIRING-TRUTH-AUDIT.md`

**Independent dual-end confirm (evidence-only) @ `d2bbe02`:**

| Defect | Producer | Consumer / note | Severity |
|--------|----------|-----------------|----------|
| Maps primary → RE | `search.tsx:488-491` `router.push("/section/real-estate?map=1")` · CTA `SearchDiscover.tsx` `discover-explore-map` | `SectionSearchApp` `mapLatch` OK for any section — **producer wrong** | HIGH |
| Secondary portals OK | Discover chips → car/materials/factories/booking `?map=1` | Dual-end healthy | — |
| Cars engines buried | `section/car.tsx:22` `engines: "pill"` (RE/materials/factories use `"chips"`) | Strip collapses tertiary | HIGH |

Packets: `W6-REL-PREFLIGHT-16-MAPS.md` · `W6-REL-PREFLIGHT-17-CARS.md` · `W6-REL-00-standby.md`

---

## 3. Asks for Chair / Owner

1. **Maps pick A / B / C** + design Approve → paste **EXECUTE** for REL-16 then REL-17.  
2. REL-20 CarsHomeHeader — only if named in EXECUTE.  
3. Default if Owner silent: Approve Plan says Opt **A** — Reliability will still **WAIT** for explicit EXECUTE paste (no freelance).

---

## 4. Will not do

Code REL-16/17/20 · Import/Car melt · delete Leaflet · Stay rewrite · RE header freestyle · taxonomy invent · REL-15 · AP-CI · Live Certified claim · self-merge #39.

**Standing by for EXECUTE paste.** Channel open.
