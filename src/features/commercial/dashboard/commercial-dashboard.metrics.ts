import type { CommercialSale } from "@/features/commercial/types";

interface SalesMetric {
  amount: number;
  count: number;
}

interface CommercialDashboardMetrics {
  daily: SalesMetric;
  weekly: SalesMetric;
  monthly: SalesMetric;
}

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (day === 0 ? -6 : 1 - day));
  result.setHours(0, 0, 0, 0);
  return result;
}

function sumSales(sales: CommercialSale[], startsAt: Date) {
  return sales.reduce<SalesMetric>(
    (metric, sale) => {
      if (sale.status === "cancelled" || new Date(sale.createdAt) < startsAt) return metric;
      return { count: metric.count + 1, amount: metric.amount + sale.totalAmount };
    },
    { count: 0, amount: 0 },
  );
}

export function getCommercialDashboardMetrics(
  sales: CommercialSale[],
  now = new Date(),
): CommercialDashboardMetrics {
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    daily: sumSales(sales, dayStart),
    weekly: sumSales(sales, startOfWeek(now)),
    monthly: sumSales(sales, monthStart),
  };
}
