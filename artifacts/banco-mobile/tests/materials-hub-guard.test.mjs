// Materials Industrial Mini-App — Figma hub adapted to BANCO native chrome.
// Scope: /section/materials only.
//
// Run: pnpm --filter @workspace/banco-mobile run test:materials-hub

import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const materials = fs.readFileSync(
  path.join(root, "app/section/materials.tsx"),
  "utf8",
);
const home = fs.readFileSync(
  path.join(root, "components/search/materials/MaterialsHome.tsx"),
  "utf8",
);
const section = fs.readFileSync(
  path.join(root, "components/search/SectionSearchApp.tsx"),
  "utf8",
);
const i18n = fs.readFileSync(path.join(root, "constants/i18n.ts"), "utf8");
const discover = fs.readFileSync(
  path.join(root, "components/SearchDiscover.tsx"),
  "utf8",
);

test("materials route still registered path /section/materials from Discover", () => {
  assert.match(discover, /materials:\s*"\/section\/materials"/);
});

test("materials screen is two-layer: MaterialsHome then SectionSearchApp", () => {
  assert.match(materials, /MaterialsHome/);
  assert.match(materials, /SectionSearchApp/);
  assert.match(materials, /useState<"home" \| "catalog">/);
  assert.match(materials, /collapseInlineStrips/);
  assert.match(materials, /onRequestClose/);
  assert.match(materials, /initialIndustrialType/);
});

test("MaterialsHome matches industrial hub structure inside BANCO chrome", () => {
  assert.match(home, /testID="materials-hub-home"/);
  assert.match(home, /testID="materials-hub-hero"/);
  assert.match(home, /testID="materials-hub-services"/);
  assert.match(home, /testID="materials-hub-quick"/);
  assert.match(home, /testID="materials-hub-trending"/);
  assert.match(home, /testID="materials-hub-search"/);
  assert.match(home, /testID="materials-hub-filters"/);
  assert.match(home, /MiniAppBottomNav/);
  assert.match(home, /paddingBottom:\s*132/);
  assert.match(home, /key:\s*"raw_material"/);
  assert.match(home, /key:\s*"factories"/);
  // Not filter-first; not Stay; not car import hub.
  assert.doesNotMatch(home, /industrial-type-|materials-material-strip/);
  assert.doesNotMatch(home, /StaysHomeHeader|boom-logo/);
  assert.doesNotMatch(home, /href:\s*"\/import"/);
  assert.match(home, /\/business\/global-supply/);
  // Compact hero — Figma identity, not a giant new-app shell.
  assert.match(home, /minHeight:\s*132/);
  // No fake vanity counts from the mock.
  assert.doesNotMatch(home, /\b2450\b|\b18400\b|\b930\b/);
});

test("SectionSearchApp supports materials catalog close + strip collapse", () => {
  assert.match(section, /onRequestClose\?:/);
  assert.match(section, /collapseInlineStrips\?:/);
  assert.match(section, /initialIndustrialType\?:/);
  assert.match(section, /testID="materials-material-strip"/);
  assert.match(section, /testID="materials-origin-strip"/);
  assert.match(section, /!collapseInlineStrips/);
  assert.match(
    section,
    /showListingMode\s*=\s*!lockedEngine\s*&&\s*!isRealEstateSection/,
  );
});

test("materialsHub i18n exists en+ar", () => {
  assert.match(i18n, /materialsHub:\s*\{/);
  assert.match(i18n, /svcRawMaterials:\s*"Raw materials"/);
  assert.match(i18n, /svcRawMaterials:\s*"مواد خام"/);
  assert.match(i18n, /tagline:\s*"Industrial supply network/);
  assert.match(i18n, /tagline:\s*"شبكة توريد صناعي/);
  assert.match(i18n, /trendingTitle:/);
  assert.match(i18n, /searchPlaceholder:/);
});

test("factories section screen is untouched (no MaterialsHome)", () => {
  const factories = fs.readFileSync(
    path.join(root, "app/section/factories.tsx"),
    "utf8",
  );
  assert.doesNotMatch(factories, /MaterialsHome|collapseInlineStrips/);
  assert.match(factories, /category="facilities"/);
});
