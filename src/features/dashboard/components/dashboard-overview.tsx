import { AlertTriangle, DollarSign, Package, ShoppingCart } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryTableCard } from "@/features/dashboard/components/inventory-table-card";
import { OverviewBars } from "@/features/dashboard/components/overview-bars";
import { RecentSalesCard } from "@/features/dashboard/components/recent-sales-card";
import { formatCurrency } from "@/lib/format/currency";
import type { DashboardMetrics, InventoryItem, OverviewPoint, RecentSale } from "@/features/dashboard/types";
import type { ColumnDef, Table } from "@tanstack/react-table";

interface DashboardOverviewProps {
  columns: ColumnDef<InventoryItem>[];
  isLoading: boolean;
  metrics: DashboardMetrics;
  overview: OverviewPoint[];
  recentSales: RecentSale[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  table: Table<InventoryItem>;
}

export function DashboardOverview({
  columns,
  isLoading,
  metrics,
  overview,
  recentSales,
  searchQuery,
  setSearchQuery,
  table,
}: DashboardOverviewProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Valeur du stock"
          value={formatCurrency(metrics.totalInventoryValue)}
          helper="En attente des donnees reelles de stock"
          icon={DollarSign}
        />
        <MetricCard
          title="References actives"
          value={`${table.options.data.length}`}
          helper={`${metrics.totalStockItems} unite(s) actuellement en stock`}
          icon={Package}
        />
        <MetricCard
          title="Ventes recentes"
          value={formatCurrency(metrics.totalSalesValue)}
          helper={`${recentSales.length} transaction(s) enregistree(s)`}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Alertes stock"
          value={`${metrics.lowStockCount + metrics.outOfStockCount}`}
          helper={`${metrics.outOfStockCount} rupture(s) a traiter`}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Vue d'ensemble du module stock des que les donnees seront disponibles.</CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewBars data={overview} />
          </CardContent>
        </Card>

        <RecentSalesCard recentSales={recentSales} />
      </div>

      <InventoryTableCard
        columns={columns}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        table={table}
      />
    </>
  );
}
