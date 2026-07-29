# 39 — Release execution GO / NO-GO (`w.4.1`)

**Engineering order:** Code tip verified → **owner merge** → **tag** → **Coolify** → **smoke matrix** → FULL CERT only if smoke passes.  
**Tip under test:** `05d0dd1` (`cursor/w41-production-release-5cf0`)  
**Policy:** No new product invent in this gate. OPS cannot be faked from CI.

---

## A. Code gate (agent — DONE this turn)

| Check | Result @ `05d0dd1` |
|-------|---------------------|
| chain-integrity | **164/164 PASS** |
| API vitest | **385 passed / 3 skipped** |
| production-confidence | **14/14 PASS** |
| `banco-website` tsc | **PASS** |
| Ahead of `main` | **54** commits |
| PR on GitHub | **NONE** — open compare URL |
| Tag `w.4.1` | **NONE** |

### Closed on tip (code)

| ID | Item |
|----|------|
| P2-M2 | Tombstone auto-signOut web/SPA |
| P2-M3 | Website `/workspace/settings` delete UI |
| P2-M4 | OpenAPI livez/readyz/payments (140/166) |
| P2-M9 | dealer-os NotFound catch-all |
| w.4.1 reconnects | Coolify bake/paths/pin/S3 env/plug/notif scrub/CI |

### Still open (do not block merge; block FULL CERT)

| ID | Item | Next owner |
|----|------|------------|
| — | Merge + tag + Coolify deploy | **you** |
| P2-H2/H3 | S3 keys + migrate → readyz 200 | OPS |
| P2-H1 | Paymob TOFU | Design later — no invent |
| P2-M1 | Facets `market_country` | Post-ship code (MED) |
| P2-M5/M6 | Dual web / search LIVE false | Cutover / bake flags |
| Live Clerk/EAS/Paymob/device | UNVERIFIED | Smoke `37-*` |

**Code verdict:** **GO to merge** (CONDITIONAL — not FULL CERT).

---

## B. Owner sequence (strict order)

### B1 — GitHub (required)

1. Open PR:  
   https://github.com/waelzaid66-max/banco-with-wael/compare/main...cursor/w41-production-release-5cf0?expand=1  
2. Title suggestion: `w.4.1 — production release (recovery + P2-M2/M3/M4/M9)`  
3. Merge to `main`  
4. Tag merge SHA:
   ```bash
   git checkout main && git pull origin main
   git tag -a w.4.1 -m "w.4.1 production release"
   git push origin w.4.1
   ```

### B2 — Coolify (required for live ship)

Follow `deploy/coolify/COOLIFY-DEPLOY-ORDER.md`:

1. Secrets (Clerk, session, payment encryption, **S3 static keys**, Paymob)  
2. Postgres healthy  
3. `docker compose -f docker-compose.coolify.yml --profile migrate run --rm migrate`  
4. Up `api` → **`GET /api/readyz` = 200**  
5. Up `banco-website` (+ frozen `banco-web` until cutover)  
6. Up `web` nginx  

### B3 — Live smoke (required for FULL CERT)

Execute `37-COOLIFY-LIVE-SMOKE-MATRIX.md` at minimum: **S1–S3, S5–S9, S12–S15, S17–S19, S22–S25**.

---

## C. Post-ship backlog (engineering priority after Coolify green)

| Priority | Work | Why later |
|----------|------|-----------|
| 1 | Facets `market_country` (P2-M1) | Search chip parity — contract expansion |
| 2 | Paymob TOFU design (P2-H1) | Needs signed correlation — no invent without design |
| 3 | Owner cutover drop `banco-web` | Domain ownership |
| 4 | Flip `WEB_SEARCH_LIVE/MAP=true` | Soft-launch product choice |
| 5 | Product waves M2–N* | After ship unless ordered |

---

## D. GO / NO-GO summary

| Question | Answer |
|----------|--------|
| Merge this tip to `main`? | **GO** |
| Tag `w.4.1` after merge? | **GO** |
| Claim production fully certified now? | **NO-GO** until B2+B3 |
| More code invent before merge? | **NO-GO** — tip is merge-ready |

---

## STOP

Agent code work for `w.4.1` recovery line is **complete** at this gate.  
**Next human actions only:** B1 → B2 → B3.  
Reply after Coolify smoke (or paste failures) for triage; or order post-ship item #1 (facets).
