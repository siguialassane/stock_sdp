import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createSaleDraftLine,
  getSaleLineValues,
} from "@/features/commercial/sales/sale-form.utils";
import type {
  CommercialCatalogItem,
  CommercialSaleDraftLine,
} from "@/features/commercial/types";
import { formatCurrency } from "@/lib/format/currency";

const selectClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-[15px] outline-none focus:border-primary";
const lineInputClass = "h-11 text-[15px]";

interface SaleLinesEditorProps {
  catalog: CommercialCatalogItem[];
  lines: CommercialSaleDraftLine[];
  onChange: (lines: CommercialSaleDraftLine[]) => void;
}

export function SaleLinesEditor({ catalog, lines, onChange }: SaleLinesEditorProps) {
  const selectedVariantIds = new Set(lines.map((line) => line.variantId).filter(Boolean));

  const updateLine = (draftId: string, nextLine: CommercialSaleDraftLine) => {
    onChange(lines.map((line) => (line.draftId === draftId ? nextLine : line)));
  };

  const removeLine = (draftId: string) => {
    const remainingLines = lines.filter((line) => line.draftId !== draftId);
    onChange(remainingLines.length ? remainingLines : [createSaleDraftLine()]);
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">Lignes de vente</p>
        <p className="text-xs text-muted-foreground">
          Chaque ligne correspond a une variante vendable du catalogue.
        </p>
      </div>

      <div className="space-y-3">
        {lines.map((line, index) => {
          const { lineTotal, unitPrice, variant } = getSaleLineValues(line, catalog);
          const fieldSuffix = line.draftId;

          return (
            <div
              key={line.draftId}
              className="grid gap-3 rounded-xl border bg-background px-4 py-4 lg:grid-cols-[1.35fr_0.55fr_0.8fr_0.7fr_auto]"
            >
              <div className="space-y-2">
                <Label htmlFor={`sale-line-variant-${fieldSuffix}`} className="text-[15px]">Variante</Label>
                <select
                  id={`sale-line-variant-${fieldSuffix}`}
                  className={selectClass}
                  value={line.variantId}
                  onChange={(event) => {
                    const nextVariant = catalog.find((item) => item.variantId === event.target.value);
                    updateLine(line.draftId, {
                      ...line,
                      variantId: event.target.value,
                      unitPrice: nextVariant?.salePrice,
                    });
                  }}
                >
                  <option value="">Selectionner une variante</option>
                  {catalog.map((item) => (
                    <option
                      key={item.variantId}
                      value={item.variantId}
                      disabled={item.variantId !== line.variantId && selectedVariantIds.has(item.variantId)}
                    >
                      {item.productName} - {item.unitCode} ({item.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`sale-line-quantity-${fieldSuffix}`} className="text-[15px]">Quantite</Label>
                <Input
                  id={`sale-line-quantity-${fieldSuffix}`}
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={lineInputClass}
                  value={line.quantity}
                  onChange={(event) => updateLine(line.draftId, { ...line, quantity: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[15px]">Prix unitaire</Label>
                <Input
                  className={lineInputClass}
                  value={variant || line.unitPrice !== undefined ? formatCurrency(unitPrice) : "-"}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[15px]">Total ligne</Label>
                <div className="rounded-md border bg-muted/40 px-3 py-2 text-[15px] font-medium">
                  {lineTotal ? formatCurrency(lineTotal) : "-"}
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Supprimer la ligne ${index + 1}`}
                  className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-900 dark:bg-red-950/40"
                  onClick={() => removeLine(line.draftId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={() => onChange([...lines, createSaleDraftLine()])}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une ligne
        </Button>
      </div>
    </div>
  );
}
