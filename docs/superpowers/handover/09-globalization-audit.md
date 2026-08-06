# 09 — Globalization Audit

## Dimensions

| Dimension | Current behavior | Consistency | Evidence |
|-----------|------------------|-------------|----------|
| Market country | ISO codes; default EG | Search/map/create mostly aligned | searchParams, SearchService |
| LocationPicker country | English labels + partial ISO map | **Diverges** from marketCountry | LocationPicker.tsx |
| Region/city | Static LOCATIONS + suggestions API | Coupled to picker country string | create/search |
| Timezone | Device-local ad hoc | **No market TZ layer** | — |
| Language | EN/AR LanguageContext | Strong copy coverage mobile | i18n.ts |
| RTL | Manual row-reverse; **no forceRTL** | Incomplete native | LanguageContext |
| Units | Mixed (km near-me) | Near-me km consistent | nearMe.ts |
| Phone | E164 + CountryCodePicker | Create solid | create.tsx |
| Address | Free text + taxonomy | Not country-format aware | — |
| Date/number | Device/`ar-EG`/`en-US` mix | Inconsistent | profile vs wallet |
| Notifications i18n | Category keys EN/AR | Present | i18n cat_* |
| Email localization | Partially path-fixed (MSG-11) | Content localization not fully audited | — |
| Marketplace country | Specs.market_country on listings | Server COALESCE EG | SearchService |
| Map country | marketCountryMapCenter | Restored | searchTaxonomy.ts |
| Business country | Often unscoped | Differs from search | business hubs |

## Country-logic difference map

| Context | Key type | Notes |
|---------|----------|-------|
| Search/map API | ISO `market_country` | Canonical |
| Create listing specs | ISO | currencyForMarket |
| LocationPicker | English name | Suggestions may unscope |
| MapPinPicker | ISO → center | Independent of picker tab |
| Import calculator | Local math | Not market-tax accurate claim |
| Dealer/Admin | Ops locale | Separate |

## Globalization score
**EN/AR copy:** 7.5/10 · **Country model:** 6/10 · **RTL native:** 4/10 · **Overall:** **5.5/10**
