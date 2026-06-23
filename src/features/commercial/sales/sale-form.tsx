import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SaleCustomerFields } from "@/features/commercial/sales/sale-customer-fields";
import {
  calculateSaleTotal,
  createSaleDraftLines,
  getSaleLineValues,
} from "@/features/commercial/sales/sale-form.utils";
import { SaleLinesEditor } from "@/features/commercial/sales/sale-lines-editor";
import type {
  CommercialCatalogItem,
  CommercialCustomer,
  CommercialSale,
  CommercialSaleInput,
} from "@/features/commercial/types";

const textareaClass =
  "flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

interface SaleFormProps {
  customers: CommercialCustomer[];
  catalog: CommercialCatalogItem[];
  initialSale?: CommercialSale | null;
  isSaving: boolean;
  onSubmit: (input: CommercialSaleInput) => Promise<void>;
  submitLabel?: string;
  title?: string;
  description?: string;
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
}: SaleFormProps) {
  const [customerId, setCustomerId] = useState(initialSale?.customerId ?? "");
  const [notes, setNotes] = useState(initialSale?.notes ?? "");
  const [lines, setLines] = useState(() => createSaleDraftLines(initialSale));
  const [error, setError] = useState("");
  const activeCustomers = customers.filter((customer) => customer.isActive);

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
        const values = getSaleLineValues(line, catalog);
        return {
          variantId: line.variantId,
          quantity: values.quantity,
          unitPrice: values.unitPrice,
        };
      });

    if (!normalizedLines.length) {
      setError("Ajoutez au moins une ligne de vente.");
      return;
    }

    if (normalizedLines.some((line) => !Number.isFinite(line.quantity) || line.quantity <= 0)) {
      setError("Chaque ligne doit avoir une quantite superieure a zero.");
      return;
    }

    if (new Set(normalizedLines.map((line) => line.variantId)).size !== normalizedLines.length) {
      setError("Une variante ne peut apparaitre qu'une seule fois dans la commande.");
      return;
    }

    try {
      await onSubmit({ customerId, notes: notes.trim(), lines: normalizedLines });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enregistrement impossible.");
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/[0.025]">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <SaleCustomerFields
            customerId={customerId}
            customers={activeCustomers}
            orderTotal={calculateSaleTotal(lines, catalog)}
            onCustomerChange={setCustomerId}
          />

          <SaleLinesEditor catalog={catalog} lines={lines} onChange={setLines} />

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

          <Button type="submit" disabled={isSaving || !activeCustomers.length || !catalog.length}>
            {isSaving ? "Enregistrement..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
