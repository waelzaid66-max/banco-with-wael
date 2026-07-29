#!/usr/bin/env node
/**
 * BANCO full-chain integrity gate — NON-DESTRUCTIVE.
 *
 * Verifies that critical adopted fixes remain present in source so a future
 * Replit mega-wipe (class of 93b650b) cannot ship silently.
 *
 * Usage (repo root):
 *   node scripts/chain-integrity-gate.mjs
 *
 * Exit 0 = all markers present. Exit 1 = one or more missing.
 * Does NOT modify product behavior. Does NOT guess env/runtime.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/** @type {{ id: string; file: string; test: (src: string) => boolean; why: string }[]} */
const CHECKS = [
  {
    id: "P-profile-phone-MOB01",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) =>
      /testID="edit-phone-input"/.test(s) &&
      /phoneDraft/.test(s) &&
      /phone:\s*trimmedPhone/.test(s),
    why: "MOB-01 phone edit must remain wired to updateMe",
  },
  {
    id: "P-account-skip",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) => /testID="onboard-skip"/.test(s),
    why: "Skip on account-type gate (224ef4f) must not be wiped again",
  },
  {
    id: "P-account-anti-trap",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) => {
      const i = s.indexOf("const chooseAccountType");
      if (i < 0) return false;
      const sl = s.slice(i, i + 2200);
      const d = sl.indexOf("setNeedsAccountType(false)");
      const u = sl.indexOf("await updateMe({ account_type");
      return d >= 0 && u >= 0 && d < u;
    },
    why: "df68258 dismiss-first — never trap users if API fails",
  },
  {
    id: "P-account-fi-intent",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) => /intent=fi/.test(s) && /financial_institution/.test(s),
    why: "FI onboarding must pass intent=fi (never silent dealer demotion path)",
  },
  {
    id: "P-account-role-from-me",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) =>
      /meQuery\.data\?\.data\?\.role/.test(s) &&
      /const role = meRole \|\| clerkRole/.test(s),
    why: "Profile chrome must prefer DB /me.role over Clerk metadata lag",
  },
  {
    id: "P-account-demote-guard",
    file: "artifacts/api-server/src/services/UserService.ts",
    test: (s) =>
      /DEMOTE_BLOCKED/.test(s) &&
      /account_type === "individual"/.test(s) &&
      /financial_institution/.test(s),
    why: "Elevated roles must not self-demote to individual via PATCH /me",
  },
  {
    id: "P-banks-awaiting-link",
    file: "artifacts/banco-mobile/app/business/banks.tsx",
    test: (s) =>
      /testID="banks-awaiting-link"/.test(s) &&
      /showAwaitingAdminLink/.test(s) &&
      /intent=fi/.test(s),
    why: "FI without owner link must see awaiting-admin UX, not endless Join",
  },
  {
    id: "P-menu-touch-safe-profile",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) => {
      const a = s.indexOf("{/* Overflow menu");
      if (a < 0) return false;
      const b = s.indexOf("</Modal>", a);
      const block = s.slice(a, b);
      return (
        !/onStartShouldSetResponder/.test(block) &&
        /StyleSheet\.absoluteFillObject/.test(block) &&
        /maxHeight:\s*["']85%["']/.test(s)
      );
    },
    why: "Profile overflow menu touch-safe + scroll cap (f70e016/4ccf939)",
  },
  {
    id: "P-menu-touch-safe-promote",
    file: "artifacts/banco-mobile/components/PromoteButton.tsx",
    test: (s) =>
      !/onStartShouldSetResponder/.test(s) && /StyleSheet\.absoluteFillObject/.test(s),
    why: "Promote sheet must stay touch-safe",
  },
  {
    id: "P-menu-touch-safe-home",
    file: "artifacts/banco-mobile/app/(tabs)/index.tsx",
    test: (s) =>
      !/onStartShouldSetResponder/.test(s) &&
      (s.match(/StyleSheet\.absoluteFillObject/g) || []).length >= 2,
    why: "Home logo/sort menus must stay touch-safe",
  },
  {
    id: "P-map-locate-me",
    file: "artifacts/banco-mobile/components/search/mapHtml.ts",
    test: (s) => /LocateControl/.test(s) && /locate-btn/.test(s),
    why: "Locate-me control (fcd7d1c) must remain after wipe restore",
  },
  {
    id: "P-map-market-center",
    file: "artifacts/banco-mobile/lib/searchTaxonomy.ts",
    test: (s) =>
      /export function marketCountryMapCenter/.test(s) &&
      /FR:\s*\{\s*lat:/.test(s) &&
      /LB:\s*\{\s*lat:/.test(s) &&
      /MA:\s*\{\s*lat:/.test(s) &&
      /TN:\s*\{\s*lat:/.test(s) &&
      /SD:\s*\{\s*lat:/.test(s),
    why: "Market-country initial map center must cover EU + LB/MA/TN/SD (no silent EG fallback)",
  },
  {
    id: "P-profile-menu-hooks-safe",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) =>
      /const menuItems\s*:/.test(s) && !/const menuItems\s*=\s*useMemo/.test(s),
    why: "Profile menuItems must not useMemo after early returns (Rules of Hooks crash)",
  },
  {
    id: "P-deploy-pin-readyz",
    file: "artifacts/api-server/src/routes/health.ts",
    test: (s) =>
      /function deployPin/.test(s) &&
      /gitSha/.test(s) &&
      /readyz/.test(s) &&
      /\.\.\.deployPin\(\)/.test(s),
    why: "Readyz/livez must expose deploy SHA pin for live production verification (F1)",
  },
  {
    id: "P-map-market-center-wired",
    file: "artifacts/banco-mobile/components/search/SearchResultsMap.tsx",
    test: (s) => /marketCountryMapCenter\(criteria\.marketCountry\)/.test(s),
    why: "Native map must frame by selected market country",
  },
  {
    id: "P-map-geolocation-webview",
    file: "artifacts/banco-mobile/components/search/SearchResultsMap.tsx",
    test: (s) => /geolocationEnabled/.test(s),
    why: "Android/iOS WebView must allow geolocation for locate-me",
  },
  {
    id: "P-map-locate-error",
    file: "artifacts/banco-mobile/components/search/mapHtml.ts",
    test: (s) =>
      /locate_error/.test(s) &&
      /reason:\s*"denied"/.test(s) &&
      /function \(err\)/.test(s),
    why: "Locate-me must report deny/timeout to host (N2 Android/iOS honesty)",
  },
  {
    id: "P-android-keyboard-resize",
    file: "artifacts/banco-mobile/app.json",
    test: (s) => /softwareKeyboardLayoutMode"\s*:\s*"resize"/.test(s),
    why: "Android SoftInput resize so composers stay visible above keyboard",
  },
  {
    id: "P-cover-photo-rationale",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) =>
      /showCoverRationale/.test(s) &&
      /coverAccessTitle/.test(s) &&
      /setShowCoverRationale\(true\)/.test(s),
    why: "Cover gallery must use in-app rationale before OS prompt",
  },
  {
    id: "P-chat-attach-rationale",
    file: "artifacts/banco-mobile/app/messages/[id].tsx",
    test: (s) =>
      /showAttachRationale/.test(s) &&
      /PermissionRationaleModal/.test(s) &&
      /message-attach/.test(s),
    why: "Chat attach must disclose before OS gallery prompt",
  },
  {
    id: "P-market-eu-flags",
    file: "artifacts/banco-mobile/constants/countryCodes.ts",
    test: (s) =>
      ["FR", "DE", "ES", "IT"].every((iso) =>
        new RegExp(`iso:\\s*"${iso}"[\\s\\S]{0,120}?flag:\\s*"`).test(s),
      ),
    why: "Compressed market strip needs EU flags (not globe fallback)",
  },
  {
    id: "P-car-compact-strip",
    file: "artifacts/banco-mobile/components/search/SectionSearchApp.tsx",
    test: (s) =>
      /testID="car-brand-origin-strip"/.test(s) && /testID="car-brand-btn"/.test(s),
    why: "Owner-approved compact car strip (aa0364c) — do not regress to dual rows",
  },
  {
    id: "P-stay-compact-sort",
    file: "artifacts/banco-mobile/components/search/BookingStaysApp.tsx",
    test: (s) => /sortChip:\s*\{[\s\S]*?width:\s*30[\s\S]*?height:\s*30/.test(s),
    why: "Owner compact Stay sort chip 30×30 (4bf7cfb)",
  },
  {
    id: "P-upload-503-storage",
    file: "artifacts/api-server/src/controllers/uploadController.ts",
    test: (s) =>
      /object storage is not configured/.test(s) && /status\(503\)/.test(s),
    why: "Clear 503 when storage missing (0afef07) — not opaque 500",
  },
  {
    id: "P-upload-claims-idor",
    file: "artifacts/api-server/src/lib/uploadClaims.ts",
    test: (s) => /assertCallerMayUseUpload/.test(s),
    why: "C-01 upload IDOR guard must remain",
  },
  {
    id: "P-upload-update-503",
    file: "artifacts/api-server/src/controllers/listingController.ts",
    test: (s) => {
      const i = s.indexOf("export async function updateListingHandler");
      if (i < 0) return false;
      const block = s.slice(i, i + 1800);
      return (
        /MEDIA_VERIFY_RETRYABLE/.test(block) &&
        /status\(503\)/.test(block) &&
        /createListingHandler/.test(s) &&
        /MEDIA_VERIFY_RETRYABLE/.test(s)
      );
    },
    why: "Update listing must map transient media verify to 503 like create (N1.1)",
  },
  {
    id: "P-email-cycles",
    file: "artifacts/api-server/src/services/EmailService.ts",
    test: (s) =>
      /sendNewMessageEmail/.test(s) &&
      /sendNewMatchEmail/.test(s) &&
      /sendPriceDropEmail/.test(s),
    why: "Transactional email cycles (ef8174d) must remain",
  },
  {
    id: "P-email-arabic-safe",
    file: "artifacts/api-server/src/services/EmailService.ts",
    test: (s) => /BUG-001/.test(s) && /charCodeAt\(0\)\.toString\(16\)/.test(s),
    why: "Arabic ByteString-safe escape (b6724a1) must remain",
  },
  {
    id: "P-push-service",
    file: "artifacts/api-server/src/services/PushService.ts",
    test: (s) => /EXPO_PUSH_ENDPOINT/.test(s) && /registerPushToken/.test(s),
    why: "Push delivery path must remain",
  },
  {
    id: "P-push-chokepoint",
    file: "artifacts/api-server/src/services/NotificationService.ts",
    test: (s) =>
      /sendPushToUser/.test(s) &&
      /createNotification/.test(s) &&
      /data:\s*\{\s*type:\s*input\.type/.test(s),
    why: "Push must fan out only via createNotification with data.type",
  },
  {
    id: "P-push-expo-go-guard",
    file: "artifacts/banco-mobile/hooks/usePushNotifications.tsx",
    test: (s) =>
      /isExpoGo/.test(s) &&
      /ExecutionEnvironment\.StoreClient/.test(s) &&
      /routeForNotification/.test(s),
    why: "Expo Go must stay no-remote-push; taps use shared router",
  },
  {
    id: "P-push-routing-shared",
    file: "artifacts/banco-mobile/lib/notificationRouting.ts",
    test: (s) =>
      /export function routeForNotification/.test(s) &&
      /type === "message"/.test(s) &&
      /listingId:\s*d\.listing_id/.test(s) &&
      /financing_lead_id/.test(s) &&
      /payment_success/.test(s),
    why: "Shared feed+push router must keep message listingId + banks + billing",
  },
  {
    id: "P-fi-agent-authz",
    file: "artifacts/api-server/src/services/FinancingService.ts",
    test: (s) => /agentCanAccessRequest/.test(s),
    why: "FI branch agent AuthZ must remain",
  },
  {
    id: "P-fi-admin-queue",
    file: "artifacts/admin-os/src/pages/users.tsx",
    test: (s) =>
      /users-role-filter/.test(s) &&
      /users-fi-queue/.test(s) &&
      /fiInboxUnlinked/.test(s) &&
      /GetAdminUsersRole\.financial_institution/.test(s) &&
      /ownedByOther/.test(s),
    why: "Admin FI awaiting-link queue + unlinked badge + no overwrite other owners (N1.3)",
  },
  {
    id: "P-fi-inbox-forbidden-unlinked",
    file: "artifacts/api-server/src/services/FinancingService.test.ts",
    test: (s) =>
      /denies institution inbox for FI role without owner\/seat link/.test(s) &&
      /listInstitutionRequests/.test(s) &&
      /FORBIDDEN/.test(s),
    why: "Regression: unlinked FI must get FORBIDDEN on institution inbox",
  },
  {
    id: "P-section-route-discover",
    file: "artifacts/banco-mobile/components/SearchDiscover.tsx",
    test: (s) => /SECTION_ROUTE/.test(s) && /router\.push\(SECTION_ROUTE\[cat\]\)/.test(s),
    why: "Discover must ENTER mini-apps (anti-melt)",
  },
  {
    id: "P-clerk-load-gate",
    file: "artifacts/banco-mobile/app/_layout.tsx",
    test: (s) =>
      /function ClerkLoadGate/.test(s) &&
      /CLERK_LOAD_TIMEOUT_MS/.test(s) &&
      /getToken\(\)\.catch\(\(\)\s*=>\s*null\)/.test(s) &&
      /FONT_WAIT_MS/.test(s),
    why: "ClerkLoadGate + font wait prevent infinite white screen (bancoo C-WEB-BASE)",
  },
  {
    id: "P-web-export-build",
    file: "artifacts/banco-mobile/scripts/build.js",
    test: (s) => /function exportWebBuild/.test(s) && /exportWebBuild\(\)/.test(s),
    why: "Replit deploy must export web SPA (not QR-only browsers)",
  },
  {
    id: "P-web-serve-spa",
    file: "artifacts/banco-mobile/server/serve.js",
    test: (s) =>
      /WEB_ROOT/.test(s) &&
      /static-build.*web/.test(s) &&
      /serveWebIndex|hasWebBuild/.test(s),
    why: "serve.js must prefer static-build/web for browsers without expo-platform",
  },
  {
    id: "P-edit-media-wired",
    file: "artifacts/banco-mobile/app/listings/edit/[id].tsx",
    test: (s) =>
      /ListingMediaEditor/.test(s) &&
      /buildMediaPayload/.test(s) &&
      /media,/.test(s),
    why: "Edit listing must PATCH media via ListingMediaEditor (EDIT-MEDIA-DEAD)",
  },
  {
    id: "P-landing-clerk-domain",
    file: "artifacts/landing/src/App.tsx",
    test: (s) =>
      /banco\.today\/dealer-os/.test(s) &&
      /banco\.today\/banco-mobile/.test(s),
    why: "deals/autos must hop to banco.today for Clerk live origin",
  },
  {
    id: "P-buyer-phone-from-me",
    file: "artifacts/banco-mobile/app/listing/[id].tsx",
    test: (s) =>
      /meQuery\.data\?\.data\?\.phone/.test(s) &&
      /buyer_phone/.test(s),
    why: "Lead/booking buyer phone must prefer /me.phone (profile SoT)",
  },
  {
    id: "P-edit-listing-invalidate",
    file: "artifacts/banco-mobile/app/listings/edit/[id].tsx",
    test: (s) =>
      /invalidateQueries/.test(s) &&
      /getGetListingQueryKey\(id\)/.test(s),
    why: "Edit save must invalidate listing RQ cache (not only session bump)",
  },
  {
    id: "P-post-signup-no-nav-on-fail",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) =>
      /let synced = false/.test(s) &&
      /if \(!synced\) return/.test(s) &&
      /post-signup account_type save failed/.test(s) &&
      /setNeedsAccountType\(true\)/.test(s),
    why: "Failed post-signup updateMe must not navigate and must reopen retry gate",
  },
  {
    id: "P-account-type-chosen-after-me",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) => {
      const i = s.indexOf("const chooseAccountType");
      if (i < 0) return false;
      const sl = s.slice(i, i + 2800);
      const u = sl.indexOf("await updateMe({ account_type");
      const c = sl.indexOf("accountTypeChosen: true");
      return u >= 0 && c >= 0 && u < c;
    },
    why: "Clerk accountTypeChosen must be set only after /me updateMe succeeds",
  },
  {
    id: "P-consent-type-chosen-after-me",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) => {
      const terms = s.indexOf("termsAcceptedAt: new Date().toISOString()");
      const post = s.indexOf("post-signup account_type save failed");
      if (terms < 0 || post < 0 || terms > post) return false;
      // Consent metadata write before /me must not stamp accountTypeChosen.
      if (s.slice(terms, post).includes("accountTypeChosen: true")) return false;
      const after = s.slice(post, post + 1600);
      const u = after.indexOf("await updateMe");
      // Flag write appears after successful sync block (after !synced return).
      const c = after.indexOf("accountTypeChosen: true");
      return (
        /if \(!synced\) return/.test(after) &&
        c >= 0 &&
        after.indexOf("accountTypeChosen: true") >
          after.indexOf("if (!synced) return")
      );
    },
    why: "Email signup consent must not set accountTypeChosen before /me succeeds",
  },
  {
    id: "P-verify-go-back-locked",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) =>
      /testID="verify-go-back"/.test(s) &&
      /disabled=\{isSigningUp\}/.test(s),
    why: "Verify Go Back must not clear consent while finalize is in flight",
  },
  {
    id: "P-mobile-archive-wired",
    file: "artifacts/banco-mobile/app/listings/mine.tsx",
    test: (s) =>
      /updateListing\(id, \{ status \}\)/.test(s) &&
      /confirmArchive/.test(s) &&
      /confirmReactivate/.test(s),
    why: "Mine must archive/reactivate via updateListing status (dealer parity)",
  },
  {
    id: "P-listing-detail-archive",
    file: "artifacts/banco-mobile/app/listing/[id].tsx",
    test: (s) =>
      /handleArchive/.test(s) &&
      /handleReactivate/.test(s) &&
      /status: "archived"/.test(s),
    why: "Owner listing detail must archive/reactivate like mine",
  },
  {
    id: "P-mine-mark-sold",
    file: "artifacts/banco-mobile/app/listings/mine.tsx",
    test: (s) =>
      /confirmSold/.test(s) &&
      /runStatus\(item\.id as string, "sold"\)/.test(s) &&
      /notifyListingsChanged/.test(s),
    why: "Mine must mark sold + invalidate profile/feed listings cache",
  },
  {
    id: "P-status-mutation-bump",
    file: "artifacts/banco-mobile/app/listing/[id].tsx",
    test: (s) =>
      /notifyListingsChanged/.test(s) &&
      /bumpListings/.test(s) &&
      /getGetMyListingsQueryKey/.test(s),
    why: "Owner status mutations must bump + invalidate my listings",
  },
  {
    id: "P-chat-sold-bump",
    file: "artifacts/banco-mobile/app/messages/[id].tsx",
    test: (s) =>
      /bumpListings\(\)/.test(s) &&
      /getGetMyListingsQueryKey/.test(s) &&
      /status: "sold"/.test(s),
    why: "Chat mark-sold must refresh profile/mine listings, not only detail",
  },
  {
    id: "P-dealer-mark-sold",
    file: "artifacts/dealer-os/src/pages/listings.tsx",
    test: (s) =>
      /handleMarkSold/.test(s) &&
      /status: "sold"/.test(s) &&
      /useUpdateListing/.test(s),
    why: "Dealer-os must close deals via updateListing status=sold",
  },
  {
    id: "P-dealer-edit-media",
    file: "artifacts/dealer-os/src/components/listing-form-sheet.tsx",
    test: (s) =>
      /buildMediaPayload/.test(s) &&
      /detail\.media/.test(s) &&
      /media: mediaArr/.test(s) &&
      !/Media \+ financing are create-only/.test(s),
    why: "Dealer edit must hydrate + PATCH media (UpdateListingBody.media)",
  },
  {
    id: "P-feed-safe-thumbnail",
    file: "artifacts/api-server/src/services/SearchService.ts",
    test: (s) =>
      /pickListingThumbnailUrl/.test(s) &&
      /thumbnailUrl: m\.thumbnailUrl/.test(s),
    why: "Feed enrich must never use raw video URL as card Image",
  },
  {
    id: "P-video-poster-client",
    file: "artifacts/banco-mobile/app/listings/create.tsx",
    test: (s) =>
      /thumbnail_url = posterUrl/.test(s) &&
      /VIDEO-POSTER/.test(s),
    why: "Create must set video thumbnail_url from sibling cover image",
  },
  {
    id: "P-poster-claim-assert",
    file: "artifacts/api-server/src/services/ListingService.ts",
    test: (s) =>
      /if \(m\.thumbnail_url\)/.test(s) &&
      /assertCallerMayUseUpload\(m\.thumbnail_url/.test(s),
    why: "thumbnail_url must be ownership-asserted like media.url",
  },
  {
    id: "P-expo-identity-canonical",
    file: "artifacts/banco-mobile/app.json",
    test: (s) => {
      try {
        const j = JSON.parse(s);
        return (
          j?.expo?.name === "BANCO" &&
          j?.expo?.scheme === "bancooom" &&
          j?.expo?.ios?.bundleIdentifier === "com.bancooom.app" &&
          j?.expo?.android?.package === "com.bancooom.app"
        );
      } catch {
        return false;
      }
    },
    why: "Display name BANCO + package com.bancooom.app + scheme bancooom",
  },
  {
    id: "P-no-facebook-oauth",
    file: "artifacts/banco-mobile/app/(tabs)/profile.tsx",
    test: (s) =>
      // Facebook is allowed ONLY when fail-closed behind tenant-enabled providers.
      // Absolute ban was outdated: Clerk can enable FB later without dead-end buttons.
      /oauth_facebook/.test(s) &&
      /socialProviders\.includes\("facebook"\)/.test(s) &&
      /oauth_google/.test(s) &&
      /useSocialProviders/.test(s),
    why: "Facebook OAuth must stay fail-closed via useSocialProviders (no ungated invent)",
  },
  {
    id: "P-no-fi-autocreate-onboarding",
    file: "artifacts/banco-mobile/app/business/onboarding.tsx",
    test: (s) =>
      /financial_institution/.test(s) &&
      !/createIntermediary/.test(s) &&
      !/createBank/.test(s),
    why: "FI onboarding must not auto-create intermediary orgs",
  },
  {
    id: "P-auth-reject-tombstone",
    file: "artifacts/api-server/src/middlewares/authGuard.ts",
    test: (s) =>
      /ACCOUNT_DELETED/.test(s) &&
      /deletedAt/.test(s) &&
      /findActiveUserByClerkId/.test(s),
    why: "requireAuth must reject soft-deleted accounts (not only dealer/admin guards)",
  },
  {
    id: "P-intent-before-psp",
    file: "artifacts/api-server/src/services/PaymentIntentService.ts",
    test: (s) => {
      const fn = s.slice(s.indexOf("export async function createTopupIntent"));
      const insertAt = fn.indexOf("insert(paymentIntents)");
      const chargeAt = fn.indexOf("createProviderCharge");
      return insertAt >= 0 && chargeAt >= 0 && insertAt < chargeAt;
    },
    why: "Durable payment_intents row must exist before PSP charge (no stranded money)",
  },
  {
    id: "P-plug-redirect-not-rewrite",
    file: "artifacts/banco-website/middleware.ts",
    test: (s) =>
      /NextResponse\.redirect\(url\)/.test(s) &&
      !/NextResponse\.rewrite\(url\)/.test(s) &&
      /REDIRECTED to \/maintenance/.test(s),
    why: "Plug-off must redirect (not rewrite) so SiteChrome pathname matches maintenance",
  },
  {
    id: "P-delete-revokes-fi-seats",
    file: "artifacts/api-server/src/services/UserService.ts",
    test: (s) =>
      /financingSeats/.test(s) &&
      /delete\(financingSeats\)/.test(s) &&
      /eq\(financingSeats\.userId/.test(s),
    why: "Account deletion must revoke FI seats (inbox PII)",
  },
  {
    id: "P-ad-budget-atomic",
    file: "artifacts/api-server/src/services/AdsService.ts",
    test: (s) =>
      /budget_exhausted/.test(s) &&
      /budgetSpent\}\)::numeric/.test(s) &&
      /budgetTotal\}\)::numeric/.test(s),
    why: "Ad impression spend must be conditional UPDATE (no concurrent overspend)",
  },
  {
    id: "P-fi-status-predicate",
    file: "artifacts/api-server/src/services/FinancingService.ts",
    test: (s) =>
      /statusChanging/.test(s) &&
      /eq\(financingRequests\.status, existing\.status\)/.test(s) &&
      /CONFLICT/.test(s),
    why: "FI request status updates must be conditional (no last-write-wins reopen)",
  },
  {
    id: "P-chat-media-assert-before-insert",
    file: "artifacts/api-server/src/services/ConversationService.ts",
    test: (s) => {
      const fn = s.slice(s.indexOf("export async function sendMessage"));
      const assertAt = fn.indexOf("assertCallerMayUseUpload");
      const insertAt = fn.indexOf("insert(messages)");
      return assertAt >= 0 && insertAt >= 0 && assertAt < insertAt;
    },
    why: "Chat media ownership must be proven before message insert (no durable stolen URL)",
  },
  {
    id: "P-company-brand-assert-before-write",
    file: "artifacts/api-server/src/services/CompanyService.ts",
    test: (s) => {
      const fn = s.slice(s.indexOf("export async function upsertMyCompanyProfile"));
      const assertAt = fn.indexOf("assertCallerMayUseUpload");
      const insertAt = fn.indexOf("insert(companyProfiles)");
      return assertAt >= 0 && insertAt >= 0 && assertAt < insertAt;
    },
    why: "Company brand media ownership must be proven before profile write",
  },
  {
    id: "P-notif-enum-car-import",
    file: "artifacts/api-server/src/validators/schemas.ts",
    test: (s) =>
      /NotificationTypeEnum[\s\S]*car_import/.test(s) &&
      /subscription_expiring/.test(s),
    why: "Response Zod enum must include car_import or GET /notifications 500s",
  },
  {
    id: "P-prefs-billing-mutable",
    file: "artifacts/api-server/src/services/ProfileService.ts",
    test: (s) =>
      /"booking"/.test(s) &&
      /"payment_success"/.test(s) &&
      /"car_import"/.test(s) &&
      /NOTIFICATION_TYPES/.test(s),
    why: "Settings must expose booking/billing/import mute categories",
  },
  {
    id: "P-delete-clerk-fail-soft",
    file: "artifacts/api-server/src/services/UserService.ts",
    test: (s) => {
      const fn = s.slice(s.indexOf("export async function deleteAccount"));
      return (
        /clerkClient\.users\.deleteUser/.test(fn) &&
        /returning success so client signs out/.test(fn) &&
        !/AUTH_PROVIDER_ERROR/.test(fn)
      );
    },
    why: "Clerk delete failure must not block client sign-out after privacy wipe",
  },
  {
    id: "P-push-response-dedupe",
    file: "artifacts/banco-mobile/hooks/usePushNotifications.tsx",
    test: (s) =>
      /handledResponseIds/.test(s) &&
      /getLastNotificationResponseAsync/.test(s) &&
      /addNotificationResponseReceivedListener/.test(s),
    why: "Cold-start push deep-link must dedupe last-response vs listener",
  },
  {
    id: "P-biometric-bg-only",
    file: "artifacts/banco-mobile/context/BiometricContext.tsx",
    test: (s) =>
      /state === "background"/.test(s) &&
      !/state === "background" \|\| state === "inactive"/.test(s) &&
      !/\(state === "background" \|\| state === "inactive"\)/.test(s),
    why: "Biometric must not re-lock on inactive (permission sheet storms)",
  },
  {
    id: "P-svg-icon-registry",
    file: "artifacts/banco-mobile/components/icons.tsx",
    test: (s) =>
      /lucide-react-native/.test(s) &&
      /react-native-svg/.test(s) &&
      !/from ["']@expo\/vector-icons["']/.test(s),
    why: "SVG icon registry must remain the sole runtime glyph source (no vector-font regression)",
  },
  {
    id: "P-push-unregister-scoped",
    file: "artifacts/api-server/src/services/PushService.ts",
    test: (s) =>
      /eq\(pushTokens\.userId, user\.id\)/.test(s) &&
      /delete\(pushTokens\)/.test(s),
    why: "unregisterPushToken must scope DELETE to caller userId (no cross-user wipe)",
  },
  {
    id: "P-message-notif-cooldown",
    file: "artifacts/api-server/src/services/ConversationService.ts",
    test: (s) =>
      /MESSAGE_NOTIF_COOLDOWN_MS/.test(s) &&
      /conversation_id/.test(s) &&
      /recentNotif/.test(s),
    why: "Message push/email must cooldown per thread (no chat storms)",
  },
  {
    id: "P-follower-notif-route",
    file: "artifacts/banco-mobile/lib/notificationRouting.ts",
    test: (s) =>
      /follower_id/.test(s) &&
      /\/notifications/.test(s) &&
      /open_notifications/.test(s),
    why: "Follower system pings must deep-link to notifications feed (not dead null)",
  },
  {
    id: "P-signout-unregister-first",
    file: "artifacts/banco-mobile/app/settings.tsx",
    test: (s) =>
      /unregisterCachedPushTokenBestEffort/.test(s) &&
      /confirmSignOut/.test(s),
    why: "Sign-out must unregister push while session is still valid",
  },
  {
    id: "P-account-deleted-signout",
    file: "artifacts/banco-mobile/app/_layout.tsx",
    test: (s) =>
      /setAuthFailureHandler/.test(s) &&
      /ACCOUNT_DELETED/.test(s) &&
      /signOut/.test(s),
    why: "Lingering JWT after soft-delete must force client sign-out",
  },
];

function main() {
  console.log("BANCO chain-integrity-gate (source markers only)\n");
  const failed = [];
  for (const c of CHECKS) {
    const full = path.join(ROOT, c.file);
    if (!fs.existsSync(full)) {
      failed.push({ id: c.id, detail: `missing file ${c.file}` });
      console.error(`[FAIL] ${c.id}: missing file ${c.file}`);
      continue;
    }
    const src = fs.readFileSync(full, "utf8");
    if (!c.test(src)) {
      failed.push({ id: c.id, detail: c.why });
      console.error(`[FAIL] ${c.id}: ${c.why}`);
    } else {
      console.log(`[PASS] ${c.id}`);
    }
  }
  console.log(`\n--- ${CHECKS.length - failed.length}/${CHECKS.length} passed ---`);
  if (failed.length) {
    console.error("\nChain broken — do not ship until markers are restored.");
    process.exit(1);
  }
  console.log("Chain integrity OK.");
}

main();
