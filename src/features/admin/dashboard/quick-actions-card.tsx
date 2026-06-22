import { Boxes, PlusCircle, Settings, UserPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminNavItem } from "@/features/admin/constants";
import type { LucideIcon } from "lucide-react";

interface QuickAction {
  label: string;
  description: string;
  icon: LucideIcon;
  to: AdminNavItem["to"];
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Creer un type", description: "Ajouter un type de produit", icon: Boxes, to: "/admin/catalogue" },
  { label: "Creer un produit", description: "Referencer un nouveau produit", icon: PlusCircle, to: "/admin/catalogue" },
  { label: "Creer un agent", description: "Ajouter un utilisateur", icon: UserPlus, to: "/admin/utilisateurs" },
  { label: "Ouvrir les parametres", description: "Configuration globale", icon: Settings, to: "/admin/parametres" },
];

/**
 * Bloc 3 : raccourcis de configuration rapide.
 * Chaque action navigue vers le sous-ecran correspondant.
 */
export function QuickActionsCard() {
  return (
    <Card className="xl:col-span-1">
      <CardHeader>
        <CardTitle className="text-base">Configuration rapide</CardTitle>
        <CardDescription>Acces direct aux taches de mise en place</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-muted/60"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <action.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{action.label}</p>
              <p className="truncate text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
