import { useState } from "react";
import { ChevronRight, Tags } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogActions } from "@/features/admin/catalog/catalog-actions";
import { CatalogDetailDialog } from "@/features/admin/catalog/catalog-detail-dialog";
import { CatalogRowActions } from "@/features/admin/catalog/catalog-row-actions";
import type { CatalogEditTarget } from "@/features/admin/catalog/catalog-types";
import { EmptyState } from "@/components/empty-state";
import { useAdminStore } from "@/features/admin/store/admin-store";

export function TypeList({ onCreate, onEdit }: { onCreate: () => void; onEdit: (target: CatalogEditTarget) => void }) {
  const store = useAdminStore();
  const [selectedId, setSelectedId] = useState<string>();
  const selected = store.types.find((item) => item.id === selectedId);
  const linkedProducts = store.products.filter((item) => item.typeId === selectedId);

  if (!store.types.length) {
    return (
      <EmptyState
        icon={Tags}
        title="Aucun type"
        description="Creez le premier type qui servira de reference aux produits."
        action={
          <Button type="button" variant="outline" onClick={onCreate}>
            Creer le premier type
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Card>
        <CardContent className="divide-y p-0">
          {store.types.map((type) => {
            const productCount = store.products.filter((item) => item.typeId === type.id).length;

            return (
              <div key={type.id} className="flex items-center gap-4 px-4 py-4 sm:px-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Tags className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{type.nom}</p>
                    <Badge variant={type.actif ? "success" : "secondary"}>{type.actif ? "Actif" : "Inactif"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-mono">{type.code}</span> - {productCount} produit(s)
                  </p>
                </div>

                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedId(type.id)}>
                  Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>

                <CatalogRowActions
                  active={type.actif}
                  onEdit={() => onEdit({ kind: "type", id: type.id })}
                  onToggle={() => store.toggleCatalogItem("type", type.id)}
                  onDelete={() => store.deleteCatalogItem("type", type.id)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {selected ? (
        <CatalogDetailDialog title={selected.nom} subtitle={`Code type : ${selected.code}`} onClose={() => setSelectedId(undefined)}>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Gestion du type</h3>
            <CatalogActions
              active={selected.actif}
              onEdit={() => {
                setSelectedId(undefined);
                onEdit({ kind: "type", id: selected.id });
              }}
              onToggle={() => store.toggleCatalogItem("type", selected.id)}
              onDelete={async () => {
                await store.deleteCatalogItem("type", selected.id);
                setSelectedId(undefined);
              }}
            />
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">Produits lies</h3>
              <p className="text-sm text-muted-foreground">Un type utilise par un produit ne peut pas etre supprime.</p>
            </div>

            {linkedProducts.length ? (
              <div className="flex flex-wrap gap-2">
                {linkedProducts.map((product) => (
                  <Badge key={product.id} variant="outline">
                    {product.nom}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">Aucun produit lie a ce type.</p>
            )}
          </section>
        </CatalogDetailDialog>
      ) : null}
    </>
  );
}
