import {
  LayoutDashboard,
  PackageCheck,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

/** Element du menu de navigation Magasin. */
export interface MagasinNavItem {
  label: string;
  icon: LucideIcon;
  /** Chemin absolu type par TanStack Router. */
  to: "/magasin/dashboard" | "/magasin/stock" | "/magasin/receptions" | "/magasin/sorties";
}

/**
 * Menu specifique au role Magasin.
 * Le Magasin gere : le stock, les receptions fournisseur et la validation
 * des sorties de ventes (apres paiement complet, voir plan.md).
 */
export const MAGASIN_NAV_ITEMS: MagasinNavItem[] = [
  { label: "Tableau de bord", icon: LayoutDashboard, to: "/magasin/dashboard" },
  { label: "Stock", icon: Warehouse, to: "/magasin/stock" },
  { label: "Receptions", icon: PackageCheck, to: "/magasin/receptions" },
  { label: "Sorties", icon: Truck, to: "/magasin/sorties" },
];
