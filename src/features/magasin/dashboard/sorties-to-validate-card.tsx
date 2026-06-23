import { Link } from "@tanstack/react-router";
import { ChevronRight, Truck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { formatCurrency } from "@/lib/format/currency";
import type { Sortie } from "@/features/magasin/types";

interface SortiesToValidateCardProps {
  sorties: Sortie[];
}

/**
 * Bloc du dashboard : sorties de ventes a valider par le Magasin.
 * Regle v1 (plan.md) : la sortie n'est autorisee qu'apres paiement complet,
 * donc ces ventes sont deja au statut ready_for_release.
 */
export function SortiesToValidateCard({ sorties }: SortiesToValidateCardProps) {
  const ready = sorties.filter((item) => item.statut === "ready_for_release");

  return (
    <Card className="xl:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Truck className="h-4 w-4 text-muted-foreground" />
          Sorties a valider
        </CardTitle>
        <CardDescription>Ventes payees pretes a sortir</CardDescription>
      </CardHeader>
      <CardContent>
        {ready.length === 0 ? (
          <EmptyState
            icon={Truck}
            title="Aucune sortie a valider"
            description="Les ventes pretes a sortir apparaitront ici."
          />
        ) : (
          <ul className="space-y-3">
            {ready.map((sortie) => (
              <li key={sortie.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{sortie.numero}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {sortie.client} · {formatCurrency(sortie.montantTotal)}
                  </p>
                </div>
                <Link
                  to="/magasin/sorties"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Valider <ChevronRight className="h-3 w-3" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
