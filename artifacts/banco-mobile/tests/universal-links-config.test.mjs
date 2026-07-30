import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP_CONFIG = path.join(APP_ROOT, "app.config.ts");

test("app.config.ts wires Universal/App Links from env (not hardcoded)", () => {
  const src = fs.readFileSync(APP_CONFIG, "utf8");
  assert.match(src, /webAppLinkHost/);
  assert.match(src, /associatedDomains/);
  assert.match(src, /intentFilters/);
  assert.match(src, /EXPO_PUBLIC_ROUTER_ORIGIN/);
  assert.doesNotMatch(src, /applinks:banco\./i);
});

test("app.config.ts merges env host into app.json multi-host set (H2)", () => {
  const src = fs.readFileSync(APP_CONFIG, "utf8");
  // Must union hosts — never replace app.json associatedDomains / intentFilters wholesale.
  assert.match(src, /mergeAssociatedDomains/);
  assert.match(src, /mergeAndroidAppLinkFilters/);
  assert.match(src, /hostsFromIntentFilters/);
  assert.match(src, /config\.ios\?\.associatedDomains/);
  assert.match(src, /config\.android\?\.intentFilters/);
});

test("nginx + Dockerfile.web ship well-known AASA/assetlinks templates", () => {
  const root = path.resolve(APP_ROOT, "../..");
  const aasa = path.join(root, "deploy/coolify/well-known/apple-app-site-association");
  const assetlinks = path.join(root, "deploy/coolify/well-known/assetlinks.json");
  const nginx = fs.readFileSync(path.join(root, "deploy/coolify/nginx.conf"), "utf8");
  const dockerfile = fs.readFileSync(
    path.join(root, "deploy/coolify/Dockerfile.web"),
    "utf8",
  );
  assert.ok(fs.existsSync(aasa), "AASA template missing");
  assert.ok(fs.existsSync(assetlinks), "assetlinks template missing");
  assert.match(fs.readFileSync(aasa, "utf8"), /REPLACE_APPLE_TEAM_ID/);
  assert.match(fs.readFileSync(assetlinks, "utf8"), /REPLACE_PLAY_APP_SIGNING_SHA256/);
  assert.match(nginx, /\.well-known/);
  assert.match(dockerfile, /well-known\/apple-app-site-association/);
  assert.match(dockerfile, /well-known\/assetlinks\.json/);
});

test("custom scheme bancooom remains in app.json", () => {
  const json = JSON.parse(fs.readFileSync(path.join(APP_ROOT, "app.json"), "utf8"));
  assert.equal(json.expo.scheme, "bancooom");
});

test("Expo product identity stays canonical (BANCO / com.bancooom.app)", () => {
  const json = JSON.parse(fs.readFileSync(path.join(APP_ROOT, "app.json"), "utf8"));
  assert.equal(json.expo.name, "BANCO");
  assert.equal(json.expo.ios?.bundleIdentifier, "com.bancooom.app");
  assert.equal(json.expo.android?.package, "com.bancooom.app");
  // Slug may stay bancoboom for EAS project continuity — scheme/package are SoT.
  assert.equal(json.expo.scheme, "bancooom");
});
