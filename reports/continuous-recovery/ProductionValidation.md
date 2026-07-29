# Production Validation

| Field | Value |
|-------|-------|
| Commit | `5d027bfdbd88cb89304c8ca869454d64c4d1273a` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


| authentication_clerk_email_google_apple | PASS |
| authentication_facebook_login | N/A — not a product provider (social icon only) |
| profile_me_role_demote_skip_menu | PASS |
| profile_cover_rationale | PASS |
| media_upload_create_update_503 | PASS |
| maps_leaflet_centers_locate | PASS |
| search_section_route | PASS |
| marketplace_stay_cars_never_touch_markers | PASS |
| banks_fi_awaiting_link | PASS |
| push_listingId_deeplink | PASS |
| email_message_match_price_drop | PASS |
| deploy_pin_readyz_source | PASS |
| chain_integrity_gate | PASS |
| replit_web_export_clerk_load_gate | PASS — restored this iteration (C-WEB-BASE) |
| pnpm_install_typecheck_lint_build | BLOCKED — npm registry ECONNRESET / no node_modules |
| live_readyz_f1 | BLOCKED — needs --prod-url / owner paste |
| bancooom_gcp_mirror | FAIL — remote empty; sync required (ops) |
| aws_eb_unique_packaging | BLOCKED — knowledge on aws-virgen; not imported |

