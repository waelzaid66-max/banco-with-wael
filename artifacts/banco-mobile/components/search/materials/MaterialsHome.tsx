/**
 * Materials Industrial Hub — Mini-App HOME (layer 1).
 *
 * Figma target (B-CORE Industrial Hub) adapted to BANCO native chrome:
 * - Section back header (not mock hamburger/bell)
 * - MiniAppBottomNav (same 5 app tabs — never mock Marketplace/+ tabs)
 * - Dark industrial home identity (materials brick-red) — not Stay black shell
 * - Filters are NOT the page; catalog layer owns FilterSheet
 *
 * Presentational + navigation only. No search-engine / API changes.
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

/** Materials section accent — BANCO red-family (sectionTheme.materials). */
const ACCENT = "#A82A1C";
const VOID = "#0B0B0B";
const PANEL = "#141414";
const HAIR = "rgba(255,255,255,0.12)";
const MUTED = "rgba(255,255,255,0.72)";
const HERO_PHOTO = require("../../../assets/images/categories/materials.jpg");

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
type FeatherName = React.ComponentProps<typeof Feather>["name"];

export type MaterialsCatalogSeed = {
  industrialType: IndustrialType;
  material?: string | null;
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
      icon: FeatherName;
      labelKey: string;
      seed: MaterialsCatalogSeed;
    }
  | {
      kind: "route";
      key: string;
      icon: FeatherName;
      labelKey: string;
      href: Href;
    };

/** Order mirrors the owner Figma service grid. */
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
    kind: "catalog",
    key: "equipment",
    icon: "package-variant-closed",
    titleKey: "materialsHub.svcEquipment",
    seed: { industrialType: "machine" },
  },
];

/** Real destinations only — no industrial-auctions dead end. */
const QUICK: QuickAction[] = [
  {
    kind: "route",
    key: "find-supplier",
    icon: "search",
    labelKey: "materialsHub.qaFindSupplier",
    href: "/business/suppliers",
  },
  {
    kind: "catalog",
    key: "compare",
    icon: "trending-up",
    labelKey: "materialsHub.qaCompare",
    seed: { industrialType: "all" },
  },
  {
    kind: "route",
    key: "rfq",
    icon: "file-text",
    labelKey: "materialsHub.qaRequestQuote",
    href: "/rfq/create",
  },
  {
    kind: "route",
    key: "factories",
    icon: "home",
    labelKey: "materialsHub.qaVerifiedFactories",
    href: "/section/factories",
  },
  {
    kind: "route",
    key: "my-rfqs",
    icon: "list",
    labelKey: "materialsHub.qaMyRfqs",
    href: "/rfq",
  },
];

/** Capability chips — labels only, never fake counts from the mock. */
const STATS: { key: string; labelKey: string; icon: FeatherName }[] = [
  { key: "factories", labelKey: "materialsHub.statFactories", icon: "home" },
  { key: "machines", labelKey: "materialsHub.statMachines", icon: "settings" },
  { key: "materials", labelKey: "materialsHub.statMaterials", icon: "package" },
  { key: "markets", labelKey: "materialsHub.statMarkets", icon: "globe" },
];

/** Trending strip — real MATERIAL_TYPES + machines entry. */
const TRENDING: {
  key: string;
  en: string;
  ar: string;
  seed: MaterialsCatalogSeed;
}[] = [
  ...MATERIAL_TYPES.filter((m) =>
    ["steel", "copper", "aluminum", "chemical", "plastic_resin", "cement"].includes(
      m.value,
    ),
  ).map((m) => ({
    key: m.value,
    en: m.en,
    ar: m.ar,
    seed: { industrialType: "raw_material" as IndustrialType, material: m.value },
  })),
  {
    key: "machinery",
    en: "Machinery",
    ar: "ماكينات",
    seed: { industrialType: "machine" },
  },
];

type Props = {
  onOpenCatalog: (seed: MaterialsCatalogSeed) => void;
};

export function MaterialsHome({ onOpenCatalog }: Props) {
  const { t, isRTL } = useI18n();
  const insets = useSafeAreaInsets();
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
    <View style={[styles.root, { backgroundColor: VOID }]} testID="materials-hub-home">
      {/* BANCO mini-app header — accounts for safe area; not mock chrome. */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 10,
            flexDirection: rowDir,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityRole="button"
          testID="materials-hub-back"
        >
          <Feather
            name={isRTL ? "arrow-right" : "arrow-left"}
            size={22}
            color="#FFFFFF"
          />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <AppText style={[styles.headerTitle, { textAlign }]} numberOfLines={1}>
            {t("home.categories.materials")}
          </AppText>
          <AppText style={[styles.headerSub, { textAlign }]} numberOfLines={1}>
            {t("materialsHub.headerSub")}
          </AppText>
        </View>
        <Pressable
          onPress={() => openCatalog({ industrialType: "all" })}
          style={[styles.iconBtn, styles.iconBtnFill]}
          testID="materials-hub-open-catalog"
          accessibilityLabel={t("materialsHub.browseCatalog")}
        >
          <Feather name="search" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Compact industrial hero — Figma identity block, not a giant banner. */}
        <View style={styles.heroWrap} testID="materials-hub-hero">
          <LinearGradient
            colors={["#1A0806", "#120605", "#0B0B0B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <Image source={HERO_PHOTO} style={styles.heroPhoto} contentFit="cover" />
            <View style={styles.heroScrim} />
            <View style={[styles.heroBrandRow, { flexDirection: rowDir }]}>
              <View style={styles.heroMark}>
                <MaterialCommunityIcons name="package" size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <AppText style={[styles.heroBrand, { textAlign }]} numberOfLines={1}>
                  {t("materialsHub.brand")}
                </AppText>
                <AppText style={[styles.heroTagline, { textAlign }]} numberOfLines={2}>
                  {t("materialsHub.tagline")}
                </AppText>
              </View>
            </View>
            <View style={[styles.statsRow, { flexDirection: rowDir }]}>
              {STATS.map((s) => (
                <View key={s.key} style={styles.statChip}>
                  <Feather name={s.icon} size={12} color={ACCENT} />
                  <AppText style={styles.statLabel}>{t(s.labelKey)}</AppText>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Industrial Services */}
        <View style={[styles.sectionHead, { flexDirection: rowDir }]}>
          <AppText style={[styles.sectionTitle, { textAlign }]}>
            {t("materialsHub.servicesTitle")}
          </AppText>
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
              accessibilityRole="button"
              testID={`materials-hub-svc-${svc.key}`}
              style={({ pressed }) => [
                styles.serviceCard,
                { opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <View style={styles.serviceIcon}>
                <MaterialCommunityIcons name={svc.icon} size={24} color={ACCENT} />
              </View>
              <AppText style={styles.serviceTitle} numberOfLines={2}>
                {t(svc.titleKey)}
              </AppText>
            </Pressable>
          ))}
        </View>

        {/* Quick Actions */}
        <AppText style={[styles.sectionTitle, { textAlign, marginTop: 4 }]}>
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
                <Feather name={qa.icon} size={18} color="#FFFFFF" />
              </View>
              <AppText style={styles.quickLabel} numberOfLines={2}>
                {t(qa.labelKey)}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>

        {/* Trending Categories — MATERIAL_TYPES seeds into catalog */}
        <View style={[styles.sectionHead, { flexDirection: rowDir }]}>
          <AppText style={[styles.sectionTitle, { textAlign }]}>
            {t("materialsHub.trendingTitle")}
          </AppText>
          <Pressable onPress={() => openCatalog({ industrialType: "raw_material" })} hitSlop={8}>
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
              <Image source={HERO_PHOTO} style={styles.trendPhoto} contentFit="cover" />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.85)"]}
                style={styles.trendScrim}
              />
              <AppText style={styles.trendLabel} numberOfLines={1}>
                {isRTL ? item.ar : item.en}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>

        {/* Search + Filters — opens catalog layer (filters live in FilterSheet). */}
        <View style={[styles.searchRow, { flexDirection: rowDir }]}>
          <Pressable
            onPress={() => openCatalog({ industrialType: "all" })}
            style={[styles.searchField, { flexDirection: rowDir }]}
            testID="materials-hub-search"
          >
            <Feather name="search" size={18} color={ACCENT} />
            <AppText style={styles.searchPlaceholder} numberOfLines={1}>
              {t("materialsHub.searchPlaceholder")}
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => openCatalog({ industrialType: "all" })}
            style={[styles.filtersBtn, { flexDirection: rowDir }]}
            testID="materials-hub-filters"
          >
            <Feather name="sliders" size={16} color={ACCENT} />
            <AppText style={styles.filtersText}>{t("materialsHub.filters")}</AppText>
          </Pressable>
        </View>
      </ScrollView>

      {/* Fixed BANCO mini-app bottom nav — never replaced by mock tabs. */}
      <MiniAppBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIR,
    gap: 4,
    backgroundColor: VOID,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnFill: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
  },
  headerTitleWrap: { flex: 1, minWidth: 0, gap: 2 },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
  },
  headerSub: {
    color: MUTED,
    fontSize: 11.5,
    fontFamily: "Inter_400Regular",
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    // Clears MiniAppBottomNav capsule (same contract as import hub).
    paddingBottom: 132,
    gap: 14,
  },
  heroWrap: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIR,
  },
  heroGradient: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    minHeight: 132,
  },
  heroPhoto: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.28,
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8,2,2,0.55)",
  },
  heroBrandRow: {
    alignItems: "center",
    gap: 10,
    zIndex: 1,
  },
  heroMark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(168,42,28,0.35)",
    borderWidth: 1,
    borderColor: "rgba(168,42,28,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBrand: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Cairo_700Bold",
    letterSpacing: 0.2,
  },
  heroTagline: {
    color: MUTED,
    fontSize: 12.5,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  statsRow: {
    flexWrap: "wrap",
    gap: 8,
    zIndex: 1,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIR,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11.5,
    fontFamily: "Inter_600SemiBold",
  },
  sectionHead: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Cairo_700Bold",
    letterSpacing: 0.4,
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
    minHeight: 104,
    backgroundColor: PANEL,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(168,42,28,0.45)",
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(168,42,28,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Cairo_700Bold",
    textAlign: "center",
  },
  quickRow: {
    gap: 16,
    paddingVertical: 2,
    paddingEnd: 8,
  },
  quickItem: {
    width: 76,
    alignItems: "center",
    gap: 8,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(168,42,28,0.12)",
  },
  quickLabel: {
    color: ACCENT,
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    lineHeight: 14,
  },
  trendRow: {
    gap: 10,
    paddingEnd: 8,
  },
  trendCard: {
    width: 118,
    height: 86,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: PANEL,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIR,
    justifyContent: "flex-end",
  },
  trendPhoto: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.75,
  },
  trendScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  trendLabel: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontFamily: "Cairo_700Bold",
    paddingHorizontal: 10,
    paddingBottom: 8,
    zIndex: 1,
  },
  searchRow: {
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  searchField: {
    flex: 1,
    alignItems: "center",
    gap: 10,
    backgroundColor: PANEL,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIR,
    paddingHorizontal: 14,
    paddingVertical: 13,
    minHeight: 48,
  },
  searchPlaceholder: {
    flex: 1,
    color: MUTED,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  filtersBtn: {
    alignItems: "center",
    gap: 6,
    backgroundColor: PANEL,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(168,42,28,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  filtersText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontFamily: "Inter_600SemiBold",
  },
});
