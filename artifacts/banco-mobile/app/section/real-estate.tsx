import { SectionSearchApp } from "@/components/search/SectionSearchApp";

/**
 * Real estate (B-PROPERTY) — segments on sale-vs-rent first, then property type.
 *
 * Offer axis stays CHIPS on purpose: تمليك / إيجار is the decision a browsing
 * user flips constantly, and it is short enough to fit. Charging a tap to open a
 * list for it would tax the most-used control on the page — the opposite of what
 * the pill is for.
 *
 * Property type is a PILL: measured 16-type chip rows either overflow a phone
 * width or stack into ~163px of chrome before the first listing. The pill keeps
 * every type reachable via FilterPillSelect + FilterSheet, and gives the screen
 * back to inventory. Cars differ on purpose — their axes are not alike.
 */
export default function RealEstateSectionScreen() {
  return (
    <SectionSearchApp
      category="real_estate"
      titleKey="home.categories.real_estate"
      subtitleKey="search.discover.section.realEstateSub"
      chrome={{ engines: "chips", propertyType: "pill" }}
    />
  );
}
