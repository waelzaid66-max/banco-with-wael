# Rollback Plan

| Field | Value |
|-------|-------|
| Commit | `5d027bfdbd88cb89304c8ca869454d64c4d1273a` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


1. `git revert` C-WEB-BASE commit
2. Confirm chain gate fails on missing P-clerk-load-gate / P-web-* (expected)
3. No DB migrations in this repair — no schema rollback

