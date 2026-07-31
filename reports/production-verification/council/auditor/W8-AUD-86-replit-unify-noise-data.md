# W8-AUD-86 — Tranche D peer + توحيد Replit + ضجيج/بيانات دقيقة

- Seat: Production Auditor (`bc-019fb7f4-92be-7d5b-96d8-17142efbc8f0`)  
- **SoT tip:** `main` @ **`6999915`** (`6999915c7dccaed69735ff2f6284656e226738c5`)  
- Product land ⊂ tip: **`3420aec`**  
- Chair seat order: AUD-86 World-protect peer · ثم STANDBY  
- Owner: لوجز · ضجيج · تشغيل · شوتات · بيانات · توحيد نسخة · لصق Replit · ساعد المدير  
- Stamp: `2026-07-31T16:25Z` (rebind tip handoff)  
- Mode: VERIFY peer + paste · **zero product code**  
- Follow-on Chair cockpit: **`W8-AUD-87`**

---

## 0. حكم التوحيد

| | |
|--|--|
| Product SoT | **`main` @ `6999915`** (A+B+C+**D** CLOSED · CI green handoff) |
| Product land | `3420aec` ⊂ tip |
| Floor | `a05190e` / land `7ee71ec` |
| Live public | **NOT_CUTOVER 0/6** (أُعيد القياس هذا الختم) |
| Replit | proof-only + env lessons من تقرير `reports/replit-env/2026-07-31-…` |
| لصق | `audit/handoff/PASTE-REPLIT-UNIFY-MAIN-TIP-WAVE8-AR.md` |

كل المقاعد (Chair / Auditor / Reliability / Idle) تتكلم عن **نفس SHA**. Metadata فرع وكيل قديم ≠ SoT.

---

## 1. Tranche D peer VERIFY (طلب المجلس)

| ID | Claim | Evidence @ tip | Judgment |
|----|-------|----------------|----------|
| D-W8-07 | chain `P-saved-search-nav-consume` · ban applySaved | `node scripts/chain-integrity-gate.mjs` → **167/167 PASS** | **PASS** |
| D-W8-08 | W8-D section locks (Discover Props · Banks · map toggles · Car/Stay maps · Factories · Maps hub `?map=1` · Import · Accounts Stack) | `section-miniapp-guard` → **85/85 PASS** (was 77) | **PASS** |

### Companion guards (this machine @ tip)

| Gate | Result |
|------|--------|
| materials-core | **8/8** |
| production-wiring | **47/47** |
| lib-hardening | **32/32** |
| stay-honesty | **4/4** |
| messenger-wiring | **11/11** |
| production-confidence | **20/20** |
| ops:live-cutover | **0/6 NOT_CUTOVER** |

**JUDGMENT:** Tranche D **FIXED_ON_MAIN** · peer **PASS**.  
Forbidden surfaces untouched (no Stay/RE rewrite · no Banks directory · no Leaflet delete).  
Live Certified **FORBIDDEN**.

---

## 2. Live / DNS (حقيقي — أعيد القياس)

نفس نمط `56`/`70`:

- apex → Replit “isn't live” / HTML 404 على `/api/readyz` و well-known  
- www → Hostinger Horizons CDN  

**Owner OPS only:** Coolify `banco-with-wael` + compose · apex→`web:80` · secrets · migrate · DNS off Replit/Horizons.

---

## 3. ضجيج vs مشاكل بيانات/تشغيل دقيقة

### A. ضجيج (لا DEFECT منتج)

Metro spam · Expo Go push limits · Horizons كـ«موقع حي» · apex placeholder · API Vitest بلا DB · mockup-sandbox drift · PASTE قديم (77/46/25 · `ddb9371` بلا D) · confidence static ≠ Live · فروع وكلاء metadata قديمة.

### B. بيانات/env حقيقية (من تقرير Replit على main — مهم للمدير)

| جذر | عرض | إصلاح صحيح |
|-----|------|------------|
| `EXPO_PUBLIC_DOMAIN=banco.today` في shared | كل API → برودكشن → **CORS** → شاشة فارغة | domain من `$REPLIT_DEV_DOMAIN` في dev |
| `CLERK_SECRET_KEY` placeholder في development | يطغى على encrypted secret → SSR أسود | احذف placeholder |
| `pk_live_*` في shared + `sk_test_*` | عاصفة **401** | pk_live في production فقط · زوج test متطابق |
| DNS العام على Replit/Horizons | NOT_CUTOVER · ready z ليس JSON | Coolify + DNS |
| S3 vs Replit object storage في Coolify | فشل ميديا برودكشن | S3 إلزامي |

**درس الأدوار:** إصلاحات env في `.replit` أنقذت المعاينة — **لا تُترجم إلى صيانة كود منتج من Replit**. أي باج UI بعد unify → بلّغ Chair.

### C. منتج Wave8 مغلق (الشوتات تُثبت)

A: Car dual-chrome · Materials origin-once  
B: Discover melt severed  
C: applySaved dead · Maps §7 · guards  
D: chain CI green · per-World map/identity locks (**85**)

### D. HOLD

Factories header · Banks directory · REL-21 · REL-15 · Live/Coolify

---

## 4. لصق Replit (للمالك الآن)

انسخ كاملاً:

**`audit/handoff/PASTE-REPLIT-UNIFY-MAIN-TIP-WAVE8-AR.md`**

يفرض: `reset --hard` → assert `3420aec` → floor `a05190e` → install → guards **85/8/47/32/4/11 + 167 + 20** → Expo → W8-S01…S11 → قالب RUNTIME ONLY.

ملاحظة: تقرير Replit قال إنه سحب حتى Tranche A (~142 commits) وقتها — **يجب إعادة unify الآن** لالتقاط C+D + env report على tip.

---

## 5. Ask Chair

1. الصق UNIFY المحدَّث إلى Replit الشغّال.  
2. ارفض بلاغ SHA ≠ `3420aec` (أو أصدر لصق tip جديد إن تحرك main).  
3. اقبل AUD-86: Tranche D peer **PASS** + unify packet.  
4. ادمج هذا الـPR docs-only.  
5. STANDBY مقاعد · Owner Coolify إن أريد Live.

---

## 6. Auditor STANDBY

Zero product code · قناة أدلة مفتوحة.

— Auditor · AUD-86
