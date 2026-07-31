# 17 — Refactoring Opportunities

**Safe / high value (do first):**

1. Shared Search: replace local CLEAR_* with `CLEAR_SECTION_ATTRS` + include `listingMode`  
2. Extract `useNearMeToggle(criteria, update)` shared by tab/section/stays  
3. Replace local `serializeCriteria` with `criteriaKey`  
4. `formatMoney` single helper (preview + wallet + import)  
5. Banner stale docs (MASTER-TRACKER section stamps)  
6. Rename dealer-os Import page title to Bulk CSV Import  
7. Align website sort options with mobile (nearest + gate) or document “web unsupported”  
8. Port `/workspace/settings` to banco-web or delete twin  

**Medium (needs care):**

9. Unify SectionSearchApp / BookingStaysApp shared hooks  
10. Server: reject `sort=nearest` without lat/lng (breaking for any raw client)  
11. LocationPicker bind to marketCountry ISO  
12. Profile role prefer `/me` + guard test restore  
13. Admin import-orders page  

**Large / Owner decision:**

14. MSG-05 WebSocket rewrite  
15. Hard block + mute schema  
16. Merge or kill banco-web twin  
17. Live auction integrations  
18. Draw-area map filter  

**Do not “refactor” by deleting features** (Owner rule).
