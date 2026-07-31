# 06 — Mini App Audit

## Inventory

| Mini-app | Route | Shell | MiniAppBottomNav | FilterSheet | Browse map | Create |
|----------|-------|-------|------------------|-------------|------------|--------|
| Cars | `/section/car` | SectionSearchApp | Yes | Yes | Yes | listings/create |
| Real estate | `/section/real-estate` | SectionSearchApp | Yes | Yes + Property header | Yes | same |
| Facilities | `/section/factories` | SectionSearchApp | Yes | Yes | Yes | same |
| Materials | `/section/materials` | SectionSearchApp | Yes | Yes + Materials header | Yes | same |
| Stays | `/section/booking` | BookingStaysApp | Yes | Yes (hide payment) | Yes | same |
| Car Import | `/import` | Custom hub | Yes | No | Indirect cars | import/request |
| Banks | `/business/banks` | Custom | No | No | No | FI join |
| Supply hub | `/business/supply-hub` | Custom | No | No | No | outbound links |
| Global supply | `/business/global-supply` | Custom | No | Own list | No | create |
| Shared Search | `/search` | Discover+results | Real tabs | Yes | Yes | N/A |

## Comparison findings

1. **Section apps share one shell** — good for parity; Stays forks BookingStaysApp (intentional).  
2. **Business hubs thinner** — no map/filters/nav mirror (likely product scope, but inconsistent UX).  
3. **Import is real mini-app** — hub wired Discover Wave 2; advanced features deferred.  
4. **Shared Search weaker hygiene** than section `clearAllFilters` baseline reset.  
5. **Ownership:** section chrome owns criteria instance; market preference AsyncStorage couples sections intentionally.

## Missing features vs peers

| Gap | Who lacks it |
|-----|--------------|
| MiniAppBottomNav | Banks, supply, global-supply, many business |
| Browse map | Business hubs, import (shipment) |
| Nearest in quick sort strip | Section + Stays (sheet has it) |
| Live auctions | Import auctions screen |
| Ops stage UI | Admin (affects import lifecycle) |

## Shared leakage risks

| Risk | Evidence | Level |
|------|----------|-------|
| Shared Search CLEAR_ATTRS omit material/propertyType | `search.tsx` vs `CLEAR_SECTION_ATTRS` | Medium |
| listingMode survives clear-all on tab | `search.tsx` CLEAR_FILTERS | Medium |
| Unread badge shared query | MiniAppBottomNav + tabs | Low (good) |
| Category melt into shared Search | Guarded; still a regression magnet | High if broken |

## Score
**Section mini-apps:** 7.5/10 · **Import:** 6.5/10 · **Business hubs:** 5/10 · **Cross-app consistency:** 5.5/10
