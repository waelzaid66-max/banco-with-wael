# Banco — Coolify on Hostinger VPS Deployment Guide

> **Start here for a no-guess deploy:** root file [`COOLIFY_DEPLOY_NOW.md`](../COOLIFY_DEPLOY_NOW.md)
> **SoT repo only:** `waelzaid66-max/banco-with-wael` · compose `docker-compose.coolify.yml` · mobile `com.bancooom.app`

## Overview

This guide explains how to deploy the entire Banco monorepo on
[Coolify](https://coolify.io) running on a Hostinger VPS.

### Services deployed

| Service | Image name | Type | Container Port | Description |
|---------|------------|------|---------------|-------------|
| `postgres` | `postgres:16` | Postgres 16 | 5432 (internal) | Persistent database |
| `api` | `banco-api` | Node.js Express | 8080 | REST + WebSocket — health **`/api/readyz`** |
| `banco-web` | `banco-web` | Next.js standalone | 3000 | Consumer Next app |
| `banco-website` | `banco-website` | Next.js standalone | 3000 (→ 3001 host) | Marketing / consumer twin |
| `web` | **`banco-web-static`** | Nginx + Vite SPAs | 80 | Landing + dealer-os + admin-os + well-known + `/api/` proxy |

The Expo mobile app (`artifacts/banco-mobile`) runs on iOS/Android via EAS — it is **not** deployed as a server container.


---

## Quick Start

### 1. Prerequisites

- Coolify installed on your Hostinger VPS (see [Coolify docs](https://coolify.io/docs/installation))
- A domain (or subdomain per service)
- A GitHub personal access token with repo access (or SSH key) configured in Coolify
- PNPM and Node.js 24 installed only on your local machine for migrations

### 2. Add your repository to Coolify

1. In Coolify dashboard → **New Resource** → **Docker Compose**
2. Connect your GitHub/GitLab account
3. Select the `waelzaid66-max/banco-with-wael` repository (SoT monorepo)
4. Set the **Compose file path** to: `docker-compose.coolify.yml`
5. Click **Save**

### 3. Set environment variables

In Coolify's **Environment Variables** tab, add every variable listed in the
[Environment Variables](#environment-variables) section below.

> ⚠️  **Build-time variables** (prefixed `NEXT_PUBLIC_*` and `VITE_*`) are
> baked into the JavaScript bundle at image build time. Changing them requires
> a full rebuild (`Redeploy`). Set them before the first deploy.

### 4. Configure domains in Coolify

#### Recommended first deploy (single origin — least confusing)

Assign your **apex** (e.g. `banco.today`) to service **`web`** port **80**.

Service `web` is **Nginx** (image `banco-web-static`). It already serves:

| Path | App |
|------|-----|
| `/` | Landing |
| `/market/` | Dealer OS |
| `/admin/` | Admin OS |
| `/api/` | Reverse proxy → compose service `api:8080` |
| `/.well-known/` | Universal / App Links templates |
| `/nginx-health` | Liveness |

This avoids putting the marketing Next app on the apex by accident.

#### Optional split origins (advanced)

| Service | Host Port | Example domain | Notes |
|---------|-----------|----------------|-------|
| `web` (Nginx) | 80 | `banco.today` (recommended) | Static SPAs + `/api/` proxy |
| `api` | 8080 | `api.banco.today` | Only if you want a separate API host |
| `banco-website` | 3001 | marketing host | Next.js — **not** the same as Nginx `web` |
| `banco-web` | 3000 | app host | Next.js consumer twin |

**Name trap:** compose service `web` ≠ compose service `banco-web`.
`web` = Nginx image `banco-web-static`. `banco-web` = Next.js image `banco-web`.

Coolify's built-in Traefik reverse proxy handles HTTPS/TLS automatically via
Let's Encrypt.

### 5. Deploy

Click **Deploy** in Coolify. Coolify will:
1. Pull the source code from GitHub
2. Build all Docker images (API, Next.js apps, Nginx SPAs)
3. Start all containers in dependency order
4. Run health checks on each service

---

## Environment Variables

### Required (API server will refuse to start without these)

| Variable | Description |
|----------|-------------|
| `POSTGRES_PASSWORD` | Postgres database password |
| `CLERK_SECRET_KEY` | Clerk backend secret key (`sk_live_...`) |
| `SESSION_SECRET` | Random 32+ character string for session signing |
| `PAYMENT_CONFIG_ENCRYPTION_KEY` | Random 32+ character hex string for payment config AES encryption |

### Important build-time variables (set before first deploy)

| Variable | Used by | Description |
|----------|---------|-------------|
| `BANCO_WEB_URL` | `banco-web` build | Public URL of the consumer app (e.g. `https://app.yourdomain.com`) |
| `BANCO_WEBSITE_URL` | `banco-website` build | Public URL of the marketing website (e.g. `https://yourdomain.com`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `banco-web`, `banco-website` builds | Clerk publishable key (`pk_live_...`) |
| `VITE_CLERK_PUBLISHABLE_KEY` | `web` (Vite SPAs) build | Same Clerk publishable key for admin-os / dealer-os |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `banco-web` build | Google Maps API key for map search |

> **Why is `NEXT_PUBLIC_API_URL` hardcoded to `http://api:8080`?**
>
> `NEXT_PUBLIC_API_URL` is used by the Next.js server for SSR data fetches and
> for the `/api/*` reverse proxy rewrite. Since both `banco-web` and `banco-website`
> run inside the same Docker network as the `api` container, the internal hostname
> `api` resolves to the API container. Browser clients never call this URL directly
> — they use relative `/api/*` paths that the Next.js server proxies internally.
>
> This hardcoded internal URL is correct and intentional. If you move to a
> separate API host, update `NEXT_PUBLIC_API_URL` in both
> `Dockerfile.banco-web` and `Dockerfile.banco-website` and rebuild.

### Optional variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | `banco` | Postgres user |
| `POSTGRES_DB` | `banco` | Postgres database name |
| `CLERK_PUBLISHABLE_KEY` | — | Clerk publishable key (server-side use in API) |
| `CORS_ALLOWED_ORIGINS` | — | Comma-separated list of allowed CORS origins |
| `PUBLIC_API_BASE_URL` | — | Public-facing API base URL |
| `PUBLIC_APP_URL` | — | Public-facing app base URL |
| `ADMIN_EMAILS` | — | Comma-separated admin email addresses |
| `OPENAI_API_KEY` | — | OpenAI API key (AI features) |
| `OPENAI_MODEL` | — | OpenAI model name |
| `RESEND_API_KEY` | — | Resend API key (email delivery) |
| `EMAIL_FROM` | — | Sender email address |
| `PAYMOB_MODE` | `test` | `test` or `live` |
| `PAYMOB_API_BASE` | — | Paymob API base URL |
| `PAYMOB_PUBLIC_KEY` | — | Paymob public key |
| `PAYMOB_SECRET_KEY` | — | Paymob secret key |
| `PAYMOB_HMAC_SECRET` | — | Paymob HMAC secret |
| `PAYMOB_INTEGRATION_IDS` | — | Paymob integration IDs (JSON) |
| `OBJECT_STORAGE_PROVIDER` | — (must set explicitly) | `s3` or `replit` — **NOT `gcs`** (the API rejects `gcs`: "Unsupported OBJECT_STORAGE_PROVIDER … Supported: s3, replit"). For Coolify/Hostinger VPS set **`s3`** with static AWS keys. Do **not** leave unset and do **not** use `replit` when `COOLIFY_URL`/`COOLIFY_FQDN` are present (API refuses start). |
| `S3_BUCKET` | — | S3 bucket name |
| `AWS_REGION` | — | AWS region |
| `AWS_ACCESS_KEY_ID` | — | **Required on Coolify/Hostinger VPS** (no IAM role). Optional on EC2/ECS when an instance role is attached. |
| `AWS_SECRET_ACCESS_KEY` | — | Pair with `AWS_ACCESS_KEY_ID` on VPS |
| `PUBLIC_OBJECT_SEARCH_PATHS` | — | Public S3 path prefix for listing images |
| `PRIVATE_OBJECT_DIR` | — | Private S3 dir for internal assets |
| `GIT_SHA` | — | Deploy pin for `/api/readyz` (Coolify may also inject `SOURCE_COMMIT`) |
| `BUILD_ID` | — | Optional build id surfaced on health/readyz |
| `COOLIFY_URL` / `COOLIFY_FQDN` | — | Coolify markers — forbids `OBJECT_STORAGE_PROVIDER=replit` in-container |
| `WEB_PLUG_ENABLED` | `true` | Consumer Next kill-switch (`false` → maintenance) |
| `BANCO_WEB_MARKET_URL` | — | Baked into Next as `NEXT_PUBLIC_MARKET_URL` (prefer `/market/` or absolute) |
| `BANCO_WEB_ADMIN_URL` | — | Baked into Next as `NEXT_PUBLIC_ADMIN_URL` (prefer `/admin/` or absolute) |
| `NEXT_PUBLIC_APP_ANDROID_URL` | — | Play Store URL (store CTAs stay “soon” when unset) |
| `NEXT_PUBLIC_APP_IOS_URL` | — | App Store URL |
| `ERROR_ALERT_WEBHOOK` | — | Webhook URL for error alerts |
| `LOG_LEVEL` | `info` | Pino log level |
| `LOG_DIR` | — | Directory for log file output (omit to log to stdout only) |
| `CRON_TIMEZONE` | `Africa/Cairo` | Timezone for scheduled jobs |

### Build-time Vite SPA variables (for `web` service)

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for admin-os / dealer-os |
| `VITE_CLERK_PROXY_URL` | Clerk proxy URL if using Clerk auth proxy |
| `VITE_API_BASE_URL` | API base URL referenced inside the SPAs |
| `VITE_MARKET_URL` | URL for the market/dealer surface |
| `VITE_ADMIN_URL` | URL for the admin surface |
| `VITE_APP_ANDROID_URL` | Android app store URL |
| `VITE_APP_IOS_URL` | iOS app store URL |

---

## Database Migrations

> ⚠️  **Migrations are NOT run automatically on container start.** This is
> intentional — auto-running schema changes on every boot is unsafe in production.

### First-time setup (new database)

After the `postgres` and `api` containers are running, open a shell in the
API container and push the schema:

```bash
# In Coolify: select the `api` container → Execute Command → /bin/sh

# Push schema (applies all pending migrations, creating tables from scratch)
pnpm --filter @workspace/db run push
```

Or with a local `DATABASE_URL` pointing to your production Postgres:

```bash
DATABASE_URL="postgresql://banco:<password>@<vps-ip>:5432/banco" \
  pnpm --filter @workspace/db run push
```

### Subsequent deployments

Schema apply uses Drizzle **push** (there is no `generate` / `migrate` script
in `@workspace/db`). After the DB is healthy:

```bash
# One-shot (profile-gated — never runs on a normal `up`)
docker compose -f docker-compose.coolify.yml --profile migrate run --rm migrate
```

That runs `pnpm --filter @workspace/db run push -- --force` inside the API
builder image. On a real data migration, review the SQL first; re-runs are
idempotent for additive schema.

### Postgres connection string

The `api` container's `DATABASE_URL` is automatically constructed from the
`POSTGRES_*` variables:

```
postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
```

The hostname `postgres` resolves to the Postgres container via Docker's internal
DNS on the `banco_net` network.

---

## Deployment Order

Coolify respects Docker Compose `depends_on` semantics:

1. `postgres` starts first (health-checked: `pg_isready`)
2. `api` starts after Postgres is healthy (health-checked: `/api/readyz`)
3. `banco-web`, `banco-website`, `web` start after API is healthy

This order is enforced by `depends_on: condition: service_healthy` in
`docker-compose.coolify.yml`.

---

## Architecture

```
Internet
    │
    ▼
Coolify Traefik (HTTPS/TLS)
    │
    ├──── yourdomain.com (apex)  →  web:80   (Nginx = banco-web-static)  ← RECOMMENDED FIRST
    │                                 ├── /              landing
    │                                 ├── /market/       dealer-os
    │                                 ├── /admin/        admin-os
    │                                 ├── /api/          → api:8080
    │                                 └── /.well-known/  AASA + assetlinks
    │
    │  Optional split origins (advanced — do NOT put apex on Next by accident):
    ├──── app.yourdomain.com       →  banco-web:3000      (Next.js consumer)
    ├──── marketing.yourdomain.com →  banco-website:3000  (Next.js twin)
    └──── api.yourdomain.com       →  api:8080            (only if separate API host)

Internal Docker network (banco_net):
    api:8080  ←──── banco-web (SSR data fetches)
    api:8080  ←──── banco-website (SSR data fetches)
    api:8080  ←──── web/nginx (/api/ reverse proxy)
    postgres:5432 ←──── api
```

**Name trap reminder:** compose service `web` (Nginx) ≠ `banco-web` (Next) ≠ `banco-website` (Next).
First deploy maps apex → **`web:80`**. See `COOLIFY_DEPLOY_NOW.md`.

### Key networking facts

- All services communicate via the `banco_net` Docker bridge network
- `api` service is reachable as hostname `api` from all other containers
- `postgres` is only reachable internally (no host port exposed)
- Browsers call `/api/*` → this is proxied server-side by Next.js (to `http://api:8080`) or by Nginx — browsers never need the internal `api` hostname

---

## Expo Mobile App

The Expo app (`artifacts/banco-mobile`) is a React Native mobile app deployed
via Expo Application Services (EAS), not as a Docker container.

- Run `eas build` and `eas submit` from your local machine or CI
- Set `EXPO_PUBLIC_DOMAIN` to your API domain (e.g. `api.yourdomain.com`)
- The mobile app communicates with the API over HTTPS — it is unaffected by
  Docker deployment topology

### Universal Links / App Links (well-known)

The `web` nginx image ships templates from `deploy/coolify/well-known/`:

| URL | File |
|-----|------|
| `/.well-known/apple-app-site-association` | iOS Universal Links |
| `/.well-known/assetlinks.json` | Android App Links |

Before store deep-link verification:

1. Replace `REPLACE_APPLE_TEAM_ID` with your Apple Team ID
2. Replace `REPLACE_PLAY_APP_SIGNING_SHA256` with Play App Signing SHA-256
3. Redeploy the `web` service
4. Confirm DNS for `banco.today` (and any other associated hosts) points at Coolify — not Replit / Hostinger Horizons

See `deploy/coolify/well-known/README.md`.

---

## Troubleshooting

### Container fails to start: "PORT environment variable is required"

The `api` container requires `PORT=8080`. This is set in `docker-compose.coolify.yml`.
If missing, check that Coolify is reading the compose file correctly.

### Next.js app shows blank page or 404 on `/api/*`

1. Verify `NEXT_PUBLIC_API_URL` was set to `http://api:8080` at build time
2. Confirm the `api` service is healthy: check Coolify logs for `api`
3. Check that the `banco-web` and `api` containers are on the same network (`banco_net`)

### Vite SPA (admin-os, dealer-os) shows blank page

1. Verify `BASE_PATH` was set correctly at build time (`/admin/` for admin-os, `/market/` for dealer-os)
2. Rebuild the `web` service: in Coolify, force a rebuild
3. Check nginx logs for 404s on asset paths

### Database connection refused

1. Confirm `postgres` container is healthy: `pg_isready -U banco`
2. Verify `POSTGRES_PASSWORD` is set in Coolify environment
3. The `DATABASE_URL` is auto-constructed from `POSTGRES_*` variables; manually
   override with `DATABASE_URL` env var if using an external Postgres

### Clerk authentication errors

- `CLERK_SECRET_KEY` must match the Clerk application in use (`sk_live_...` for production)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `VITE_CLERK_PUBLISHABLE_KEY` must be
  the same publishable key (`pk_live_...`), set before build time

### Slow first deployment

The first build downloads all npm packages. Subsequent builds use BuildKit pnpm
store cache mounts and complete significantly faster.

### Checking service health manually

```bash
# API liveness (no DB dependency)
curl http://<vps-ip>:8080/api/healthz

# API readiness (DB must be up)
curl http://<vps-ip>:8080/api/readyz

# banco-web
curl http://<vps-ip>:3000/api/healthz

# banco-website
curl http://<vps-ip>:3001/api/healthz

# Nginx
curl http://<vps-ip>/nginx-health
```

---

## Production Readiness Checklist

Before going live:

- [ ] Set all **required** environment variables (see table above)
- [ ] Set `BANCO_WEB_URL`, `BANCO_WEBSITE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` before first build
- [ ] Configure domains in Coolify → Traefik issues TLS certificates automatically
- [ ] Run database schema push once via Coolify migrate profile (`--profile migrate run --rm migrate`)
- [ ] Set `PAYMOB_MODE=live` and fill in production Paymob credentials
- [ ] Verify `CORS_ALLOWED_ORIGINS` includes all frontend domains
- [ ] Set up object storage (`S3_BUCKET` etc.) for media uploads
- [ ] Configure `RESEND_API_KEY` for transactional email
- [ ] Set `ERROR_ALERT_WEBHOOK` for production error alerting
- [ ] Test health endpoints for all services
- [ ] Verify Expo app points to the production API (`EXPO_PUBLIC_DOMAIN`)

---

## Residual Deployment Risks

| Risk | Mitigation |
|------|-----------|
| `NEXT_PUBLIC_*` vars baked at build time | Document rebuild requirement; use internal `http://api:8080` for SSR |
| First DB migration must be run manually | Documented above; prevents accidental destructive migrations |
| Vite SPAs require `BASE_PATH` at build time | Set correctly in `Dockerfile.web`; rebuild if path changes |
| No TLS between internal services | Internal Docker network traffic is trusted; use mTLS if higher security is required |
| `pnpm-lock.yaml` frozen — update lockfile locally if deps change | Run `pnpm install` locally, commit updated lockfile |
