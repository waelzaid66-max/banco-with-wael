# 01 — Repository Health Report

**Evidence date:** 2026-07-31 · Branch context: `cursor/final-handover-audit-1e3d` (from production-wiring tip)

## Structure

| Artifact | Role | Health |
|----------|------|--------|
| `artifacts/banco-mobile` | Expo consumer app (primary) | Active; large guard suite |
| `artifacts/api-server` | REST API | Active; service tests for import/conversations |
| `artifacts/banco-website` | Next.js public + workspace | Active; bilingual AR/EN |
| `artifacts/banco-web` | Near-twin of website | **Parity gap:** no `/workspace/settings` |
| `artifacts/dealer-os` | BANCO Market (Wouter) | Active |
| `artifacts/admin-os` | Admin console | Active; **no import-order ops UI** |
| `artifacts/landing` | Domain hop SPA | Thin; orphan `not-found.tsx` |
| `artifacts/mockup-sandbox` | Preview server | **Empty mockups dir** |
| `lib/db`, `lib/api-spec`, `lib/api-client-react`, `lib/api-zod`, `lib/search-contract` | Shared contracts | Active |

## CI / guards (known green on this tip)

| Suite | Evidence |
|-------|----------|
| `production-wiring-guard.test.mjs` | 43 tests (wave 7) |
| `messenger-wiring-guard.test.mjs` | Included in same run |
| `notification-routing.test.mjs` | 11 tests |
| `section-miniapp-guard.test.mjs` | Large; Discover→`/import`, materials contracts |
| `import-order-documents-guard.test.mjs` | Wave 3 docs |

**Caveat:** Full monorepo `tsc` / Expo export / EAS not re-run in this documentation session. PR #29/#31 claimed stabilize + Coolify; successor must re-verify on `main` after merges.

## Open PRs / branches to know

| Item | State | Notes |
|------|-------|-------|
| PR #30 production-wiring | OPEN | Waves 3–7 messenger/maps/notif |
| PR #15 car-import W3 | MERGED | Documents |
| PR #13/#14 car-import | MERGED | Hub + entry |
| PR #27 | CLOSED | Superseded by #30 |
| Multiple draft PRs #12–#25 | Mixed | Listed in messenger inventory §D |

## Schema / migrate health

| Concern | Evidence | Risk |
|---------|----------|------|
| `ensureSchema` only patches notification enums + `upload_claims` | `lib/db/src/ensureSchema.ts` | **High** if prod never ran drizzle for `import_orders` / `import_order_documents` |
| Concurrent index bootstrap | `api-server/.../bootstrap.ts` | Ops must still migrate tables |

## Dependency / dead surface

| Item | Status |
|------|--------|
| `react-native-maps` | Not used (Leaflet WebView) |
| CDN Leaflet unpkg | Removed from browse map (MAP-07); OSM tiles still network |
| `landing/.../not-found.tsx` | Orphan |
| `ReServiceDesks.tsx` | Orphan component (kept on disk) |
| `mockup-sandbox` mockups | Empty |

## Health score (honest)

**Codebase organization:** B+ (clear artifacts, shared libs)  
**Doc hygiene:** C (MASTER-TRACKER / PRODUCTION-STATE / early wiring-audit contain stale Fixed/Deferred claims)  
**Ops readiness:** C− (migrate + secrets + push certification incomplete)  
**Overall repo health for successor:** **B−** — shippable subsystems exist; production attestation incomplete; docs partially polluted.
