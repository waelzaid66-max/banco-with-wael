import React, { useState } from "react";

import {
  MaterialsHome,
  type MaterialsCatalogSeed,
} from "@/components/search/materials/MaterialsHome";
import { SectionSearchApp } from "@/components/search/SectionSearchApp";

/**
 * Raw materials & production lines — Industrial Mini-App.
 *
 * Layer 1 HOME: MaterialsHome (compact hero + Quick Services).
 * Layer 2 CATALOG: SectionSearchApp — filters in FilterSheet (not the page).
 *
 * Route stays `/section/materials`. No API / search-engine / other-section UI changes.
 */
export default function MaterialsSectionScreen() {
  const [layer, setLayer] = useState<"home" | "catalog">("home");
  const [seed, setSeed] = useState<MaterialsCatalogSeed>({
    industrialType: "all",
  });

  if (layer === "home") {
    return (
      <MaterialsHome
        onOpenCatalog={(next) => {
          setSeed(next);
          setLayer("catalog");
        }}
      />
    );
  }

  return (
    <SectionSearchApp
      key={`materials-catalog-${seed.industrialType}-${seed.material ?? ""}`}
      category="materials"
      titleKey="home.categories.materials"
      subtitleKey="search.discover.section.materialsSub"
      chrome={{ listingMode: "pill", engines: "chips" }}
      initialIndustrialType={seed.industrialType}
      initialMaterial={seed.material ?? null}
      collapseInlineStrips
      onRequestClose={() => setLayer("home")}
    />
  );
}
