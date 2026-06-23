import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight, ShoppingCart } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import {
  commercialQueryKeys,
  useCommercialCatalogQuery,
  useCommercialCustomersQuery,
  useCommercialSalesQuery,
} from "@/features/commercial/queries";
import { SaleForm } from "@/features/commercial/sales/sale-form";
import {
  createCommercialSale,
  updateCommercialSale,
} from "@/features/commercial/services/commercial.service";
import { useCommercialSalesDraft } from "@/features/commercial/store/commercial-sales-draft-context";
import { canEditCommercialSale, type CommercialSale, type CommercialSaleInput } from "@/features/commercial/types";

export function CommercialSales() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearEditingSale, draftSale } = useCommercialSalesDraft();
  const { data: catalog = [], error: catalogError } = useCommercialCatalogQuery();
  const { data: customers = [], error: customersError } = useCommercialCustomersQuery();
  const { data: sales = [], error: salesError } = useCommercialSalesQuery();
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const editingSale = draftSale ? sales.find((sale) => sale.id === draftSale.id) ?? draftSale : null;
  const activeCustomers = customers.filter((customer) => customer.isActive);
  const canCreateSale = activeCustomers.length > 0 && catalog.length > 0;
  const loadError = catalogError ?? customersError ?? salesError;

  useEffect(() => {
    if (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Chargement impossible.");
      return;
    }

    setError("");
  }, [loadError]);

  useEffect(() => {
    if (editingSale && !canEditCommercialSale(editingSale.status)) {
      clearEditingSale();
      setError("Cette commande ne peut plus etre modifiee apres une validation de paiement.");
    }
  }, [clearEditingSale, editingSale]);

  const handleSubmit = async (input: CommercialSaleInput) => {
    setIsSaving(true);

    try {
      let savedSale: CommercialSale;

      if (editingSale) {
        savedSale = await updateCommercialSale(editingSale.id, input);
      } else {
        savedSale = await createCommercialSale(input);
      }

      queryClient.setQueryData<CommercialSale[]>(commercialQueryKeys.sales, (current = []) => {
        if (editingSale) {
          return current.map((sale) => (sale.id === savedSale.id ? savedSale : sale));
        }

        return [savedSale, ...current];
      });

      queryClient.invalidateQueries({ queryKey: commercialQueryKeys.sales });
      setError("");
      clearEditingSale();
      await navigate({ to: "/commercial/commandes" });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enregistrement impossible.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={editingSale ? "Modifier une commande" : "Ventes"}
        description={
          editingSale
            ? "La commande reste modifiable tant que la Caisse n'a pas encore valide un paiement."
            : "Le Commercial saisit ici une nouvelle commande sans afficher l'historique sur ce meme ecran."
        }
        action={
          <Button type="button" variant="outline" onClick={() => void navigate({ to: "/commercial/commandes" })}>
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Aller aux commandes
          </Button>
        }
      />

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {canCreateSale ? (
        <SaleForm
          catalog={catalog}
          customers={customers}
          initialSale={editingSale}
          isSaving={isSaving}
          submitLabel={editingSale ? "Enregistrer les modifications" : "Enregistrer la vente"}
          title={editingSale ? `Commande ${editingSale.orderNumber}` : "Nouvelle vente"}
          description={
            editingSale
              ? "Mettez a jour le client, les lignes et les quantites avant la validation Caisse."
              : "Saisissez d'abord le client, puis ajoutez les variantes vendues avec leur quantite."
          }
          onSubmit={handleSubmit}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Impossible de creer une vente pour le moment</CardTitle>
          </CardHeader>
          <CardContent>
            {!activeCustomers.length ? (
              <EmptyState
                icon={ShoppingCart}
                title="Ajoutez d'abord un client actif"
                description="Une commande Commerciale doit toujours etre rattachee a un grossiste ou demi-grossiste existant."
                action={
                  <Button asChild type="button">
                    <Link to="/commercial/clients">Ouvrir les clients</Link>
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={ShoppingCart}
                title="Aucune variante active"
                description="L'Admin doit d'abord activer des produits et variantes dans le catalogue avant toute saisie."
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
