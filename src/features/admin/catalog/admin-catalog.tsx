import { useState } from "react";
import { Boxes, Tags } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { CATALOG_SECTIONS, type CatalogEditTarget, type CatalogSection } from "@/features/admin/catalog/catalog-types";
import { ProductForm } from "@/features/admin/catalog/product-form";
import { ProductList } from "@/features/admin/catalog/product-list";
import { TypeForm } from "@/features/admin/catalog/type-form";
import { TypeList } from "@/features/admin/catalog/type-list";
import { useAdminStore } from "@/features/admin/store/admin-store";
import { cn } from "@/lib/utils";

export function AdminCatalog() {
  const [section, setSection] = useState<CatalogSection>("types");
  const [formOpen, setFormOpen] = useState(false);
  const [target, setTarget] = useState<CatalogEditTarget>();
  const [parentProductId, setParentProductId] = useState<string>();
  const { error, isLoading } = useAdminStore();

  const closeForm = () => {
    setFormOpen(false);
    setTarget(undefined);
    setParentProductId(undefined);
  };

  const openCreate = () => {
    setTarget(undefined);
    setParentProductId(undefined);
    setFormOpen(true);
  };

  const openEdit = (nextTarget: CatalogEditTarget) => {
    setParentProductId(undefined);
    setTarget(nextTarget);
    setFormOpen(true);
  };

  const openAddVariant = (productId: string) => {
    setTarget(undefined);
    setParentProductId(productId);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Catalogue"
        description="Un type identifie chaque produit; ses variantes restent gerees dans le produit."
        action={
          <Button type="button" onClick={openCreate}>
            {section === "types" ? <Tags className="mr-2 h-4 w-4" /> : <Boxes className="mr-2 h-4 w-4" />}
            {section === "types" ? "Ajouter un type" : "Ajouter un produit"}
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Sections du catalogue">
        {CATALOG_SECTIONS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={section === item.key}
            onClick={() => {
              setSection(item.key);
              closeForm();
            }}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              section === item.key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {formOpen && section === "types" ? <TypeForm key={target?.id ?? "new"} target={target} onClose={closeForm} /> : null}
      {formOpen && section === "products" ? (
        <ProductForm
          key={target?.id ?? parentProductId ?? "new"}
          target={target}
          parentProductId={parentProductId}
          onClose={closeForm}
          onEditVariant={(variantId) => openEdit({ kind: "variant", id: variantId })}
          onAddVariant={openAddVariant}
        />
      ) : null}

      {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p> : null}

      {!formOpen ? (
        isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Chargement du catalogue...</p>
        ) : section === "types" ? (
          <TypeList onCreate={openCreate} onEdit={openEdit} />
        ) : (
          <ProductList onCreate={openCreate} onEdit={openEdit} onAddVariant={openAddVariant} />
        )
      ) : null}
    </div>
  );
}
