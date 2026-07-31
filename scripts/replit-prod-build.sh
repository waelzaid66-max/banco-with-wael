#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Replit Production Build
# Runs once before deployment. Compiles api-server + banco-website.
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

echo "▶ Installing dependencies..."
pnpm install --frozen-lockfile --prefer-offline 2>/dev/null || pnpm install --frozen-lockfile

echo "▶ Building shared libraries..."
pnpm --filter @workspace/db build 2>/dev/null || true
pnpm --filter @workspace/taxonomy build 2>/dev/null || true
pnpm --filter @workspace/api-client build 2>/dev/null || true

echo "▶ Building api-server..."
pnpm --filter @workspace/api-server run build

echo "▶ Building banco-website..."
pnpm --filter @workspace/banco-website run build

echo "✅ Build complete"
