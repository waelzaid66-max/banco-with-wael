# BANCO MASTER ENGINEERING AUDIT — PHASE ZERO

**التاريخ:** 30 يوليو 2026  
**النوع:** قراءة وتحليل فقط — **لا إصلاحات**  
**SoT:** `waelzaid66-max/banco-with-wael` @ `01274b7` (main)  
**الفرع الحامل لهذا التقرير فقط:** `cursor/phase-zero-master-audit-288a`  
**النطاق:** المونوريبو كاملًا + مقارنة وثائق/فروع/لقطات ريبوهات سابقة  
**سياسة:** لم يُعدَّل أي ملف تطبيق/إعداد تشغيل/أسرار/قاعدة بيانات. الملف الناتج الوحيد المقصود هو هذا التقرير.

---

## 0. حدود الفحص

### ما تم
- قراءة هيكل المونوريبو (`artifacts/*`, `lib/*`, docs, audit, reports).
- تحقق ثابت من الشاشات/الـAPIs/الـschema ذات الصلة بشكاوى المالك.
- مقارنة مع تقرير #59 وتقارير production-verification والـUX study.
- فحص حي (قراءة عامة فقط): `GET https://clerk.banco.today/v1/environment` → `user_settings.social = {}`.
- مراجعة `.replit` / Docker / CI لمسارات النشر (بدون طباعة أسرار).
- مراجعة فروع `origin/cursor/*` ولقطات `reports/from-other-repos/*`.

### ما لم يتم
- تعديل كود أو commit لمنتج.
- تثبيت حزم / build / test / migration / seed.
- تدفقات مستخدم تفاعلية (تسجيل، دفع، رفع).
- استنساخ sister repos كاملة (`bancoo`, `bancotoday`, `-BANCO-CA-OOM-`, `aws-virgen`) — غير متاحة كـ remotes في هذا الـcheckout؛ المتاح لقطات README/STATUS فقط.
- SQL audit على production.

### مصادر تاريخية متاحة محليًا
| المصدر | الحالة |
|--------|--------|
| `origin` → `banco-with-wael` | SoT الحالي |
| فروع `cursor/*-5cf0` | موجودة؛ أغلبها تدقيق/hardening موثّق |
| `reports/from-other-repos/*` | لقطات من `banco.store-main`, `banco-cloud-web-app-all`, `aws-virgen` |
| `DUAL_REPO_STATUS.md` / `REPO_SYNC_STATUS.md` | تاريخية؛ تتحدث عن `-BANCO-CA-OOM-` و `aws-virgen` — **غير متصلة** بهذا الـclone |
| `audit/` (~285 ملف) + `reports/production-verification/` (59+) | أدلة داخلية غنية |

**حكم المقارنة الخارجية:** لا يمكن الجزم بحذف ملفات من sister repos غير المستنسخة. المقارنة الموثوقة هنا = SoT الحالي + git history على SoT + تقارير مقارنة سابقة (#59) التي قاست أحجام الملفات على `bancoo`/`bancotoday`.

---

## 1. Architecture Review

### 1.1 الحكم
نظام سوق متعدد القطاعات (Cars · Real Estate/Stays · Industrial · Materials · B2B · Banks/FI) مبني كـ **monorepo منظم** وليس مشروعًا فارغًا. البنية الأساسية جيدة ومتشعبة؛ الجاهزية المنتجّية تعاني من فجوات UX/تشغيل/مزامنة أسطح وليست من غياب الـAPI الأساسي.

### 1.2 الرسم البياني

```
Clients
  banco-mobile (Expo ~54, flagship)
  admin-os (Vite) · dealer-os/Market (Vite) · landing (Vite)
  banco-website (Next — canonical website)
  banco-web (Next — FROZEN)
        │  @workspace/api-client-react (+ taxonomy / search-contract / design-tokens)
        ▼
api-server (Express 5) ──► @workspace/db (Drizzle/Postgres)
        ▲
openapi.yaml (api-spec) ──orval──► api-client-react + api-zod
```

### 1.3 المنتجات (Artifacts)

| Artifact | الدور | الحالة |
|----------|-------|--------|
| `api-server` | Backend وحيد | نشط · اختبارات قوية |
| `banco-mobile` | تطبيق المستهلك الرئيسي | نشط · flagship |
| `banco-website` | الموقع الرسمي (App Router) | نشط حسب README الخاص به |
| `banco-web` | توأم تاريخي للموقع | **FROZEN** (`FROZEN.md`) |
| `admin-os` | لوحة الإدارة | نشط |
| `dealer-os` | بوابة التجار / Market | نشط |
| `landing` | هبوط نطاقات | نشط |
| `mockup-sandbox` | معاينة تصميم | مساعد |

### 1.4 مكتبات مشتركة
`db` · `api-spec` · `api-client-react` · `api-zod` · `taxonomy` · `design-tokens` · `search-contract` · `integrations-openai-ai-server`

### 1.5 تناقضات معمارية موثّقة
1. **Replit Preview يشغّل `banco-web` المجمد** (`.replit` → port 5000) بينما `banco-website` هو الـcanonical.
2. **PROJECT_STATUS.md** يدّعي Hono — الكود Express.
3. **BANCO_MASTER_REFERENCE.md** يجمّد أحيانًا `banco-website` عكس `FROZEN.md` على `banco-web`.
4. **Node:** Replit `nodejs-20` مقابل CI/Docker Node 24.
5. وثائق dual-repo تشير لـ remotes غير موجودة في هذا الـclone.

---

## 2. Product Review

### Banco Mobile
تطبيق Expo Router بتبويبات: Feed · Search · Saved · Messages · Profile.  
أقسام: `section/car` · `real-estate` · `factories` · `materials` · `booking` (BOOM STAY).  
أعمال: banks · RFQ · supply · investments · wallet · bookings · rentals hub · listings create/edit.

### Banco Web
مشروع مجمد. لا يجب اعتباره المرجع المنتج. ما زال مستخدمًا في Preview/بعض مسارات Docker/CI.

### Banco Website
الموقع الرسمي حسب ميثاقه. شجرة routes قريبة من web + `workspace/settings`. يحتاج cutover كامل من Preview/Deploy.

### Banco Stay / Boom Stay
واجهة BOOM STAY + محرك حجوزات `furnished_daily` (طلب/تأكيد/رفض). ليس PMS فندقيًا. التفاصيل في §20.

### Boom Stay
نفس المحرك؛ الهوية البصرية في `StaysHomeHeader` هي **المعيار المرجعي** للهوية حسب UX study.

### Messenger
محادثات مربوطة بالإعلان · polling · مرفقات صور · تفاعلات. لا WebSocket. التفاصيل في §14.

### Banks & Finance
ملف/مسارات موجودة؛ الدليل العام brochure؛ صندوق FI + CRM إداري حقيقيان. التفاصيل في §21.

### Listings
إنشاء/تعديل/بحث/خريطة بحث. فجوة UX كبيرة في create (دول/عملات/خريطة). التفاصيل في §22.

### Authentication
Clerk عبر كل الأسطح. Email يعمل على tenant الإنتاجي. Google/Facebook/Apple **مخفية** لأن Dashboard لا يعلنها. التفاصيل في §11.

---

## 3. Repository Comparison

| مقارنة | النتيجة |
|--------|---------|
| SoT vs sister (حسب #59) | `banks.tsx` ~897 ≈ bancoo ~891 ≈ bancotoday ~895 — **ليس حذف ملفات** |
| SoT vs لقطات from-other-repos | README/STATUS فقط — لا شجرة كود كاملة للمقارنة الحية |
| Dual-repo docs | تاريخية؛ هذا الـclone على `banco-with-wael` بـ remote واحد |
| ادعاء «تمسح البنوك/الإقامات/الرسائل» | **مرفوض كحذف ملفات**؛ الفجوات سلوكية/نطاق منتج |

### ما فُقد فعليًا (سلوك/منتج، موثّق)
| الفقد | النوع |
|-------|-------|
| منتقي دولة/عملة مضغوط في إنشاء الإعلان | UX regression (البدائية موجودة في Search وغير مستخدمة في create) |
| منتقي موقع على خريطة داخل create | ميزة ناقصة (GPS فقط) |
| دليل بنوك عام حي | منتج ناقص (brochure) |
| SSO Facebook/Apple/Google ظاهر | تكوين Clerk + gating |
| WebSocket للماسنجر | متعمد غائب (G47) |
| دفع الحجوزات عبر Banco | مؤجل بالتصميم |
| تقويم مضيف لحظر تواريخ | ناقص |
| ربط حجز ↔ محادثة تلقائي | ناقص |
| هوية B‑OOM موحّدة خارج Stay | UX debt |

### ما لم يُفقد (ملفات ما زالت)
`banks.tsx` · `BookingStaysApp` · `messages/[id].tsx` · `FinancingService` · `BookingService` · `ConversationService` · admin financing · OpenAPI financing/bookings/conversations.

---

## 4. Missing Features (عدسة المنتج)

| # | الميزة | الحالة | ثقة |
|---|--------|--------|-----|
| M1 | Compact country/currency على create/edit | ناقصة (chip cloud بدلًا منها) | مؤكدة |
| M2 | Map pin picker في create بجانب أدوات التحكم العليا | ناقصة | مؤكدة |
| M3 | Social SSO ظاهر وعامل (G/F/A) | ناقصة على tenant الإنتاجي | مؤكدة (probe حي) |
| M4 | دليل مؤسسات تمويل عامة للمستخدم | ناقصة / brochure | مؤكدة |
| M5 | Chat realtime (WS/SSE) | ناقصة عمدًا | مؤكدة |
| M6 | Presence / typing | ناقصة | مؤكدة |
| M7 | Pay-through-Banco للحجوزات | مؤجلة | مؤكدة |
| M8 | Host availability blocks (غير الحجوزات) | ناقصة | مؤكدة |
| M9 | Stay-specific reviews بعد الإقامة | ناقصة | مؤكدة |
| M10 | Help Center UI | mailto فقط | مؤكدة |
| M11 | Account recovery بعد الحذف | ناقصة | مؤكدة |
| M12 | `@workspace/ui` مشتركة | ناقصة | مؤكدة |
| M13 | Worker service منفصل | ناقص في compose | مؤكدة |
| M14 | E2E رحلات شاملة | ناقصة | مؤكدة |
| M15 | `expo-apple-authentication` | غير موجود رغم `usesAppleSignIn` | مؤكدة |

---

## 5. Missing Files

لا دليل على حذف جماعي لملفات البنوك/Stay/Messenger على SoT (`git log --diff-filter=D` السابق في #59 فارغ لمسارات البنوك الجوهرية).

**ملفات/حزم متوقعة وغائبة:**
- حزمة native maps (`react-native-maps` / Mapbox) على الموبايل.
- `expo-apple-authentication`.
- `@workspace/ui`.
- `turbo.json` (Turborepo pipelines).
- sister repo remotes في هذا الـclone.

---

## 6. Missing APIs

| API متوقع من شكاوى المنتج | الواقع |
|---------------------------|--------|
| Public list of financing intermediaries للموبايل | غير موجود للعامة؛ موجود admin |
| Countries/currencies reference API للإنشاء | غير موجود — ثوابت client |
| Chat WebSocket/SSE | غير موجود |
| Booking payment charge | غير موجود (مؤجل) |
| Host calendar block endpoints | غير موجود |
| Availability | **موجود** `GET /v1/listings/{id}/availability` |
| Bookings CRUD lifecycle | **موجود** |
| Conversations + messages + react | **موجود** |
| Map clusters | **موجود** `GET /v1/search/map` |
| Places autocomplete | **موجود** `GET /v1/reference/places` |
| FI inbox | **موجود** `/v1/financing/inbox*` |

---

## 7. Missing Screens

| شاشة | الحالة |
|------|--------|
| Create listing map pin screen/modal | غائبة |
| Live banks directory browse | غائبة (بدلها brochure cards) |
| Dedicated Help | غائبة |
| Account undelete/recovery | غائبة |
| Web Banks section | غائبة (موبايل فقط تقريبًا) |
| Web messenger rich (reactions/attach/cards) | جزئية جدًا مقابل الموبايل |
| Host calendar editor | غائبة |

شاشات موجودة وهامة: `listings/create` · `business/banks` · `section/booking` · `bookings` · `messages` · `messages/[id]` · admin `financing`.

---

## 8. UI Regression

### مؤكد على create listing
- `MARKET_COUNTRIES.map` داخل `optionRow` + `flexWrap: "wrap"` — سحابة ~21 دولة.
- نفس النمط للعملات.
- نفس النمط في `listings/edit/[id].tsx`.
- البدائية الصحيحة `MarketCountryButton` / `MarketCountryPicker` مستخدمة في Search/Sections/Stays **فقط**.

### أزرار بعرض كامل / كثافة
- أزرار primary بـ `alignSelf: "stretch"` / `width: "100%"` في create ومكوّنات متعددة.
- تكديس مساحة علوية (header pad + progress).
- دراسة UX (`docs/audit/UX-STUDY-BOOM-SYSTEM.md`): أقسام Cars/RE/Factories/Materials دون نظام هوية Stay؛ صفوف فلاتر كانت تفيض ثم لُفّت.

### هوية
- معيار B‑OOM مُطبَّق فعليًا في Stay.
- Banks بألوان زرقاء خارج نظام B‑OOM.
- Cairo مرتبط غالبًا بـ RTL وليس عالميًا.
- `Inter_*` ظاهر في حقول create.

---

## 9. UX Regression

| المشكلة | التفسير الهندسي |
|---------|------------------|
| «بيفتح قسم السيارات» | ليس cold-start إلى cars. `SearchDiscover.SECTION_ROUTE.all → /section/car`؛ مسارات map/brand تجبر `category: "car"` |
| دول/عملات طويلة | create لم يُرحَّل لنمط الزر المضغوط المعتمد |
| زر الخريطة | GPS تحت حقل الموقع — ليس map picker بجانب أدوات أعلى |
| بنوك «اتمسحت» | الدليل الحي غائب؛ الشاشة brochure + inbox للأعضاء |
| ماسنجر «مش مربوط زي قبل» | مربوط بالإعلان + deep links؛ النقل poll لا realtime |
| Stay ناقص | نطاق marketplace يومي لا PMS |

---

## 10. Performance Problems

| المصدر | الدليل | الأثر |
|--------|--------|-------|
| Chat polling | thread 3s · inbox 8s · unread ~15s | بطارية/شبكة/إحساس «بطء/قطع» |
| Maps CDN | Leaflet 1.9.4 + MarkerCluster من `unpkg` داخل WebView | اعتماد شبكة خارجية · بطء أول رسم |
| `useColors()` | `{ ...palette, radius }` كل استدعاء | هوية كائن جديدة → إعادة render محتملة |
| API base على Replit | خطر عنوان خاطئ إن نقص `EXPO_PUBLIC_API_BASE_URL` | فشل/بطء متصوَّر |
| Auth 401 latency (تقرير Replit) | 3–4s على محميّات أثناء عطل Clerk | يحتاج قياس بعد إصلاح secrets |
| لا worker منفصل | مهام خلفية على نفس عملية API | مخاطر تحت الحمل |

لم يُنفَّذ قياس p95/p99 أو Core Web Vitals في هذا الفحص.

---

## 11. Authentication Problems

### فحص حي (2026-07-30)
`clerk.banco.today` → `user_settings.social: {}` · email enabled · password enabled.

### لكل مزود

| المزود | كود الموبايل | Tenant إنتاجي | ما يراه المستخدم |
|--------|--------------|---------------|------------------|
| Email/password | موجود | مفعّل | يظهر |
| Email OTP | موجود | مفعّل | يظهر |
| Google | موجود + gated | **غير معلن** | **مخفي** |
| Facebook | موجود + gated (أُعيد بعد حذف مؤقت في التاريخ) | **غير معلن** | **مخفي** |
| Apple | موجود + gated؛ مخفي على Android؛ بلا `expo-apple-authentication` | **غير معلن** | **مخفي** |

### أسباب اختفاء Facebook/Apple
1. **Clerk Dashboard** لا يفعّل social على tenant الإنتاجي (دليل حي).
2. `useSocialProviders` fail-closed — يخفي الأزرار عمدًا لتجنب نقرات ميتة (`fc6ed2a`).
3. Footgun Replit: `package.json` dev يضبط `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY` وقد يفرّغ المفتاح في بيئة shared.

### تقرير Replit السابق (Clerk secret-invalid)
يُعامل كـ **عطل تشغيل بيئة Replit** محتمل/سابق. هذا الـcloud checkout لم يُعد تشغيل workflows للتحقق. يجب إعادة التحقق على Replit بعد مراجعة Secrets دون افتراض الشفاء.

### Web/Admin/Dealer
مكوّنات Clerk الجاهزة — تعرض ما يفعّله Dashboard → حاليًا email-only على نفس الـtenant.

---

## 12. Database Risks

| البند | الحالة |
|-------|--------|
| Schema موجود (listings, bookings, conversations, financing_*, payments…) | مؤكد في `lib/db` |
| CI يدفع schema + seed قبل API tests | مؤكد من docs/workflows |
| دليل corruption / missing relations في logs المقروءة هنا | لا يوجد |
| SQL health / orphans / slow queries / backup drill | **لم يُنفَّذ** |
| Booking بدون عمود دفع مكتمل | متعمد (تعليق schema) |
| Soft-delete مستخدمين بلا undelete | خطر منتج لا فساد بيانات |

---

## 13. Integration Problems

| التكامل | المشكلة |
|---------|---------|
| Clerk | Social فارغ · secrets footgun · اختلاف Replit vs production keys |
| Maps | لا native SDK · CDN unpkg · create بلا map |
| Paymob | مخاطر logging/callback host من تدقيقات سابقة (تحتاج إعادة تحقق قبل أي تغيير) |
| Upload URLs | اشتقاق من Forwarded headers (خطر مشروط) |
| OpenAPI codegen | لا gate freshness إلزامي في كل مسار CI |
| Preview vs Website | `banco-web` vs `banco-website` |
| Object storage / Resend / Push | موجودة معماريًا؛ لم تُختبر تفاعليًا هنا |

---

## 14. Messenger Problems

| البند | الحكم |
|-------|-------|
| Inbox + thread + create من إعلان | **يعمل في الكود** |
| Reactions / reply / listing cards / image attach (موبايل) | **موجود** |
| Realtime socket | **غائب عمدًا** — REST poll |
| Presence / typing | **غائب** |
| Video/audio attach UI | Schema أوسع من UI (صور فقط) |
| Web messenger | أساسي (نص/قراءة) — أضعف من الموبايل |
| ربط booking → conversation | **غائب** |
| ادعاء «اتمسح» | **رفض** — `messages/[id].tsx` ~1441 سطر |

---

## 15. Booking Problems

| البند | الحكم |
|-------|-------|
| Create/list/confirm/reject/cancel | موجود |
| Availability من الحجوزات النشطة | موجود |
| بوابة `furnished_daily` فقط | مقصود |
| دفع عبر Banco | مؤجل |
| تقويم مضيف للحظر | ناقص |
| إشعارات booking | موجودة + deep link |

---

## 16. Maps Problems

| البند | الحكم |
|-------|-------|
| بحث: Leaflet WebView + clusters API | موجود لكن هش/بطيء الإحساس |
| إنشاء إعلان: map picker | **غائب** — GPS فقط تحت الموقع |
| مكتبات native maps | **غائبة** من dependencies |
| زر تحديد العنوان أعلى مع الخيارات | **غير مطابق** لطلب المالك |
| autocomplete أماكن | API موجود · LocationPicker يستخدمه |

---

## 17. Payments Problems

| البند | الحكم (من كود + تدقيقات سابقة؛ بلا اختبار تفاعلي) |
|-------|------|
| Paymob webhook/return | موجود |
| تسجيل أجزاء رد البوابة | خطر معلومات (P1 سابق) |
| PUBLIC_API_BASE_URL لأي HTTPS | خطر إعداد |
| Wallet / subscriptions / billing | موجودة كخدمات |
| Booking payment | غير موصول |

---

## 18. Notifications Problems

| البند | الحكم |
|-------|--------|
| In-app notifications API | موجود |
| Deep links (booking/message/banks) | موجود في `notificationRouting` |
| Push على Expo Go Android | قيد معروف SDK — يحتاج dev build للتحقق الحقيقي |
| تفضيلات إشعارات | موجودة جزئيًا حسب UX study (سلك واحد كان معطلًا تاريخيًا — تحقق قبل الإصلاح) |

---

## 19. Banco Stay Problems

انظر §20 — نفس المحرك تحت علامة Boom/Banco Stay.

---

## 20. Boom Stay Problems

| البند | الحكم |
|-------|--------|
| Browse BOOM STAY + StayCard + header أسود | موجود (~1253 سطر BookingStaysApp) |
| BookingCard على listing يومي | موجود |
| Guest/Host bookings UI | موجود |
| Rentals hub | موجود |
| Hotel PMS / housekeeping / staff | **خارج النطاق** (موثّق WAVE-R1) |
| أسبوعي/شهري كمحرك حجز API | خارج النطاق الحالي |
| دفع الإقامة | مؤجل |
| تقويم مضيف غني / amenities admin | جزئي/ناقص |
| ربط رسائل بالحجز | ناقص |
| Reviews خاصة بالإقامة | ناقص |
| M1 redesign report ما زال مفتوحًا تاريخيًا | دين بصري لا غياب API |

**الخلاصة:** النظام الموجود = سوق إيجار مفروش يومي بعلامة Boom Stay. ما «ينقص» كثيرًا هو توقّع ضيافة كامل لم يدخل SoT، إضافة إلى فجوات تقويم مضيف ودفع ومراجعات إقامة.

---

## 21. Banks & Finance Problems

| الطبقة | الحالة |
|--------|--------|
| Mobile `business/banks.tsx` (~897) | موجود |
| Discover/Profile/Verification/Push → banks | مربوط |
| Public product cards | brochure صريح في الكود |
| FI inbox API/UI | حقيقي للأعضاء المرتبطين |
| Admin financing CRM | حقيقي |
| DB `financing_*` + role `financial_institution` | موجود |
| Public live directory API | **ناقص** |
| Web banks section | **غائب** |
| حذف الملف من git | **لم يحدث** |

ما يقصده المالك غالبًا: **تكملة المنتج/الدليل/UX الأغنى**، لا استعادة ملف محذوف.

---

## 22. Listings Problems

| البند | الحالة |
|-------|--------|
| Create wizard (category→details→media→preview) | موجود |
| دول كـ chip cloud | **مرفوض من المالك — موثّق** |
| عملات كـ chips | **مرفوض** |
| LocationPicker نصّي | موجود |
| Map pin في create | **ناقص** |
| CarPicker / specs chips | موجودة |
| Edit يعيد نفس anti-pattern للدول/العملات | مؤكد |
| بحث/فلاتر/خريطة browse | موجودة (محرك search-contract) |
| Categories taxonomy | موجودة في `@workspace/taxonomy` |

---

## 23. Deployment Problems

| البند | الدليل |
|-------|--------|
| Preview = `banco-web` المجمد | `.replit` workflow Web App |
| Canonical = `banco-website` | README + FROZEN.md |
| Compose يشغّل الاثنين | `docker-compose.coolify.yml` |
| CI website يبني/يفحص الاثنين وما زال يركّز smoke على web أحيانًا | `ci-website.yml` |
| Node 20 (Replit) vs 24 (CI/Docker) | عدم توحيد toolchain |
| Secrets في Replit | footgun الموبايل؛ تقرير Replit عن encryption key نصي يحتاج تحقق بيئة |
| لا E2E gate للنشر | فجوة |

---

## 24. Technical Debt

1. موقعان Next بدون cutover مكتمل.
2. وثائق متضاربة (Hono، freeze، Expo version، dual-repo).
3. Polling بدل realtime مع توقعات منتج realtime.
4. تكرار UI primitives (chip clouds vs MarketCountryButton).
5. shadcn محلي لكل Vite app بلا `@workspace/ui`.
6. حراس اختبار كثيرة على الموبايل دون journey E2E.
7. OpenAPI freshness غير مضمونة دائمًا.
8. `useColors` churn.
9. Leaflet عبر CDN داخل WebView.
10. اعتماد تشغيل الموبايل على سكربت Replit هش.

---

## 25. Prioritized Repair Plan

**قاعدة ملزمة:** لا إصلاح حتى موافقة المالك. لا حذف مسارات عاملة. كل إصلاح مسار واحد. مطابقة النية الأصلية قبل تغيير السلوك.

| الترتيب | المسار | الأولوية | الجهد | لماذا |
|---------|--------|----------|-------|-------|
| **1** | تصحيح استيراد Secrets/Clerk على Replit (إيقاف تفريغ `EXPO_PUBLIC_CLERK_*`) + التحقق من Secret Key | P0 | XS–S | يفتح إعادة إنتاج SSO/API الحقيقية |
| **2** | تفعيل Google/Facebook/Apple على Clerk Dashboard + اختبار؛ قرار حزمة Apple native | P0 | S + OPS | سبب اختفاء الأزرار مؤكد حيًا |
| **3** | Create/Edit: استبدال سحابة الدول/العملات بـ `MarketCountryButton`/dropdown أفقي ديناميكي | P0 | S | شكوى مالك صريحة |
| **4** | Create: نقل/إضافة map pin picker أعلى مع الأدوات؛ تقييم native maps vs تحسين Leaflet | P0 | M | شكوى مالك صريحة |
| **5** | UI density/identity pass: أزرار غير full-row بلا داعٍ · تعميم هوية Stay على الأقسام (حسب UX study S2→S4) | P1 | M–L | فقدان هوية |
| **6** | مسارات Discover التي تجبر cars (`SECTION_ROUTE.all`, map FAB) — تصحيح أو توضيح المنتج | P1 | S | «بيفتح سيارات» |
| **7** | Banks: تعريف المنتج المطلوب (دليل حي؟) ثم API عامة + UI — **بعد** إثبات تاريخي/موافقة؛ لا «restore أعمى» | P1 | M–L | تكملة لا ملف محذوف |
| **8** | Stay scope closeout مكتوب: ما يدخل/ما يبقى خارجًا · تقويم مضيف · دفع · reviews | P1 | M | توقعات Boom Stay |
| **9** | Messenger: قرار معماري poll vs WS؛ إن بقي poll حسّن الفواصل والربط؛ لا تدعِ realtime زائف | P1 | M–L | «مش مربوط زي قبل» |
| **10** | أداء: CDN maps · `useColors` · API base · قياس latency بعد auth | P2 | S–M | بطء محسوس |
| **11** | Cutover `banco-website` في Preview/Deploy + توحيد Node | P1 | M–L | خطر نشر النسخة الخطأ |
| **12** | أمن اعتماديات/upload host/Paymob logs (من تدقيقات سابقة) | P1 | S–M | بعد تثبيت التشغيل |
| **13** | Smoke E2E: auth → browse → create/upload → chat → booking sandbox | P1 | M–L | بعد Clerk |
| **14** | DB read-only health منفصل | P2 | S–M | قبل production claim |

---

## دمج تقرير Replit المُرفق في رسالة المالك

| ادعاء Replit | حكم Phase Zero |
|--------------|----------------|
| Clerk secret-invalid على Replit | يُقبل كعطل بيئة محتمل؛ يُعاد التحقق تشغيليًا. لا يتعارض مع فراغ social على `clerk.banco.today` |
| `.replit` فيه قيم حساسة | يحتاج مراجعة بيئة؛ لا تُطبع أسرار هنا. سياسة: Secrets Store فقط |
| Preview على banco-web | **مؤكد** مستقلًا |
| ثغرات Next/js-yaml/brace-expansion | لم يُعاد تشغيل الماسح هنا؛ يبقى P1 صيانة إلى إعادة audit |
| Node 20 vs 24 | **مؤكد** |
| Upload forwarded headers / Paymob logging / callback URL | مؤكد في تدقيقات سابقة؛ يُعاد في موجة أمن بعد P0 المنتج |
| لا Critical SAST مؤكد | يُقبل بحذر |
| اختبارات قوية API/mobile ضعيفة web | **مؤكد** |

**الشكاوى العشر للمالك مقابل الدليل**

| # | شكوى | الحكم |
|---|------|-------|
| 1 | دول/عملات قائمة طويلة | **مؤكد** على create/edit |
| 2 | زر خريطة + مكتبات + بطء | **مؤكد** (GPS لا map؛ Leaflet CDN) |
| 3 | بنوك اتمسحت | **ملفات موجودة** · **دليل حي ناقص** |
| 4 | Facebook/Apple اختفوا | **مؤكد** — Dashboard فارغ + gating |
| 5 | Secrets import | **مؤكد** footgun في dev script |
| 6 | يفتح سيارات | **مسارات Discover تجبر cars** لا cold-start |
| 7 | أزرار full-row / فراغ علوي / هوية | **مؤكد جزئيًا** + UX study |
| 8 | Stay ناقص | **نطاق marketplace + فجوات مضيف/دفع** |
| 9 | ماسنجر محدّث وغير مربوط كالسابق | **poll لا WS** · الربط بالإعلان موجود |
| 10 | باطن أعمق | هذا التقرير + #59 + audit/financing |

---

## الحكم التنفيذي النهائي

المشروع **ليس ممسوحًا**. هو SoT غني بـ API وموبايل واختبارات، مع فجوات منتج واضحة يراها المالك يوميًا:

1. إنشاء إعلان (دول/عملات/خريطة) — أعلى أولوية UX.
2. SSO الاجتماعي — تكوين Clerk + secrets قبل أي «إصلاح أزرار».
3. بنوك — إكمال منتج الدليل لا استعادة ملف وهمي.
4. Stay/Messenger — توضيح النطاق والنقل (marketplace + poll) مقابل توقعات PMS/realtime.
5. هوية الأقسام — تعميم معيار Boom Stay.
6. تشغيل/نشر — قطع البنك المجمد وتوحيد Node/Secrets.

**لا يُبدأ أي إصلاح كود منتج حتى مراجعة المالك لهذا التقرير وتحديد الأولويات.**

---

## ملحق — مسارات دليلية عالية الإشارة

```
artifacts/banco-mobile/app/listings/create.tsx
artifacts/banco-mobile/components/MarketCountryPicker.tsx
artifacts/banco-mobile/components/LocationPicker.tsx
artifacts/banco-mobile/components/search/mapHtml.ts
artifacts/banco-mobile/components/SearchDiscover.tsx
artifacts/banco-mobile/hooks/useSocialProviders.ts
artifacts/banco-mobile/app/business/banks.tsx
artifacts/banco-mobile/components/search/BookingStaysApp.tsx
artifacts/banco-mobile/app/messages/[id].tsx
artifacts/api-server/src/services/{Booking,Conversation,Financing}Service.ts
artifacts/banco-web/FROZEN.md
artifacts/banco-website/README.md
docs/audit/UX-STUDY-BOOM-SYSTEM.md
reports/production-verification/59-MOBILE-FULL-PRODUCT-AUDIT.md
```
