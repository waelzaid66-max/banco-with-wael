# 03 — Visual Audit Report

## Scope limitation (mandatory)

| Requirement | Result |
|-------------|--------|
| Open EVERY screen | **NOT DONE live** — no full Expo session |
| Screenshot every screen | **NOT DONE** — would be fabricated if claimed |
| Existing visual artifacts | Materials hub PNGs only (prior agent) |

### Existing screenshot corpus (reuse, do not treat as full product)

Path prefix: `/opt/cursor/artifacts/screenshots/`

- `materials-hub-home.png`
- `materials-hub-v3.png` / `v4.png`
- `materials-hub-live.png`
- `materials-b-core-header.png` / `materials-b-core-upper-header.png`
- `materials-REAL-expo-web.png` / `materials-REAL-header-closeup.png`

**None** of messenger, maps browse, import hub, banks, wallet, or admin were captured in this handover session.

## Visual system observations (code)

| Topic | Finding | Evidence |
|-------|---------|----------|
| Brand red | Import hub hardcodes `RED = "#E53935"` | `import/index.tsx` |
| Theme | `useColors()` tokens widely used | hooks/useColors |
| Typography | Inter_* families in many screens | messages.tsx etc. |
| Cards | Heavy card usage in hubs; Owner frontend rules prefer fewer cards on marketing — product app differs | Discover, import hub |
| Map pins | Leaflet markers + clusters; price/bookable on singles | mapHtml + SearchService |
| Icons | Should go through `@/components/icons` | AGENTS rules |
| Web vs native map | Dual hosts `.tsx` / `.web.tsx` | SearchResultsMap* |

## Visual risk register

| ID | Risk | Level |
|----|------|-------|
| V-01 | Successor accepts UX without device screenshots | High |
| V-02 | Materials looks “done” because only it has PNGs — selection bias | Medium |
| V-03 | Website EN/AR twins may drift visually | Medium |
| V-04 | banco-web missing settings page vs website | Medium |

## Required successor visual pass

1. Expo web or device: all tabs + all 5 section mini-apps + import hub + thread + create + FilterSheet + map  
2. Website AR + EN: home, search map, listing, workspace messages  
3. Dealer + Admin: smoke  
4. Attach PNGs under `docs/superpowers/handover/screenshots/` with naming `{app}-{route}-{state}.png`
