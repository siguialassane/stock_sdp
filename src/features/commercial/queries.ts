import { useQuery } from "@tanstack/react-query";

import {
  fetchCommercialCatalog,
  fetchCommercialCustomers,
  fetchCommercialSales,
} from "@/features/commercial/services/commercial.service";

export const commercialQueryKeys = {
  catalog: ["commercial", "catalog"] as const,
  customers: ["commercial", "customers"] as const,
  sales: ["commercial", "sales"] as const,
};

const defaultQueryOptions = {
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 30,
  refetchOnWindowFocus: false,
} as const;

export function useCommercialCatalogQuery() {
  return useQuery({
    queryKey: commercialQueryKeys.catalog,
    queryFn: fetchCommercialCatalog,
    ...defaultQueryOptions,
  });
}

export function useCommercialCustomersQuery() {
  return useQuery({
    queryKey: commercialQueryKeys.customers,
    queryFn: fetchCommercialCustomers,
    ...defaultQueryOptions,
  });
}

export function useCommercialSalesQuery() {
  return useQuery({
    queryKey: commercialQueryKeys.sales,
    queryFn: fetchCommercialSales,
    ...defaultQueryOptions,
  });
}
