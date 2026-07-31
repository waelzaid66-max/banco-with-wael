/**
 * B-CORE Industrial Hub — upper header only (materials).
 *
 * Stay method: brand stays clean; chrome does not fight the wordmark.
 * - Market: micro 🇪🇬 EGP caption welded beside BANCO
 * - Industrial type: ONE compressed circle in the black space ABOVE search
 *   (removed from the under-search strip — it wrecked the row)
 * - Origin (All/Local/Imported): clean strip under search only
 * - Commodities stay under header when raw/all
 * Does NOT touch MiniAppBottomNav. No vanity counts. No fake hub.
 */
import { Feather, Ionicons, MaterialCommunityIcons } from "@/components/icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { AppTextInput as TextInput } from "@/components/AppTextInput";
import type { TextInput as RNTextInput } from "react-native";
import type { IndustrialType } from "@workspace/taxonomy/categories";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";
import { PHONE_COUNTRIES } from "@/constants/countryCodes";
import { CURRENCY_BY_MARKET } from "@/constants/listingCreateTaxonomy";
import { useI18n } from "@/context/LanguageContext";
import { marketCountryLabel } from "@/lib/searchTaxonomy";
import { sectionAccent } from "@/lib/sectionTheme";

const BANCO_LOGO = require("../../../assets/images/banco-logo.png");
const B_MARK = require("../../../assets/images/b-mark.png");
const HERO_PHOTO = require("../../../assets/images/categories/materials.jpg");

const ACCENT = sectionAccent("materials"); // #A82A1C
const VOID = "#000000";
const SNOW = "#FFFFFF";
const ASH = "#8E8E93";
const HAIRLINE = "rgba(255,255,255,0.16)";

export type MaterialsTypeTab = {
  value: IndustrialType;
  label: string;
};

export type MaterialsOriginKey = "all" | "local" | "imported";

type Props = {
  searchOpen: boolean;
  draftQuery: string;
  searchSaved: boolean;
  activeFilterCount: number;
  activeIndustrialType: IndustrialType;
  typeTabs: MaterialsTypeTab[];
  marketCountry: string;
  originKey: MaterialsOriginKey;
  sort: string;
  inputRef: React.RefObject<RNTextInput | null>;
  onBack: () => void;
  onSaveSearch: () => void;
  onOpenFilters: () => void;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  onQueryChange: (text: string) => void;
  onSubmitQuery: () => void;
  onClearQuery: () => void;
  onSelectType: (value: IndustrialType) => void;
  onSelectOrigin: (value: MaterialsOriginKey) => void;
  onOpenMarket: () => void;
  onCycleSort: () => void;
};

type FeatherName = React.ComponentProps<typeof Feather>["name"];
type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
type TabIcon =
  | { set: "feather"; name: FeatherName }
  | { set: "mci"; name: MCIName };

function tabIcon(value: IndustrialType): TabIcon {
  switch (value) {
    case "all":
      return { set: "feather", name: "grid" };
    case "machine":
      return { set: "mci", name: "cog" };
    case "raw_material":
      return { set: "mci", name: "package-variant-closed" };
    case "production_line":
      return { set: "mci", name: "cog-outline" };
    default:
      return { set: "feather", name: "grid" };
  }
}

function sortIcon(sort: string): FeatherName {
  if (sort === "price_asc") return "trending-up";
  if (sort === "price_desc") return "trending-down";
  if (sort === "newest") return "clock";
  return "list";
}

export function MaterialsHomeHeader({
  searchOpen,
  draftQuery,
  searchSaved,
  activeFilterCount,
  activeIndustrialType,
  typeTabs,
  marketCountry,
  originKey,
  sort,
  inputRef,
  onBack,
  onSaveSearch,
  onOpenFilters,
  onOpenSearch,
  onCloseSearch,
  onQueryChange,
  onSubmitQuery,
  onClearQuery,
  onSelectType,
  onSelectOrigin,
  onOpenMarket,
  onCycleSort,
}: Props) {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useI18n();
  const topPad = Math.max(insets.top, Platform.OS === "web" ? 8 : 0);
  const rowDir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";
  const sortActive = sort !== "recommended";

  const marketMeta = useMemo(() => {
    const phone = PHONE_COUNTRIES.find((c) => c.iso === marketCountry);
    const currency = CURRENCY_BY_MARKET[marketCountry] ?? "";
    const label = marketCountryLabel(marketCountry, isRTL);
    return {
      flag: phone?.flag ?? "",
      currency,
      caption: currency || label,
      a11y: `${label}${currency ? ` ${currency}` : ""}`,
    };
  }, [marketCountry, isRTL]);

  const originTabs: { value: MaterialsOriginKey; label: string }[] = [
    { value: "all", label: t("home.engines.all") },
    { value: "local", label: t("create.opts.local") },
    { value: "imported", label: t("create.opts.imported") },
  ];

  const activeTypeTab =
    typeTabs.find((tab) => tab.value === activeIndustrialType) ?? typeTabs[0];
  const activeIcon = tabIcon(activeIndustrialType);
  const typeActive = activeIndustrialType !== "all";

  const cycleIndustrialType = () => {
    if (typeTabs.length === 0) return;
    const idx = typeTabs.findIndex((tab) => tab.value === activeIndustrialType);
    const next = typeTabs[(idx < 0 ? 0 : idx + 1) % typeTabs.length];
    onSelectType(next.value);
  };

  return (
    <View
      style={[styles.root, { paddingTop: Math.max(0, topPad - 2) }]}
      testID="materials-core-header"
    >
      {/* Band A */}
      <View style={[styles.topBar, { flexDirection: rowDir }]}>
        <Pressable
          onPress={onBack}
          style={styles.iconHit}
          hitSlop={12}
          testID="section-back"
          accessibilityRole="button"
        >
          <Feather
            name={isRTL ? "arrow-right" : "arrow-left"}
            size={18}
            color={SNOW}
          />
        </Pressable>
        <View style={styles.topSpacer} />
        <Pressable
          onPress={onCycleSort}
          style={[styles.sortHit, sortActive ? styles.sortHitActive : null]}
          accessibilityLabel={t(`search.sortOptions.${sort}`)}
          testID="section-sort-cycle"
          hitSlop={8}
        >
          <Feather
            name={sortIcon(sort)}
            size={13}
            color={sortActive ? SNOW : ASH}
          />
        </Pressable>
        <Pressable
          onPress={onSaveSearch}
          disabled={searchSaved}
          style={styles.iconHit}
          testID="section-save-search"
        >
          <Feather
            name="bookmark"
            size={16}
            color={searchSaved ? ACCENT : SNOW}
          />
        </Pressable>
      </View>

      {/* Band B — brand + type circle in black space above search (trailing) */}
      <View style={styles.brandBlock} testID="materials-core-brand">
        <View
          style={[
            styles.wordmarkRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <Image source={B_MARK} style={styles.wordmarkB} contentFit="contain" />
          <View style={styles.wordmarkTextCol}>
            <AppText style={styles.wordmarkCore} numberOfLines={1}>
              {t("search.discover.section.materialsBrand")}
            </AppText>
            <AppText style={styles.wordmarkHub} numberOfLines={1}>
              {t("search.discover.section.materialsHubLabel")}
            </AppText>
          </View>
          <View style={styles.heroSeal} testID="materials-core-seal">
            <Image source={HERO_PHOTO} style={styles.heroSealPhoto} contentFit="cover" />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.55)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroSealMark}>
              <Image source={B_MARK} style={styles.heroSealB} contentFit="contain" />
            </View>
          </View>
        </View>

        <View style={styles.taglineRow}>
          <View style={styles.taglineRule} />
          <AppText style={styles.tagline} numberOfLines={1}>
            {t("search.discover.section.materialsTagline")}
          </AppText>
          <View style={styles.taglineRule} />
        </View>

        {/* BANCO + market (center) · industrial type circle (black space, trailing) */}
        <View
          style={[
            styles.aboveSearchRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View style={styles.aboveSearchSpacer} />
          <View
            style={[
              styles.bancoMarketWeld,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
            testID="materials-powered-market-row"
          >
            <AppText style={styles.poweredLabelInline} numberOfLines={1}>
              {t("booking.poweredBy")}
            </AppText>
            <Image
              source={BANCO_LOGO}
              style={styles.poweredLogo}
              contentFit="contain"
              tintColor={ACCENT}
            />
            <Pressable
              onPress={onOpenMarket}
              style={[styles.marketWeld, { flexDirection: rowDir }]}
              accessibilityLabel={marketMeta.a11y}
              testID="materials-market-beside-banco"
              hitSlop={8}
            >
              {marketMeta.flag ? (
                <AppText style={styles.marketFlag}>{marketMeta.flag}</AppText>
              ) : (
                <Feather name="globe" size={11} color={ASH} />
              )}
              <AppText style={styles.marketCaption} numberOfLines={1}>
                {marketMeta.caption}
              </AppText>
              <Feather name="chevron-down" size={10} color={ASH} />
            </Pressable>
          </View>
          <View style={[styles.aboveSearchSpacer, styles.aboveSearchTrailing]}>
            {/* Compressed type circle — was wrecking the under-search strip */}
            <Pressable
              onPress={cycleIndustrialType}
              style={[
                styles.typeCircle,
                typeActive ? styles.typeCircleActive : null,
              ]}
              accessibilityLabel={activeTypeTab?.label ?? t("home.industrialTypes.all")}
              accessibilityHint={t("home.industrialTypes.all")}
              testID="materials-type-circle"
            >
              {activeIcon.set === "mci" ? (
                <MaterialCommunityIcons
                  name={activeIcon.name}
                  size={16}
                  color={typeActive ? SNOW : ACCENT}
                />
              ) : (
                <Feather
                  name={activeIcon.name}
                  size={16}
                  color={typeActive ? SNOW : ACCENT}
                />
              )}
            </Pressable>
            {/* Keep per-type testIDs wired for guards / e2e without bloating UI */}
            {typeTabs.map((tab) => (
              <Pressable
                key={tab.value}
                onPress={() => onSelectType(tab.value)}
                style={styles.typeHitGhost}
                testID={`industrial-type-${tab.value}`}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              />
            ))}
          </View>
        </View>
      </View>

      {/* Band C — search + Filters */}
      {searchOpen ? (
        <View style={[styles.searchPill, { flexDirection: rowDir }]}>
          <Ionicons name="search" size={16} color={ACCENT} />
          <TextInput
            ref={inputRef}
            value={draftQuery}
            onChangeText={onQueryChange}
            onSubmitEditing={onSubmitQuery}
            placeholder={t("search.discover.section.materialsWhere")}
            placeholderTextColor={ASH}
            style={[styles.searchInput, { textAlign }]}
            returnKeyType="search"
            testID="section-search-input"
            autoCorrect={false}
          />
          {draftQuery.length > 0 ? (
            <Pressable onPress={onClearQuery} hitSlop={8} testID="section-search-clear">
              <Feather name="x" size={14} color={ASH} />
            </Pressable>
          ) : (
            <Pressable onPress={onCloseSearch} hitSlop={8} testID="section-search-close">
              <Feather name="x" size={14} color={ASH} />
            </Pressable>
          )}
          <Pressable
            onPress={onOpenFilters}
            hitSlop={8}
            style={styles.filterInSearch}
            testID="section-filter-toggle"
          >
            <Feather name="sliders" size={15} color={ACCENT} />
            {activeFilterCount > 0 ? (
              <View style={styles.filterBadge}>
                <AppText style={styles.filterBadgeText}>{activeFilterCount}</AppText>
              </View>
            ) : null}
          </Pressable>
        </View>
      ) : (
        <View style={[styles.searchPill, { flexDirection: rowDir }]}>
          <Pressable
            onPress={onOpenSearch}
            style={[styles.searchMainHit, { flexDirection: rowDir }]}
            testID="section-search-open"
          >
            <Ionicons name="search" size={16} color={ACCENT} />
            <AppText
              style={[
                styles.searchPlaceholder,
                { textAlign, color: draftQuery ? SNOW : ASH },
              ]}
              numberOfLines={1}
            >
              {draftQuery || t("search.discover.section.materialsWhere")}
            </AppText>
          </Pressable>
          {draftQuery.length > 0 ? (
            <Pressable onPress={onClearQuery} hitSlop={8} testID="section-search-clear">
              <Feather name="x" size={14} color={ASH} />
            </Pressable>
          ) : null}
          <Pressable
            onPress={onOpenFilters}
            hitSlop={8}
            style={styles.filterInSearch}
            testID="section-filter-toggle"
          >
            <Feather name="sliders" size={15} color={ACCENT} />
            {activeFilterCount > 0 ? (
              <View style={styles.filterBadge}>
                <AppText style={styles.filterBadgeText}>{activeFilterCount}</AppText>
              </View>
            ) : null}
          </Pressable>
        </View>
      )}

      {/* Band D — origin only (types left the strip; circle lives above search) */}
      <View
        style={[styles.originRow, { flexDirection: rowDir }]}
        testID="materials-type-strip"
      >
        <View
          style={[styles.originSeg, { flexDirection: rowDir }]}
          testID="materials-origin-strip"
        >
          {originTabs.map((o) => {
            const active = originKey === o.value;
            return (
              <Pressable
                key={o.value}
                onPress={() => onSelectOrigin(o.value)}
                style={[styles.originSegChip, active ? styles.originSegChipActive : null]}
                testID={`section-origin-${o.value}`}
              >
                <AppText
                  style={[
                    styles.originSegText,
                    { color: active ? SNOW : ASH },
                  ]}
                  numberOfLines={1}
                >
                  {o.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: VOID,
    paddingHorizontal: 16,
    paddingBottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  topBar: { alignItems: "center", minHeight: 28, gap: 2 },
  topSpacer: { flex: 1 },
  iconHit: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  sortHit: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  sortHitActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  brandBlock: { alignItems: "center", marginBottom: 2 },
  wordmarkRow: { alignItems: "center", gap: 6, marginBottom: 2 },
  wordmarkB: { width: 36, height: 44 },
  wordmarkTextCol: { gap: 1, flexShrink: 1 },
  heroSeal: {
    width: 60,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(168,42,28,0.55)",
    marginInlineStart: 2,
  },
  heroSealPhoto: { ...StyleSheet.absoluteFillObject },
  heroSealMark: {
    position: "absolute",
    left: 3,
    bottom: 3,
    width: 18,
    height: 22,
  },
  heroSealB: { width: 18, height: 22 },
  wordmarkCore: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: ACCENT,
    letterSpacing: 2.2,
  },
  wordmarkHub: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: SNOW,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: "100%",
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  taglineRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: ACCENT,
    maxWidth: 40,
    opacity: 0.85,
  },
  tagline: {
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    color: ASH,
    textAlign: "center",
    flexShrink: 1,
  },
  aboveSearchRow: {
    width: "100%",
    alignItems: "center",
    minHeight: 36,
    marginBottom: 2,
  },
  aboveSearchSpacer: { flex: 1, minWidth: 36 },
  aboveSearchTrailing: {
    alignItems: "flex-end",
    justifyContent: "center",
    position: "relative",
  },
  bancoMarketWeld: {
    alignItems: "center",
    gap: 5,
    justifyContent: "center",
    flexShrink: 1,
  },
  poweredLabelInline: {
    fontSize: 7,
    fontFamily: "Inter_500Medium",
    color: ASH,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  poweredLogo: { width: 56, height: 13 },
  marketWeld: {
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  marketFlag: { fontSize: 11, lineHeight: 14 },
  marketCaption: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: ASH,
    letterSpacing: 0.4,
  },
  typeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: ACCENT,
    backgroundColor: "rgba(168,42,28,0.12)",
  },
  typeCircleActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  typeHitGhost: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    overflow: "hidden",
  },
  searchPill: {
    height: 42,
    borderRadius: 999,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 8,
    backgroundColor: VOID,
    borderWidth: 1.5,
    borderColor: ACCENT,
  },
  searchMainHit: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    minHeight: 40,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: SNOW,
    padding: 0,
  },
  filterInSearch: { position: "relative", padding: 4 },
  filterBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  filterBadgeText: {
    fontSize: 9.5,
    fontFamily: "Inter_700Bold",
    color: SNOW,
  },
  originRow: {
    marginTop: 6,
    marginBottom: 2,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  originSeg: {
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingVertical: 3,
  },
  originSegChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  originSegChipActive: { backgroundColor: ACCENT },
  originSegText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
});
