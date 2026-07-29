# Pending Repairs

1. Laptop/owner: `CONFIRM_BANCOO_FORCE=YES` + `./scripts/publish-bancoo-production-main.sh` (bancoo MAIN)
2. Laptop: `pnpm install --frozen-lockfile` + `laptop-validation-matrix.mjs --with-install`
3. Owner: sync bancooom + deploy + paste readyz (F1)
4. Laptop: device N2 QA
5. Optional: MOBILE-ARCHIVE-UNWIRED (dealer has archive; mobile mine/detail sold-only)
6. Optional: VIDEO-POSTER-SCHEMA-UNWIRED (thumbnail_url never set on client)
7. Optional: EXPO-APP-IDENTITY-DRIFT (app.json name/slug vs bancoo) — owner branding decision
8. Runtime prove web export on Replit after deps available
