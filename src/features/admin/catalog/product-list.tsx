import { useState } from "react";
import { Boxes, ChevronRight, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogActions } from "@/features/admin/catalog/catalog-actions";
import { CatalogDetailDialog } from "@/features/admin/catalog/catalog-detail-dialog";
import { CatalogRowActions } from "@/features/admin/catalog/catalog-row-actions";
import type { CatalogEditTarget } from "@/features/admin/catalog/catalog-types";
import { EmptyState } from "@/components/empty-state";
import { useAdminStore } from "@/features/admin/store/admin-store";
import { formatCurrency } from "@/lib/format/currency";

export function ProductList({ onCreate, onEdit, onAddVariant }: { onCreate: () => void; onEdit: (target: CatalogEditTarget) => void; onAddVariant: (productId: string) => void }) {
  const store = useAdminStore();
  const [selectedId, setSelectedId] = useState<string>();
  const selected = store.products.find((item) => item.id === selectedId);
  const selectedType = store.types.find((item) => item.id === selected?.typeId);

  if (!store.products.length) {
    return (
      <EmptyState
        icon={Boxes}
        title="Aucun produit"
        description="Creez un produit avec sa premiere variante dans un seul formulaire."
        action={
          <Button type="button" variant="outline" onClick={onCreate}>
            Creer le premier produit
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Card>
        <CardContent className="divide-y p-0">
          {store.products.map((product) => {
            const type = store.types.find((item) => item.id === product.typeId);

            return (
              <div key={product.id} className="flex items-center gap-4 px-4 py-4 sm:px-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Boxes className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{product.nom}</p>
                    <Badge variant={product.actif ? "success" : "secondary"}>{product.actif ? "Actif" : "Inactif"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {type?.nom} - {product.variantes.length} variante(s)
                  </p>
                </div>

                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedId(product.id)}>
                  Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>

                <CatalogRowActions
                  active={product.actif}
                  onEdit={() => onEdit({ kind: "product", id: product.id })}
                  onToggle={() => store.toggleCatalogItem("product", product.id)}
                  onDelete={() => store.deleteCatalogItem("product", product.id)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {selected ? (
        <CatalogDetailDialog
          title={selected.nom}
          subtitle={`Type : ${selectedType?.nom ?? "Non renseigne"} - ${selectedType?.code ?? "-"}`}
          onClose={() => setSelectedId(undefined)}
        >
          <section className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Produit</h3>
            {selected.description ? <p className="text-sm">{selected.description}</p> : null}
            <CatalogActions
              active={selected.actif}
              onEdit={() => {
                setSelectedId(undefined);
                onEdit({ kind: "product", id: selected.id });
              }}
              onToggle={() => store.toggleCatalogItem("product", selected.id)}
              onDelete={async () => {
                await store.deleteCatalogItem("product", selected.id);
                setSelectedId(undefined);
              }}
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Variantes de vente</h3>
                <p className="text-sm text-muted-foreground">Gerees uniquement depuis ce produit.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => { setSelectedId(undefined); onAddVariant(selected.id); }}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>

            <div className="divide-y rounded-lg border">
              {selected.variantes.map((variant) => (
                <div key={variant.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium capitalize">{variant.unite}</p>
                      <Badge variant={variant.actif ? "outline" : "secondary"}>{variant.actif ? "Active" : "Inactive"}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {variant.code} - Prix : {formatCurrency(variant.prix)}
                    </p>
                  </div>
                  <CatalogActions
                    active={variant.actif}
                    onEdit={() => {
                      setSelectedId(undefined);
                      onEdit({ kind: "variant", id: variant.id });
                    }}
                    onToggle={() => store.toggleCatalogItem("variant", variant.id)}
                    onDelete={() => store.deleteCatalogItem("variant", variant.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        </CatalogDetailDialog>
      ) : null}
    </>
  );
}
