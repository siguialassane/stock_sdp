import {
  ClipboardList,
  LayoutDashboard,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";

interface CommercialNavItem {
  label: string;
  icon: LucideIcon;
  to:
    | "/commercial/dashboard"
    | "/commercial/ventes"
    | "/commercial/commandes"
    | "/commercial/clients";
}

export const COMMERCIAL_NAV_ITEMS: CommercialNavItem[] = [
  { label: "Tableau de bord", icon: LayoutDashboard, to: "/commercial/dashboard" },
  { label: "Clients", icon: Users, to: "/commercial/clients" },
  { label: "Ventes", icon: ShoppingCart, to: "/commercial/ventes" },
  { label: "Commandes", icon: ClipboardList, to: "/commercial/commandes" },
];
