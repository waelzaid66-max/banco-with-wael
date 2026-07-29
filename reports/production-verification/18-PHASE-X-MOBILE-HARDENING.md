# PHASE X — Absolute Production Hardening (Mobile-first certification)

**Branch:** `cursor/phase-x-production-hardening-5cf0`  
**Date:** 2026-07-29  
**Policy:** Zero assumption. PASS only with evidence. No SVG→PNG/font migration. No invented features.

---

## What was audited (evidence-based)

### Forensic contamination (`artifacts/banco-mobile`)

| Finding | Verdict | Action |
|---------|---------|--------|
| Icon system = lucide → react-native-svg via `components/icons.tsx` | **INTENTIONAL** (Android compatibility) | Verify only — **no migration** |
| `MiniAppBottomNav` vs tab CapsuleTabBar | Intentional chrome mirror for section stack | Keep |
| Dead modules: `lib/searchNavParams.ts`, `financeFilters.ts`, `behaviorSession.ts`, `hooks/useI18n.ts` | Orphan | Tracked — not deleted (no proof of safe removal this turn) |
| Declared but unused: `react-native-maps`, `@vis.gl/react-google-maps`, markerclusterer | Package contamination | Tracked — maps use Leaflet WebView (`SearchResultsMap`) |
| `@types/react` pin vs catalog | Version drift | Tracked |

### Five primary marketplace mini-apps (PROVEN in code)

| # | Route | Body | Map |
|---|-------|------|-----|
| 1 | `/section/car` | `SectionSearchApp` category=`car` | Shared `SearchResultsMap` |
| 2 | `/section/real-estate` | `SectionSearchApp` `real_estate` | same |
| 3 | `/section/factories` | `SectionSearchApp` `facilities` | same |
| 4 | `/section/materials` | `SectionSearchApp` `materials` | same |
| 5 | `/section/booking` | `BookingStaysApp` locks `real_estate`+`rent` | same |

Hard-locks proven by `section-miniapp-guard.test.mjs` (**PASS**).

### “Five service mini-apps”

**No code constant defines exactly five service apps.** Discover B2B portals found: Global supply, Supply hub, Banks (**3**). Supply-hub cards expand to **8** routes. Industry hub is a parallel industrial browse — not a sixth marketplace section. Reported honestly, not invented.

### Maps

Single implementation family: `SearchResultsMap` + `.web` + `mapHtml` (Leaflet). Ownership: Search tab + section mini-apps + booking. No `react-native-maps` usage in source.

### Account system (10th pass)

| Path | Status |
|------|--------|
| Register / email OTP / MFA sign-in / OAuth fail-closed / consent-before-flag / FI intent / demote guards / soft-delete auth | **PROVEN_OK** (source + gates) |
| Delete when Clerk fails after DB wipe | **FIXED** this turn (return success → client signs out) |
| MFA delete skips second factor | **DOCUMENTED residual** (intentional prior unblock; completing TOTP UI = product work, not invented here) |
| Session restore on physical device | **UNVERIFIABLE** here (needs device/EAS) |

### Notifications / dynamics

| Defect | Severity | Status |
|--------|----------|--------|
| `car_import` missing from response Zod enum → GET /notifications 500 | CRITICAL | **FIXED** |
| Prefs API omitted booking/billing/import → unmuteable | HIGH | **FIXED** + Settings i18n |
| Cold-start push last-response + listener double nav | HIGH | **FIXED** (id dedupe) |
| Biometric lock on `inactive` storms | HIGH | **FIXED** (background only) |
| Dual new_match (saved search + follower) | HIGH | **FIXED** (skip set) |
| Message push/email no cooldown | MED | Residual |
| Pixel visual QA all screens | — | **UNVERIFIABLE** without device/simulator UI |

---

## Verification evidence (this turn)

| Gate | Result |
|------|--------|
| `node scripts/chain-integrity-gate.mjs` | Must be **74/74** after new Phase X markers |
| API vitest | **346 passed / 3 skipped** |
| Mobile section + icons + accounts batch | **75+ pass** (section guard suite + related) |
| SVG icons | `tests/icons.test.mjs` asserts no runtime vector-font glyphs |

---

## Explicitly UNVERIFIABLE without device / EAS / ops

Cold/warm start, kill, memory pressure, rotation, large fonts, dark/light pixel QA, APNs/FCM delivery, biometric + notification permission interaction, Universal Links, live OAuth tenant, Resend delivery, multi-device push.

**Do not claim visual PASS.** Claim: static + unit gates PASS; device QA still required.

---

## Decision

**CONDITIONAL GO** for mobile code hardening continues. Phase X closed proven incident-class notification/auth/dynamic defects without inventing features or touching SVG icon architecture.
