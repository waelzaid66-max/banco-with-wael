# B-CORE materials — upper header only (final approach)

**Date:** 2026-07-31  
**Status:** Implemented on branch — owner to verify on device  
**Method:** Same as B-PROPERTIES colleague — chrome **inside** `SectionSearchApp`

## Scope (locked)

| Do | Do not |
|----|--------|
| Upper header bands A–D only | Fake hub home with services grid as entry |
| Compress search + Filters into pill | Erase FilterSheet / commodity / origin |
| Large industrial type tabs → real `industrialType` | `collapseInlineStrips` |
| Market + sort in header | Touch `MiniAppBottomNav` |
| Listings under header | Fake stats 2450/18400/930 |
| Lightning-B + CORE + Industrial Hub | Mock Marketplace / + bottom tabs |

## Filter layers (compressed, not erased)

1. **Header Band C:** search + Filters → opens `FilterSheet`  
2. **Header Band D:** All / Machine / Raw material / Production line  
3. **FilterSheet:** material commodity, origin, listingMode, price, industry, …  

## Files

- `components/search/materials/MaterialsHomeHeader.tsx`  
- `SectionSearchApp.tsx` — materials-only mount  
- `FilterSheet.tsx` — materials listingMode chips  
- `MiniAppBottomNav` — unchanged  
