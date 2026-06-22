import { INVENTORY_DATA, OVERVIEW_DATA, RECENT_SALES } from "@/mocks/dashboard.mock";
import type { DashboardPayload } from "@/features/dashboard/types";

export async function fetchDashboardData(): Promise<DashboardPayload> {
  await new Promise((resolve) => setTimeout(resolve, 220));

  return {
    inventory: INVENTORY_DATA,
    recentSales: RECENT_SALES,
    overview: OVERVIEW_DATA,
  };
}
