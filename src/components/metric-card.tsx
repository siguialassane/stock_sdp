import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}

/**
 * Carte KPI reutilisable.
 * Le helper (statistique detaillee) est masque par defaut et revele au survol
 * de la card (glisse + fondu), dans une zone reservee pour eviter tout saut de hauteur.
 *
 * Partage entre les tableaux de bord par role.
 */
export function MetricCard({ title, value, helper, icon: Icon }: MetricCardProps) {
  return (
    <Card className="group transition-all duration-300 hover:border-primary/30 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="relative h-5 overflow-hidden">
          <p
            className={cn(
              "text-xs text-muted-foreground transition-all duration-500 ease-out",
              "absolute inset-0 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
            )}
          >
            {helper}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
