export type CatalogSection = "types" | "products";
export type CatalogEntityKind = "type" | "product" | "variant";

export interface CatalogEditTarget {
  kind: CatalogEntityKind;
  id: string;
}

export const CATALOG_SECTIONS: { key: CatalogSection; label: string }[] = [
  { key: "types", label: "Types" },
  { key: "products", label: "Produits" },
];
