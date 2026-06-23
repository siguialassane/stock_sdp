import { AlertTriangle, Boxes, PackageCheck, Truck, Users } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { useAdminStore } from "@/features/admin/store/admin-store";

/**
 * Bloc 1 du dashboard Admin : resume global en 5 KPIs.
 * Grille responsive : 1 colonne mobile, 2 en sm, 5 en xl.
 */
export function AdminKpiGrid() {
  const { products, agents } = useAdminStore();
  const totalProduitsActifs = products.filter((product) => product.actif).length;
  const totalAgentsActifs = agents.filter((agent) => agent.actif).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <MetricCard
        title="Produits actifs"
        value={`${totalProduitsActifs}`}
        helper="References parentes activees dans le catalogue"
        icon={Boxes}
      />
      <MetricCard
        title="Agents actifs"
        value={`${totalAgentsActifs}`}
        helper="Utilisateurs applicatifs actives"
        icon={Users}
      />
      <MetricCard
        title="Ventes en attente"
        value="—"
        helper="Disponible apres le branchement du module Caisse"
        icon={PackageCheck}
      />
      <MetricCard
        title="Pretes a sortir"
        value="—"
        helper="Disponible apres le branchement du flux Magasin"
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
