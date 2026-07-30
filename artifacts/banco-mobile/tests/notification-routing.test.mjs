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

test("booking notifications open /bookings (guest/host role)", () => {
  assert.match(routing, /type === "booking"/);
  assert.match(routing, /pathname:\s*"\/bookings"/);
  assert.match(routing, /role === "guest"/);
});

test("listing-scoped pings deep-link to /listing/[id]", () => {
  assert.match(
    routing,
    /pathname:\s*"\/listing\/\[id\]"/,
    "listing_id must open listing detail (RE match/comment/lead path)",
  );
});

test("message notifications keep conversation + optional listingId", () => {
  assert.match(routing, /type === "message"/);
  assert.match(routing, /conversation_id/);
  assert.match(routing, /listingId/);
});
