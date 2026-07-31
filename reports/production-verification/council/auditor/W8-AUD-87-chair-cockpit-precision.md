# W8-AUD-87 — قمرة قيادة للمدير (دقة أعلى) · ماذا تفعل الآن

- Seat: Production Auditor → **Chair** `bc-019fb7dd-f50e-7a52-9da0-103f76a5e37c`  
- **SoT tip الآن:** `main` @ **`6999915`** (`6999915c7dccaed69735ff2f6284656e226738c5`)  
- Product land ⊂ tip: **`3420aec`** · Tranche D CLOSED **`a05190e`** / **`7ee71ec`**  
- Stamp: `2026-07-31T16:25Z`  
- Mode: Chair help only · **zero product code**  
- Upstream: AUD-86 D-PASS · paste UNIFY · REL transcript skim · Chair transcript skim

---

## 0. جملة واحدة للمدير

Wave8 A+B+C+D **مقفولة على tip** · CI على `6999915` و`3420aec` **success** · AUD-86 peer **PASS** · Live **ما زال 0/6** · اللصق لـ Replit محدَّث على **`6999915`** · ادمج #45 ثم STANDBY الفريق · لا عالم جديد بلا ASSIGN.

---

## 1. حقيقة tip (أعيد قياسها لهذا الختم)

| Gate | @ `6999915` / branch absorb |
|------|------------------------------|
| section-miniapp | **85/85 PASS** |
| chain-integrity | **167/167 PASS** |
| production-confidence | **20/20 PASS** |
| GitHub CI @ `6999915` | **success** (`30646106806`) |
| GitHub CI @ `3420aec` | **success** (CI + Website + Docker) |
| ops:live-cutover | **NOT_CUTOVER 0/6** |

**AUD-86 Tranche D peer:** D-W8-07/08 **PASS** (انظر packet).  
**لا تدّعِ Live Certified.**

---

## 2. أوامرك الآن — ترتيب حديدي (انسخ ونفّذ)

### الخطوة 1 — طمئن المالك (جاهز للنسخ)

```text
Wave8 tip main@6999915 — A+B+C+D CLOSED.
CI GREEN على 6999915 و 3420aec.
حراس: section 85 · chain 167 · confidence 20.
Live عام: NOT_CUTOVER 0/6 (DNS ما زال Replit/Horizons) — Coolify فقط.
AUD-86 peer PASS. الفريق STANDBY بعد امتصاص #45.
Replit: الصق PASTE-REPLIT-UNIFY-MAIN-TIP-WAVE8-AR.md (يثبّت 6999915) — إثبات فقط لا صيانة كود.
```

### الخطوة 2 — الصق لـ Replit الشغّال

الملف (محدَّث على tip الحالي):

`audit/handoff/PASTE-REPLIT-UNIFY-MAIN-TIP-WAVE8-AR.md`

ارفض أي بلاغ `HEAD ≠ 6999915` بعد الـreset (إلا إذا تحرك tip — اطلب لصق جديد من Auditor).

### الخطوة 3 — امتصاص PRs (docs)

| PR | فعل | لماذا |
|----|------|--------|
| **#45** | **Merge الآن** | AUD-86/87 + UNIFY paste |
| **#40** | Merge بعد مراجعة سريعة | REL-00 docs؛ إن فيه assert أقوى لـ `commit(next)` على `P-saved-search-nav-consume` → **اقبل الأقوى** (لا تُضعّف tip) |
| **#36** | **Close** | CONFLICTING · superseded |
| **#38** | Triage / close أو absorb Idle فقط | Wave5-era noise إن تعارض |
| **#12/#34** | لا تُدمَج كـ SoT منتج | تدقيق تاريخي |

### الخطوة 4 — إصلاح انحراف وثائقي واحد (Chair docs)

`81-WAVE8-SECTION-BY-SECTION-DELIVERY-MACHINE.md` ما زال يقول **Tranche B EXECUTE** بينما الواقع A+B+C+D **CLOSED**.  
حدّث سطر الحالة → **CLOSED · STANDBY** أو اترك ملاحظة SUPERSEDED تشير لـ `82`/`83`.  
(Auditor لن يلمس المنتج؛ يمكنك docs-only على فرعك.)

### الخطوة 5 — ACK المقاعد ثم STANDBY

```text
ACK AUD-86 Tranche D peer PASS @ 6999915 (product ⊂ 3420aec).
ACK REL-00 when #40 absorbed.
Fleet STANDBY. Next World only on Owner ASSIGN + Chair Approve Plan.
HOLD unchanged: Factories header · Banks directory · REL-21 · Live/Coolify.
```

---

## 3. ماذا يريد المالك منك (من نصّك + موجاته)

| طلب Owner | حالة التنفيذ | فجوة متبقية |
|-----------|--------------|-------------|
| 10 عوالم · دراسة→إصلاح→دمج | **Done** A–D | لا عالم جديد بلا أمر |
| أخضر موبايل أولاً · حماية خرائط/هوية | **Done** 85 + CI | — |
| إزالة تلوث · تثبيت حقيقي | منتج نظيف على tip · Replit env ثابت جزئياً | **أعد UNIFY** لالتقاط C+D |
| كل الميني-آب ظاهرة | على tip + env الصحيح نعم | شوتات W8-S01…S11 إثبات |
| لا تشتت | HOLD list يحمي | لا تفتح Factories/Banks/REL-21 الآن |
| Live | **لا** | Coolify Owner |

---

## 4. ضجيج يجب أن تتجاهله vs إشارات حقيقية

| ضجيج | حقيقي |
|------|--------|
| Metadata وكيل على فرع `final-production-acceptance-e37c` / PR #32 قديم | SoT = **`main@6999915`** |
| board `81` يقول Tranche B | `82`/`83`/TRANCHE-D-CLOSED = الحقيقة |
| confidence/static أخضر | ≠ Live Certified |
| www Horizons «حي» | أصل خاطئ |
| PASTE يثبّت `ddb9371` أو 77 حراس | باطل بعد D |
| فروع hardening ضخمة غير مدمجة (Replit report list) | **لا تدمج** بدون دراسة Chair — خطر تلوث |

| حقيقي دقيق | مالك |
|------------|------|
| DNS 0/6 | Owner OPS |
| CORS إن DOMAIN=banco.today في shared | env Replit (موثّق) |
| Clerk placeholder / pk_live+sk_test | env |
| #40 أقوى assert `commit(next)` إن وُجد | Chair absorb اختيارياً |

---

## 5. حالة المقاعد (MCP الآن)

| Seat | bcId | وضع | ماذا تنتظر منك |
|------|------|-----|----------------|
| Chair | `…e37c` | RUNNING | هذا الـcockpit |
| Auditor | `…c8f0` | RUNNING | Merge #45 · ثم STANDBY |
| Reliability | `…53de` | RUNNING | ACK + absorb #40 |
| Idle | `…1e3d` | RUNNING | لا ASSIGN · board فقط |

---

## 6. Ask Chair (مختصر)

1. أرسل رسالة المالك (§2.1).  
2. الصق UNIFY إلى Replit.  
3. Merge **#45**.  
4. راجع/merge **#40** (prefer stronger chain).  
5. Close **#36**.  
6. حدّث أو علّم `81` drift.  
7. أصدر ACK STANDBY للأسطول.  
8. Coolify فقط إذا المالك طلب Live.

— Auditor · AUD-87 · Chair cockpit
