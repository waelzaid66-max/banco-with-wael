# W4-MOBILE-SCREEN-MATRIX.md

**Tip:** PR #32 · **Wave:** `67` + **`69` Wave 4b**  
**Protocol:** `68` distrust — half-path HEALTHY invalid  
**Legend:** PENDING · IN_PROGRESS · HEALTHY · RISK · DEFECT · UNVERIFIED_VISUAL · FIXED · SUPERSEDED · HYPOTHESIS

| Zone | Screen / surface | Status | Packet |
|------|------------------|--------|--------|
| A | Tab shell + FAB | HEALTHY | W4-CHAIR-ZONE-A-TABS |
| A | Feed | HEALTHY | W4-CHAIR-ZONE-A-TABS |
| A | Search / Discover | HEALTHY | W4-CHAIR-ZONE-A-TABS |
| A | Messages list | HEALTHY | W4-CHAIR-ZONE-A-TABS (+ Zone D) |
| A | Saved | RISK LOW | W4-CHAIR-ZONE-A-TABS |
| A | Profile (Skip/role) | FIXED REL-09 | W4-CHAIR-ZONE-A-TABS + REL-09 + AUD peer |
| B | /section/* (5) | HEALTHY emit; create consumer FIXED REL-10 | W4-CHAIR-ZONE-B-SECTIONS (amended) |
| C | listing/[id] | HYPOTHESIS→rebind Wave4b | W4-MOB-C-01 (stale SHA) · skeptic MOB-C-11 |
| C | listings/create | **FIXED REL-10** | skeptic + REL-10 + AUD REL-10 peer; C-02 HEALTHY **SUPERSEDED** |
| C | listings/edit | **FIXED REL-11** price/request; RISK MEDIUM AuthGate MOB-C-10 open | skeptic C-09/10 · W4-REL-11-CHAIR-EXECUTE · W4-MOB-C-03 |
| C | listings/mine | RISK / PENDING AuthGate MOB-C-10 | skeptic · W4-MOB-C-04 |
| D | messages/[id] · notifications · auth | HYPOTHESIS @ `3a234ef` → **Wave4b rebind** | W4-REL-ZONE-D-* |
| E | business/* | HYPOTHESIS @ `3a234ef` → **AUD-42 rebind** | W4-MOB-E-01…03 |
| F | import/industry/wallet/settings/legal | HYPOTHESIS @ `3a234ef` → **SUP-10 rebind** | W4-MOB-F-ZONE-STATIC |
| G | notificationRouting + deep links | PENDING shared | |
| * | Device screenshots | UNVERIFIED_VISUAL | Owner device |

**Open Approve backlog:** MOB-C-10 AuthGate (REL-12 plan only until Approve).  
**Non-goals:** Live Certified · CAR IMPORT W4/5 · MSG-05.
