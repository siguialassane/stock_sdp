import { AlertTriangle, PackageCheck, Truck, Warehouse } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import type { MagasinKpis } from "@/features/magasin/types";

interface MagasinKpiGridProps {
  kpis: MagasinKpis;
}

/**
 * Bloc KPIs du tableau de bord Magasin : references en stock, receptions en
 * attente, sorties a valider, alertes stock.
 */
export function MagasinKpiGrid({ kpis }: MagasinKpiGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="References en stock"
        value={`${kpis.referencesEnStock}`}
        helper="Variantes actuellement disponibles dans l'entrepot"
        icon={Warehouse}
      />
      <MetricCard
        title="Receptions en attente"
        value={`${kpis.receptionsEnAttente}`}
        helper="Livraisons fournisseur a confirmer"
        icon={PackageCheck}
      />
      <MetricCard
        title="Sorties a valider"
        value={`${kpis.sortiesAValider}`}
        helper="Ventes payees pretes a sortir"
        icon={Truck}
      />
      <MetricCard
        title="Alertes stock"
        value={`${kpis.alertesStock}`}
        helper="Stock faible et ruptures confondus"
        icon={AlertTriangle}
      />
    </div>
  );
}
