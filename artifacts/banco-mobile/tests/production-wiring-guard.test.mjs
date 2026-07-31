// Production wiring wave — map latch + notification role + web geolocation
// + wave-2 messenger/map/notif completions (MSG-06/07/09/10, MAP-03/04/06,
// NOTIF-03/09). Additive guards; do not delete prior tests.
//
// Run: node --test tests/production-wiring-guard.test.mjs

import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const section = fs.readFileSync(
  path.join(root, "components/search/SectionSearchApp.tsx"),
  "utf8",
);
const routing = fs.readFileSync(
  path.join(root, "lib/notificationRouting.ts"),
  "utf8",
);
const mapWeb = fs.readFileSync(
  path.join(root, "components/search/SearchResultsMap.web.tsx"),
  "utf8",
);
const mapHtml = fs.readFileSync(
  path.join(root, "components/search/mapHtml.ts"),
  "utf8",
);
const mapNative = fs.readFileSync(
  path.join(root, "components/search/SearchResultsMap.tsx"),
  "utf8",
);
const thread = fs.readFileSync(path.join(root, "app/messages/[id].tsx"), "utf8");
const layout = fs.readFileSync(path.join(root, "app/_layout.tsx"), "utf8");
const apiConv = fs.readFileSync(
  path.join(root, "../api-server/src/services/ConversationService.ts"),
  "utf8",
);
const apiSearch = fs.readFileSync(
  path.join(root, "../api-server/src/services/SearchService.ts"),
  "utf8",
);

test("section map latch opens on results without requiring page pins", () => {
  assert.match(section, /if \(inResultsView\) \{\s*setMapMode\(true\)/);
  assert.doesNotMatch(
    section,
    /if \(inResultsView && hasPagePins\)/,
    "Discover ?map=1 must not wait for hasPagePins",
  );
});

test("message notifications forward stamped role (mark-sold chrome)", () => {
  assert.match(
    routing,
    /d\.role === "buyer" \|\| d\.role === "seller"/,
    "message route must forward server-stamped buyer|seller role",
  );
  assert.match(routing, /role:\s*d\.role/);
});

test("ConversationService stamps recipient role on message notification", () => {
  assert.match(
    apiConv,
    /role:\s*isBuyer \? "seller" : "buyer"/,
    "push/in-app message data must stamp recipient role",
  );
  assert.match(apiConv, /listing_id:\s*conv\.listingId/);
});

test("web SearchResultsMap enables iframe geolocation for locate", () => {
  assert.match(
    mapWeb,
    /allow="geolocation"/,
    "web map iframe must allow geolocation (LocateControl parity)",
  );
});

test("MSG-06 deliver commits on POST before soft refetch", () => {
  assert.match(thread, /setQueryData/);
  assert.match(thread, /void query\.refetch\(\)\.catch/);
  const deliverAt = thread.indexOf("const deliver = useCallback");
  const deliver = thread.slice(deliverAt, deliverAt + 1800);
  assert.match(deliver, /setPending\(\(p\) => p\.filter/);
  assert.ok(
    deliver.indexOf("setPending((p) => p.filter") <
      deliver.indexOf("void query.refetch().catch"),
    "pending must drop before soft refetch so retry cannot duplicate",
  );
});

test("MSG-07 thread polls with limit page size", () => {
  assert.match(thread, /limit:\s*THREAD_PAGE/);
  assert.match(apiConv, /opts:\s*\{\s*limit\?:/);
  assert.match(apiConv, /Math\.min\(Math\.floor\(opts\.limit\),\s*1000\)/);
});

test("MSG-09 thread surfaces isError with retry", () => {
  assert.match(thread, /query\.isError && !query\.data/);
  assert.match(thread, /testID="thread-retry"/);
});

test("MSG-10 pending preserves reply_to_id for retry", () => {
  assert.match(thread, /reply_to_id\?: string/);
  assert.match(
    thread,
    /\.\.\.\(m\.reply_to_id \? \{\s*reply_to_id:\s*m\.reply_to_id\s*\} : \{\}\)/,
  );
});

test("MAP-03 near-me radius circle restored in mapHtml + hosts", () => {
  assert.match(mapHtml, /near\?: \{ lat: number; lng: number; radiusKm: number \}/);
  assert.match(mapHtml, /L\.circle\(\[/);
  assert.match(mapNative, /criteria\.nearMeEnabled/);
  assert.match(mapNative, /radiusKm:\s*criteria\.nearRadiusKm/);
  assert.match(mapWeb, /criteria\.nearMeEnabled/);
});

test("MAP-04 mapClusters emit price_display / is_bookable for singles", () => {
  assert.match(apiSearch, /price_display/);
  assert.match(apiSearch, /is_bookable/);
  assert.match(mapNative, /c\.price_display \?\? priceById/);
  assert.match(mapWeb, /c\.price_display \?\? priceById/);
});

test("MAP-06 web locate_error shows Alert", () => {
  assert.match(mapWeb, /locate_error/);
  assert.match(mapWeb, /Alert\.alert/);
  assert.match(mapWeb, /search\.locateFailedTitle/);
});

test("NOTIF-03 soft ACCOUNT_DELETED unregisters push before signOut", () => {
  assert.match(layout, /ACCOUNT_DELETED/);
  assert.match(layout, /unregisterCachedPushTokenBestEffort/);
});

test("NOTIF-09 unknown notification routes to /notifications", () => {
  const fnStart = routing.indexOf("export function routeForNotification(");
  const fnEnd = routing.indexOf("export function routeForNotificationItem(");
  const body = routing.slice(fnStart, fnEnd);
  assert.match(body, /\/\/ NOTIF-09/);
  assert.match(body, /return "\/notifications";\s*\n\}/);
  assert.doesNotMatch(body, /return null;/);
});

// ── Wave 3 ──────────────────────────────────────────────────────────────

const nearMe = fs.readFileSync(path.join(root, "lib/nearMe.ts"), "utf8");
const inbox = fs.readFileSync(path.join(root, "app/(tabs)/messages.tsx"), "utf8");
const importOrder = fs.readFileSync(
  path.join(root, "app/import/order/[id].tsx"),
  "utf8",
);
const importHub = fs.readFileSync(path.join(root, "app/import/index.tsx"), "utf8");
const pushHook = fs.readFileSync(
  path.join(root, "hooks/usePushNotifications.tsx"),
  "utf8",
);
const editListing = fs.readFileSync(
  path.join(root, "app/listings/edit/[id].tsx"),
  "utf8",
);
const emailSvc = fs.readFileSync(
  path.join(root, "../api-server/src/services/EmailService.ts"),
  "utf8",
);
const notifSvc = fs.readFileSync(
  path.join(root, "../api-server/src/services/NotificationService.ts"),
  "utf8",
);
const pushSvc = fs.readFileSync(
  path.join(root, "../api-server/src/services/PushService.ts"),
  "utf8",
);
const home = fs.readFileSync(path.join(root, "app/(tabs)/index.tsx"), "utf8");

test("MSG-07b thread can load older pages via before=", () => {
  assert.match(thread, /getMessages\(/);
  assert.match(thread, /before:\s*oldest\.id/);
  assert.match(thread, /testID="thread-load-older"/);
});

test("MSG-11 email CTA uses website workspace messages path", () => {
  assert.match(emailSvc, /\/workspace\/messages\/\$\{args\.conversationId\}/);
  assert.doesNotMatch(
    emailSvc,
    /appUrl\(`\/messages\/\$\{args\.conversationId\}`\)/,
  );
});

test("MSG-12 import support creates ticket (not generic inbox)", () => {
  assert.match(importOrder, /createSupportTicket/);
  assert.match(importOrder, /category:\s*"import_order"/);
  assert.doesNotMatch(importOrder, /router\.push\("\/messages"/);
  assert.match(importHub, /href:\s*"support"/);
  assert.match(importHub, /createSupportTicket/);
});

test("MSG-15 inbox empty has browse CTA", () => {
  assert.match(inbox, /testID="messages-browse"/);
  assert.match(inbox, /messages\.emptyCta/);
});

test("MAP-05 web near-me uses browser geolocation", () => {
  assert.match(nearMe, /navigator\.geolocation\.getCurrentPosition/);
  assert.doesNotMatch(nearMe, /if \(Platform\.OS === "web"\) return null;/);
});

test("MAP-09 edit listing wires MapPinPicker + lat/lng patch", () => {
  assert.match(editListing, /MapPinPicker/);
  assert.match(editListing, /testID="edit-pin-tools"/);
  assert.match(editListing, /latitude:\s*pin\.lat/);
});

test("NOTIF-05 unread is full count not page-capped", () => {
  assert.match(notifSvc, /count\(\*\)::int/);
  assert.match(home, /meta\?\.total/);
});

test("NOTIF-06 push payload includes badge", () => {
  assert.match(pushSvc, /badge,/);
});

test("NOTIF-07 push registration retries with backoff", () => {
  assert.match(pushHook, /const delays = \[0, 2000, 5000, 15000\]/);
});
