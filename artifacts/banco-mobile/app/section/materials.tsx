import { SectionSearchApp } from "@/components/search/SectionSearchApp";

/**
 * B-CORE Industrial Hub — Raw materials & production lines.
 *
 * Identity + search/Filters + industrial type tabs live in MaterialsHomeHeader
 * inside SectionSearchApp (Stay/B-PROPERTIES method). Commodity/origin/listing
 * refinements stay in FilterSheet — not erased. MiniAppBottomNav untouched.
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
