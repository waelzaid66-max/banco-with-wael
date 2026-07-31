# W8-REL-00 — Post–Tranche B tip re-verify (`main`)

**Seat:** Production Reliability · `bc-019fb4d1…53de`  
**Orders:** `82` — REL-00 after land · then STANDBY  
**SoT:** `main` @ `0893b8b` (Tranche B CLOSED stamp `841ee01` · fix `2afccf8` · PR **#42**)  
**Date:** 2026-07-31  
**Companion:** `W8-REL-CHAIR-FULL-AUDIT.md`

## Dual-end

| ID | Pass | Tip evidence |
|----|------|--------------|
| D-W8-01 | YES (vs Approve Plan) | one `section-sort-cycle` · header market/sort removed |
| D-W8-02 | YES | one `materials-origin-strip` |
| D-W8-03 | YES | `SearchDiscover` Props=`{onExploreMap}` · host `search.tsx:613` · Maps `/section/maps` · FilterSheet browseBrand kept |

**ASK (not FAIL):** D-W8-01 inverted STUDY-01 Stay-parity sacred header — see full audit §4.

## Gates @ `0893b8b`

77 miniapp · 8 materials · 4 stay · 7 market · 32 harden · 47 wiring · 167 chain · 18 confidence · api tsc **PASS** · cutover **NOT_CUTOVER 0/6**

**ACK:** REL-00 complete. Zero product code. STANDBY pending Chair ACK / D-W8-01 ADJUDICATE.
