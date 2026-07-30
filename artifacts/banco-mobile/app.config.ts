import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Deep-link / universal-link origin for expo-router static rendering.
 *
 * Prefer EXPO_PUBLIC_ROUTER_ORIGIN, then EXPO_PUBLIC_PUBLIC_APP_URL (production
 * app host). Last resort is replit.com for local Expo Go on Replit only —
 * Coolify/EAS must set a real origin or web export canonical links break.
 */
const routerOrigin =
  process.env.EXPO_PUBLIC_ROUTER_ORIGIN?.trim() ||
  process.env.EXPO_ROUTER_ORIGIN?.trim() ||
  process.env.EXPO_PUBLIC_PUBLIC_APP_URL?.trim() ||
  "https://replit.com/";

/**
 * HTTPS app-link host for Universal Links (iOS) and App Links (Android).
 * Driven only by operator env — never hardcoded. Omitted when unset or replit.com.
 */
function webAppLinkHost(): string | null {
  for (const raw of [
    process.env.EXPO_PUBLIC_PUBLIC_APP_URL,
    process.env.EXPO_PUBLIC_ROUTER_ORIGIN,
    process.env.EXPO_ROUTER_ORIGIN,
  ]) {
    const t = raw?.trim();
    if (!t) continue;
    try {
      const url = t.includes("://") ? new URL(t) : new URL(`https://${t}`);
      const host = url.hostname;
      if (!host || host === "replit.com" || host.endsWith(".replit.dev")) {
        continue;
      }
      return host;
    } catch {
      /* try next */
    }
  }
  return null;
}

const webHost = webAppLinkHost();

function withRouterOrigin(plugins: ExpoConfig["plugins"]): ExpoConfig["plugins"] {
  return (plugins ?? []).map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === "expo-router") {
      const opts =
        typeof plugin[1] === "object" && plugin[1] !== null ? plugin[1] : {};
      return ["expo-router", { ...opts, origin: routerOrigin }];
    }
    return plugin;
  });
}

type AndroidIntentFilter = NonNullable<
  NonNullable<ExpoConfig["android"]>["intentFilters"]
>[number];

/**
 * Collect HTTPS hosts already declared on Android intent filters (from app.json).
 * Used so an env-driven primary host ADDS to the multi-host set instead of
 * wiping banco.deals / banco.autos (H2 regression).
 */
function hostsFromIntentFilters(
  filters: NonNullable<ExpoConfig["android"]>["intentFilters"] | undefined,
): string[] {
  const hosts: string[] = [];
  for (const filter of filters ?? []) {
    const data = filter.data;
    const entries = Array.isArray(data) ? data : data ? [data] : [];
    for (const entry of entries) {
      if (
        entry &&
        typeof entry === "object" &&
        "host" in entry &&
        typeof entry.host === "string" &&
        entry.host.length > 0
      ) {
        hosts.push(entry.host);
      }
    }
  }
  return hosts;
}

/**
 * Merge app.json multi-host App Links with the env primary host.
 * Path prefixes stay production-safe (/l, /listing) for every host in the union.
 */
function mergeAndroidAppLinkFilters(
  existing: NonNullable<ExpoConfig["android"]>["intentFilters"] | undefined,
  primaryHost: string,
): AndroidIntentFilter[] {
  const hosts = Array.from(
    new Set([...hostsFromIntentFilters(existing), primaryHost]),
  );
  return [
    {
      action: "VIEW",
      autoVerify: true,
      data: hosts.flatMap((host) => [
        { scheme: "https", host, pathPrefix: "/l" },
        { scheme: "https", host, pathPrefix: "/listing" },
      ]),
      category: ["BROWSABLE", "DEFAULT"],
    },
  ];
}

function mergeAssociatedDomains(
  existing: string[] | undefined,
  primaryHost: string,
): string[] {
  return Array.from(
    new Set([
      ...(existing ?? []),
      `applinks:${primaryHost}`,
      `webcredentials:${primaryHost}`,
    ]),
  );
}

// Canonical dynamic-config pattern: `config` IS the parsed app.json, so the
// static store config (bundle ids, permissions, icons) stays the single source
// of truth and this file only layers the env-driven link/origin bits on top.
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  plugins: withRouterOrigin(config.plugins),
  // Web static export served under a path prefix (e.g. /banco-mobile/ on the
  // Replit deployment). Set ONLY by scripts/build.js during `expo export -p web`;
  // absent in dev and native builds so nothing changes there.
  // Restored from bancoo production handoff (C-WEB-BASE) — evidence: white-screen
  // / QR-only browser when web export path prefix is missing.
  ...(process.env.EXPO_WEB_BASE_URL
    ? {
        experiments: {
          ...config.experiments,
          baseUrl: process.env.EXPO_WEB_BASE_URL.replace(/\/+$/, ""),
        },
      }
    : {}),
  ios: {
    ...config.ios,
    ...(webHost
      ? {
          associatedDomains: mergeAssociatedDomains(
            config.ios?.associatedDomains,
            webHost,
          ),
        }
      : {}),
  },
  android: {
    ...config.android,
    ...(webHost
      ? {
          intentFilters: mergeAndroidAppLinkFilters(
            config.android?.intentFilters,
            webHost,
          ),
        }
      : {}),
  },
});
