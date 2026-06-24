import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ListCollapse, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CancelOrderDialog } from "@/features/commercial/orders/cancel-order-dialog";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/components/toast/toast";
import { commercialQueryKeys, useCommercialSalesQuery } from "@/features/commercial/queries";
import { OrderDetailDialog } from "@/features/commercial/orders/order-detail-dialog";
import { OrderDetailCard } from "@/features/commercial/orders/order-detail-card";
import { OrdersList } from "@/features/commercial/orders/orders-list";
import { cancelCommercialSale } from "@/features/commercial/services/commercial.service";
import { useCommercialSalesDraft } from "@/features/commercial/store/commercial-sales-draft-context";
import type { CommercialSale } from "@/features/commercial/types";

export function CommercialOrders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { startEditingSale } = useCommercialSalesDraft();
  const { data: sales = [], error: salesError } = useCommercialSalesQuery();
  const [cancelTarget, setCancelTarget] = useState<CommercialSale | null>(null);
  const [detailSaleId, setDetailSaleId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionError, setActionError] = useState("");

  const selectedSale = detailSaleId ? sales.find((sale) => sale.id === detailSaleId) ?? null : null;

  const handleEdit = async (sale: CommercialSale) => {
    startEditingSale(sale);
    await navigate({ to: "/commercial/ventes" });
  };

  const handleCancel = async (reason: string) => {
    if (!cancelTarget) return;

    setIsCancelling(true);
    setActionError("");

    try {
      const updatedSale = await cancelCommercialSale(cancelTarget.id, { reason });

      queryClient.setQueryData<CommercialSale[]>(commercialQueryKeys.sales, (current = []) =>
        current.map((sale) => (sale.id === updatedSale.id ? updatedSale : sale)),
      );
      queryClient.invalidateQueries({ queryKey: commercialQueryKeys.sales });
      setCancelTarget(null);
      setDetailSaleId(updatedSale.id);
      toast.warning({ title: "Commande annulee", message: `${cancelTarget.customerName} - ${cancelTarget.orderNumber} a ete annulee.` });
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Annulation impossible.";
      setActionError(message);
      toast.error({ title: "Annulation impossible", message });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commandes"
        description="Consultez les commandes du Commercial dans une liste compacte, puis ouvrez le detail seulement quand c'est utile."
        action={
          <Button type="button" onClick={() => void navigate({ to: "/commercial/ventes" })}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle vente
          </Button>
        }
      />

      {salesError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {salesError instanceof Error ? salesError.message : "Chargement impossible."}
        </p>
      ) : null}
      {actionError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {actionError}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ListCollapse className="h-4 w-4" />
            Historique des commandes ({sales.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersList
            onCancel={(sale) => setCancelTarget(sale)}
            sales={sales}
            onCreate={() => void navigate({ to: "/commercial/ventes" })}
            onEdit={(sale) => void handleEdit(sale)}
            onSelect={(sale) => setDetailSaleId(sale.id)}
          />
        </CardContent>
      </Card>

      {selectedSale ? (
        <OrderDetailDialog
          title={selectedSale.customerName}
          subtitle={`${selectedSale.orderNumber} - ${selectedSale.customerTier === "grossiste" ? "Grossiste" : "Demi-grossiste"}`}
          onClose={() => setDetailSaleId(null)}
        >
          <OrderDetailCard sale={selectedSale} />
        </OrderDetailDialog>
      ) : null}

      {cancelTarget ? (
        <CancelOrderDialog
          isSaving={isCancelling}
          order={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancel}
        />
      ) : null}
    </div>
  );
}
