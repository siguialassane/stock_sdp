export interface InventoryItem {
  id: number;
  produit: string;
  categorie: string;
  quantite: number;
  prixUnitaire: number;
  statut: "En stock" | "Stock faible" | "Rupture";
}

export interface RecentSale {
  id: number;
  client: string;
  email: string;
  montant: number;
  initials: string;
}

export interface OverviewPoint {
  month: string;
  total: number;
}

export interface DashboardPayload {
  inventory: InventoryItem[];
  recentSales: RecentSale[];
  overview: OverviewPoint[];
}

export interface DashboardMetrics {
  totalStockItems: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalSalesValue: number;
}
