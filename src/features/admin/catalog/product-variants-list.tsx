import { Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/features/admin/types";
import { formatCurrency } from "@/lib/format/currency";

interface ProductVariantsListProps {
  product: Product;
  onAdd: (productId: string) => void;
  onEdit: (variantId: string) => void;
}

export function ProductVariantsList({ product, onAdd, onEdit }: ProductVariantsListProps) {
  return (
    <div className="space-y-4 md:col-span-2 xl:col-span-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Variantes existantes</p>
          <p className="text-sm text-muted-foreground">
            Les variantes de ce produit restent visibles et modifiables depuis ici.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => onAdd(product.id)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une variante
        </Button>
      </div>

      {product.variantes.length ? (
        <div className="divide-y rounded-lg border bg-background">
          {product.variantes.map((variant) => (
            <div key={variant.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium capitalize">{variant.unite}</p>
                  <Badge variant={variant.actif ? "outline" : "secondary"}>
                    {variant.actif ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {variant.code} - Prix : {formatCurrency(variant.prix)}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => onEdit(variant.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier la variante
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
          Ce produit n'a pas encore de variante. Ajoutez-en une pour completer sa vente.
        </p>
      )}
    </div>
  );
}
