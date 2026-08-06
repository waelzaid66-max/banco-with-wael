# 08 — Search Audit

## Entry points

| Surface | File |
|---------|------|
| Shared Search tab | `app/(tabs)/search.tsx` |
| Section shell | `components/search/SectionSearchApp.tsx` |
| Stays | `components/search/BookingStaysApp.tsx` |
| FilterSheet | `components/search/FilterSheet.tsx` |
| Hook | `hooks/useSearchMiniApp.ts` |
| Params | `lib/searchParams.ts` |
| Contract (web) | `lib/search-contract` |
| Website | `SearchControls.tsx`, `SearchPageBody.tsx` |
| API | `SearchService.ts` |

## Sort / filter / pagination / map / country

| Capability | FilterSheet | Section strip | Stays strip | Shared tab nav | Website |
|------------|-------------|---------------|-------------|----------------|---------|
| recommended/newest/price | Yes | Yes | Yes | Yes | Yes |
| popular | Yes | **No** | **No** | Yes (nav) | Yes |
| nearest | Yes + gate | **No** | **No** | Sheet only | **No** |
| Near-me | Yes | Yes | Yes | Yes | Yes |
| Cursor pagination | via hook | Yes | Yes | Yes | Yes |
| Map latch | N/A | mapLatch | mapLatch | weak / no import | view=map |
| Market country | Yes | Yes | Yes | Yes | Yes |

## Duplicated logic

- Local `serializeCriteria` in Section + Stays vs `criteriaKey()`  
- Near-me toggle triplicated  
- Shared tab `CLEAR_ATTRS` / `CLEAR_FILTERS` drift vs `CLEAR_SECTION_ATTRS`  
- Website sort labels omit nearest

## Inconsistencies (evidence)

1. Quick-sort 4 vs sheet 6 — `SectionSearchApp` / `BookingStaysApp` vs `FilterSheet.tsx:50-57`  
2. Shared CLEAR missing material/propertyType — `search.tsx` vs `searchParams.ts`  
3. listingMode may survive clear-all on tab  
4. Section map pin bookable gate vs shared tab always booking focus for RE  
5. API nearest without coords soft-falls to recommended — `SearchService.ts` (~377) — client gates honesty  
6. LocationPicker country ≠ marketCountry ISO (see globalization)

## Search score
**Contract + pagination:** 8/10 · **UX consistency:** 5/10 · **Overall:** **6.5/10**
