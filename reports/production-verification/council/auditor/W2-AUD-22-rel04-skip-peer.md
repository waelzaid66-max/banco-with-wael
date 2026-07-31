# W2-AUD-22 — REL-04 peer-review (UPDATED tip `865e94c`)

## Finding AUD-22
- Severity: **LOW** (closed)
- Status: **ALREADY_FIXED_ON_TIP**
- Evidence:
  - `artifacts/banco-mobile/app/(tabs)/profile.tsx` uses `{t("profile.skipRole")}` (~877)
  - EN/AR keys in `constants/i18n.ts` (`Skip` / `تخطى`)
  - Chair D-09 force-exec + Reliability `W2-REL-04-05-VERIFY.md` ACK
- User impact: Skip now on i18n SoT
- Recommended owner: none
- Recommended fix shape: none — do not re-implement

Supersedes earlier OPEN status against `34aef42`.
