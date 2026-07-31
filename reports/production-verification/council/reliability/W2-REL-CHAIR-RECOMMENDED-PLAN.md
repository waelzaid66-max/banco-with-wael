# W2-REL — Recommended Chair plan (reality-backed)

Companion to `W2-REL-CHAIR-SENIOR-BRIEFING.md`. No speculative features.

## Plan A (recommended) — Engineering merge → OPS cutover

| Step | Actor | Action | Done when |
|------|-------|--------|-----------|
| 1 | Chair/Owner | Re-run failed **CI Website Docker** on #32 (flake @ docker.io) | Job green **or** waiver logged in COUNCIL-DECISIONS |
| 2 | Chair | Undraft #32 → merge to `main` | `main` == tip SHA |
| 3 | Chair | Close #30; close/supersede #36 | No competing tip |
| 4 | Reliability | Post-merge REL-00 on `main` | Wiring/chain/confidence recorded |
| 5 | Auditor | AUD-20→25 on `main` | `W2-AUD-WAVE2-ROLLUP.md` |
| 6 | Owner OPS | Checklist A→G | `pnpm ops:live-cutover` exit **0** |
| 7 | Chair | Only then allow “Live Production Ready” language | Cutover 0 + checklist G |

## Plan B — Hold for Auditor paper

Same as A but insert Auditor rollup **before** step 2. Use only if Owner requires audit packet pre-merge. Does not unblock DNS.

## Explicit rejects

- CAR IMPORT Wave 4/5 without Owner go  
- MSG-05 WebSocket without product decision  
- Dual-Next cutover without Architect design  
- Treating Docker Hub timeout as app bug  
- Declaring Certified while cutover ≠ 0  

## Optional Approve Plan one-liner for Reliability

`Approve Plan: REL-06 — notification enum→route matrix markdown + production-wiring guard rows only; no new routes.`
