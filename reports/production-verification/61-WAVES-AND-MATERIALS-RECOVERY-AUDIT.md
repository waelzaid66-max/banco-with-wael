# Wave recovery + Materials precision audit

**Date:** 2026-07-31  
**Owner:** Banco Boom  
**Branch:** `cursor/materials-hub-layer-1e3d` (PR #25)  
**Scope of code fixes in this wave:** `/section/materials` only  

---

## 0) Verdict (read first)

| Area | Status on `main` | Action now |
|------|------------------|------------|
| Tracks A–D (Clerk env footgun, create market/currency, map pin, MENA) | **MERGED** (#16) | Done in code; OPS must still bake Clerk secrets |
| CAR IMPORT W1/W2 | **MERGED** (#13/#14) | Done |
| Discover forces cars | **BROKEN on main** | Open draft #17 — merge next (not materials) |
| UI density stretch CTAs | **BROKEN on main** | Open draft #18 |
| Banks / Stay / Messenger honesty | **Open drafts** #19–#21 | Honesty only; not full feature builds |
| B-PROPERTY chrome | Open draft #22 | Touches shared `SectionSearchApp` — conflict risk vs materials |
| Materials mini-app home | **Missing on main** | #23/#24 failed (filter erase); **#25** recovers with strips intact + Stay-header repair |
| Live Coolify DNS / AASA / EAS bake / Paymob | **OPS open** | Not fixable in app-only PRs |

**Hard lesson from #23/#24:** never use `collapseInlineStrips` on materials. Home organizes entry; catalog keeps every strip + FilterSheet.

---

## 1) Giant production issues (from conversation start / Phase Zero / audits #52 #59)

Sources: `52-MOBILE-FIRST-PRINCIPAL-AUDIT.md`, `59-MOBILE-FULL-PRODUCT-AUDIT.md`, Phase Zero master audit (PR #12 docs-only branch).

### 1.1 Fixed in merged code (#16 Tracks A–D)

1. **Replit `dev` blanked `EXPO_PUBLIC_CLERK_*`** → `scripts/dev-env.sh` path (Track A).
2. **Create listing country/currency chip clouds** → compact market/currency buttons (Track C).
3. **Create map pin picker missing** → `MapPinPicker` + GPS tools under location (Track D).
4. **Unsafe MENA market expansion** → gated expansion (Track D).

### 1.2 Still open — product (draft PRs, not merged)

| # | Issue | PR | Risk |
|---|-------|-----|------|
| P1 | Discover `SECTION_ROUTE.all → /section/car` + map FAB honesty | #17 | Low |
| P1 | Full-row CTA density (`alignSelf: stretch`) | #18 | Low |
| P2 | Banks brochure honesty + copyable `/me` id | #19 | Low |
| P2 | Stay overclaim copy (Reserve → request) | #20 | Low |
| P2 | Messenger listing chrome drop (`listingId`/`role`) | #21 | Low |
| P2 | B-PROPERTY compact chrome | #22 | Med — shared SectionSearchApp |
| P2 | CAR IMPORT Wave 3 document upload | #15 | Med — rebase + schema |
| P3 | Materials Industrial Hub home | #25 | Med UX — strips preserved |

### 1.3 Still open — OPS / platform (no app PR can close alone)

- Live API/DNS readiness (`banco.today` `/api/readyz` historically 404 in audit probes).
- AASA / assetlinks well-known.
- EAS env bake of `EXPO_PUBLIC_*` (Clerk + API).
- Clerk Dashboard social providers empty → SSO buttons stay fail-closed.
- `expo-apple-authentication` still missing for Apple Sign-In on device.
- Paymob live / Stay booking pay deferred.
- Device E2E / store submit not certified.
- Preview runs frozen `banco-web` (documented in Phase Zero §23).

### 1.4 Intentionally not “wiped” (honesty vs rebuild)

- **Banks:** brochure hub exists; not a deleted marketplace. Live public directory is ADS-FIRST by design.
- **Boom Stay:** engine present; host calendar / pay / stay-reviews still missing — copy must not overclaim (#20).
- **Messenger:** poll-only (G47) — not a missing WebSocket. Real bug is listing→chat wiring (#21).

---

## 2) Materials failure autopsy (#23 → #24 → #25)

### PR #23 (CLOSED) — first break

- Introduced `collapseInlineStrips` so chips “moved into FilterSheet.”
- **Root cause:** flag hid the **entire primary strip** → market + sort gone; industrial subtype had no working FilterSheet control.
- Also improvised home chrome that felt stolen / unbalanced.

### PR #24 (CLOSED) — second break

- Still passed `collapseInlineStrips`; salvage kept market/sort but **erased** listingMode / industrial / material / origin strips from the strip UI.
- Figma-style photo hero (`minHeight` ~132) → half-screen feel.
- Owner closed again.

### PR #25 (OPEN) — recovery contract

| Must keep | Must fix in recovery pass |
|-----------|---------------------------|
| No `collapseInlineStrips` | Stay-band header: search+filters in header (Band C), not buried under scroll |
| Additive seeds only | Remove competing hero thumb from brand band |
| Catalog strips + FilterSheet intact | Brand band = logo + wordmark + rules + powered-by (Stay proportions) |
| `MiniAppBottomNav` 5 tabs | Equipment tile must not duplicate Machines seed |
| No fake 2450/18400/930 counts | Capability chips as Band D tabs (honest seeds) |
| Import/export → `/business/global-supply` | Scope stays `/section/materials` only |
| SVG icons via `@/components/icons` | Guard tests updated |

---

## 3) Open wave merge order (after materials visual OK)

1. **#25 Materials** (this PR) — isolated route; strips intact.  
2. **#17 Discover** — stops cars-force on main.  
3. **#18 Density** — hug CTAs.  
4. **#19–#21** honesty/wiring (independent).  
5. **#12** Phase Zero docs ledger anytime.  
6. **#15** Import W3 after rebase.  
7. **#22** B-PROPERTY last among drafts that touch `SectionSearchApp` — rebase on materials first.

---

## 4) Materials-only recovery checklist

- [x] Audit giant issues + open waves (this file)
- [x] Confirm #25 does not reintroduce strip collapse
- [x] Stay-band header repair on `MaterialsHome` only
- [x] Equipment seed honesty (`all` + openFilters — not duplicate machine)
- [x] Search+Filters in header Band C
- [x] Capability chips Band D (not stuffed inside brand wordmark row)
- [x] Guards + typecheck
- [ ] Device smoke: all catalog strips still present

---

## 5) Non-goals (this branch)

- Do not edit Factories / Cars / RE / Stay screens.
- Do not merge other wave PRs from this branch.
- Do not invent fake directory counts or car `/import` routes for materials.
