// Materials Mini-App HOME layer — filters MUST stay intact on catalog.
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

test("materials route still /section/materials from Discover", () => {
  assert.match(discover, /materials:\s*"\/section\/materials"/);
});

test("materials is two-layer home then intact catalog", () => {
  assert.match(materials, /MaterialsHome/);
  assert.match(materials, /SectionSearchApp/);
  assert.match(materials, /useState<"home" \| "catalog">/);
  assert.match(materials, /onRequestClose/);
  assert.match(materials, /initialIndustrialType/);
  assert.match(materials, /openFiltersOnMount/);
  // CRITICAL: never erase filters by collapsing strips.
  assert.doesNotMatch(materials, /collapseInlineStrips/);
});

test("MaterialsHome is Stay-band hub (not half-screen, not Stay clone)", () => {
  assert.match(home, /testID="materials-hub-home"/);
  assert.match(home, /testID="materials-hub-hero"/);
  assert.match(home, /testID="materials-hub-services"/);
  assert.match(home, /testID="materials-hub-quick"/);
  assert.match(home, /testID="materials-hub-trending"/);
  assert.match(home, /testID="materials-hub-search"/);
  assert.match(home, /testID="materials-hub-filters"/);
  assert.match(home, /testID="materials-hub-caps"/);
  assert.match(home, /MiniAppBottomNav/);
  assert.match(home, /paddingBottom:\s*132/);
  assert.match(home, /banco-logo/);
  assert.match(home, /brandBlock/);
  assert.match(home, /searchPill/);
  assert.match(home, /taglineRule/);
  // Stay bands — search lives in header, not buried under scroll body alone.
  assert.match(home, /Band C — search pill/);
  assert.match(home, /Band D — capability tabs/);
  // No competing hero thumb / half-screen photo in brand band.
  assert.doesNotMatch(home, /heroThumb|heroWrap|minHeight:\s*132/);
  assert.doesNotMatch(home, /StaysHomeHeader|boom-logo/);
  assert.doesNotMatch(home, /href:\s*"\/import"/);
  assert.match(home, /\/business\/global-supply/);
  // No fake vanity counts from the mock.
  assert.doesNotMatch(home, /\b2450\b|\b18400\b|\b930\b/);
  // Icons from SVG registry only (no raw @expo/vector-icons).
  assert.match(home, /@\/components\/icons/);
  assert.doesNotMatch(home, /@expo\/vector-icons/);
  // Equipment must not duplicate Machines → machine seed.
  assert.match(
    home,
    /key:\s*"equipment"[\s\S]*?seed:\s*\{\s*industrialType:\s*"all",\s*openFilters:\s*true/,
  );
  assert.match(
    home,
    /key:\s*"machine"[\s\S]*?seed:\s*\{\s*industrialType:\s*"machine"\s*\}/,
  );
});

test("SectionSearchApp additive props do not hide materials strips", () => {
  assert.match(section, /onRequestClose\?:/);
  assert.match(section, /initialIndustrialType\?:/);
  assert.match(section, /openFiltersOnMount\?:/);
  assert.doesNotMatch(section, /collapseInlineStrips/);
  // All materials filter surfaces remain in source.
  assert.match(section, /testID="section-primary-strip"/);
  assert.match(section, /testID="materials-material-strip"/);
  assert.match(section, /testID="materials-origin-strip"/);
  assert.match(section, /testID=\{`industrial-type-\$\{item\.key\}`\}/);
  assert.match(section, /showOriginChrome = isMaterialsSection;/);
  assert.match(
    section,
    /showListingMode\s*=\s*!lockedEngine\s*&&\s*!isRealEstateSection/,
  );
});

test("materialsHub i18n en+ar", () => {
  assert.match(i18n, /materialsHub:\s*\{/);
  assert.match(i18n, /svcRawMaterials:\s*"Raw materials"/);
  assert.match(i18n, /svcRawMaterials:\s*"مواد خام"/);
  assert.match(i18n, /brandHub:\s*"Industrial Hub"/);
  assert.match(i18n, /brandHub:\s*"المركز الصناعي"/);
});

test("factories untouched", () => {
  const factories = fs.readFileSync(
    path.join(root, "app/section/factories.tsx"),
    "utf8",
  );
  assert.doesNotMatch(factories, /MaterialsHome|collapseInlineStrips/);
  assert.match(factories, /category="facilities"/);
});

test("recovery audit ledger exists for waves + materials", () => {
  const audit = fs.readFileSync(
    path.resolve(
      root,
      "../../reports/production-verification/61-WAVES-AND-MATERIALS-RECOVERY-AUDIT.md",
    ),
    "utf8",
  );
  assert.match(audit, /collapseInlineStrips/);
  assert.match(audit, /#16/);
  assert.match(audit, /#25/);
  assert.match(audit, /Tracks A/);
});
