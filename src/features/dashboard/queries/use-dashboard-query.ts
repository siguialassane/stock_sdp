import { useQuery } from "@tanstack/react-query";

import { fetchDashboardData } from "@/features/dashboard/services/dashboard.service";

export function useDashboardQuery() {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 10,
  });
}
