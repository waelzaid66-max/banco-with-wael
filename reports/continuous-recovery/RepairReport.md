# Repair Report — C-WEB-BASE

| Field | Value |
|-------|-------|
| Commit | `194e1447cef9113fd7981e6fd97049ab8a72bf22` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


## Unique ID
`REP-C-WEB-BASE-2026-07-21`

## Problem
CA lacked bancoo's Replit web production path: browsers got Expo Go QR only; `<ClerkLoaded>` could white-screen forever on unauthorized origins; fonts could hang on web.

## Evidence
- Forensic card C-WEB-BASE / C-MEM-WEB
- Diff bancoo`321af02` vs CA: `_layout.tsx`, `app.config.ts`, `scripts/build.js`, `server/serve.js`

## Root Cause
History-stripped bancoo handoff contained the web stack; CA continuous line had native/EAS focus and never re-imported the Replit browser SPA path after wipe-era churn.

## Files Modified
See fingerprint.lastRepair.files

## Validation
- chain-integrity-gate: PASS (includes P-clerk-load-gate, P-web-export-build, P-web-serve-spa)
- mobile node tests incl. session-restore: PASS
- typecheck/lint/full build: BLOCKED (no node_modules)

## Rollback
`git revert` this commit; gates will fail intentionally if markers regress.

## Final Status
CODE MERGED on working line · NOT production-accepted · bancooom still FAIL · live F1 BLOCKED

