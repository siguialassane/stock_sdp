import { Link } from "@tanstack/react-router";
import { ChevronRight, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import type { StockAlert } from "@/features/magasin/types";

const SEVERITY_VARIANT: Record<string, "warning" | "danger"> = {
  warning: "warning",
  danger: "danger",
};

interface StockAlertsCardProps {
  alerts: StockAlert[];
}

/**
 * Bloc du dashboard : alertes de stock (faible et rupture).
 * Lien rapide vers l'ecran Stock pour le detail.
 */
export function StockAlertsCard({ alerts }: StockAlertsCardProps) {
  return (
    <Card className="xl:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          Alertes de stock
        </CardTitle>
        <CardDescription>References en seuil bas ou en rupture</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="Aucune alerte"
            description="Les seuils de stock sont respectes."
          />
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{alert.produit}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {alert.varianteCode} · {alert.quantite} en stock
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={SEVERITY_VARIANT[alert.severite]}>
                    {alert.severite === "danger" ? "Rupture" : "Faible"}
                  </Badge>
                  <Link to="/magasin/stock" aria-label="Voir le stock">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
