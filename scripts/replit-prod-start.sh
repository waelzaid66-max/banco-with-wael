#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Replit Production Start
# Runs api-server (port 8080) in background, then starts the
# banco-website (port 3000) in the foreground as the main process.
# Next.js rewrites proxy /api/* → localhost:8080 automatically.
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

# Ensure DATABASE_URL is set (Replit injects it for postgres deployments)
if [ -z "${DATABASE_URL:-}" ]; then
  echo "⚠  DATABASE_URL not set — api-server will fail to start"
fi

echo "▶ Starting api-server on :8080..."
pnpm --filter @workspace/api-server run start &
API_PID=$!

# Give the API server a moment to bind its port before website boot
sleep 2

echo "▶ Starting banco-website on :3000..."
# Trap SIGTERM/SIGINT so we cleanly stop the api-server too
trap 'echo "Shutting down..."; kill "$API_PID" 2>/dev/null; exit 0' SIGTERM SIGINT

pnpm --filter @workspace/banco-website run start

# If website process exits unexpectedly, kill api-server and exit non-zero
kill "$API_PID" 2>/dev/null || true
exit 1
