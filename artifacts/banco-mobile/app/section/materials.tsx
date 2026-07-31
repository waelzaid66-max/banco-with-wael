import { SectionSearchApp } from "@/components/search/SectionSearchApp";

/**
 * B-CORE Industrial Hub — materials section.
 *
 * Upper header chrome (identity + search/Filters + type tabs) lives inside
 * SectionSearchApp via MaterialsHomeHeader. Commodity/origin/listingMode stay
 * in FilterSheet — never erased. MiniAppBottomNav untouched.
 */
export default function MaterialsSectionScreen() {
  return (
    <SectionSearchApp
      category="materials"
      titleKey="home.categories.materials"
      subtitleKey="search.discover.section.materialsSub"
      chrome={{ listingMode: "pill", engines: "chips" }}
    />
  );
}
