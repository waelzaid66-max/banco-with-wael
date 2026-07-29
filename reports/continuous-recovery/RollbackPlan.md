# Rollback Plan

| Field | Value |
|-------|-------|
| Commit | `9965d12a4d532c755abf7642e90a2c1afa914226` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


1. `git revert` C-WEB-BASE commit
2. Confirm chain gate fails on missing P-clerk-load-gate / P-web-* (expected)
3. No DB migrations in this repair — no schema rollback

