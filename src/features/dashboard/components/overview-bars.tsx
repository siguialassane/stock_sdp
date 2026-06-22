import { formatCurrency } from "@/lib/format/currency";
import type { OverviewPoint } from "@/features/dashboard/types";

interface OverviewBarsProps {
  data: OverviewPoint[];
}

export function OverviewBars({ data }: OverviewBarsProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center text-sm text-muted-foreground">
        Aucune donnee de synthese disponible pour le moment.
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.total), 1);

  return (
    <div className="space-y-4">
      <div className="grid h-72 grid-cols-12 items-end gap-2">
        {data.map((item) => (
          <div key={item.month} className="flex h-full flex-col items-center justify-end gap-3">
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-t-md bg-primary/90 transition-all duration-300 hover:bg-primary"
                style={{ height: `${Math.max(12, (item.total / maxValue) * 100)}%` }}
                title={`${item.month}: ${formatCurrency(item.total)}`}
              />
            </div>
            <span className="text-xs text-muted-foreground">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Evolution mensuelle</span>
        <span>Objectif annuel: {formatCurrency(75000)}</span>
      </div>
    </div>
  );
}
