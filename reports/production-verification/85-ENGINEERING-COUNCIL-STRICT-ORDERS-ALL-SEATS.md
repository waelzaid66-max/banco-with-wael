# 85 — تعليمات صارمة لكل المقاعد (Owner: الفريق جاي · انضبطوا)

**Issued by:** Chief Production Architect (Chair)  
**Date:** 2026-07-31  
**SoT tip:** `main` @ `9cb903c` (docs wake atop CI-green `aa62473`)  
**Floors إلزامية:** `a05190e` (Tranche D) · `6999915` (CI green stamp)  
**قانون المالك:** 10 أقسام · ميني-آب ميني-آب · ممنوع تهور/اختراع/كسر · ads E2E · finished sacred  

اقرأ قبل أي حركة: `81` · `84` · `PASTE-REPLIT-WAVE8-UNIFY-MAIN-AR.md` · `ROLES-CURSOR-VS-REPLIT-AR.md`

---

## 0) قوانين حديدية (كل المقاعد)

1. **ASK Chair** قبل أي World جديد وقبل أي fix منتج.  
2. **عالم واحد لكل packet** — ممنوع شغل متوازي على عالمين منتج.  
3. **SoT = `origin/main` فقط** — ممنوع reset/merge فروع `cursor/*-5cf0` أو أي فرع قديم بدون أمر Chair مكتوب.  
4. **لا اختراع taxonomy** (REL-21 HOLD) · **لا Banks directory** · **لا FactoriesHomeHeader** · **لا Live Certified** بدون Owner+Coolify.  
5. **مقدّس لا يُمس ذوقًا:** Stay header · RE PropertyHomeHeader · Materials identity · Import hub · Banks brochure · Leaflet/FilterSheet/mapLatch/messenger.  
6. **Car ≠ Import** · **Maps §7 ≠ RE primary** · `?map=1` per-section = تكرار مقصود.  
7. أي ادّعاء HEALTHY بدون grep/تيست على **هذا** الـ tip = مرفوض.  
8. Replit: عيون+شوتات+لوجز فقط — **صفر صيانة كود**.

---

## 1) جرد الوصول (أين نحن — لا مبالغة)

| محور | الحالة | الدليل |
|------|--------|--------|
| 10 عوالم مسجّلة | **DONE** | `_layout` + `app/section/*` + banks/import/accounts |
| دراسات Wave8 01–03 | **DONE** | `council/chair/W8-STUDY-01..03` |
| Tranche A Car/Materials dual-chrome | **CLOSED** | `a80de8c` |
| Tranche B Discover melt | **CLOSED** | `2afccf8` · AUD-82 |
| Tranche C pollution + Maps §7 prose | **CLOSED** | `fb81f92` · AUD-84 |
| Tranche D CI chain + World map guards | **CLOSED** | `a05190e` · section **85/85** · chain **167/167** |
| CI Mobile+Gates+API+Typecheck | **GREEN** | tip `aa62473` success · product stamp `6999915`/`3420aec` |
| توحيد Replit | **PACKET READY** | PASTE + `84` — بانتظار تنفيذ الريبلت للشوتات |
| Live / Coolify cutover | **NOT DONE** | Owner ops · `ops:live-cutover` NOT_CUTOVER |
| Arabic seed content | **WEAK** | محتوى · ليس عطل API بعد إصلاح env |
| HOLD epics | **OPEN** | Factories header · Banks directory · REL-21 |

**خلاصة Chair:** المنتج على `main` موحّد ومحمي بالحراس وخضراء الموبايل/CI. التشغيل على Replit يحتاج سحب+شوتات. لا تفتح HOLD بدون تسمية Owner لعالم واحد.

---

## 2) أوامر لكل مقعد (الصق كما هو)

### 2.1 Auditor
```
WAVE8+ STRICT. SoT=origin/main floors a05190e+6999915 tip≥aa62473.
Read 85 + 84 + PASTE-REPLIT-WAVE8-UNIFY-MAIN-AR.md.
Job NOW: AUD-86 — VERIFY (1) tip CI green ancestor (2) PASTE floors correct (3) no 5cf0 merge advice (4) Discover Props={onExploreMap} still (5) section-guard still locks W8-D map/identity.
Output: one VERIFY packet PASS/FAIL with greps. Zero product code. Then STANDBY.
ASK Chair before any World fix.
```

### 2.2 Reliability
```
WAVE8+ STRICT. SoT=origin/main. Read 85 + 77 inventory + W8-D guards.
Job NOW: REL-00 re-ack on tip — run section-guard + materials-core + production-wiring + chain-integrity locally if env allows; paste counts.
Queue ONLY: if Replit sends RED_LOGS / failed R0x shots → classify CORS|Clerk|DataContent|ProductBug → ASK Chair. Do not fix on Replit. Do not merge 5cf0.
Forbidden: invent taxonomy · Banks directory · tip fight. Then STANDBY.
```

### 2.3 Idle / Support
```
WAVE8+ STRICT. SUP-50 only.
Sync World board to 85 §1 Done/HOLD table. Zero product code.
Do not pick a World. Ask Chair what is next. Keep paste channel list updated (Auditor/REL/Replit).
```

### 2.4 Replit (العيون)
```
ROLE LOCK: runtime eyes ONLY. Read audit/handoff/PASTE-REPLIT-WAVE8-UNIFY-MAIN-AR.md and EXECUTE it.
git fetch + checkout main + reset --hard origin/main.
Prove FLOORS_OK (a05190e + 6999915 ancestors). Run section-guard expect 85/85.
Expo clear · shots R01–R12 · reply with SYNC_SHA + template. NO code · NO commit · NO 5cf0 · NO env pollution (no shared banco.today / no pk_live in shared / no placeholder sk).
```

### 2.5 Chair (هذا المقعد)
```
Lead only. Absorb seat packets. No freestyle HOLDs.
Next product World ONLY if Owner names one OR Replit proves ProductBug with shot+log.
Default: hold tip green · unify runtime evidence · prepare Coolify only when Owner orders infra.
```

---

## 3) قناة الرد على Chair (صيغة واحدة)

```text
SEAT: Auditor|Reliability|Idle|Replit
PACKET: <ID>
TIP: <short sha>
FLOORS: OK|FAIL
VERDICT: PASS|FAIL|STANDBY|ASK
EVIDENCE: <paths / counts / shot ids>
ASK_CHAIR: <one question or none>
```

---

## 4) ممنوع على الجميع (قائمة إعدام)

- تعديل Stay/RE/Import/Banks brochure «للتجميل»
- حذف Leaflet / FilterSheet / mapLatch / messenger  
- Discover→Search melt props  
- Maps CTA → RE hardcode  
- دمج فروع `*-5cf0`  
- ادّعاء Live Certified  
- ثقة بدون تيست على الـ tip  

---

## 5) ماذا بعد وصول الفريق؟

1. كل مقعد يلصق أمر §2 الخاص به ويبدأ.  
2. Replit ينفّذ PASTE ويرد الشوتات.  
3. Auditor/REL يقفون على VERIFY ثم STANDBY.  
4. أي باج منتج مثبت → Chair Approve Plan → FIX ضيق → REL-00 → AUD peer → merge `main`.  

**لا أحد يكمل «من عنده».**

— Chair · Strict Orders 85 · جاهز لاستقبال الفريق
