import { Warehouse } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

/**
 * Ecran Stock du Magasin.
 * Liste les references en stock (variantes) avec leur quantite et seuil.
 * Etat vide propre en attendant le branchement Supabase (table stock_balances).
 */
export function MagasinStock() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock"
        description="Etat du stock par variante dans l'entrepot unique."
        action={<Button type="button" variant="outline">Ajuster le stock</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">References en stock</CardTitle>
          <CardDescription>Quantites disponibles et seuils d'alerte par variante.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Warehouse}
            title="Aucune reference en stock"
            description="Le stock sera alimente par les receptions fournisseur une fois Supabase branche."
            action={<Button type="button" variant="outline">Enregistrer une reception</Button>}
          />
        </CardContent>
      </Card>
    </div>
  );
}
