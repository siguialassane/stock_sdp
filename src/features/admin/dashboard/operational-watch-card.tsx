import { ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/features/admin/components/empty-state";
import { ADMIN_OPERATIONAL_ALERTS } from "@/mocks/admin.mock";

const SEVERITY_VARIANT: Record<string, "warning" | "danger"> = {
  warning: "warning",
  danger: "danger",
};

/**
 * Bloc 4 : surveillance operationnelle.
 * Regroupe les alertes : ventes bloquees par impaye, sorties en attente
 * Magasin, produits bientot en rupture.
 */
export function OperationalWatchCard() {
  const alerts = ADMIN_OPERATIONAL_ALERTS;

  return (
    <Card className="xl:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          Surveillance operationnelle
        </CardTitle>
        <CardDescription>Points de blocage et ruptures a surveiller</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="Aucune alerte"
            description="Les blocages operationnels apparaîtront ici."
          />
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex items-start justify-between gap-3">
                <p className="text-sm">{alert.libelle}</p>
                <Badge variant={SEVERITY_VARIANT[alert.severite]} className="shrink-0">
                  {alert.type}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
