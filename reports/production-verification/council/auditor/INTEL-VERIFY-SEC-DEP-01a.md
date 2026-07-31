# INTEL-VERIFY — SEC-01/02 · DEP-01a · DIR-02 re-ack (تخصص Intelligence)

- Seat: **Production Intelligence** (read-only)  
- Wake: `90-DIRECTOR-TEAM-WAKE.md` · Intelligence paste  
- Master: `88` · Orders: `89` §3  
- Approve plan: `DIR-APPROVE-PLAN-SEC-DEP-REPLIT.md`  
- **SoT tip:** `main` @ **`7e3b40a`**  
- Floors: `a05190e` · `6999915` · Wave9 E · SEC/DEP land ⊂ tip  
- Stamp: `2026-07-31T18:28Z`  
- Mode: VERIFY only · **zero product code**

---

## 0. Channel (`89` §3)

```text
SEAT: Intelligence
PACKET: INTEL-VERIFY-SEC-DEP
TIP: 7e3b40a
FLOORS: OK
VERDICT: PASS
EVIDENCE: .replit no PAYMENT_CONFIG_ENCRYPTION_KEY= · no pk_live_ · no EXPO_PUBLIC_DOMAIN=banco.today · workflow banco-website :5000 · DIR-02 re-ack 90/90 · MOB-05 exact pins · SEC-02b WATCH residual PUBLIC_*→banco.today in shared · Owner Secrets UI UNVERIFIED · live NOT_CUTOVER 0/6
ASK_DIRECTOR: mark SEC-01/02 VCS VERIFY PASS · DEP-01a VERIFY PASS · keep SEC-02b WATCH · Owner confirm Secrets set · UX+Replit DIR-03
```

---

## 1. SEC-01 — plaintext Paymob enc key removed from VCS

| Check | Result | Evidence |
|-------|--------|----------|
| No `PAYMENT_CONFIG_ENCRYPTION_KEY =` assignment in `.replit` | **PASS** | `rg` no assignment (comment-only reminder L128–130) |
| Owner Secrets UI actually set | **UNVERIFIED** | Cannot prove encrypted store from git — Owner ops |

**Verdict SEC-01 VCS:** **PASS** · residual Owner rotation = **OWNER**

---

## 2. SEC-02 — no committed `pk_live` / `EXPO_PUBLIC_DOMAIN=banco.today`

| Check | Result | Evidence |
|-------|--------|----------|
| No `pk_live_` in `.replit` | **PASS** | `rg pk_live_` empty |
| No `EXPO_PUBLIC_DOMAIN=banco.today` | **PASS** | `rg` empty |
| Dev publishable keys | **OK / expected** | `[userenv.development]` uses `pk_test_*` only (publishable) |
| Production block | **OK** | comment: set via Secrets UI — no committed live keys |

**Verdict SEC-02 VCS:** **PASS** · Replit cold-start / blank-screen = still needs DIR-03 eyes (**VERIFY runtime open**)

### SEC-02b WATCH (Master)

| Residual in `[userenv.shared]` | Risk |
|-------------------------------|------|
| `PUBLIC_APP_URL` / `PUBLIC_API_BASE_URL` / `EXPO_PUBLIC_PUBLIC_APP_URL` → `banco.today` | Local CORS risk if client uses these for API host | **WATCH** — Approve Plan before change |

---

## 3. DEP-01a — Replit Web → `banco-website`

| Check | Result | Evidence |
|-------|--------|----------|
| Workflow args use `@workspace/banco-website` | **PASS** | `.replit` L34 `pnpm --filter @workspace/banco-website exec -- next dev … --port 5000` |
| Not defaulting to frozen `banco-web` | **PASS** | no `banco-web` in workflow args |

**Verdict DEP-01a:** **PASS** (code/config) · preview shot :5000 still **UNVERIFIED** until Replit/UX shot

---

## 4. DIR-02 re-ack (Wave9 E still green after SEC/DEP tip)

| Check | Result |
|-------|--------|
| MapsHub no `#C4A35A` · `sectionAccent("all")` | **PASS** |
| `section-header-map` present | **PASS** |
| `hideOriginAxis={isMaterialsSection}` | **PASS** |
| BookingStaysApp no `#650E36` | **PASS** |
| Leaflet + mapLatch + FilterSheet on disk | **PASS** |
| section-guard | **90/90 PASS** |
| MOB-05 exact pins | **PASS** (`3.3.1` / `15.0.3`) |

**JUDGMENT:** DIR-02 remains **PASS** on tip `7e3b40a`.

---

## 5. Specialty boundary (ما لن أفعله)

| Not Intelligence now | Owner |
|----------------------|-------|
| DIR-03 R01–R12 shots | UX + Replit |
| SEC-03…06 product fixes | PE-API after EXECUTE |
| AUTH-01 code | PE-Mobile after Approve Plan |
| MOB-01/02/03 dual filters | HOLD |
| Live Certified | FORBIDDEN |

Next Intelligence candidates after Director ACK: deepen **ACC-00** · **SEC-07** visibility grep matrix · **DATA-02** rent evidence when DB available.

— Intelligence · specialty VERIFY complete
