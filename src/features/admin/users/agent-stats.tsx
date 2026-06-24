import { useAdminStore } from "@/features/admin/store/admin-store";

const statItems = [
  { key: "total", label: "Total", filter: () => true },
  { key: "active", label: "Actifs", filter: (statut: string) => statut === "active" },
  { key: "pending", label: "En attente", filter: (statut: string) => statut === "pending" },
  { key: "suspended", label: "Suspendus", filter: (statut: string) => statut === "suspended" },
] as const;

export function AgentStats() {
  const { agents } = useAdminStore();

  return (
    <div className="grid grid-cols-2 divide-x divide-border rounded-lg border xl:grid-cols-4">
      {statItems.map((item) => {
        const count = agents.filter((agent) => item.filter(agent.statut)).length;
        return (
          <div key={item.key} className="px-4 py-3 sm:px-5 sm:py-4">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{count}</p>
          </div>
        );
      })}
    </div>
  );
}
