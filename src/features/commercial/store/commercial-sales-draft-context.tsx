import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { CommercialSale } from "@/features/commercial/types";

interface CommercialSalesDraftContextValue {
  draftSale: CommercialSale | null;
  clearEditingSale: () => void;
  startEditingSale: (sale: CommercialSale) => void;
}

const CommercialSalesDraftContext = createContext<CommercialSalesDraftContextValue | null>(null);

export function CommercialSalesDraftProvider({ children }: { children: ReactNode }) {
  const [draftSale, setDraftSale] = useState<CommercialSale | null>(null);

  const value = useMemo<CommercialSalesDraftContextValue>(
    () => ({
      draftSale,
      clearEditingSale: () => setDraftSale(null),
      startEditingSale: (sale) => setDraftSale(sale),
    }),
    [draftSale],
  );

  return (
    <CommercialSalesDraftContext.Provider value={value}>
      {children}
    </CommercialSalesDraftContext.Provider>
  );
}

export function useCommercialSalesDraft() {
  const context = useContext(CommercialSalesDraftContext);

  if (!context) {
    throw new Error("useCommercialSalesDraft must be used within CommercialSalesDraftProvider.");
  }

  return context;
}
