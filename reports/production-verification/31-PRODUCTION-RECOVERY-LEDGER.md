# 31 — Production Recovery Ledger (w.4.1)

**SoT:** `waelzaid66-max/banco-with-wael`  
**Branch:** `cursor/w41-production-release-5cf0`  
**Policy:** Recover / reconnect / certify — never rewrite, never invent, never fake green.  
**Verdict at this ledger:** **CONDITIONAL GO — NOT FULL PRODUCTION CERTIFIED**

---

## 1. What already existed

| Capability | Evidence |
|------------|----------|
| Phase X R1–R16 money/tombstone/PSP hardening | `114bd53` Round 16 certs; chain 164/164; vitest 384 |
| Coolify compose + API/web/Next Dockerfiles | `docker-compose.coolify.yml`, `deploy/coolify/*` |
| `banco-website` site-env reads MARKET/ADMIN/APP/search flags | `artifacts/banco-website/lib/site-env.ts`, `search-config.ts` |
| Landing `VITE_*` documented + baked in `Dockerfile.web` | `.env.example`, compose `web` build args |
| Deploy pin reader on API health/readyz | `artifacts/api-server/src/routes/health.ts` `deployPin()` |
| Web plug kill-switch | `web-plug-config.ts`; AWS compose already passed `WEB_PLUG_ENABLED` |
| S3 uploads via AWS SDK default chain | `objectStorage.s3.ts`; Coolify docs expect static keys on VPS |
| Coolify nginx path map `/market/` + `/admin/` | `deploy/coolify/nginx.conf` |

---

## 2. What was incomplete (proven disconnects)

| Gap | Class |
|-----|-------|
| `banco-website` Coolify bake omitted MARKET/ADMIN/APP/search/Maps args while code already read them | **code/config** — store CTAs stayed “soon” forever |
| Website health reported `surface=banco-web` / `wave=phase8-soft-launch` | **identity drift** |
| Landing hard-coded Replit `/dealer-os/`, `/admin-os/`, `/banco-mobile/` while Coolify nginx only serves `/market/`, `/admin/` | **404 on production CTAs** |
| Landing ignored baked `VITE_*` URLs | **disconnected env** |
| Coolify `Dockerfile.api` never set `GIT_SHA`/`BUILD_ID` (AWS/GCP did) | **F1 pin null on SoT host** |
| Coolify API env omitted `AWS_ACCESS_KEY_ID`/`SECRET` + `COOLIFY_URL`/`FQDN` | **uploads + Coolify guard dead in-container** |
| Coolify Next services omitted `WEB_PLUG_ENABLED` (AWS had it) | **ops kill-switch unreachable** |
| Dual `banco-web` + `banco-website` still both deployed | **cutover incomplete (B-07)** — intentional until owner cutover |
| Live search/map defaults `false` in compose | **soft-launch default** — ops must set true + rebuild when ready |

---

## 3. What was repaired (this branch)

| Commit / change | Connected |
|-----------------|-----------|
| Prior tip `5bed83e` | Mobile typecheck; CI ports; W41 plan |
| `ee4d2ba` | Website Dockerfile/compose bake parity; health `banco-website` / `w4.1` |
| This turn | Landing ↔ Coolify paths + `VITE_*` reconnect; nginx legacy 301 aliases; Coolify API `GIT_SHA`/`BUILD_ID`; API env AWS keys + Coolify markers + runtime pin; `WEB_PLUG_ENABLED` on both Next services |

---

## 4. What remains (honest blockers)

### Code / release process

- Open/merge PR `cursor/w41-production-release-5cf0` → `main`
- Tag **`w.4.1`** on merge SHA
- Owner cutover: stop serving frozen `banco-web` when website owns the public domain
- Optional: set `NEXT_PUBLIC_WEB_SEARCH_LIVE/MAP=true` for live search (rebuild)

### OPS / UNVERIFIED (cannot code-fake)

- Coolify deploy of this SHA + one-shot migrate (`/readyz` money schema)
- `OBJECT_STORAGE_PROVIDER=s3` + bucket/region + **static AWS keys** on VPS
- SSL + domains + Clerk live social providers
- Paymob live webhook; EAS submit; device push/OAuth/payment QA
- Unsigned Paymob first-bind TOFU (HIGH deferred — no invention)
- Product waves M2–N5 / P3–P7 after ship unless owner orders

---

## 5. Certification gates (this tip)

| Gate | Result | When |
|------|--------|------|
| `chain-integrity-gate.mjs` | **164/164 PASS** | after DomainRouter Clerk-origin restore |
| API vitest | **384 passed / 3 skipped** | same tip |
| Coolify website bake parity | committed `ee4d2ba` | prior |
| Landing PATHS ↔ Coolify + Clerk hops | committed (this tip) | PATHS use `/market|/admin` + VITE_*; DomainRouter still hops to `banco.today/dealer-os` + `banco.today/banco-mobile` (P-landing-clerk-domain) |

Do **not** mark FULL CERT without OPS/device evidence (Coolify live secrets, S3, SSL, EAS, Paymob webhook, Clerk providers).
