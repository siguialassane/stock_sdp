import { PackageCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

/**
 * Ecran Receptions du Magasin.
 * Liste des receptions fournisseur (en attente, recues, annulees) et bouton
 * pour enregistrer une nouvelle livraison.
 * Etat vide propre en attendant Supabase (table purchase_receipts).
 */
export function MagasinReceptions() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Receptions"
        description="Livraisons fournisseur a enregistrer et a confirmer."
        action={<Button type="button">Nouvelle reception</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Receptions recentes</CardTitle>
          <CardDescription>Chaque reception confirmee cree une entree de stock.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={PackageCheck}
            title="Aucune reception enregistree"
            description="Les livraisons fournisseur apparaitront ici des qu'elles seront saisies."
            action={<Button type="button" variant="outline">Enregistrer la premiere reception</Button>}
          />
        </CardContent>
      </Card>
    </div>
  );
}
