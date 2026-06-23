import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CommercialCustomer } from "@/features/commercial/types";
import { formatCurrency } from "@/lib/format/currency";

const selectClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-[15px] outline-none focus:border-primary";

interface SaleCustomerFieldsProps {
  customerId: string;
  customers: CommercialCustomer[];
  orderTotal: number;
  onCustomerChange: (customerId: string) => void;
}

export function SaleCustomerFields({
  customerId,
  customers,
  orderTotal,
  onCustomerChange,
}: SaleCustomerFieldsProps) {
  const selectedCustomer = customers.find((customer) => customer.id === customerId);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-2">
        <Label htmlFor="sale-customer">Client</Label>
        <div className="flex items-center gap-2">
          <select
            id="sale-customer"
            className={selectClass}
            value={customerId}
            onChange={(event) => onCustomerChange(event.target.value)}
          >
            <option value="">Selectionner un client</option>
            {customers.map((customer) => (
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
              ) : null}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Montant estime</Label>
        <output className="flex h-14 items-center rounded-md border border-emerald-200 bg-emerald-50 px-4 text-lg font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {formatCurrency(orderTotal)}
        </output>
      </div>
    </div>
  );
}
