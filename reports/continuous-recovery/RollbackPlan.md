# Rollback Plan

| Field | Value |
|-------|-------|
| Commit | `194e1447cef9113fd7981e6fd97049ab8a72bf22` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


1. `git revert` C-WEB-BASE commit
2. Confirm chain gate fails on missing P-clerk-load-gate / P-web-* (expected)
3. No DB migrations in this repair — no schema rollback

