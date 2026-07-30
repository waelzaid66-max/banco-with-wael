# Universal / App Links well-known files (Coolify nginx)

These files are copied into the `web` (nginx) image at `/.well-known/` so iOS
Universal Links and Android App Links can verify after DNS points at Coolify.

## Placeholders (MUST replace before store verification)

| File | Placeholder | Source |
|------|-------------|--------|
| `apple-app-site-association` | `REPLACE_APPLE_TEAM_ID` | Apple Developer → Membership → Team ID |
| `assetlinks.json` | `REPLACE_PLAY_APP_SIGNING_SHA256` | Play Console → App signing → SHA-256 certificate fingerprint |

Do **not** invent Team IDs or signing fingerprints. Leave placeholders in Git
until the owner fills real values in a follow-up commit (or override via a
Coolify volume mount of the same paths).

## After DNS → Coolify

Verify:

```bash
curl -sSI https://banco.today/.well-known/apple-app-site-association
curl -sS https://banco.today/.well-known/assetlinks.json
```

AASA must be `application/json` (nginx sets this). HTTP 200 with real Team ID /
SHA-256 is required for store deep-link verification.
