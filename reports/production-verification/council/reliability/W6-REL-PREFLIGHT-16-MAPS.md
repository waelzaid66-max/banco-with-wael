# W6-REL-PREFLIGHT-16 — Maps primary ≠ RE (evidence only)

**Seat:** Reliability · WAIT Approve/EXECUTE  
**Tip:** `d2bbe02` · SoT main `6ad7a48`  
**World:** Maps / Discover  
**Protocol:** `68` dual-end · **no code**

## Dual-end

| End | Evidence | Verdict |
|-----|----------|---------|
| Producer primary | `app/(tabs)/search.tsx:488-491` → `/section/real-estate?map=1` | **DEFECT** |
| Producer CTA | `components/SearchDiscover.tsx` `testID="discover-explore-map"` → `onExploreMap` | Wired to defect |
| Producer FAB | `search.tsx:1075-1087` same `exploreOnMap()` | Same defect |
| Secondary producers | Discover portals car/materials/factories/booking `?map=1` | HEALTHY |
| Consumer | `SectionSearchApp` map latch accepts any section | HEALTHY |

## Ready when EXECUTE

REL-16 Opt A (default): chooser / equal portals; stop hardcoding RE; generic copy.  
Forbidden: shared-Search melt · delete portals · API touch.

**Status:** PREFLIGHT PASS — awaiting Chair EXECUTE.
