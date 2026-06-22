import { useState, useTransition } from "react";

import { DashboardAnalytics } from "@/features/dashboard/components/dashboard-analytics";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { useDashboardMetrics } from "@/features/dashboard/hooks/use-dashboard-metrics";
import { useInventoryTable } from "@/features/dashboard/hooks/use-inventory-table";
import { useDashboardQuery } from "@/features/dashboard/queries/use-dashboard-query";
import { cn } from "@/lib/utils";

interface DashboardScreenProps {
  onLogout: () => void;
}

export function DashboardScreen({ onLogout }: DashboardScreenProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">("overview");
  const [, startTransition] = useTransition();

  const { data, isLoading } = useDashboardQuery();
  const inventory = data?.inventory ?? [];
  const recentSales = data?.recentSales ?? [];
  const overview = data?.overview ?? [];

  const metrics = useDashboardMetrics(inventory, recentSales);
  const { columns, searchQuery, setSearchQuery, table } = useInventoryTable(inventory);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="grid min-h-screen md:grid-cols-[auto_1fr]">
        <DashboardSidebar
          onLogout={onLogout}
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        <div className="flex min-w-0 flex-col">
          <DashboardHeader
            onSearchChange={setSearchQuery}
            onToggleSidebar={handleToggleSidebar}
            searchQuery={searchQuery}
            sidebarOpen={sidebarOpen}
          />

          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                {(["overview", "analytics"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => startTransition(() => setActiveTab(tab))}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      activeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    )}
                  >
                    {tab === "overview" ? "Overview" : "Analytics"}
                  </button>
                ))}
              </div>

              {activeTab === "overview" ? (
                <DashboardOverview
                  columns={columns}
                  isLoading={isLoading}
                  metrics={metrics}
                  overview={overview}
                  recentSales={recentSales}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  table={table}
                />
              ) : (
                <DashboardAnalytics overview={overview} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
