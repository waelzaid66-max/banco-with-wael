import React, { useState } from "react";

import {
  MaterialsHome,
  type MaterialsCatalogSeed,
} from "@/components/search/materials/MaterialsHome";
import { SectionSearchApp } from "@/components/search/SectionSearchApp";

/**
 * Raw materials & production lines — Mini-App layer (owner: missing hub).
 *
 * Layer 1 HOME: MaterialsHome (Industrial Hub structure, Stay-balanced header).
 * Layer 2 CATALOG: SectionSearchApp with EVERY filter strip + FilterSheet intact.
 *
 * Filters are never erased — home only organizes entry; catalog keeps tools.
 * Route stays `/section/materials`. No other-section UI changes.
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
      key={`materials-catalog-${seed.industrialType}-${seed.material ?? ""}-${seed.openFilters ? "f" : "b"}`}
      category="materials"
      titleKey="home.categories.materials"
      subtitleKey="search.discover.section.materialsSub"
      chrome={{ listingMode: "pill", engines: "chips" }}
      initialIndustrialType={seed.industrialType}
      initialMaterial={seed.material ?? null}
      openFiltersOnMount={!!seed.openFilters}
      onRequestClose={() => setLayer("home")}
    />
  );
}
