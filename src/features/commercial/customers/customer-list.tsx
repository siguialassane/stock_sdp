import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import type { CommercialCustomer } from "@/features/commercial/types";
import { Users } from "lucide-react";

function formatCustomerDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(value));
}

export function CustomerList({
  customers,
  onCreate,
  onEdit,
  onToggleActive,
}: {
  customers: CommercialCustomer[];
  onCreate: () => void;
  onEdit: (customer: CommercialCustomer) => void;
  onToggleActive: (customer: CommercialCustomer) => Promise<void>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des clients ({customers.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {customers.length ? (
          customers.map((customer) => (
            <div
              key={customer.id}
              className="flex flex-col gap-4 rounded-xl border px-4 py-4 lg:flex-row lg:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{customer.fullName}</p>
                  <Badge variant="outline">
                    {customer.tier === "grossiste" ? "Grossiste" : "Demi-grossiste"}
                  </Badge>
                  <Badge variant={customer.isActive ? "success" : "warning"}>
                    {customer.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                  <p>{customer.phone || "Telephone non renseigne"}</p>
                  <p>{customer.address || "Adresse non renseignee"}</p>
                  {customer.notes ? <p>{customer.notes}</p> : null}
                  <p>Ajoute le {formatCustomerDate(customer.createdAt)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => onEdit(customer)}>
                  Modifier
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void onToggleActive(customer)}
                >
                  {customer.isActive ? "Desactiver" : "Reactiver"}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={Users}
            title="Aucun client pour le moment"
            description="Commencez par creer vos grossistes et demi-grossistes afin de pouvoir leur rattacher des ventes."
            action={
              <Button type="button" onClick={onCreate}>
                Creer le premier client
              </Button>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
