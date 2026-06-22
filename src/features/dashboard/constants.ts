import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Truck,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  icon: LucideIcon;
  active: boolean;
}

export const NAV_ITEMS: DashboardNavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Inventaire", icon: ClipboardList, active: false },
  { label: "Commandes", icon: ShoppingCart, active: false },
  { label: "Fournisseurs", icon: Truck, active: false },
  { label: "Rapports", icon: BarChart3, active: false },
  { label: "Parametres", icon: Settings, active: false },
];

export const REFERRER_DATA: Array<{ name: string; value: number }> = [];

export const DEVICE_DATA: Array<{ name: string; value: number }> = [];
