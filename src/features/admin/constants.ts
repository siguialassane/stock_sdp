import {
  Boxes,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Element du menu de navigation Admin. */
export interface AdminNavItem {
  label: string;
  icon: LucideIcon;
  /** Chemin absolu type par TanStack Router. */
  to: "/admin/dashboard" | "/admin/catalogue" | "/admin/utilisateurs" | "/admin/parametres";
}

/**
 * Menu specifique a l'Admin.
 * Le dashboard de supervision + les 3 sous-ecrans de configuration.
 * La lecture sur Achats/Stock/Ventes/Caisse/Finance viendra plus tard.
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Tableau de bord", icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Catalogue", icon: Boxes, to: "/admin/catalogue" },
  { label: "Utilisateurs", icon: Users, to: "/admin/utilisateurs" },
  { label: "Parametres", icon: Settings, to: "/admin/parametres" },
];
