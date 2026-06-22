import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format/currency";
import type { RecentSale } from "@/features/dashboard/types";

interface RecentSalesCardProps {
  recentSales: RecentSale[];
}

export function RecentSalesCard({ recentSales }: RecentSalesCardProps) {
  return (
    <Card className="xl:col-span-3">
      <CardHeader>
        <CardTitle>Recent sales</CardTitle>
        <CardDescription>{recentSales.length} vente(s) enregistree(s).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {recentSales.length === 0 ? (
          <div className="flex min-h-52 items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center text-sm text-muted-foreground">
            Aucune vente recente disponible pour le moment.
          </div>
        ) : (
          recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {sale.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{sale.client}</p>
                <p className="truncate text-sm text-muted-foreground">{sale.email}</p>
              </div>
              <div className="text-sm font-medium">+{formatCurrency(sale.montant)}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
