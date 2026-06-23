import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MagasinKpiGrid } from "@/features/magasin/dashboard/magasin-kpi-grid";
import { ReceptionsPendingCard } from "@/features/magasin/dashboard/receptions-pending-card";
import { SortiesToValidateCard } from "@/features/magasin/dashboard/sorties-to-validate-card";
import { StockAlertsCard } from "@/features/magasin/dashboard/stock-alerts-card";
import type {
  Reception,
  Sortie,
  StockAlert,
} from "@/features/magasin/types";

/**
 * Tableau de bord du role Magasin.
 * Front uniquement pour ce jet : listes vides sans fausses valeurs metier,
 * pretes pour le branchement Supabase.
 *
 * 4 blocs :
 *   1. Resume global (KPIs)
 *   2. Receptions en attente
 *   3. Sorties a valider
 *   4. Alertes de stock
 */
export function MagasinDashboard() {
  // Donnees volontairement videes (front seul). Voir mocks quand Supabase sera branche.
  const receptions: Reception[] = [];
  const sorties: Sortie[] = [];
  const alerts: StockAlert[] = [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble des receptions, du stock et des sorties a valider."
      />

      <MagasinKpiGrid />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ReceptionsPendingCard receptions={receptions} />
        <SortiesToValidateCard sorties={sorties} />
        <StockAlertsCard alerts={alerts} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rappel du flux Magasin</CardTitle>
          <CardDescription>Role operationnel : reception, stock et sortie physique.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>1. Le Magasin enregistre ou confirme la reception fournisseur, ce qui cree une entree de stock.</p>
          <p>2. Si l'achat n'est pas paye, une dette fournisseur est creee cote Finance.</p>
          <p>3. Apres paiement complet d'une vente, le Magasin valide la sortie physique (statut released).</p>
          <p>4. La sortie n'est jamais autorisee avant paiement complet au v1.</p>
        </CardContent>
      </Card>
    </div>
  );
}
