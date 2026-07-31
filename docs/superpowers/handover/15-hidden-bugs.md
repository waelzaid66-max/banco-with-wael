# 15 — Hidden Bugs

Defects that can look “fine” in a happy-path demo.

| ID | Bug | Why hidden | Evidence | Severity |
|----|-----|------------|----------|----------|
| HB-01 | Soft-hide still named deleteConversation | API name vs UX | client hooks | Low (copy fixed) |
| HB-02 | nearest without coords → recommended | Only if API called raw | SearchService | Medium |
| HB-03 | Shared Search clear leaves attrs/mode | Must clear-all after section filters | search.tsx | Medium |
| HB-04 | listingPreview always EGP | Only visible on create preview | listingPreview.ts | Medium |
| HB-05 | Profile role from Clerk metadata | Only when syncRoleToClerk fails | MASTER-TRACKER; re-verify lines | High if true |
| HB-06 | Mark-read by length (website) | Fixed MSG-11b; can regress | MessageThreadPanel | Medium |
| HB-07 | Duplicate send on refetch fail | Fixed MSG-06; can regress | deliver() | High if regress |
| HB-08 | InvalidCredentials token prune | Would kill valid tokens; prevented | PushService guard | High if regress |
| HB-09 | Older-load armed before scroll settle | Fixed MSG-07b P1 | thread | Medium |
| HB-10 | Import works in staging, fails prod | Missing migrate | ensureSchema | **Critical** |
| HB-11 | Location suggestions wrong country | market ≠ picker | LocationPicker | Medium |
| HB-12 | RTL looks OK but native direction wrong | Manual flips only | LanguageContext | Medium |
| HB-13 | Push “works” in logs, not on device | NOTIF-02 | Expo | High |
| HB-14 | Stay overlay / focus=booking claims | Docs overclaim | inventory vs SectionSearchApp | Low |

**Test magnets:** production-wiring-guard · messenger-wiring · notification-routing · import-order-documents · section-miniapp-guard.
