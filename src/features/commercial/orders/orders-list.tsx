import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import {
  canEditCommercialSale,
  type CommercialSale,
} from "@/features/commercial/types";
import {
  formatCommercialSaleDate,
  getCommercialSaleStatusLabel,
  getCommercialSaleStatusVariant,
} from "@/features/commercial/sales/sale-status";
import { formatCurrency } from "@/lib/format/currency";
import { Ban, Eye, FileText, PencilLine } from "lucide-react";

export function OrdersList({
  onCancel,
  onCreate,
  onEdit,
  onSelect,
  sales,
}: {
  onCancel: (sale: CommercialSale) => void;
  onCreate: () => void;
  onEdit: (sale: CommercialSale) => void;
  onSelect: (sale: CommercialSale) => void;
  sales: CommercialSale[];
}) {
  if (!sales.length) {
    return (
      <EmptyState
        icon={FileText}
        title="Aucune commande enregistree"
        description="Les commandes creees par le Commercial apparaitront ici avec leur statut de paiement."
        action={
          <Button type="button" onClick={onCreate}>
            Creer la premiere commande
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {sales.map((sale) => {
        return (
          <div key={sale.id} className="rounded-xl border bg-background px-4 py-4 transition-colors">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-foreground">{sale.customerName}</p>
                  <Badge variant={getCommercialSaleStatusVariant(sale.status)}>
                    {getCommercialSaleStatusLabel(sale.status)}
                  </Badge>
                  <Badge variant="outline">
                    {sale.customerTier === "grossiste" ? "Grossiste" : "Demi-grossiste"}
                  </Badge>
                  <Badge variant="secondary">{sale.orderNumber}</Badge>
                </div>

                <div className="grid gap-1 text-sm text-muted-foreground md:grid-cols-2 xl:grid-cols-5 xl:gap-4">
                  <p>{sale.lineCount} ligne(s)</p>
                  <p>{formatCommercialSaleDate(sale.createdAt)}</p>
                  <p className="font-medium text-foreground">{formatCurrency(sale.totalAmount)}</p>
                  {sale.cancelReason ? <p className="text-red-600">Motif : {sale.cancelReason}</p> : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" onClick={() => onSelect(sale)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Details
                </Button>
                {canEditCommercialSale(sale.status) ? (
                  <Button type="button" variant="outline" onClick={() => onEdit(sale)}>
                    <PencilLine className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                ) : null}
                {canEditCommercialSale(sale.status) ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onCancel(sale)}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Annuler
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
