import { useMemo } from "react";

import type {
  DashboardMetrics,
  InventoryItem,
  RecentSale,
} from "@/features/dashboard/types";

export function useDashboardMetrics(
  inventory: InventoryItem[],
  recentSales: RecentSale[],
): DashboardMetrics {
  return useMemo(
    () => ({
      totalStockItems: inventory.reduce((sum, item) => sum + item.quantite, 0),
      totalInventoryValue: inventory.reduce(
        (sum, item) => sum + item.quantite * item.prixUnitaire,
        0,
      ),
      lowStockCount: inventory.filter((item) => item.statut === "Stock faible").length,
      outOfStockCount: inventory.filter((item) => item.statut === "Rupture").length,
      totalSalesValue: recentSales.reduce((sum, item) => sum + item.montant, 0),
    }),
    [inventory, recentSales],
  );
}
