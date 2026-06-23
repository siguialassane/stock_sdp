import { Truck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

/**
 * Ecran Sorties du Magasin.
 * Liste des ventes pretes a sortir (statut ready_for_release) que le Magasin
 * doit valider physiquement. Regle v1 : sortie autorisee apres paiement complet.
 * Etat vide propre en attendant Supabase (table sales_deliveries).
 */
export function MagasinSorties() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sorties"
        description="Validation de la sortie physique des ventes payees."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sorties en attente de validation</CardTitle>
          <CardDescription>
            Ventes au statut "prete a sortir" - la confirmation cree un mouvement de sortie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Truck}
            title="Aucune sortie en attente"
            description="Les ventes payees pretes a sortir apparaitront ici."
          />
        </CardContent>
      </Card>
    </div>
  );
}
