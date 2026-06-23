import { ReceiptText, TrendingUp, UsersRound } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/auth-context";
import {
  useCommercialCustomersQuery,
  useCommercialSalesQuery,
} from "@/features/commercial/queries";
import {
  getCommercialSaleStatusLabel,
  getCommercialSaleStatusVariant,
} from "@/features/commercial/sales/sale-status";
import { formatCurrency } from "@/lib/format/currency";

function isSameDay(date: Date, target: Date) {
  return date.getFullYear() === target.getFullYear()
    && date.getMonth() === target.getMonth()
    && date.getDate() === target.getDate();
}

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function countSalesAmountWithinRange(dates: Date[], amounts: number[], predicate: (date: Date) => boolean) {
  return dates.reduce(
    (accumulator, date, index) => {
      if (!predicate(date)) return accumulator;

      return {
        count: accumulator.count + 1,
        amount: accumulator.amount + amounts[index],
      };
    },
    { count: 0, amount: 0 },
  );
}

export function CommercialDashboard() {
  const { session } = useAuth();
  const { data: customers = [], error: customersError } = useCommercialCustomersQuery();
  const { data: sales = [], error: salesError } = useCommercialSalesQuery();

  const latestCustomers = [...customers]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 3);

  const latestSales = [...sales]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 6);

  const now = new Date();
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);
  const saleDates = sales.map((sale) => new Date(sale.createdAt));
  const saleAmounts = sales.map((sale) => sale.totalAmount);

  const dailySales = countSalesAmountWithinRange(saleDates, saleAmounts, (date) => isSameDay(date, now));
  const weeklySales = countSalesAmountWithinRange(saleDates, saleAmounts, (date) => date >= weekStart);
  const monthlySales = countSalesAmountWithinRange(saleDates, saleAmounts, (date) => date >= monthStart);
  const error = customersError ?? salesError;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description={`Bienvenue ${session?.displayName ?? "Commercial"}. Voici l'etat commercial utile du moment.`}
      />

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Chargement impossible."}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Ventes du jour"
          value={formatCurrency(dailySales.amount)}
          helper={`${dailySales.count} commande(s) aujourd'hui`}
          icon={TrendingUp}
        />
        <MetricCard
          title="Ventes semaine"
          value={formatCurrency(weeklySales.amount)}
          helper={`${weeklySales.count} commande(s) cette semaine`}
          icon={ReceiptText}
        />
        <MetricCard
          title="Ventes mois"
          value={formatCurrency(monthlySales.amount)}
          helper={`${monthlySales.count} commande(s) ce mois-ci`}
          icon={UsersRound}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>3 derniers clients crees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestCustomers.length ? (
              latestCustomers.map((customer) => (
                <div key={customer.id} className="rounded-xl border bg-background px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{customer.fullName}</p>
                    <Badge variant="outline">
                      {customer.tier === "grossiste" ? "Grossiste" : "Demi-grossiste"}
                    </Badge>
                    <Badge variant={customer.isActive ? "success" : "outline"}>
                      {customer.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>{customer.phone || "Telephone non renseigne"}</p>
                    <p>{customer.address || "Adresse non renseignee"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                Aucun client cree pour le moment.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Etat actuel des commandes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestSales.length ? (
              latestSales.map((sale) => (
                <div key={sale.id} className="rounded-xl border bg-background px-4 py-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{sale.customerName}</p>
                        <Badge variant={getCommercialSaleStatusVariant(sale.status)}>
                          {getCommercialSaleStatusLabel(sale.status)}
                        </Badge>
                        <Badge variant="secondary">{sale.orderNumber}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {sale.lineCount} ligne(s) - {sale.customerTier === "grossiste" ? "Grossiste" : "Demi-grossiste"}
                      </p>
                      {sale.cancelReason ? (
                        <p className="text-sm text-red-600">Motif : {sale.cancelReason}</p>
                      ) : null}
                    </div>

                    <p className="text-sm font-semibold text-foreground">{formatCurrency(sale.totalAmount)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                Aucune commande enregistree pour le moment.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
