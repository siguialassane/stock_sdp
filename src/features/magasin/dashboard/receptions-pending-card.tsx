import { Link } from "@tanstack/react-router";
import { ChevronRight, PackageCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import type { Reception } from "@/features/magasin/types";

interface ReceptionsPendingCardProps {
  receptions: Reception[];
}

/**
 * Bloc du dashboard : receptions fournisseur en attente de confirmation.
 * Le Magasin valide la reception physique, ce qui cree un mouvement d'entree.
 */
export function ReceptionsPendingCard({ receptions }: ReceptionsPendingCardProps) {
  const pending = receptions.filter((item) => item.statut === "pending");

  return (
    <Card className="xl:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PackageCheck className="h-4 w-4 text-muted-foreground" />
          Receptions en attente
        </CardTitle>
        <CardDescription>Livraisons a confirmer physiquement</CardDescription>
      </CardHeader>
      <CardContent>
        {pending.length === 0 ? (
          <EmptyState
            icon={PackageCheck}
            title="Aucune reception en attente"
            description="Les livraisons a confirmer apparaitront ici."
          />
        ) : (
          <ul className="space-y-3">
            {pending.map((reception) => (
              <li key={reception.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{reception.numero}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {reception.fournisseur} · {reception.lignes} ligne(s)
                  </p>
                </div>
                <Link
                  to="/magasin/receptions"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Confirmer <ChevronRight className="h-3 w-3" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
