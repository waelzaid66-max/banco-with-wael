# B-CORE — Materials mini-app upper header (materials only)

**Date:** 2026-07-31  
**Scope:** `/section/materials` only — do not touch Cars, Stay, RE, Factories UI, Import, API, DB, auth  
**Status:** REJECTED by owner 2026-07-31 — wrong identity (CORE/B copy), HTML fake screenshot, touched original materials strips. Reverted to main catalog.  
**Method:** Same as B-PROPERTIES colleague — chrome **inside** `SectionSearchApp`, not a separate hub route  

---

## Goal

Give Manufacturing & Raw Materials a clear **B-CORE Industrial Hub** identity in the **upper header**, with filters **completed + compressed into that header** — then serve the section (listings + real criteria).  

**Never touch** BANCO `MiniAppBottomNav` (our bottom header). Mock Marketplace / center-`+` tabs are **not** used.

---

## Name & identity (from owner mock + brand kit)

| On screen | Source |
|-----------|--------|
| Lightning **B** mark | Official kit (`boom-logo` crop → `b-mark.png`, same family as RE) |
| **CORE** | Typography — completes **B-CORE** (mock name) |
| **INDUSTRIAL HUB** | Small spaced subtitle under wordmark |
| Tagline | Industrial supply network for manufacturing & trade (en + ar) |
| **POWERED BY** + `banco-logo.png` | Same Stay / B-PROPERTIES pattern |

### Explicitly NOT used

- Full **B-OOM** / “BANCO OWNERS OPEN MARKET” word as the materials title  
- Handshake **O** / house-keys **O** (those are RE / group kit — RE already uses property seal)  
- Fake stats **2,450 / 930 / 18,400 / 52** (no live totals → no vanity numbers)  
- Hamburger / bell unless already wired to real routes  
- Mock bottom nav (Marketplace / +)

Accent: existing `sectionTheme` materials `#A82A1C`.

Optional Band B atmosphere: `categories/materials.jpg` as **cropped** backdrop behind brand only (gradient), **not** a half-screen hero card.

---

## Architecture

```
/section/materials
  └─ SectionSearchApp (category="materials")
       ├─ MaterialsHomeHeader   ← NEW (presentational; parent owns criteria)
       ├─ results / map         ← listings first under header
       ├─ FilterSheet           ← full refinements (material, origin, …)
       └─ MiniAppBottomNav      ← UNCHANGED
```

- `app/section/materials.tsx` stays a thin shell (like `real-estate.tsx`).  
- **No** `MaterialsHome` two-layer hub. **No** `collapseInlineStrips`.  
- Mount header **only** when `category === "materials"`.

---

## Upper header bands (Stay-parity proportions)

Component: `components/search/materials/MaterialsHomeHeader.tsx`

| Band | Content | ~Height | Notes |
|------|---------|---------|--------|
| A | Back · save-search (real actions only) | ~40px | No fake bell/hamburger |
| B | `[b-mark] CORE` · INDUSTRIAL HUB · tagline · POWERED BY BANCO | ~72–88px | Large B mark — industrial presence |
| C | **Search pill** + **Filters control inside pill** → existing `FilterSheet` | ~50px | Completes mock search+Filters by moving them **up** into header |
| D | **Large-icon type tabs** → real `industrialType` | ~56–64px | Icons sized for industrial section (larger hit than Stay text tabs) |

`topPad`: `Math.max(insets.top, Platform.OS === "web" ? 12 : 0)` — never fake `67`.

### Band D tabs (real criteria — not decoration)

| Tab | Criteria |
|-----|----------|
| All | `industrialType: "all"` |
| Machines | `industrialType: "machine"` |
| Raw materials | `industrialType: "raw_material"` |
| Production lines | `industrialType: "production_line"` |

Icons: `@/components/icons` registry only (Android/Expo-safe). Large MCI icons (`cog`, `package`, `cog-outline`, `grid` / factory-safe names).

Factories / Suppliers / Import / Export from the mock **services grid** are **not** first-paint header chrome in v1 (avoids broken cross-section hub). They remain reachable via existing Discover / business routes later as optional desks **only if** owner asks after header lands.

---

## Filter merge (complete + compress — never erase)

| Today | After (materials chrome on) |
|-------|------------------------------|
| Search icon + separate filter entry competing with strips | Search + Filters **inside** Band C pill → `FilterSheet` |
| Industrial type chips in a strip | Band D large-icon tabs (same `industrialType` axis) |
| Material commodity strip (13) + origin strip | Stay available inside **`FilterSheet`** (complete, not deleted) |
| Market + sort on primary strip | Compact controls in header **or** one slim primary row under Band D if needed for market/sort only — **never** hide without replacement |
| Listing mode | Inside `FilterSheet` (same honesty as keeping the axis) |

Hard rule from failed PRs #23/#24: **do not** introduce `collapseInlineStrips` that blanks market/sort/industrial with no FilterSheet replacement.

Map FAB / map mode / listing open / messenger contracts unchanged.

---

## Bottom header (locked)

- Keep `MiniAppBottomNav` exactly as BANCO (Home / Search / Messages / Saved / Profile).  
- Do **not** implement mock Marketplace / center plus button.

---

## Non-goals

- Separate MaterialsHome dashboard with 2×4 service cards as the entry screen  
- Fake country/factory counts  
- Touching `/section/car`, `/section/real-estate`, `/section/booking`, `/section/factories` UI  
- New API/DB  
- HTML fake screenshots as “done”

---

## Success

1. First viewport: **B-CORE** identity clear + search/Filters in header + large type icons + listings  
2. Every control drives real criteria / `FilterSheet` / existing routes  
3. Bottom nav untouched  
4. `typecheck` + section/icon/i18n guards green  
5. Other sections byte-identical outside the materials chrome path  

---

## Owner gate

Approve this spec (especially: **B-CORE** naming, Band D four types, refinements in FilterSheet, no fake stats, no mock bottom nav) → then implement.
