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

// Wave 2 contract: car_import lifecycle pings deep-link into order detail when
// the server stamped import_order_id; older rows fall back to tracking.
test("car_import with import_order_id opens /import/order/[id]", () => {
  assert.match(routing, /type === "car_import"/);
  assert.match(routing, /import_order_id/);
  assert.match(routing, /\/import\/order\/\[id\]/);
  const carIdx = routing.indexOf('type === "car_import"');
  const detailIdx = routing.indexOf('/import/order/[id]', carIdx);
  const fallbackIdx = routing.indexOf("/import-tracking", carIdx);
  assert.ok(carIdx >= 0 && detailIdx > carIdx);
  assert.ok(fallbackIdx > detailIdx, "fallback tracking must follow the detail route");
});
