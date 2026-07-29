# FINAL PRODUCTION CERTIFICATION — Evidence Ledger

**Authority:** Chief Production Architect / Final Production Certification  
**Repository SoT:** `waelzaid66-max/banco-with-wael`  
**Branch:** `cursor/phase-x-production-hardening-5cf0`  
**Tip at certification write:** Round 7 tip (see git log)  
**Policy:** Zero invented features. PASS only with evidence. UNVERIFIED when device/ops required. SVG icon architecture must not be migrated.

---

## Executive verdict

**CONDITIONAL GO — NOT FULL PRODUCTION CERTIFIED.**

Code-path defects with reproducible source evidence from Phases / Rounds 1–7 have been repaired and gated. Physical-device, live PSP/APNs/FCM, and Coolify runtime configuration remain **UNVERIFIED**. Do not claim million-user deploy confidence until those external surfaces pass.

---

## Gate evidence (automated)

| Gate | Result | Evidence |
|------|--------|----------|
| `node scripts/chain-integrity-gate.mjs` | **108/108 PASS** | Includes Round 7 top-up/subscribe idempotency + saved-search match markers |
| API `pnpm test` (vitest) | **355 passed / 3 skipped** | `artifacts/api-server` |
| Mobile `pnpm test` | **PASS** | icons/lib/resilience/links/session/section/i18n |
| SVG icon registry | **PASS (static)** | `components/icons.tsx` lucide→svg; chain `P-svg-icon-registry` |

---

## Phase coverage (honest)

| Phase | Status | Notes |
|-------|--------|-------|
| 1 Monorepo integrity | **PARTIAL PASS** | Dead modules tracked, not mass-deleted (unsafe without proof) |
| 2 Architecture consistency | **PARTIAL PASS** | Mini-apps share SearchResultsMap by design; no invented isolation rewrite |
| 3 Account system | **CONDITIONAL** | Soft-delete/auth/tombstone hardened; MFA-delete TOTP UI deferred (BUG-002) |
| 4 Production consistency | **CONDITIONAL** | Money-path top-up/subscribe client idempotency closed (Round 7); device/ops still open |
| 5 Android hardening | **UNVERIFIED** | Needs physical device / EAS / FCM |
| 6 iOS hardening | **UNVERIFIED** | Needs physical device / APNs / Universal Links live |
| 7 Notifications | **CONDITIONAL** | Storms/mute/dedupe/unregister fixed in code; live delivery UNVERIFIED |
| 8 Email | **PARTIAL** | Cooldowns + channel prefs; live Resend delivery UNVERIFIED |
| 9 Search | **CONDITIONAL** | market_country/material/has_installment wired; Round 7 versioned alert matcher; nav rich replay residual |
| 10 Maps | **CONDITIONAL** | Native Leaflet WebView family proven; web map uses loaded pages only (residual) |
| 11 Mini-apps | **PASS (static)** | 5 marketplace sections guarded by tests; service-app count not invented |
| 12 API | **CONDITIONAL** | Validation/CAS/tombstone repairs; rate-limit trust + Coolify callbacks residual |
| 13 Visual QA | **UNVERIFIED** | No device/simulator UI session in this environment |
| 14 Deployment | **CONDITIONAL** | Compose/docs audited earlier; Coolify env correctness is ops-dependent |

---

## Round 5 repairs (this certification pass)

| Defect | Severity | Status |
|--------|----------|--------|
| Session storage + reconcile leaked saves across account switch | CRITICAL | **FIXED** — per-`userId` AsyncStorage keys + wipe on identity change |
| React Query shared cache leaked `/me`/notifications across users | HIGH | **FIXED** — `cancelQueries` + `clear` on `userId` change |
| Expired subscription still granted entitlements until cron | HIGH | **FIXED** — `expiresAt > now()` in PlanService + getActiveSubscription |
| Late PSP webhook credited soft-deleted wallet / subscription | HIGH | **FIXED** — settle paths fail-closed on `deletedAt` |
| Overlapping saved searches + race → new_match storms | HIGH | **FIXED** — once-per-user + atomic cooldown claim |
| RFQ / supply / investment upsert replay notified as “new” | HIGH | **FIXED** — notify only on first insert |
| Feed dropped `material` despite schema | HIGH | **FIXED** — controller + FeedService wire |
| Import cancel could overwrite delivered stage | HIGH | **FIXED** — CAS on current stage |
| Booking after archive still insertable (post FOR UPDATE) | HIGH | **FIXED** — re-read active + specs inside txn |
| Boost without idempotency key double-charged | HIGH | **FIXED** — key required; mobile + dealer-os emit; replay scoped to seller |
| Boost charged archived listing mid-flight | HIGH | **FIXED** — re-check active inside charge txn |

---

## Explicit residuals (not invented; not faked PASS)

| Residual | Severity | Why open |
|----------|----------|----------|
| MFA delete step-up UI when Clerk returns `needs_second_factor` | MED | Intentional prior BUG-002; full TOTP UI = product work |
| Saved-search structured filters ignored by AlertService matcher | HIGH | **FIXED (Round 7)** — `match_version: 1` + fail-closed unversioned dumps |
| Mobile saved-search navigation drops rich criteria | HIGH | Needs nav param pipeline completion (alert matcher is separate) |
| Web `SearchResultsMap.web` incomplete vs native clusters | HIGH | Twin implementation; needs shared cluster controller |
| Soft-delete leaves stories/comments/reviews public text | HIGH | **FIXED (Round 6)** — delete scrub + read guards |
| Top-up/subscription intents lack client idempotency keys | HIGH | **FIXED (Round 7)** — required UUID key = intent id; clients emit |
| Coolify `PUBLIC_API_BASE_URL` empty → Paymob no webhook URL | HIGH | **FIXED (Round 6)** — charge creation fail-closes without https callback |
| Rate limiter trust proxy / published :8080 spoofability | HIGH | **FIXED (Round 6)** — loopback bind + `RATE_LIMITED` contract |
| Paymob webhook unsigned intent remapping | CRITICAL | **FIXED (Round 6)** — signed `order.id` exclusive bind |
| Device cold/warm/kill/biometric/APNs/FCM visual QA | — | **UNVERIFIED** |

---

## Round 6 (final release hardening)

| Defect | Severity | Status |
|--------|----------|--------|
| HMAC-valid webhook remaps settlement via unsigned merchant_order_id | CRITICAL | **FIXED** — `claimPaymobOrderForIntent` advisory-locked bind |
| Account deletion left stories/reviews/comments + KYC blobs | HIGH | **FIXED** — scrub + storage purge + pending intent fail |
| Paymob charge without `PUBLIC_API_BASE_URL` stranded pending | HIGH | **FIXED** — require https callback before charge |
| 429 used `INVALID_DATA`; API port world-bound | HIGH | **FIXED** — `RATE_LIMITED` + Coolify loopback publish |

---

## Round 7 (idempotency + alert precision)

| Defect | Severity | Status |
|--------|----------|--------|
| Top-up/subscribe retries opened a second Paymob checkout | HIGH | **FIXED** — client UUID = `payment_intents.id`; replay bound checkout |
| Saved-search alerts ignored `filters` (false positives) | HIGH | **FIXED** — versioned matcher; unversioned fail-closed; cooldown after match only |

See `reports/production-verification/20-ROUND-7-IDEMPOTENCY-ALERTS.md`.

---

## What must be true before FULL CERTIFIED

1. Physical Android + iOS QA checklist signed (cold/warm/kill, push tap, OAuth, biometric).  
2. Coolify: `PUBLIC_API_BASE_URL`, `OBJECT_STORAGE_PROVIDER=s3` + credentials, Paymob webhook verified end-to-end.  
3. Residual HIGH rows above closed or explicitly accepted by owner with written risk.  
4. Chain gate + API vitest + mobile tests green on the release tip.  
5. No SVG→PNG/font icon migration.

---

## Decision

**CONDITIONAL GO** for staging / controlled production ramp.  
**NOT** final million-user certification until device/ops UNVERIFIED surfaces and remaining OPEN HIGH residuals (saved-search **nav** rich replay, web map twin) are closed or owner-accepted in writing.
