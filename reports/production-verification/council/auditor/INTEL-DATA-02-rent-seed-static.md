# INTEL-DATA-02 — Rent listings presence (static only)

- Master ID: **DATA-02**  
- Seat: Production Intelligence  
- Tip: `7e3b40a`  
- Stamp: `2026-07-31T18:40Z`  
- Mode: static seed/code only · **tip DB = UNVERIFIED** (`DATABASE_URL` unset in this agent)

---

## Findings

| Check | Result |
|-------|--------|
| Seed writes `offer_type: "rent"` | **CODE YES** — `artifacts/api-server/src/seed.ts` ~L1394 (`i % 3 === 0 ? "rent" : "sale"`) |
| Search offerType=rent filter tests | **CODE YES** — `SearchService.offerType.test.ts` |
| Live/tip DB count `offer_type=rent` | **UNVERIFIED** — no DB credentials in this environment |

**Verdict:** DATA-02 remains **UNVERIFIED** for production/tip DB. Seed corpus **supports** rent rows after seed run; Owner/Replit must confirm live inventory.

---

## ASK_DIRECTOR

Assign Replit/Owner one SQL count on tip DB, or keep DATA-02 UNVERIFIED until Live Cutover prep.

— Intelligence
