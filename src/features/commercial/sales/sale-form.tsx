import { useEffect, useState, type FormEvent } from "react";
import { Info, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type {
  CommercialCatalogItem,
  CommercialCustomer,
  CommercialSale,
  CommercialSaleDraftLine,
  CommercialSaleInput,
} from "@/features/commercial/types";
import { formatCurrency } from "@/lib/format/currency";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const textareaClass =
  "flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const lineInputClass = "h-11 text-[15px]";

function buildEmptyLine(): CommercialSaleDraftLine {
  return { variantId: "", quantity: "1" };
}

function buildVariantLabel(item: CommercialCatalogItem) {
  return `${item.productName} - ${item.unitCode} (${item.sku})`;
}

export function SaleForm({
  customers,
  catalog,
  initialSale,
  isSaving,
  onSubmit,
  submitLabel = "Enregistrer la vente",
  title = "Nouvelle vente",
  description = "Saisissez d'abord le client, puis ajoutez les variantes vendues avec leur quantite.",
}: {
  customers: CommercialCustomer[];
  catalog: CommercialCatalogItem[];
  initialSale?: CommercialSale | null;
  isSaving: boolean;
  onSubmit: (input: CommercialSaleInput) => Promise<void>;
  submitLabel?: string;
  title?: string;
  description?: string;
}) {
  const [customerId, setCustomerId] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<CommercialSaleDraftLine[]>([buildEmptyLine()]);
  const [error, setError] = useState("");

  const activeCustomers = customers.filter((customer) => customer.isActive);
  const selectedCustomer = activeCustomers.find((customer) => customer.id === customerId);

  const handleLineChange = (index: number, nextLine: CommercialSaleDraftLine) => {
    setLines((current) => current.map((line, lineIndex) => (lineIndex === index ? nextLine : line)));
  };

  useEffect(() => {
    if (!initialSale) {
      setCustomerId("");
      setNotes("");
      setLines([buildEmptyLine()]);
      setError("");
      return;
    }

    setCustomerId(initialSale.customerId);
    setNotes(initialSale.notes);
    setLines(
      initialSale.lines.length
        ? initialSale.lines.map((line) => ({
            variantId: line.variantId,
            quantity: String(line.quantity),
            unitPrice: line.unitPrice,
          }))
        : [buildEmptyLine()],
    );
    setError("");
  }, [initialSale]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!customerId) {
      setError("Selectionnez d'abord un client.");
      return;
    }

    const normalizedLines = lines
      .filter((line) => line.variantId && line.quantity.trim())
      .map((line) => {
        const variant = catalog.find((item) => item.variantId === line.variantId);
        return {
          variantId: line.variantId,
          quantity: Number(line.quantity),
          unitPrice: line.unitPrice ?? variant?.salePrice ?? 0,
        };
      });

    if (!normalizedLines.length) {
      setError("Ajoutez au moins une ligne de vente.");
      return;
    }

    if (normalizedLines.some((line) => Number.isNaN(line.quantity) || line.quantity <= 0)) {
      setError("Chaque ligne doit avoir une quantite superieure a zero.");
      return;
    }

    try {
      await onSubmit({
        customerId,
        notes: notes.trim(),
        lines: normalizedLines,
      });

      if (!initialSale) {
        setCustomerId("");
        setNotes("");
        setLines([buildEmptyLine()]);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enregistrement impossible.");
    }
  };

  const orderTotal = lines.reduce((total, line) => {
    const variant = catalog.find((item) => item.variantId === line.variantId);
    const quantity = Number(line.quantity);
    const unitPrice = line.unitPrice ?? variant?.salePrice ?? 0;
    if ((!variant && !line.unitPrice) || Number.isNaN(quantity) || quantity <= 0) return total;
    return total + quantity * unitPrice;
  }, 0);

  return (
    <Card className="border-primary/20 bg-primary/[0.025]">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-2">
              <Label htmlFor="sale-customer">Client</Label>
              <div className="flex items-center gap-2">
                <select
                  id="sale-customer"
                  className={`${selectClass} h-11 flex-1 text-[15px]`}
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                >
                  <option value="">Selectionner un client</option>
                  {activeCustomers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.fullName} - {customer.tier === "grossiste" ? "Grossiste" : "Demi-grossiste"}
                    </option>
                  ))}
                </select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 shrink-0"
                      disabled={!selectedCustomer}
                      aria-label="Voir le detail du client"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 space-y-3">
                    {selectedCustomer ? (
                      <>
                        <div>
                          <p className="text-sm font-semibold">{selectedCustomer.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedCustomer.tier === "grossiste" ? "Grossiste" : "Demi-grossiste"}
                          </p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Telephone :</span> {selectedCustomer.phone || "Non renseigne"}</p>
                          <p><span className="font-medium">Adresse :</span> {selectedCustomer.address || "Non renseignee"}</p>
                          <p><span className="font-medium">Notes :</span> {selectedCustomer.notes || "Aucune note"}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Selectionnez d'abord un client pour voir sa fiche rapide.</p>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale-total">Montant estime</Label>
              <div
                id="sale-total"
                className="flex h-14 items-center rounded-md border border-emerald-200 bg-emerald-50 px-4 text-lg font-semibold text-emerald-700"
              >
                {formatCurrency(orderTotal)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Lignes de vente</p>
                <p className="text-xs text-muted-foreground">
                  Chaque ligne correspond a une variante vendable du catalogue.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {lines.map((line, index) => {
                const variant = catalog.find((item) => item.variantId === line.variantId);
                const selectedVariantIds = new Set(
                  lines
                    .map((entry, entryIndex) => (entryIndex === index ? "" : entry.variantId))
                    .filter(Boolean),
                );
                const quantity = Number(line.quantity);
                const unitPrice = line.unitPrice ?? variant?.salePrice ?? 0;
                const lineTotal =
                  (variant || line.unitPrice) && !Number.isNaN(quantity) && quantity > 0
                    ? quantity * unitPrice
                    : 0;
                const variantFieldId = `sale-line-variant-${index}`;
                const quantityFieldId = `sale-line-quantity-${index}`;
                const unitPriceFieldId = `sale-line-unit-price-${index}`;

                return (
                  <div
                    key={`${index}-${line.variantId}`}
                    className="grid gap-3 rounded-xl border bg-background px-4 py-4 lg:grid-cols-[1.35fr_0.55fr_0.8fr_0.7fr_auto]"
                  >
                    <div className="space-y-2">
                      <Label htmlFor={variantFieldId} className="text-[15px]">Variante</Label>
                      <select
                        id={variantFieldId}
                        className={`${selectClass} ${lineInputClass}`}
                        value={line.variantId}
                        onChange={(event) =>
                          handleLineChange(index, {
                            ...line,
                            variantId: event.target.value,
                            unitPrice:
                              catalog.find((item) => item.variantId === event.target.value)?.salePrice ??
                              undefined,
                          })
                        }
                      >
                        <option value="">Selectionner une variante</option>
                        {catalog.map((item) => (
                          <option
                            key={item.variantId}
                            value={item.variantId}
                            disabled={selectedVariantIds.has(item.variantId)}
                          >
                            {buildVariantLabel(item)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={quantityFieldId} className="text-[15px]">Quantite</Label>
                      <Input
                        id={quantityFieldId}
                        type="number"
                        min="0.01"
                        step="0.01"
                        className={lineInputClass}
                        value={line.quantity}
                        onChange={(event) =>
                          handleLineChange(index, { ...line, quantity: event.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={unitPriceFieldId} className="text-[15px]">Prix unitaire</Label>
                      <Input
                        id={unitPriceFieldId}
                        className={lineInputClass}
                        value={line.unitPrice || variant ? formatCurrency(line.unitPrice ?? variant?.salePrice ?? 0) : "-"}
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[15px]">Total ligne</Label>
                      <div className="rounded-md border bg-muted/40 px-3 py-2 text-[15px] font-medium">
                        {lineTotal ? formatCurrency(lineTotal) : "-"}
                      </div>
                    </div>

                    <div className="flex items-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                        onClick={() =>
                          setLines((current) =>
                            current.length === 1 ? [buildEmptyLine()] : current.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLines((current) => [...current, buildEmptyLine()])}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une ligne
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sale-notes">Notes</Label>
            <textarea
              id="sale-notes"
              className={textareaClass}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Remarques internes sur la vente"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSaving || !activeCustomers.length || !catalog.length}
            >
              {isSaving ? "Enregistrement..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
