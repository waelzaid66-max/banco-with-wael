import { SectionSearchApp } from "@/components/search/SectionSearchApp";

/**
 * Real estate (B-PROPERTIES) — Stay-parity mini-app chrome inside SectionSearchApp.
 *
 * Identity + search/filter + primary types live in PropertyHomeHeader.
 * Offer (sale/rent/wanted) and deep refinements stay in FilterSheet.
 * Do not touch Cars / Stay / Import from this shell.
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
