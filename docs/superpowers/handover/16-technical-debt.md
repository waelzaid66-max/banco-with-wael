# 16 — Hidden Technical Debt

| Debt | Description | Cost if ignored |
|------|-------------|-----------------|
| Dual website apps | banco-website vs banco-web drift | Settings/parity bugs |
| Search shell fork | SectionSearchApp vs BookingStaysApp duplicated helpers | Drift in clear/sort/near-me |
| Shared Search special-case | Doesn’t use same CLEAR/latch helpers | Filter leaks |
| Alert vs Modal confirm | 28 Alert call sites | Inconsistent a11y |
| No bottom-sheet library | Full-screen Modals for filters | UX weight |
| Doc corpus sprawl | Multiple 2026-07-31 specs + MASTER-TRACKER | Wrong priorities |
| ensureSchema partial | Enums yes / tables no | Prod footgun |
| Generated clients | Must regen after OpenAPI | Forgotten codegen |
| Multi-currency formatters | N implementations | CC bugs |
| EN page twins | Duplicate vs re-export mix | Drift |
| Stack.Screen incomplete list | Some routes lack animation config | Minor UX |
| Orphan files | landing not-found, ReServiceDesks, empty mockups | Noise |
| Poll chat architecture | Scales poorly for presence ambitions | MSG-05 pressure |
| Dealer Import naming | Cognitive debt | Ops mistakes |

## Debt score
**Manageable but large.** Prioritize migrate boot-check, CLEAR_* unify, money formatter, doc archive.
