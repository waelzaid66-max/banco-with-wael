/**
 * Materials Industrial Hub — missing Mini-App HOME layer.
 *
 * Owner brief (mm-precision):
 * - Visual structure from the Industrial Hub mock (services / quick / trending),
 *   adapted to BANCO native chrome.
 * - Header balanced like Boom Stay bands A–D (compact — NOT half the screen):
 *   top actions → brand wordmark → search pill with filters → capability tabs.
 * - Does NOT erase filters: catalog layer keeps every strip + FilterSheet.
 * - Icons ONLY from `@/components/icons` SVG registry (Android/Expo-safe).
 * - Scope: `/section/materials` only. No other section UI.
 */
import { Feather, MaterialCommunityIcons } from "@/components/icons";
import type { IndustrialType } from "@workspace/taxonomy/categories";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router, type Href } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";
import { MiniAppBottomNav } from "@/components/MiniAppBottomNav";
import { MATERIAL_TYPES } from "@/constants/listingCreateTaxonomy";
import { useI18n } from "@/context/LanguageContext";

const ACCENT = "#A82A1C";
const VOID = "#000000";
const PANEL = "#121212";
const ASH = "#8E8E93";
const HAIR = "rgba(255,255,255,0.14)";
const BANCO_LOGO = require("../../../assets/images/banco-logo.png");
const TREND_PHOTO = require("../../../assets/images/categories/materials.jpg");

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
type FeatherName = React.ComponentProps<typeof Feather>["name"];

export type MaterialsCatalogSeed = {
  industrialType: IndustrialType;
  material?: string | null;
  /** Open FilterSheet immediately on catalog (home Filters CTA). */
  openFilters?: boolean;
};

type ServiceTile =
  | {
      kind: "catalog";
      key: string;
      icon: MCIName;
      titleKey: string;
      seed: MaterialsCatalogSeed;
    }
  | {
      kind: "route";
      key: string;
      icon: MCIName;
      titleKey: string;
      href: Href;
    };

type QuickAction =
  | {
      kind: "catalog";
      key: string;
      icon: FeatherName | MCIName;
      iconSet: "feather" | "mci";
      labelKey: string;
      seed: MaterialsCatalogSeed;
    }
  | {
      kind: "route";
      key: string;
      icon: FeatherName | MCIName;
      iconSet: "feather" | "mci";
      labelKey: string;
      href: Href;
    };

/** Figma grid order — entry points, not filters. */
const SERVICES: ServiceTile[] = [
  {
    kind: "route",
    key: "factories",
    icon: "factory",
    titleKey: "materialsHub.svcFactories",
    href: "/section/factories",
  },
  {
    kind: "catalog",
    key: "machine",
    icon: "cog",
    titleKey: "materialsHub.svcMachines",
    seed: { industrialType: "machine" },
  },
  {
    kind: "catalog",
    key: "raw_material",
    icon: "package",
    titleKey: "materialsHub.svcRawMaterials",
    seed: { industrialType: "raw_material" },
  },
  {
    kind: "catalog",
    key: "production_line",
    icon: "cog-outline",
    titleKey: "materialsHub.svcProductionLines",
    seed: { industrialType: "production_line" },
  },
  {
    kind: "route",
    key: "suppliers",
    icon: "truck",
    titleKey: "materialsHub.svcSuppliers",
    href: "/business/suppliers",
  },
  {
    kind: "route",
    key: "import",
    icon: "earth",
    titleKey: "materialsHub.svcImport",
    href: "/business/global-supply",
  },
  {
    kind: "route",
    key: "export",
    icon: "ferry",
    titleKey: "materialsHub.svcExport",
    href: "/business/global-supply",
  },
  {
    // Honest: taxonomy has no separate "equipment" subtype — open full catalog
    // with FilterSheet so the shopper picks (distinct from Machines → machine).
    kind: "catalog",
    key: "equipment",
    icon: "package-variant-closed",
    titleKey: "materialsHub.svcEquipment",
    seed: { industrialType: "all", openFilters: true },
  },
];

const QUICK: QuickAction[] = [
  {
    kind: "route",
    key: "find-supplier",
    icon: "search",
    iconSet: "feather",
    labelKey: "materialsHub.qaFindSupplier",
    href: "/business/suppliers",
  },
  {
    kind: "catalog",
    key: "compare",
    icon: "trending-up",
    iconSet: "feather",
    labelKey: "materialsHub.qaCompare",
    seed: { industrialType: "all" },
  },
  {
    kind: "route",
    key: "rfq",
    icon: "file-text",
    iconSet: "feather",
    labelKey: "materialsHub.qaRequestQuote",
    href: "/rfq/create",
  },
  {
    kind: "route",
    key: "verified-factories",
    icon: "shield-check",
    iconSet: "mci",
    labelKey: "materialsHub.qaVerifiedFactories",
    href: "/section/factories",
  },
  {
    kind: "route",
    key: "auctions",
    icon: "gavel",
    iconSet: "mci",
    labelKey: "materialsHub.qaAuctions",
    href: "/industry",
  },
  {
    kind: "route",
    key: "my-rfqs",
    icon: "message-circle",
    iconSet: "feather",
    labelKey: "materialsHub.qaMyRfqs",
    href: "/rfq",
  },
];

/** Band D — capability tabs (Stay type-tabs pattern). No fake counts. */
const CAPABILITY_TABS: {
  key: string;
  labelKey: string;
  icon: MCIName;
  seed: MaterialsCatalogSeed;
}[] = [
  {
    key: "factories",
    labelKey: "materialsHub.statFactories",
    icon: "factory",
    seed: { industrialType: "all" },
  },
  {
    key: "machines",
    labelKey: "materialsHub.statMachines",
    icon: "cog",
    seed: { industrialType: "machine" },
  },
  {
    key: "materials",
    labelKey: "materialsHub.statMaterials",
    icon: "package",
    seed: { industrialType: "raw_material" },
  },
  {
    key: "markets",
    labelKey: "materialsHub.statMarkets",
    icon: "earth",
    seed: { industrialType: "all" },
  },
];

const TRENDING = [
  ...MATERIAL_TYPES.filter((m) =>
    ["steel", "copper", "aluminum", "chemical", "plastic_resin"].includes(m.value),
  ).map((m) => ({
    key: m.value,
    en: m.en,
    ar: m.ar,
    seed: {
      industrialType: "raw_material" as IndustrialType,
      material: m.value,
    },
  })),
  {
    key: "machinery",
    en: "Machinery",
    ar: "ماكينات",
    seed: { industrialType: "machine" as IndustrialType },
  },
];

type Props = {
  onOpenCatalog: (seed: MaterialsCatalogSeed) => void;
};

export function MaterialsHome({ onOpenCatalog }: Props) {
  const { t, isRTL } = useI18n();
  const insets = useSafeAreaInsets();
  // Same sanctioned safe-area rule as Stay / SectionSearchApp (never fake 67px).
  const topPad = Math.max(insets.top, Platform.OS === "web" ? 12 : 0);
  const rowDir = isRTL ? "row-reverse" : "row";
  const textAlign: "left" | "right" = isRTL ? "right" : "left";

  const tap = () => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
  };

  const openCatalog = (seed: MaterialsCatalogSeed) => {
    tap();
    onOpenCatalog(seed);
  };

  const openRoute = (href: Href) => {
    tap();
    router.push(href);
  };

  return (
    <View style={styles.root} testID="materials-hub-home">
      {/* Stay bands A–D — compact fixed header (not half-screen) */}
      <View style={[styles.headerRoot, { paddingTop: topPad - 1 }]} testID="materials-hub-hero">
        {/* Band A — top actions */}
        <View style={[styles.topBar, { flexDirection: rowDir }]}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconHit}
            hitSlop={12}
            testID="materials-hub-back"
            accessibilityRole="button"
          >
            <Feather
              name={isRTL ? "arrow-right" : "arrow-left"}
              size={22}
              color="#FFFFFF"
            />
          </Pressable>
          <View style={styles.topSpacer} />
        </View>

        {/* Band B — brand only (logo + hub wordmark + rules + powered-by) */}
        <View style={styles.brandBlock}>
          <View
            style={[
              styles.wordmarkRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <Image
              source={BANCO_LOGO}
              style={styles.wordmarkLogo}
              contentFit="contain"
              tintColor={ACCENT}
            />
            <AppText style={styles.wordmarkHub} numberOfLines={1}>
              {t("materialsHub.brandHub")}
            </AppText>
          </View>

          <View style={styles.taglineRow}>
            <View style={styles.taglineRule} />
            <AppText style={styles.tagline} numberOfLines={1}>
              {t("materialsHub.tagline")}
            </AppText>
            <View style={styles.taglineRule} />
          </View>

          <AppText style={styles.poweredLabel}>{t("materialsHub.poweredBy")}</AppText>
          <Image
            source={BANCO_LOGO}
            style={styles.poweredLogo}
            contentFit="contain"
            tintColor={ACCENT}
          />
        </View>

        {/* Band C — search pill; filters live inside (Stay pattern) */}
        <View style={[styles.searchPill, { flexDirection: rowDir }]}>
          <Pressable
            onPress={() => openCatalog({ industrialType: "all" })}
            style={[styles.searchMainHit, { flexDirection: rowDir }]}
            testID="materials-hub-search"
          >
            <Feather name="search" size={18} color={ACCENT} />
            <AppText
              style={[styles.searchPlaceholder, { textAlign }]}
              numberOfLines={1}
            >
              {t("materialsHub.searchPlaceholder")}
            </AppText>
          </Pressable>
          <Pressable
            onPress={() =>
              openCatalog({ industrialType: "all", openFilters: true })
            }
            hitSlop={8}
            style={styles.filterInSearch}
            testID="materials-hub-filters"
          >
            <Feather name="sliders" size={17} color={ACCENT} />
          </Pressable>
        </View>

        {/* Band D — capability tabs (honest seeds, no vanity counts) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabsRow, { flexDirection: rowDir }]}
          style={styles.tabsScroll}
          testID="materials-hub-caps"
        >
          {CAPABILITY_TABS.map((tab, index) => (
            <React.Fragment key={tab.key}>
              {index > 0 ? <View style={styles.tabDivider} /> : null}
              <Pressable
                onPress={() => {
                  if (tab.key === "factories") {
                    openRoute("/section/factories");
                    return;
                  }
                  openCatalog(tab.seed);
                }}
                style={styles.tabItem}
                testID={`materials-hub-cap-${tab.key}`}
              >
                <MaterialCommunityIcons name={tab.icon} size={20} color={ACCENT} />
                <AppText style={styles.tabLabel} numberOfLines={1}>
                  {t(tab.labelKey)}
                </AppText>
              </Pressable>
            </React.Fragment>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.sectionHead, { flexDirection: rowDir }]}>
          <AppText style={styles.sectionTitle}>{t("materialsHub.servicesTitle")}</AppText>
          <Pressable
            onPress={() => openCatalog({ industrialType: "all" })}
            hitSlop={8}
            testID="materials-hub-view-all"
          >
            <AppText style={styles.viewAll}>{t("materialsHub.viewAll")}</AppText>
          </Pressable>
        </View>

        <View
          style={[styles.grid, { flexDirection: isRTL ? "row-reverse" : "row" }]}
          testID="materials-hub-services"
        >
          {SERVICES.map((svc) => (
            <Pressable
              key={svc.key}
              onPress={() =>
                svc.kind === "catalog" ? openCatalog(svc.seed) : openRoute(svc.href)
              }
              testID={`materials-hub-svc-${svc.key}`}
              style={({ pressed }) => [
                styles.serviceCard,
                { opacity: pressed ? 0.88 : 1 },
              ]}
            >
              <View style={styles.serviceIcon}>
                <MaterialCommunityIcons name={svc.icon} size={22} color={ACCENT} />
              </View>
              <AppText style={styles.serviceTitle} numberOfLines={2}>
                {t(svc.titleKey)}
              </AppText>
            </Pressable>
          ))}
        </View>

        <AppText style={[styles.sectionTitle, { marginTop: 2 }]}>
          {t("materialsHub.quickTitle")}
        </AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.quickRow, { flexDirection: rowDir }]}
          testID="materials-hub-quick"
        >
          {QUICK.map((qa) => (
            <Pressable
              key={qa.key}
              onPress={() =>
                qa.kind === "catalog" ? openCatalog(qa.seed) : openRoute(qa.href)
              }
              style={styles.quickItem}
              testID={`materials-hub-qa-${qa.key}`}
            >
              <View style={styles.quickIcon}>
                {qa.iconSet === "mci" ? (
                  <MaterialCommunityIcons
                    name={qa.icon as MCIName}
                    size={18}
                    color="#FFFFFF"
                  />
                ) : (
                  <Feather name={qa.icon as FeatherName} size={18} color="#FFFFFF" />
                )}
              </View>
              <AppText style={styles.quickLabel} numberOfLines={2}>
                {t(qa.labelKey)}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[styles.sectionHead, { flexDirection: rowDir }]}>
          <AppText style={styles.sectionTitle}>{t("materialsHub.trendingTitle")}</AppText>
          <Pressable
            onPress={() => openCatalog({ industrialType: "raw_material" })}
            hitSlop={8}
          >
            <AppText style={styles.viewAll}>{t("materialsHub.viewAll")}</AppText>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.trendRow, { flexDirection: rowDir }]}
          testID="materials-hub-trending"
        >
          {TRENDING.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => openCatalog(item.seed)}
              style={styles.trendCard}
              testID={`materials-hub-trend-${item.key}`}
            >
              <Image source={TREND_PHOTO} style={styles.trendPhoto} contentFit="cover" />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.88)"]}
                style={StyleSheet.absoluteFill}
              />
              <AppText style={styles.trendLabel} numberOfLines={1}>
                {isRTL ? item.ar : item.en}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Fixed BANCO mini-app bottom nav — never replace with mock tabs. */}
      <MiniAppBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: VOID },
  headerRoot: {
    backgroundColor: VOID,
    paddingHorizontal: 16,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIR,
  },
  topBar: {
    alignItems: "center",
    minHeight: 40,
  },
  topSpacer: { flex: 1 },
  iconHit: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  brandBlock: {
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 6,
  },
  wordmarkRow: {
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  wordmarkLogo: {
    width: 108,
    height: 40,
  },
  wordmarkHub: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: ACCENT,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: "100%",
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  taglineRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: ACCENT,
    maxWidth: 56,
    opacity: 0.85,
  },
  tagline: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: ASH,
    textAlign: "center",
    flexShrink: 1,
  },
  poweredLabel: {
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    color: ASH,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  poweredLogo: {
    width: 72,
    height: 18,
  },
  searchPill: {
    height: 50,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: "center",
    gap: 10,
    backgroundColor: VOID,
    borderWidth: 1.5,
    borderColor: ACCENT,
  },
  searchMainHit: {
    flex: 1,
    alignItems: "center",
    gap: 10,
    minHeight: 48,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: ASH,
  },
  filterInSearch: {
    position: "relative",
    padding: 4,
  },
  tabsScroll: {
    marginTop: 8,
    marginHorizontal: -16,
  },
  tabsRow: {
    alignItems: "stretch",
    paddingHorizontal: 12,
    gap: 0,
    minHeight: 48,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    minWidth: 68,
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: ACCENT,
  },
  tabDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "center",
    height: 28,
    backgroundColor: HAIR,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 132,
    gap: 12,
  },
  sectionHead: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Cairo_700Bold",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  viewAll: {
    color: ACCENT,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  grid: {
    flexWrap: "wrap",
    gap: 10,
  },
  serviceCard: {
    flexBasis: "47%",
    flexGrow: 1,
    maxWidth: "48.5%",
    minHeight: 100,
    backgroundColor: PANEL,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(168,42,28,0.5)",
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  serviceIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(168,42,28,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceTitle: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontFamily: "Cairo_700Bold",
    textAlign: "center",
  },
  quickRow: { gap: 14, paddingVertical: 2, paddingEnd: 8 },
  quickItem: { width: 74, alignItems: "center", gap: 7 },
  quickIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: ACCENT,
    backgroundColor: "rgba(168,42,28,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    color: ACCENT,
    fontSize: 10.5,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    lineHeight: 13,
  },
  trendRow: { gap: 10, paddingEnd: 8 },
  trendCard: {
    width: 112,
    height: 84,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIR,
    justifyContent: "flex-end",
  },
  trendPhoto: { ...StyleSheet.absoluteFillObject, opacity: 0.8 },
  trendLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Cairo_700Bold",
    paddingHorizontal: 8,
    paddingBottom: 8,
    zIndex: 1,
  },
});
