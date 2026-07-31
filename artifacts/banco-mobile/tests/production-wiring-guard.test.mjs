// Production wiring wave — map latch + notification role + web geolocation.
// Additive guards; do not delete prior notification-routing tests.
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
const apiConv = fs.readFileSync(
  path.join(root, "../api-server/src/services/ConversationService.ts"),
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
