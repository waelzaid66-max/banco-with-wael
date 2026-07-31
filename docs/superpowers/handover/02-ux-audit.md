# 02 — UX Audit Report

**Method:** Code-static + prior materials screenshots only.  
**Screenshot coverage:** **NOT COMPLETE.** See README methodology.

## Global UX patterns (cross-app)

| Pattern | Finding | Evidence | Priority |
|---------|---------|----------|----------|
| Bottom sheets | No `@gorhom/bottom-sheet`; RN `<Modal>` everywhere | FilterSheet, MapPinPicker, pickers | P2 consistency |
| Destructive confirm | Mix of `Alert.alert` (28 files) vs custom Modal | messages, FilterSheet, billing | P2 |
| Soft-hide honesty | Fixed on mobile inbox+thread+website copy | MSG-08c | Done |
| Tab bar vs MiniAppBottomNav | Mini-apps mirror tabs; business hubs often lack mirror | MiniAppBottomNav.tsx vs banks/supply | P2 |
| Auth UX | Auth embedded in Profile tab (mobile); website has `/sign-in` | profile.tsx vs website sign-in | P1 discoverability |
| Guest gate | AuthGate modal → profile | useAuthGate.tsx | OK |
| Empty states | Uneven; messages got CTA (MSG-15); many business lists vary | per screen | P2 |
| Error states | Thread fixed (MSG-09); import tracking surfaces load fail | import-tracking, messages/[id] | Partial |
| Loading | React Query + skeletons uneven | — | P2 |
| RTL | Manual flexDirection; no `I18nManager.forceRTL` | LanguageContext | P1 native RTL |
| Dark mode | Theme tokens via useColors; not all surfaces audited live | — | P2 unverified live |
| Keyboard | Composer in thread; create forms — not device-tested here | — | P1 unverified |
| Icons | Contract: `@/components/icons` — pollution if Feather imported raw | Prior agents sometimes violated; guards watch some paths | P1 |

## Per-surface class scores (code-static)

Scores 1–10. **Screenshot = NOT CAPTURED** unless noted.

### A. Mobile tabs

| Screen | Purpose | Status | UX Score | Priority | Visual/Layout notes (code) | Screenshot |
|--------|---------|--------|----------|----------|----------------------------|------------|
| Feed `/` | Home | Live | 6 | P2 | City GPS optional; dense | NOT CAPTURED |
| Search `/search` | Discover+results | Live | 6 | P1 | CLEAR_* drift; dual map CTAs | NOT CAPTURED |
| Messages inbox | Conversations | Live | 7 | P2 | Hide copy fixed | NOT CAPTURED |
| Saved | Saved listings | Live | 6 | P2 | — | NOT CAPTURED |
| Profile | Profile+auth | Live | 5 | P1 | Auth+profile+role Clerk risk | NOT CAPTURED |

### B. Section mini-apps

| Screen | Purpose | Status | UX Score | Priority | Notes | Screenshot |
|--------|---------|--------|----------|----------|-------|------------|
| Cars | Browse cars | Live | 7 | P2 | Sort strip ≠ FilterSheet | NOT CAPTURED |
| Real estate | Browse RE | Live | 7 | P2 | Property header | NOT CAPTURED |
| Factories | Facilities | Live | 7 | P2 | — | NOT CAPTURED |
| Materials | B-CORE | Live | 7 | P2 | Prior screenshots exist (materials-*) | Partial: `/opt/cursor/artifacts/screenshots/materials-*.png` |
| Booking/Stays | Stays | Live | 7 | P2 | Strong map latch | NOT CAPTURED |

### C. Car import mini-app

| Screen | Purpose | Status | UX Score | Priority | Notes | Screenshot |
|--------|---------|--------|----------|----------|-------|------------|
| Hub `/import` | Front door | Live | 7 | P2 | 9-card grid; real hrefs | NOT CAPTURED |
| Request | Create order | Live | 6 | P2 | — | NOT CAPTURED |
| Calculator | Landed cost | Live | 6 | P3 | Client-only estimator | NOT CAPTURED |
| Auctions | Sources | Live | 5 | P2 | Placeholder cards (honest) | NOT CAPTURED |
| Documents checklist | Info | Live | 6 | P3 | Not upload surface | NOT CAPTURED |
| Order detail | Timeline+docs | Live | 7 | P2 | Uploads here | NOT CAPTURED |
| Tracking | Guide+list | Live | 6 | P2 | — | NOT CAPTURED |

### D. Messenger / notifs / wallet (high churn)

| Screen | Purpose | Status | UX Score | Priority | Notes | Screenshot |
|--------|---------|--------|----------|----------|-------|------------|
| Thread | Chat | Live | 7 | P1 | Poll-only; media open; report/hide | NOT CAPTURED |
| Notifications | Feed | Live | 6 | P2 | Deep links mostly wired | NOT CAPTURED |
| Wallet / billing / plans | Money | Live | 5 | P1 | Device locale money format | NOT CAPTURED |
| Website thread | Workspace chat | Live | 6 | P2 | Text+media links; no attach UI | NOT CAPTURED |

### E. Business / RFQ / admin / dealer

| Class | UX Score | Priority | Notes |
|-------|----------|----------|-------|
| Business hubs (banks, supply, global-supply) | 5–6 | P2 | No MiniAppBottomNav / map parity |
| RFQ flows | 6 | P2 | — |
| Dealer-OS | 6 | P2 | CSV import ≠ car import |
| Admin-OS | 6 | P1 ops | No import stage UI |

## Common problem taxonomy (apply when inspecting live)

For every screen successor opens, fill: Visual · Layout · Spacing · Typography · Button · Icon · SVG · Alignment · Safe Area · Keyboard · Animation · Dark · RTL · A11y · Loading · Empty · Error · Navigation · Performance — then Overall + Priority + Evidence + Screenshot.

**This package leaves those cells as CODE-REVIEW ONLY for non-materials screens.**

## UX overall (mobile product)

**6.0 / 10** — functional shells exist; consistency and live visual acceptance incomplete; several honesty bugs recently fixed but many surfaces never device-audited in this workstream.
