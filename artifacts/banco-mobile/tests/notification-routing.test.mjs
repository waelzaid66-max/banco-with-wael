import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const routing = fs.readFileSync(
  path.join(root, "lib/notificationRouting.ts"),
  "utf8",
);

test("follower system ping routes to /notifications (not null)", () => {
  assert.match(routing, /follower_id/);
  assert.match(routing, /\/notifications/);
  assert.match(routing, /open_notifications/);
});

test("listing_id still wins over follower fallback", () => {
  const listingIdx = routing.indexOf('typeof d.listing_id === "string"');
  const followerIdx = routing.indexOf('d.follower_id || d.open_notifications');
  assert.ok(listingIdx >= 0 && followerIdx > listingIdx);
});

test("message notifications forward stamped role (mark-sold chrome)", () => {
  assert.match(
    routing,
    /d\.role === "buyer" \|\| d\.role === "seller"/,
    "message route must forward server-stamped buyer|seller role",
  );
  assert.match(routing, /role:\s*d\.role/);
});

test("unknown / incomplete notification falls back to /notifications", () => {
  const fnStart = routing.indexOf("export function routeForNotification(");
  const fnEnd = routing.indexOf("export function routeForNotificationItem(");
  const body = routing.slice(fnStart, fnEnd);
  assert.match(body, /\/\/ NOTIF-09/);
  assert.match(body, /return "\/notifications";\s*\n\}/);
  assert.doesNotMatch(body, /return null;/);
});
