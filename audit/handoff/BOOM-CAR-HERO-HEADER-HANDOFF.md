# B-OOM CAR — Hero Header · تسليم للزميل على اللاب توب

> **الحالة:** منفّذ ومدفوع. محتاج تشغيل فعلي + قرارين من المالك.
> **البرانش:** `claude/boom-car-hero-header`
> **الكوميت:** `b8671d7`
> **الريبو:** `waelzaid66-max/banco-with-wael`

---

## 1. الهيدر المقصود بالظبط — لا يوجد لبس

الهدف هو **الطبقة الأولى بعد ما تدوس على بطاقة السيارات في صفحة السيرش**.

سلسلة الوصول الكاملة، ملف بملف:

| # | الملف | السطر | الدور |
|---|---|---|---|
| 1 | `artifacts/banco-mobile/components/SearchDiscover.tsx` | 115–127 | `sectionGrid` → `sectionCard` — بطاقة السيارات نفسها في صفحة السيرش |
| 2 | نفس الملف | 95 | `router.push(SECTION_ROUTE[cat])` → `/section/car` |
| 3 | `artifacts/banco-mobile/app/section/car.tsx` | 16 | `<SectionSearchApp category="car" …/>` |
| 4 | `artifacts/banco-mobile/components/search/SectionSearchApp.tsx` | ~1389 | `isCarSection ? <CarsHomeHeader …/>` |
| 5 | **`artifacts/banco-mobile/components/search/car/CarsHomeHeader.tsx`** | كامل الملف | ← **الهيدر المطلوب. ده اللي اتعاد بناؤه.** |

**تأكيد إنه الملف الصح:** الكود القديم في الملف ده كان بيرسم حرفيًا اللي في سكرين شوت المالك — أيقونتَي `bookmark` + `map` فوق شمال، سهم يمين، `CAR` + لوجو `B-OOM`، سطر `سوق أصحاب بانكو المفتوح` بخطين رفيعين جنبه، `powered by BANCO`، وبعدين شريط البحث.

**مش ده المطلوب (متلمسوش):**
- `app/import/*` — CAR IMPORT عالم منفصل تمامًا، ممنوع دمجه.
- `components/search/stays/StaysHomeHeader.tsx` — ده المرجع النمطي بس، متتغيرش.
- `components/search/property/PropertyHomeHeader.tsx` و `materials/MaterialsHomeHeader.tsx`.

---

## 2. النمط المتبع (زي ما طلب المالك: نفس أسلوب بانكو استاي)

`StaysHomeHeader` بيرتب نفسه كده: `root → topBar → brandBlock → searchPill → tabsScroll` — والـ tabs بتعيش **جوه الهيدر نفسه**.

`CarsHomeHeader` الجديد اتبنى على نفس المنطق، بزيادة طبقتين:

```
A  topBar      رجوع · لوجو B-OOM CAR + powered by BANCO · جرس · بروفايل
B  hero        عنوان سطرين · وصف · 5 مزايا ثقة · إضاءة حمراء (240–260px)
C  search      بيل 56px نصف قطر 20 · (خريطة + حفظ جوه البيل) · زرار فلاتر أحمر دائري
D  categories  21 نوع مركبة — سكرول أفقي
E  stats       شريط أرقام رفيع
```

---

## 3. الملفات اللي اتغيرت

| الملف | التغيير |
|---|---|
| `components/search/car/CarsHomeHeader.tsx` | إعادة بناء كاملة (+689) |
| `components/search/car/VehicleGlyph.tsx` | **جديد** — 21 أيقونة مركبة SVG (+311) |
| `components/search/SectionSearchApp.tsx` | تعديل جراحي (+155) — طيّ الفلاتر + توصيل البروبس الجديدة |
| `constants/i18n.ts` | 42 مفتاح جديد × (EN + AR) |

---

## 4. مشكلة الفلاتر — الحل المطبّق

**كان:** `market + sort + offer mode + engines + brand + origin` كلهم بيترسموا مع بعض في `chipStrip` اللي فيه `flexWrap: "wrap"` → **5 صفوف مفروشة على الشاشة كلها**، وأول إعلان يبدأ تحت الطية.

**بقى:** لقسم السيارات فقط، المحاور دي كلها **مطوية خلف زرار واحد** تحت الفئات مباشرة.

### ⚠️ القاعدة اللي لازم تتحافظ عليها — مفيش حاجة اتحذفت

فيه **guard tests** بتفحص نص الكود الخام وبتفشل لو أي `testID` اختفى. المحاور محتفظة بمقاعدها بالكامل، بس اتغيّر **شرط الظهور** بس:

```tsx
// SectionSearchApp.tsx — الشريط الأساسي (سطر ~1727)
{!isRealEstateSection && !isMaterialsSection && (!isCarSection || carFiltersOpen) ? (
  <View testID="section-primary-strip">   // ← موجود زي ما هو

// شريط الماركة/المنشأ (سطر ~1975)
{showCarBrandStrip && carFiltersOpen ? (
  <ScrollView testID="car-brand-origin-strip">   // ← موجود زي ما هو
    <View testID="car-brand-strip">              // ← guard بيطلبه
    <View testID="car-origin-strip">             // ← guard بيطلبه
```

**الدول:** `MarketCountryButton` لسه مقعده الوحيد هو `section-primary-strip` (ده مطلب guard اسمه `W8 D-W8-01`). بقى جوه الكتلة المطوية → زرار واحد مش صف كامل. **ممنوع** نقله لجوه `CarsHomeHeader` — فيه اختبار بيفشل لو الملف احتوى على `cars-market-beside-banco` أو `section-sort-cycle`.

> **فخ وقعت فيه وأنا بنفّذ:** الـ guard بيعمل grep على **النص الخام** للملف. كتبت تعليق توثيقي فيه الاسمين دول حرفيًا فالاختبار فشل. لو محتاج تذكرهم في تعليق، اكتبهم موصوفين مش حرفيًا.

**الوصول للفلاتر بقى من مكانين:** زرار الفلاتر الأحمر في صف البحث (يفتح `FilterSheet`)، أو زرار الطيّ تحت الفئات (`testID="car-filters-toggle"`). وكمان الضغط على فئة **"المزيد"** بيفتح كتلة الفلاتر.

---

## 5. ثلاث قرارات هندسية — محتاجة مراجعتك

### 5.1 أيقونات المركبات: مرسومة SVG يدوي مش من lucide

`lucide-react-native` **مفيهاش** أيقونة موتوسيكل ولا أتوبيس ولا يخت ولا هليكوبتر. خلط بدائل من مكتبات مختلفة هو بالظبط اللي خلى الشريط القديم شكله غير متسق.

كمان `node_modules` مش متثبتة في بيئتي، يعني **مقدرتش أتحقق** إن اسم import معين موجود فعلًا — واستيراد اسم غلط بيكسر البيلد كله. فاخترت أرسمهم `react-native-svg` (موجودة أصلًا في المشروع ومستخدمة في `components/icons.tsx`).

القواعد في `VehicleGlyph.tsx`: `viewBox` 24×24، `strokeWidth` 1.6، أطراف دائرية، الكتلة البصرية بين y=6 و y=18.

> **لو عندك lucide متثبتة على اللاب توب:** تقدر تتحقق بسرعة وتستبدل اللي متأكد منه — بس لازم يفضل نفس الوزن البصري لكل الـ 21، متخلطش.

### 5.2 الأرقام في شريط الإحصائيات — قرار المالك مطلوب ⚠️

المواصفات طلبت 6 أرقام: `1.2M+ مركبة · 127+ دولة · 950+ تاجر · 18+ مزاد · 34+ ميناء · 92+ خط شحن` — وكانت مكتوبة تحت كلمة **"Example"**.

**اللي اتعمل:** الشريط بيرسم **بس الأرقام الحقيقية** اللي التطبيق يقدر يثبتها — حاليًا رقم واحد: `MARKET_COUNTRIES.length` (عدد الأسواق).

**السبب:** الباقي أرقام تسويقية ملهاش مصدر حي. حطها ثابتة في الكود = ادعاء كاذب هيوصل لمستخدمين حقيقيين ومحدش هيفتكر يشيله. ودي نفس فلسفة المشروع الموثقة (`MaterialsHomeHeader`: *"No vanity counts. No fake hub."*).

**مكان التعديل:** `SectionSearchApp.tsx` → `carHeroStats` (سطر ~856). المصفوفة جاهزة للستة خانات.

```
[ ] المالك يقرر: نحطها أرقام تسويقية ثابتة دلوقتي؟
[ ] ولا نستنى endpoints حقيقية؟
```

### 5.3 فئات المركبات بتشتغل بالبحث النصي مش enum

التصنيف البحري/الطيران **لسه مش معتمد** في قاعدة البيانات. التعليق ده موجود في الكود الأصلي:

> `Vehicle-type tabs (REL-21) wait for taxonomy Approve — do not invent.`

الحقل `body_type` الموجود بيغطي السيارات بس (`sedan/suv/crossover/hatchback/coupe/convertible/pickup/minivan/van`) — مفيهوش موتوسيكلات ولا قوارب ولا طيارات.

**الحل المطبق:** الفئة بتحط كلمة البحث في `criteria.q` (نص حر) اللي بيمشي على محرك البحث العربي/الإنجليزي الموجود فعلًا. لو بعتنا enum مش مدعوم، النتيجة هتبقى **فاضية بصمت**.

**يوم ما التصنيف يتعمد:** غيّر `onSelectCategory` في `SectionSearchApp.tsx` (سطر ~1431) بس. الشريط نفسه ومكوناته مش هيتغيروا.

---

## 6. الصورة السينمائية — ناقصة، محتاجة أصل جرافيك

المواصفات طلبت تكوين واحد: سوبركار أسود بانعكاسات حمراء (أمام) + يخت (وسط) + طيارة خاصة (أعلى) + شاحنة (أقصى يمين) + هليكوبتر (سما).

**دي مش شغل كود — دي أصل جرافيك.** مقدرتش أولّدها.

الموجود حاليًا: إضاءة حمراء سينمائية حقيقية بـ `RadialGradient` (مصدر ضوء رئيسي جانبي + انعكاس أرضي) على أسود نقي — يعني الهيرو مش فاضي، بس من غير المركبات.

**الصورة الموجودة `assets/images/categories/car.jpg` متستخدمش** — معرض سيارات أبيض ساطع، عكس المواصفات حرفيًا (`No white backgrounds`, `Pure Black`).

**لما الصورة تجهز:** حطها في `assets/images/car-hero.png` واعملها `<Image>` جوه `<View style={styles.hero}>` تحت `heroGlow` مباشرة و فوق `heroCopy`. الطبقات مترتبة كده أصلًا.

> ملاحظة تقنية اتصلحت أثناء التنفيذ: في SVG، الـ `radialGradient` مالهاش `rx`/`ry` — عندها `r` بس. الشكل البيضاوي بييجي من الـ `<Ellipse>` نفسها. لو عدّلت الإضاءة خلي بالك من دي.

---

## 7. التحقق اللي اتعمل ✅ واللي لسه ❌

### ✅ اتعمل

```bash
cd artifacts/banco-mobile

# 181 اختبار guard — كلهم نجحوا (بيشتغلوا بـ node مباشرة، مش محتاجين node_modules)
node --test tests/section-miniapp-guard.test.mjs      # 90 pass / 0 fail
node --test tests/ui-density-guard.test.mjs           #  4 pass / 0 fail
node --test tests/production-wiring-guard.test.mjs    # 47 pass / 0 fail
node --test tests/materials-core-guard.test.mjs       #  8 pass / 0 fail
node --test tests/lib-hardening.test.mjs              # 32 pass / 0 fail

# تطابق عربي/إنجليزي — نجح (قيد ar: typeof en بيكسر البيلد لو مفتاح ناقص)
tsc --noEmit --skipLibCheck constants/i18n.ts         # exit 0

# فحص syntax للملفات المتغيرة — نضيف
```

### ❌ لسه (مقدرتش — `node_modules` مش متثبتة عندي)

```bash
[ ] pnpm install
[ ] pnpm --filter banco-mobile run typecheck    # typecheck كامل بأنواع RN/Expo
[ ] node --test tests/i18n-usage.test.mjs        # محتاج npx tsc
[ ] npx expo start                               # ← الأهم: تشغيل فعلي وشوف الشكل
```

**أولوية التحقق عندك:** شغّل الأب وادخل السيرش → بطاقة السيارات، وقارن بالموك. ركّز على:

1. ارتفاع الهيرو فعليًا 240–260 والليستنج بيبدأ بدري
2. الشكل في **RTL** (عربي) — الهيدر كله logical `start/end`، لازم يتشاف
3. سكرول الـ 21 فئة ناعم ومفيش قصّ
4. الـ 21 أيقونة متسقة بصريًا مع بعض (دي أكتر حاجة محتاجة عين بشرية)
5. زرار الفلاتر يفتح `FilterSheet`، وزرار الطيّ يفتح المحاور، والدول جوه في زرار واحد

---

## 8. القيود اللي لازم تفضل محفوظة

- `testID="cars-home-header"` و `testID="cars-header-map"` يفضلوا في `CarsHomeHeader.tsx`
- `CarsHomeHeader.tsx` **ممنوع** يحتوي على `section-sort-cycle` أو `cars-market-beside-banco` (حتى في التعليقات)
- `testID="car-brand-strip"` و `testID="car-origin-strip"` يفضلوا في `SectionSearchApp.tsx`
- `onOpenMap` لازم يفضل بيستدعي `openOrLatchMap`
- أي مفتاح ترجمة جديد **لازم** يتزود في الشجرتين EN و AR
- `MiniAppBottomNav` متلمسش
- CAR IMPORT (`/import`) عالم منفصل — ممنوع الدمج

---

## 9. ملخص المتبقي

| # | المهمة | المسؤول |
|---|---|---|
| 1 | تشغيل فعلي + مراجعة بصرية (خصوصًا RTL واتساق الأيقونات) | الزميل على اللاب توب |
| 2 | `pnpm install` + typecheck كامل | الزميل على اللاب توب |
| 3 | الصورة السينمائية للهيرو | مصمم / المالك |
| 4 | قرار أرقام الإحصائيات (ثابتة ولا نستنى داتا) | المالك |
| 5 | ربط الفئات بـ enum بدل النص الحر | مؤجل لحد اعتماد التصنيف (REL-21) |

---

*مرجع المواصفات: طلب المالك 2026-08-01 — "PREMIUM HERO HEADER SPECIFICATION (MANDATORY)".*
