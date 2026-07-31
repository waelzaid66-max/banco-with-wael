// B-CORE materials header — chrome inside SectionSearchApp, filters compressed not erased.
// Run: node --test tests/materials-core-guard.test.mjs

import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const materials = fs.readFileSync(path.join(root, "app/section/materials.tsx"), "utf8");
const header = fs.readFileSync(
  path.join(root, "components/search/materials/MaterialsHomeHeader.tsx"),
  "utf8",
);
const section = fs.readFileSync(
  path.join(root, "components/search/SectionSearchApp.tsx"),
  "utf8",
);
const filter = fs.readFileSync(
  path.join(root, "components/search/FilterSheet.tsx"),
  "utf8",
);
const i18n = fs.readFileSync(path.join(root, "constants/i18n.ts"), "utf8");

test("materials shell stays thin SectionSearchApp (no fake hub layer)", () => {
  assert.match(materials, /SectionSearchApp/);
  assert.doesNotMatch(materials, /MaterialsHome[^H]|useState<"home"/);
  assert.doesNotMatch(materials, /collapseInlineStrips/);
});

test("MaterialsHomeHeader is B-CORE Stay-band chrome", () => {
  assert.match(header, /testID="materials-core-header"/);
  assert.match(header, /testID="materials-core-brand"/);
  assert.match(header, /b-mark/);
  assert.match(header, /materialsBrand/);
  assert.match(header, /materialsHubLabel/);
  assert.match(header, /section-filter-toggle/);
  assert.match(header, /testID="materials-type-strip"/);
  assert.match(header, /MiniAppBottomNav|POWERED|banco-logo/);
  assert.doesNotMatch(header, /2450|18400|930\b/);
  assert.doesNotMatch(header, /@expo\/vector-icons/);
  assert.match(header, /@\/components\/icons/);
  // Large industrial icons
  assert.match(header, /size=\{22\}/);
});

test("SectionSearchApp mounts materials header only for materials", () => {
  assert.match(section, /MaterialsHomeHeader/);
  assert.match(section, /isMaterialsSection \? \(/);
  assert.match(section, /!isMaterialsSection \? \(/);
  assert.doesNotMatch(section, /collapseInlineStrips/);
  // Bottom nav stays
  assert.match(section, /MiniAppBottomNav/);
  // Type tabs keep industrial testIDs
  assert.match(header, /testID=\{`industrial-type-\$\{tab\.value\}`\}/);
  // Commodity + origin still in FilterSheet (not erased)
  assert.match(filter, /showMaterial/);
  assert.match(filter, /showOrigin/);
  assert.match(filter, /filter-material/);
  assert.match(filter, /filter-listing-mode-/);
});

test("materials B-CORE i18n en+ar", () => {
  assert.match(i18n, /materialsBrand:\s*"CORE"/);
  assert.match(i18n, /materialsHubLabel:\s*"Industrial Hub"/);
  assert.match(i18n, /materialsHubLabel:\s*"المركز الصناعي"/);
  assert.match(i18n, /materialsWhere:/);
});

test("factories and stay untouched by materials header", () => {
  const factories = fs.readFileSync(
    path.join(root, "app/section/factories.tsx"),
    "utf8",
  );
  assert.doesNotMatch(factories, /MaterialsHomeHeader/);
  assert.match(factories, /category="facilities"/);
});
