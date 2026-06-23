import { Badge } from "@/components/ui/badge";
import type { CommercialSale } from "@/features/commercial/types";
import {
  formatCommercialSaleDate,
  getCommercialSaleStatusLabel,
  getCommercialSaleStatusVariant,
} from "@/features/commercial/sales/sale-status";
import { formatCurrency } from "@/lib/format/currency";

export function OrderDetailCard({ sale }: { sale: CommercialSale }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold text-foreground">{sale.customerName}</p>
            <Badge variant={getCommercialSaleStatusVariant(sale.status)}>
              {getCommercialSaleStatusLabel(sale.status)}
            </Badge>
            <Badge variant="outline">{sale.orderNumber}</Badge>
          </div>
          <div className="grid gap-1 text-sm text-muted-foreground md:grid-cols-2 xl:grid-cols-4 xl:gap-4">
            <p>Type : {sale.customerTier === "grossiste" ? "Grossiste" : "Demi-grossiste"}</p>
            <p>Date : {formatCommercialSaleDate(sale.createdAt)}</p>
            <p>{sale.lineCount} ligne(s)</p>
            {sale.cancelledAt ? <p>Annulee le : {formatCommercialSaleDate(sale.cancelledAt)}</p> : null}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Montant total</p>
          <p className="text-lg font-semibold text-emerald-700">{formatCurrency(sale.totalAmount)}</p>
        </div>
      </div>

      {sale.cancelReason ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
          <p className="text-sm font-medium text-red-700">Motif d'annulation</p>
          <p className="mt-1 text-sm text-red-700/90">{sale.cancelReason}</p>
        </div>
      ) : null}

      <div className="rounded-xl border bg-background">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.6fr_0.8fr] gap-3 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
          <p>Article</p>
          <p>Variante</p>
          <p>Quantite</p>
          <p>Total</p>
        </div>

        <div className="divide-y">
          {sale.lines.map((line) => (
            <div
              key={line.id}
              className="grid grid-cols-[1.4fr_0.8fr_0.6fr_0.8fr] gap-3 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-foreground">{line.productName}</p>
                <p className="text-muted-foreground">SKU {line.sku}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">{line.unitCode}</p>
                <p className="text-muted-foreground">{line.typeName}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">{line.quantity}</p>
                <p className="text-muted-foreground">{formatCurrency(line.unitPrice)}</p>
              </div>
              <div className="font-medium text-foreground">{formatCurrency(line.lineTotal)}</div>
            </div>
          ))}
        </div>
      </div>

      {sale.notes ? (
        <div className="rounded-xl border bg-background px-4 py-4">
          <p className="text-sm font-medium text-foreground">Notes</p>
          <p className="mt-1 text-sm text-muted-foreground">{sale.notes}</p>
        </div>
      ) : null}
    </div>
  );
}
