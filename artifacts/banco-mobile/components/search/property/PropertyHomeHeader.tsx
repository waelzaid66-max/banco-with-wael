/**
 * B-PROPERTIES — premium black header (visual shell).
 *
 * Stay-parity bands (A–D): back/save · wordmark · search+filter pill · type tabs.
 * Presentational only — parent (`SectionSearchApp`) owns criteria and sheets.
 * RE-only; do not mount from Cars / Stay / Import.
 */
import { Feather, Ionicons } from "@/components/icons";
import { Image } from "expo-image";
import { AppTextInput as TextInput } from "@/components/AppTextInput";
import type { TextInput as RNTextInput } from "react-native";
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
import { useI18n } from "@/context/LanguageContext";
import { sectionAccent } from "@/lib/sectionTheme";

const BANCO_LOGO = require("../../../assets/images/banco-logo.png");
const B_MARK = require("../../../assets/images/b-mark.png");
const PROPERTY_MARK = require("../../../assets/images/property-mark.png");

const ACCENT = sectionAccent("real_estate"); // #B81E3C
const VOID = "#000000";
const SNOW = "#FFFFFF";
const ASH = "#8E8E93";
const HAIRLINE = "rgba(255,255,255,0.16)";

export type PropertyTypeTab = {
  value: string;
  label: string;
};

type PropertyHomeHeaderProps = {
  searchOpen: boolean;
  draftQuery: string;
  searchSaved: boolean;
  activeFilterCount: number;
  activePropertyType: string;
  typeTabs: PropertyTypeTab[];
  inputRef: React.RefObject<RNTextInput | null>;
  onBack: () => void;
  onSaveSearch: () => void;
  onOpenFilters: () => void;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  onQueryChange: (text: string) => void;
  onSubmitQuery: () => void;
  onClearQuery: () => void;
  onSelectType: (value: string) => void;
};

/** Names must exist in `@/components/icons` ICONS registry (Android/Expo safe). */
function tabIcon(value: string): React.ComponentProps<typeof Ionicons>["name"] {
  switch (value) {
    case "__all__":
      return "grid-outline";
    case "apartment":
      return "business-outline";
    case "villa":
      return "home";
    case "office":
      return "storefront-outline";
    case "land":
      return "map-outline";
    default:
      return "radio-button-off";
  }
}

export function PropertyHomeHeader({
  searchOpen,
  draftQuery,
  searchSaved,
  activeFilterCount,
  activePropertyType,
  typeTabs,
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
}: PropertyHomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useI18n();
  // Owner rule: never invent a fake 67px web pad (it destroyed headers before).
  const topPad = Math.max(insets.top, Platform.OS === "web" ? 12 : 0);
  const rowDir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  return (
    <View style={[styles.root, { paddingTop: topPad - 1 }]} testID="re-property-header">
      {/* Band A — top actions */}
      <View style={[styles.topBar, { flexDirection: rowDir }]}>
        <Pressable
          onPress={onBack}
          style={styles.iconHit}
          hitSlop={12}
          testID="section-back"
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Feather
            name={isRTL ? "arrow-right" : "arrow-left"}
            size={22}
            color={SNOW}
          />
        </Pressable>
        <View style={styles.topSpacer} />
        <Pressable
          onPress={onSaveSearch}
          disabled={searchSaved}
          style={styles.iconHit}
          testID="section-save-search"
          accessibilityRole="button"
        >
          <Feather
            name="bookmark"
            size={20}
            color={searchSaved ? ACCENT : SNOW}
          />
        </Pressable>
      </View>

      {/* Band B — B-PROPERTIES identity (balanced, not half-screen) */}
      <View style={styles.brandBlock} testID="re-property-brand">
        <View
          style={[
            styles.wordmarkRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <Image
            source={B_MARK}
            style={styles.wordmarkB}
            contentFit="contain"
          />
          <AppText style={styles.wordmarkProperties} numberOfLines={1}>
            {t("search.discover.section.propertyBrand")}
          </AppText>
          <Image
            source={PROPERTY_MARK}
            style={styles.wordmarkSeal}
            contentFit="contain"
          />
        </View>

        <View style={styles.taglineRow}>
          <View style={styles.taglineRule} />
          <AppText style={styles.tagline} numberOfLines={1}>
            {t("search.discover.section.propertyTagline")}
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
        </View>
      </View>

      {/* Band C — search pill; filter lives inside (Stay-aligned) */}
      {searchOpen ? (
        <View style={[styles.searchPill, { flexDirection: rowDir }]}>
          <Ionicons name="search" size={18} color={ACCENT} />
          <TextInput
            ref={inputRef}
            value={draftQuery}
            onChangeText={onQueryChange}
            onSubmitEditing={onSubmitQuery}
            placeholder={t("search.discover.section.propertyWhere")}
            placeholderTextColor={ASH}
            style={[styles.searchInput, { textAlign }]}
            returnKeyType="search"
            testID="section-search-input"
            autoCorrect={false}
          />
          {draftQuery.length > 0 ? (
            <Pressable onPress={onClearQuery} hitSlop={8} testID="section-search-clear">
              <Feather name="x" size={16} color={ASH} />
            </Pressable>
          ) : (
            <Pressable onPress={onCloseSearch} hitSlop={8} testID="section-search-close">
              <Feather name="x" size={16} color={ASH} />
            </Pressable>
          )}
          <Pressable
            onPress={onOpenFilters}
            hitSlop={8}
            style={styles.filterInSearch}
            testID="section-filter-toggle"
          >
            <Feather name="sliders" size={17} color={ACCENT} />
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
            <Ionicons name="search" size={18} color={ACCENT} />
            <AppText
              style={[
                styles.searchPlaceholder,
                {
                  textAlign,
                  color: draftQuery ? SNOW : ASH,
                },
              ]}
              numberOfLines={1}
            >
              {draftQuery || t("search.discover.section.propertyWhere")}
            </AppText>
          </Pressable>
          {draftQuery.length > 0 ? (
            <Pressable onPress={onClearQuery} hitSlop={8} testID="section-search-clear">
              <Feather name="x" size={16} color={ASH} />
            </Pressable>
          ) : null}
          <Pressable
            onPress={onOpenFilters}
            hitSlop={8}
            style={styles.filterInSearch}
            testID="section-filter-toggle"
          >
            <Feather name="sliders" size={17} color={ACCENT} />
            {activeFilterCount > 0 ? (
              <View style={styles.filterBadge}>
                <AppText style={styles.filterBadgeText}>{activeFilterCount}</AppText>
              </View>
            ) : null}
          </Pressable>
        </View>
      )}

      {/* Band D — primary property types (mock-aligned; rest in FilterSheet) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.tabsRow, { flexDirection: rowDir }]}
        style={styles.tabsScroll}
        testID="re-type-strip"
      >
        {typeTabs.map((tab, index) => {
          const active = activePropertyType === tab.value;
          const tint = active ? ACCENT : ASH;
          return (
            <React.Fragment key={tab.value}>
              {index > 0 ? <View style={styles.tabDivider} /> : null}
              <Pressable
                onPress={() => onSelectType(tab.value)}
                style={[styles.tabItem, active ? styles.tabItemActive : null]}
                testID={`re-type-${tab.value}`}
              >
                <Ionicons name={tabIcon(tab.value)} size={18} color={active ? SNOW : tint} />
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
    paddingBottom: 4,
  },
  topBar: {
    alignItems: "center",
    minHeight: 40,
    marginBottom: 0,
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
  wordmarkB: {
    width: 36,
    height: 44,
  },
  wordmarkProperties: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: ACCENT,
    letterSpacing: 1.2,
  },
  wordmarkSeal: {
    width: 34,
    height: 34,
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
  },
  poweredLabel: {
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    color: ASH,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  poweredRow: {
    alignItems: "center",
    gap: 6,
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
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: SNOW,
    padding: 0,
  },
  filterInSearch: {
    position: "relative",
    padding: 4,
  },
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
    borderRadius: 16,
    paddingVertical: 6,
  },
  tabItemActive: {
    backgroundColor: ACCENT,
    paddingHorizontal: 14,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  tabDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "center",
    height: 28,
    backgroundColor: HAIRLINE,
  },
});
