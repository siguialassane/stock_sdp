import { AlertTriangle, PackageCheck, Truck, Warehouse } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
/**
 * Bloc KPIs du tableau de bord Magasin : references en stock, receptions en
 * attente, sorties a valider, alertes stock.
 */
export function MagasinKpiGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="References en stock"
        value="—"
        helper="Disponible apres le branchement du stock"
        icon={Warehouse}
      />
      <MetricCard
        title="Receptions en attente"
        value="—"
        helper="Disponible apres le branchement des achats"
        icon={PackageCheck}
      />
      <MetricCard
        title="Sorties a valider"
        value="—"
        helper="Disponible apres le branchement des ventes"
        icon={Truck}
      />
      <MetricCard
        title="Alertes stock"
        value="—"
        helper="Disponible apres le branchement du stock"
        icon={AlertTriangle}
      />
    </div>
  );
}
