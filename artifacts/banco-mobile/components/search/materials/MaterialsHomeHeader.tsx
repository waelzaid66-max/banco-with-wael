/**
 * B-CORE Industrial Hub — upper header only (materials).
 *
 * Same method as B-PROPERTIES / Stay: bands A–D inside SectionSearchApp.
 * Compresses search + Filters + industrial types + market/sort into the header.
 * Does NOT erase filters — commodity/origin/listingMode stay in FilterSheet.
 * Does NOT touch MiniAppBottomNav.
 * No fake vanity counts. No separate hub dashboard.
 */
import { Feather, Ionicons, MaterialCommunityIcons } from "@/components/icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { AppTextInput as TextInput } from "@/components/AppTextInput";
import type { TextInput as RNTextInput } from "react-native";
import type { IndustrialType } from "@workspace/taxonomy/categories";
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
import { MarketCountryButton } from "@/components/MarketCountryPicker";
import { useI18n } from "@/context/LanguageContext";
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

type Props = {
  searchOpen: boolean;
  draftQuery: string;
  searchSaved: boolean;
  activeFilterCount: number;
  activeIndustrialType: IndustrialType;
  typeTabs: MaterialsTypeTab[];
  marketCountry: string;
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
  onOpenMarket,
  onCycleSort,
}: Props) {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useI18n();
  const topPad = Math.max(insets.top, Platform.OS === "web" ? 10 : 0);
  const rowDir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";
  const sortActive = sort !== "recommended";

  return (
    <View style={[styles.root, { paddingTop: topPad - 1 }]} testID="materials-core-header">
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
            size={20}
            color={SNOW}
          />
        </Pressable>
        <View style={styles.topSpacer} />
        <Pressable
          onPress={onSaveSearch}
          disabled={searchSaved}
          style={styles.iconHit}
          testID="section-save-search"
        >
          <Feather
            name="bookmark"
            size={18}
            color={searchSaved ? ACCENT : SNOW}
          />
        </Pressable>
      </View>

      {/* Band B — B-CORE Industrial Hub identity + compact industrial seal */}
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
          {/* Mock-aligned industrial seal — cropped, not half-screen hero */}
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
          <AppText style={styles.tagline} numberOfLines={2}>
            {t("search.discover.section.materialsTagline")}
          </AppText>
          <View style={styles.taglineRule} />
        </View>

        <AppText style={styles.poweredLabel} numberOfLines={1}>
          {t("booking.poweredBy")}
        </AppText>
        <View
          style={[
            styles.poweredRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <Image
            source={BANCO_LOGO}
            style={styles.poweredLogo}
            contentFit="contain"
            tintColor={ACCENT}
          />
          <Pressable
            onPress={onCycleSort}
            style={[
              styles.sortNearBanco,
              sortActive ? styles.sortNearBancoActive : null,
            ]}
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
        </View>
      </View>

      {/* Band C — search + Filters compressed inside pill (not erased) */}
      {searchOpen ? (
        <View style={[styles.searchPill, { flexDirection: rowDir }]}>
          <Ionicons name="search" size={17} color={ACCENT} />
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
              <Feather name="x" size={15} color={ASH} />
            </Pressable>
          ) : (
            <Pressable onPress={onCloseSearch} hitSlop={8} testID="section-search-close">
              <Feather name="x" size={15} color={ASH} />
            </Pressable>
          )}
          <Pressable
            onPress={onOpenFilters}
            hitSlop={8}
            style={styles.filterInSearch}
            testID="section-filter-toggle"
          >
            <Feather name="sliders" size={16} color={ACCENT} />
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
            <Ionicons name="search" size={17} color={ACCENT} />
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
              <Feather name="x" size={15} color={ASH} />
            </Pressable>
          ) : null}
          <Pressable
            onPress={onOpenFilters}
            hitSlop={8}
            style={styles.filterInSearch}
            testID="section-filter-toggle"
          >
            <Feather name="sliders" size={16} color={ACCENT} />
            {activeFilterCount > 0 ? (
              <View style={styles.filterBadge}>
                <AppText style={styles.filterBadgeText}>{activeFilterCount}</AppText>
              </View>
            ) : null}
          </Pressable>
        </View>
      )}

      {/* Band D — market + large industrial type tabs (real criteria) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.tabsRow, { flexDirection: rowDir }]}
        style={styles.tabsScroll}
        testID="materials-type-strip"
      >
        <View style={styles.marketInTabs}>
          <MarketCountryButton selected={marketCountry} onPress={onOpenMarket} />
        </View>
        <View style={styles.tabDivider} />
        {typeTabs.map((tab, index) => {
          const active = activeIndustrialType === tab.value;
          const tint = active ? SNOW : ASH;
          const icon = tabIcon(tab.value);
          return (
            <React.Fragment key={tab.value}>
              {index > 0 ? <View style={styles.tabDivider} /> : null}
              <Pressable
                onPress={() => onSelectType(tab.value)}
                style={[styles.tabItem, active ? styles.tabItemActive : null]}
                testID={`industrial-type-${tab.value}`}
              >
                {icon.set === "mci" ? (
                  <MaterialCommunityIcons
                    name={icon.name}
                    size={22}
                    color={active ? SNOW : ACCENT}
                  />
                ) : (
                  <Feather
                    name={icon.name}
                    size={22}
                    color={active ? SNOW : ACCENT}
                  />
                )}
                <AppText
                  style={[styles.tabLabel, { color: active ? SNOW : tint }]}
                  numberOfLines={1}
                >
                  {tab.label}
                </AppText>
              </Pressable>
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: VOID,
    paddingHorizontal: 16,
    paddingBottom: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  topBar: { alignItems: "center", minHeight: 34 },
  topSpacer: { flex: 1 },
  iconHit: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  brandBlock: { alignItems: "center", marginBottom: 4 },
  wordmarkRow: { alignItems: "center", gap: 8, marginBottom: 4 },
  wordmarkB: { width: 42, height: 52 },
  wordmarkTextCol: { gap: 2, flexShrink: 1 },
  heroSeal: {
    width: 72,
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(168,42,28,0.55)",
    marginInlineStart: 4,
  },
  heroSealPhoto: { ...StyleSheet.absoluteFillObject },
  heroSealMark: {
    position: "absolute",
    left: 4,
    bottom: 4,
    width: 22,
    height: 26,
  },
  heroSealB: { width: 22, height: 26 },
  wordmarkCore: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: ACCENT,
    letterSpacing: 2.6,
  },
  wordmarkHub: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: SNOW,
    letterSpacing: 2.6,
    textTransform: "uppercase",
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "100%",
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  taglineRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: ACCENT,
    maxWidth: 48,
    opacity: 0.85,
  },
  tagline: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: ASH,
    textAlign: "center",
    flexShrink: 1,
  },
  poweredLabel: {
    fontSize: 8,
    fontFamily: "Inter_500Medium",
    color: ASH,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 1,
  },
  poweredRow: { alignItems: "center", gap: 8 },
  poweredLogo: { width: 68, height: 16 },
  sortNearBanco: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  sortNearBancoActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  searchPill: {
    height: 46,
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
    minHeight: 44,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
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
  tabsScroll: { marginTop: 8, marginHorizontal: -16 },
  tabsRow: {
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 0,
    minHeight: 56,
  },
  marketInTabs: { paddingHorizontal: 4, justifyContent: "center" },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    minWidth: 72,
    gap: 4,
    borderRadius: 16,
    paddingVertical: 8,
  },
  tabItemActive: { backgroundColor: ACCENT, paddingHorizontal: 14 },
  tabLabel: { fontSize: 10.5, fontFamily: "Inter_600SemiBold" },
  tabDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "center",
    height: 28,
    backgroundColor: HAIRLINE,
  },
});
