# 53 — SoT Recovery & Mobile Restitution

**Date:** 2026-07-30  
**SoT:** `waelzaid66-max/banco-with-wael` only  
**Mobile identity:** `com.bancooom.app` / scheme `bancooom` / name `BANCO`  
**Policy:** Restitute every correct letter to SoT. Sister `bancoo` is transport pollution, not authority.

---

## 1. What went wrong (honest)

| Fact | Detail |
|------|--------|
| Cloud agent environment | Bound to `github.com/waelzaid66-max/bancoo` |
| True product SoT | `github.com/waelzaid66-max/banco-with-wael` |
| Failure mode | After `cursor[bot]` **403** on SoT push, certification was mirrored to `bancoo` (wrong package id `com.bancoboom.app`) |
| User impact | Confusion which repo is Coolify SoT; fear that a full day of mobile work was lost |

---

## 2. What was NEVER lost on SoT (already on `origin/main` @ `b7212bf`)

These merged earlier on **banco-with-wael** and remain:

| Item | Evidence |
|------|----------|
| Mobile-first principal audit | PR #5 → `52-MOBILE-FIRST-PRINCIPAL-AUDIT.md` |
| Full mobile static test pack in CI | `artifacts/banco-mobile` `test` script |
| Face ID plist / store hardening | PR #4 → `51-*` |
| CI hard audit (typecheck / eslint / deno removal) | PR #3 → `50-*` |
| Coolify compose + Dockerfiles + deploy docs | `docker-compose.coolify.yml`, `deploy/coolify/*`, `docs/DEPLOY_COOLIFY.md` |
| Anti-wipe menus + upload 503 clarity | Present on SoT (confidence gate PASS) |
| API `/api/readyz` compose healthcheck | **SoT compose uses readyz** (bancoo fork had drifted to healthz) |
| AWS key env names in compose | **Present on SoT** (`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`) |

---

## 3. Restitution commit surface (this branch → SoT)

Local branch: `cursor/production-gap-certification-5cf0`  
Base: `origin/main` (`b7212bf`)  

### Already in local SoT commit `442e68a`

| Path | Purpose |
|------|---------|
| `artifacts/banco-mobile/app.config.ts` | H2: merge multi-host Universal/App Links |
| `artifacts/banco-mobile/package.json` + lockfile | H5: runtime packages in `dependencies` |
| `artifacts/banco-mobile/tests/universal-links-config.test.mjs` | Guards merge + well-known + **`com.bancooom.app`** |
| `deploy/coolify/well-known/*` | AASA + assetlinks templates for **`com.bancooom.app`** |
| `deploy/coolify/nginx.conf` | Serve `/.well-known/` |
| `deploy/coolify/Dockerfile.web` | COPY well-known into image |
| `docs/DEPLOY_COOLIFY.md` | Well-known ops notes |
| `release/EAS_BUILD.md` | Store blockers accuracy |
| `scripts/production-confidence-check.mjs` | well-known + runtime-deps gates |
| `reports/.../PRODUCTION_GAP_MATRIX.md` | Full gap matrix |
| `reports/.../FINAL_RELEASE_CERTIFICATION.md` | Release certification |

### Added in restitution follow-up

| Path | Purpose |
|------|---------|
| `docs/DEPLOYMENT_SOURCE_OF_TRUTH.md` | Coolify SoT locked to **banco-with-wael** only |
| `reports/.../53-SOT-RECOVERY-AND-MOBILE-RESTITUTION.md` | This recovery record |

---

## 4. What on `bancoo` PR #10 must NOT be treated as SoT

| bancoo artifact | Why discard as authority |
|-----------------|--------------------------|
| Package id `com.bancoboom.app` | Wrong store identity vs SoT |
| Coolify values naming `bancoo` | Wrong repo |
| DEPLOYMENT_SOURCE_OF_TRUTH written under bancoo workspace | Contaminated; superseded by SoT copy |
| Anti-wipe menu edits on bancoo | SoT already had correct anti-wipe; bancoo was behind |

**Action for owner:** Close or abandon `bancoo` PR #10 as non-SoT. Do not Coolify-deploy from `bancoo`.

---

## 5. Verification executed on SoT (this restitution)

| Gate | Result |
|------|--------|
| Chain integrity | **167/167 PASS** |
| Production confidence | **14/14 PASS** |
| Universal-links tests | **5/5 PASS** (identity `com.bancooom.app`) |
| Mobile package id | **`com.bancooom.app`** |
| Well-known package | **`com.bancooom.app`** |

---

## 6. Push / PR status

| Target | Status |
|--------|--------|
| Local SoT branch | Restored + extended |
| `git push` to `banco-with-wael` | Requires write token (prior `cursor[bot]` 403) |
| Owner action if agent cannot push | Apply format-patch / open PR with owner PAT — see §7 |

---

## 7. Owner apply (if agent push still 403)

From a machine with write access to `banco-with-wael`:

```bash
git clone https://github.com/waelzaid66-max/banco-with-wael.git
cd banco-with-wael
git fetch origin
git checkout -b cursor/production-gap-certification-5cf0 origin/main
# If you have the patch bundle from the agent:
git am /path/to/patches/*.patch
# Or cherry-pick the published commits once pushed
git push -u origin cursor/production-gap-certification-5cf0
```

Coolify must use:

- Repository: **`waelzaid66-max/banco-with-wael`**
- Compose: **`docker-compose.coolify.yml`**
- Mobile EAS package: **`com.bancooom.app`**

---

## 8. Mobile day — restitution verdict

**Not lost.** Prior mobile PRs (#3–#5) are on SoT `main`. Certification hardening (H2/H5/well-known/gates/reports) is on this SoT branch with correct identity. Sister `bancoo` delivery was a mis-route and is documented as non-authoritative.

**Confidence in this recovery inventory:** high (path + SHA + gate evidence).  
**Live production still not certified** until DNS / Coolify secrets / EAS bake / well-known REPLACE_* (unchanged OPS).
