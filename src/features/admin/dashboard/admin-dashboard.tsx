import { PageHeader } from "@/components/page-header";
import { AdminKpiGrid } from "@/features/admin/dashboard/admin-kpi-grid";
import { AgentActivityCard } from "@/features/admin/dashboard/agent-activity-card";
import { OperationalWatchCard } from "@/features/admin/dashboard/operational-watch-card";
import { QuickActionsCard } from "@/features/admin/dashboard/quick-actions-card";

/**
 * Tableau de bord de supervision Admin.
 * 4 blocs selon le plan produit :
 *   1. Resume global (KPIs)
 *   2. Activite des agents
 *   3. Configuration rapide
 *   4. Surveillance operationnelle
 */
export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
      />

      <AdminKpiGrid />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <AgentActivityCard />
        <QuickActionsCard />
        <OperationalWatchCard />
      </div>
    </div>
  );
}
