import { SectionSearchApp } from "@/components/search/SectionSearchApp";

/**
 * Real estate (B-PROPERTY) — layered mini-app chrome inside SectionSearchApp.
 *
 * Offer axis stays CHIPS: تمليك / إيجار is flicked constantly. Property type is
 * a PILL (16 values overflow as chips). Service desks (مكاتب) are a compact
 * horizontal strip of REAL actions only — criteria seeds or existing routes
 * (Booking, custom request, FilterSheet). No fake New-Projects / Contract /
 * Payment desks until those surfaces exist.
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
