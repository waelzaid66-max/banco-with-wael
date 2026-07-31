# DIR-ACC-00 — Accounts matrix DRAFT (read-only · Intelligence)

- Master ID: **ACC-00** (`88` Track F)  
- Seat: Production Intelligence  
- Tip: `main` @ **`7e3b40a`**  
- Stamp: `2026-07-31T18:40Z` · **deepened** after wake `90` SEC/DEP VERIFY  
- Mode: **DRAFT checklist only** · zero product code · no fake device PASS  
- Surfaces: `artifacts/banco-mobile/app/(tabs)/profile.tsx` · `app/settings.tsx` · `app/_layout.tsx` · i18n keys

---

## Legend

| Mark | Meaning |
|------|---------|
| CODE | Path/handler exists in tip source (static) |
| PARTIAL | Some states handled; matrix incomplete |
| UNVERIFIED | Needs shot/log/device — **do not claim PASS** |
| OPEN | Known gap / missing path |
| ABSENT | No primary path found in mobile tip greps |
| N/A | Not applicable on this surface |

---

## Matrix (DRAFT · deepened)

| Cell | Guest | Individual | Dealer | Company/FI | Evidence note | Status |
|------|-------|------------|--------|------------|---------------|--------|
| Register email/password | — | CODE `handleSignUp` | CODE | CODE | `profile.tsx` SignUp | **UNVERIFIED** device |
| Login email/password | — | CODE `handleSignIn` | CODE | CODE | status `complete` | **UNVERIFIED** |
| MFA `needs_second_factor` | — | CODE | CODE | CODE | email_code / totp / phone / backup (~L570–596) | **UNVERIFIED** |
| `needs_new_password` | — | CODE | CODE | CODE | resetPasswordEmailCode send/verify/submit (~L576–637) | **UNVERIFIED** |
| `needs_first_factor` / identifier-first | — | OPEN? | OPEN? | OPEN? | AUTH-01 — full machine not dual-end proven | **OPEN** / AUTH-01 |
| OAuth Google/Apple/Facebook UI | — | CODE `handleOAuth` | CODE | CODE | buttons ~L3373+ · live tenant `social` may be empty (UV-04) | **UNVERIFIED** · likely dead on live |
| OTP / email code (MFA) | — | CODE | CODE | CODE | tied to second_factor | **UNVERIFIED** |
| Magic link | — | **ABSENT** | ABSENT | ABSENT | no `createMagicLink` / magic primary path in mobile tip greps | **OPEN** (product?) or N/A if Clerk-off |
| Password reset (forgot) | — | CODE | CODE | CODE | `forgotPassword` UI + `resetPasswordEmailCode` | **UNVERIFIED** shot |
| JWT / session restore | — | CODE Clerk | CODE | CODE | hooks + historical restore tests | **UNVERIFIED** tip re-run |
| Refresh / race | — | UNVERIFIED | UNVERIFIED | UNVERIFIED | UV / AUTH | **UNVERIFIED** |
| Logout | — | CODE `signOut` | CODE | CODE | profile menu + settings | **UNVERIFIED** shot |
| Sign out other sessions | — | CODE | CODE | CODE | settings `signOutOtherDevices` · `signOutOfOtherSessions: true` | **UNVERIFIED** |
| Delete account | — | CODE | CODE | CODE | settings `handleDelete` → `deleteAccount()` API then `signOut` | **UNVERIFIED** |
| Restore account | — | UNVERIFIED | UNVERIFIED | UNVERIFIED | soft-delete restore path not proven this pass | **UNVERIFIED** |
| Push register/removal | — | PARTIAL | PARTIAL | PARTIAL | `unregisterPushBestEffort` + `_layout` signOut path · FCM/APNs device | **UNVERIFIED** UV-03 |
| Expired session | — | UNVERIFIED | UNVERIFIED | UNVERIFIED | | **UNVERIFIED** |
| Device change | — | UNVERIFIED | UNVERIFIED | UNVERIFIED | UV-01/02 | **UNVERIFIED** |
| Business / Dealer upgrade | — | OPEN MOB-07 | PARTIAL | — | Master MOB-07 | **OPEN** |
| FI / Banks role | — | N/A | N/A | UNVERIFIED | Banks brochure sacred | **UNVERIFIED** |

---

## Honest Sign-Off inputs

- **No cell above is Live PASS.**  
- Physical Android/iPhone · APNs · FCM · prod OAuth · real network = required for UV-* / ACC-00 CLOSE.  
- Magic link: treat as **ABSENT** unless Director confirms Clerk Dashboard–only / out of scope.  
- Next: Director may ASSIGN Intelligence+Replit log pack for Guest→Login→MFA **or** UX DIR-03 shots first.

---

## ASK_DIRECTOR

1. After SEC/DEP VERIFY PASS: deepen ACC-00 with Replit Clerk logs, or DIR-03 shots first?  
2. Magic link: **OUT_OF_SCOPE** or product OPEN?  
3. Confirm MOB-05 stays **CLOSED** on Master `88`.

— Intelligence · ACC-00 DRAFT (deepened)
