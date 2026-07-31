# Materials mini-app — corrected plan (WAIT for owner design)

**Date:** 2026-07-31  
**Status:** Cleanup done · **no rebuild until owner hands design**  
**Scope lock:** `/section/materials` only  

---

## What was wrong (my fault)

I built a **separate fake hub** (`MaterialsHome` → then catalog) with service grids, cross-section exits, and HTML “screenshots”. That is **not** the BANCO mini-app goal and it broke trust / risked the materials path.

**Deleted in cleanup (garbage):**
- `components/search/materials/MaterialsHome.tsx`
- two-layer `materials.tsx` home|catalog state
- `collapseInlineStrips` era / hub guard / `materialsHub` i18n
- additive hub-only `SectionSearchApp` seeds tied to that home layer

**Restored to `main` (working catalog):**
- `app/section/materials.tsx` → plain `SectionSearchApp` + existing strips/FilterSheet/map
- `SectionSearchApp.tsx` byte-clean vs main (no hub props)
- i18n / package.json without materials-hub scripts

**Kept on purpose:** nothing from the hub. The real catalog tools on `main` stay — market, sort, listingMode, industrial chips, material strip, origin strip, FilterSheet, map. Those are the base we will chrome **around**, not erase.

---

## Correct goal (same as B-PROPERTIES colleague)

Mirror [PR #22 / `PropertyHomeHeader`](https://github.com/waelzaid66-max/banco-with-wael/pull/22) pattern:

| Do | Do not |
|----|--------|
| Chrome **inside** `/section/materials` → `SectionSearchApp` | Separate dashboard home route layer |
| Identity header bands A–D (Stay proportions) | Half-screen hero / fake marketplace grid |
| Search pill + filter **inside** pill → real `FilterSheet` | Collapse / hide filter strips |
| Type tabs → real `industrialType` / material criteria | Dead taps / cross-section “stolen” tiles |
| Listings under header on first paint | Fake stats (2450 / 18400 / 930) |
| Official marks + `@/components/icons` only | Invented B-CORE app / mock bottom tabs |
| Spec first, owner design first | Code before design handoff |

Reference shell (RE — do not copy RE files into materials):

```tsx
// real-estate.tsx pattern — materials will be analogous AFTER design
<SectionSearchApp category="materials" chrome={{ ... }} />
// MaterialsHomeHeader mounted only when category === "materials"
```

---

## Gate before any new code

1. Owner sends **design** (mock / marks / copy) — like RE agent received.
2. Write short spec under `docs/superpowers/specs/` and wait approval.
3. Implement chrome only; never reintroduce `collapseInlineStrips`.
4. Guards: materials route still catalog; factories/cars/stay untouched.

**Until then: STOP on materials UI. Catalog on this branch = main-clean.**

---

## Original giant problems (ledger — not materials rebuild)

Still open on `main` (separate waves; do not mix into materials until owner says):

| # | Issue | Status |
|---|--------|--------|
| — | Tracks A–D create listing / Clerk env | Merged #16 |
| #17 | Discover forces cars | Open draft |
| #18 | CTA density stretch | Open draft |
| #19–#21 | Banks / Stay / Messenger honesty | Open drafts |
| #22 | B-PROPERTIES chrome | Open — **correct pattern to mirror** |
| #15 | CAR IMPORT W3 docs | Open |
| OPS | DNS / EAS / Clerk social / Paymob | Outside app PR |

Materials work resumes **only** after owner design handoff, following B-PROPERTIES method.
