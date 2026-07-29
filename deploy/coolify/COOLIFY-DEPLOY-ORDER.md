# Coolify Deploy Order — BANCO (one service at a time)

This monorepo is designed for Coolify + Docker Compose. Deploy in this order so each layer is healthy before the next depends on it.

## 0. Secrets (fill before start)

Required:

- `DATABASE_URL` or compose Postgres vars (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`)
- `CLERK_SECRET_KEY`
- `CLERK_PUBLISHABLE_KEY` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (EAS builds)
- `SESSION_SECRET`
- `PAYMENT_CONFIG_ENCRYPTION_KEY`
- Object storage — **required for Coolify**: `OBJECT_STORAGE_PROVIDER=s3` plus S3 endpoint/keys (`OBJECT_STORAGE_*`). If unset in production (non-Replit), the API **refuses to start**. `OBJECT_STORAGE_PROVIDER=replit` is also rejected when Coolify/Cloud Run/AWS markers are present.

Optional:

- `DB_POOL_MAX` (default 20)
- `NEXT_PUBLIC_ASSET_CDN_URL`
- `RESEND_API_KEY`, `OPENAI_API_KEY`, Paymob keys

## 1. Postgres

```bash
docker compose -f docker-compose.coolify.yml up -d postgres
docker compose -f docker-compose.coolify.yml ps postgres
# wait until healthy (pg_isready)
```

## 2. Migrate schema (one-off)

```bash
docker compose -f docker-compose.coolify.yml --profile migrate run --rm migrate
```

Uses `drizzle-kit push --force` (non-interactive). Safe to re-run.

## 3. API

```bash
docker compose -f docker-compose.coolify.yml up -d --build api
curl -fsS http://127.0.0.1:${API_HOST_PORT:-8080}/api/healthz
curl -fsS http://127.0.0.1:${API_HOST_PORT:-8080}/api/readyz || true
```

On first boot the API also creates scale indexes concurrently (market_country, geo, feed).

## 4. Consumer websites (Next.js)

```bash
docker compose -f docker-compose.coolify.yml up -d --build banco-web
docker compose -f docker-compose.coolify.yml up -d --build banco-website
curl -fsS http://127.0.0.1:${BANCO_WEB_HOST_PORT:-3000}/api/healthz
curl -fsS http://127.0.0.1:${BANCO_WEBSITE_HOST_PORT:-3001}/api/healthz
```

## 5. Nginx SPA front (landing + dealer-os + admin-os)

```bash
docker compose -f docker-compose.coolify.yml up -d --build web
curl -fsS http://127.0.0.1:${WEB_HOST_PORT:-80}/nginx-health
```

Path map:

| Path | App |
|------|-----|
| `/` | landing |
| `/market/` | dealer-os |
| `/admin/` | admin-os |
| `/api/` | proxy → `api:8080` |

## 6. Mobile (EAS — not Docker)

Mobile is published via Expo EAS (`artifacts/banco-mobile/eas.json`), not Coolify containers.

```bash
cd artifacts/banco-mobile
eas build --platform android --profile production
eas build --platform ios --profile production
```

## Ports (defaults)

| Service | Host port |
|---------|-----------|
| postgres | internal only |
| api | 8080 |
| banco-web | 3000 |
| banco-website | 3001 |
| web (nginx) | 80 |

Override with `API_HOST_PORT`, `BANCO_WEB_HOST_PORT`, `BANCO_WEBSITE_HOST_PORT`, `WEB_HOST_PORT`.
