# Rollback Plan

| Field | Value |
|-------|-------|
| Commit | `5283a4fec1294ec8f272bb44a41d6d2aa92ed46b` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


1. `git revert` C-WEB-BASE commit
2. Confirm chain gate fails on missing P-clerk-load-gate / P-web-* (expected)
3. No DB migrations in this repair — no schema rollback

