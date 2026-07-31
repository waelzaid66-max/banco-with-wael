# W4 — Mobile screen matrix (master)

**Tip:** PR #32 · **Wave:** `67-MOBILE-SUCCESS-AUDIT-WAVE4.md`  
**Legend:** PENDING · IN_PROGRESS · HEALTHY · RISK · DEFECT · UNVERIFIED_VISUAL · FIXED

| Zone | Screen / surface | Status | Packet |
|------|------------------|--------|--------|
| A | Tab shell + FAB | HEALTHY | W4-CHAIR-ZONE-A-TABS |
| A | Feed | HEALTHY | W4-CHAIR-ZONE-A-TABS |
| A | Search / Discover | HEALTHY | W4-CHAIR-ZONE-A-TABS |
| A | Messages list | HEALTHY | W4-CHAIR-ZONE-A-TABS |
| A | Saved | RISK LOW | W4-CHAIR-ZONE-A-TABS |
| A | Profile (Skip/role) | FIXED REL-09 | W4-CHAIR-ZONE-A-TABS + REL-09 |
| B | /section/car | HEALTHY | W4-CHAIR-ZONE-B-SECTIONS |
| B | /section/real-estate | HEALTHY | W4-CHAIR-ZONE-B-SECTIONS |
| B | /section/factories | HEALTHY | W4-CHAIR-ZONE-B-SECTIONS |
| B | /section/materials | HEALTHY | W4-CHAIR-ZONE-B-SECTIONS |
| B | /section/booking | HEALTHY | W4-CHAIR-ZONE-B-SECTIONS |
| C | listing/[id] | PENDING Auditor | |
| C | listings/create | PENDING Auditor | |
| C | listings/edit | PENDING Auditor | |
| C | listings/mine | PENDING Auditor | |
| D | messages/[id] | PENDING Reliability | |
| D | notifications | PENDING Reliability | |
| E | business/banks | PENDING Auditor | |
| E | business RFQ/supply/investments | PENDING Auditor | |
| F | import/* | PENDING Support | |
| F | industry | PENDING Support | |
| F | wallet/billing/plans/settings/legal | PENDING Support | |
| G | notificationRouting + deep links | PENDING shared | |
| * | Device screenshots all zones | UNVERIFIED_VISUAL | Owner device |

**Baseline gates (Chair):** mobile tests 267 pass · chain 167/167 · confidence 20/20 (pre-REL-09 push re-run required).
