# 13 — Production Risk Register

| Title | Description | Root cause | Modules | Screens | APIs | Risk | Prob | Impact | Recommendation | Auto? | Safe? | Regression | Evidence |
|-------|-------------|------------|---------|---------|------|------|------|--------|----------------|-------|-------|------------|----------|
| Import tables missing on prod | Buyer import crashes if migrate skipped | ensureSchema ≠ CREATE tables | db, api, mobile import | /import/* | /v1/import-orders | **Critical** | Med | High | Run drizzle once; add boot check | Partial | Yes | Low | ensureSchema.ts; PR #15 notes |
| Push not certified | Users miss message/import pings | EAS/APNs/FCM secrets | PushService, mobile | notifs | Expo | **High** | Med | High | Ops certify NOTIF-02 | No | Yes | Low | ledger |
| Doc overclaim misleads ops | Stale trackers drive wrong work | Agent doc drift | docs | — | — | **High** | High | Med | Banner/archive stale docs | Yes | Yes | None | MASTER-TRACKER |
| Soft-hide API vs Delete UI (regression) | Copy can regress | Naming deleteConversation | mobile/web messages | inbox | DELETE conversation | Med | Med | Med | Guards MSG-08c | Yes | Yes | Low | guards |
| Nearest API soft-fallback | Clients bypassing UI get wrong sort | Server design | SearchService | filters | search | Med | Low | Med | Server 400 if nearest w/o coords | Yes | Med | Med | SearchService |
| CLEAR_* attribute leak | Wrong filters after clear | Local CLEAR_ATTRS | search tab | /search | search | Med | Med | Med | Use CLEAR_SECTION_ATTRS | Yes | Yes | Low | search.tsx |
| Preview EGP hardcode | Wrong create preview | listingPreview | create | create | — | Med | High | Med | Use currencyForMarket | Yes | Yes | Low | listingPreview.ts |
| Profile role stale | Wrong role chrome | Clerk mirror swallow | profile | profile | /me | Med | Med | High | Prefer /me | Yes | Med | Med | MASTER-TRACKER |
| No import ops UI | Stages stuck | Missing admin page | admin-os | — | PATCH stage | Med | High | High | Build admin panel | No | Med | Med | import-orders.ts |
| Dealer Import confusion | Ops use wrong tool | Name collision | dealer-os | /import | bulk | Med | Med | Med | Rename UI | Yes | Yes | Low | dealer import.tsx |
| OSM offline fail | Maps blank offline | Tile CDN | maps | all maps | — | Low | High | Med | Accept or cache | No | — | — | mapHtml |
| Website twin drift | settings missing on banco-web | Duplicate apps | website/web | settings | — | Med | Med | Med | Port or delete twin | Yes | Med | Med | inventory |
| Auth discoverability | Guests can’t find sign-in | Auth in Profile | mobile | profile | Clerk | Med | Med | Med | Dedicated entry | No | Med | Med | profile.tsx |
| Full visual unknown | UX defects unseen | No screenshot pass | all | all | — | **High** | High | Med | Device visual sprint | No | Yes | — | README |
| Object storage fail-closed | Uploads fail | S3 config | uploads, import docs | order docs | uploads | High | Med | High | Coolify secrets (#31) | No | Yes | Low | deploy docs |

**Risk scoring note:** Critical/High items block honest “production ready” claims even if feature code exists.
