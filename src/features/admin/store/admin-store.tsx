import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

import { fetchAdminData } from "@/features/admin/services/admin-data.service";
import { defaultAdminSettings } from "@/features/admin/services/admin-service.shared";
import { createAdminStoreActions } from "@/features/admin/store/admin-store.actions";
import type { AdminStoreValue } from "@/features/admin/store/admin-store.types";
import type { Agent, Product, ProductType } from "@/features/admin/types";

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

export function AdminStoreProvider({ children }: PropsWithChildren) {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [settings, setSettings] = useState(defaultAdminSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchAdminData()
      .then((data) => {
        if (!active) return;
        setTypes(data.types);
        setProducts(data.products);
        setAgents(data.agents);
        setSettings(data.settings);
      })
      .catch((reason) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Chargement Supabase impossible.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const actions = createAdminStoreActions({
    agents,
    products,
    types,
    setAgents,
    setError,
    setProducts,
    setSettings,
    setTypes,
  });

  return (
    <AdminStoreContext.Provider
      value={{ agents, error, isLoading, products, settings, types, ...actions }}
    >
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  const context = useContext(AdminStoreContext);
  if (!context) throw new Error("useAdminStore must be used within AdminStoreProvider.");
  return context;
}
