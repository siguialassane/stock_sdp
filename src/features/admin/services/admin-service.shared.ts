import type {
  AdminSettingsData,
  Agent,
  Product,
  ProductType,
} from "@/features/admin/types";

export interface AdminData {
  types: ProductType[];
  products: Product[];
  agents: Agent[];
  settings: AdminSettingsData;
}

export const defaultAdminSettings: AdminSettingsData = {
  companyName: "",
  companyContact: "",
  warehouseName: "",
  warehouseAddress: "",
  lowStockThreshold: 10,
  salesPrefix: "VTE-",
  receiptPrefix: "REC-",
};

export function fail(error: { message: string; code?: string } | null) {
  if (!error) return;
  if (error.code === "23503") {
    throw new Error("Suppression impossible : cet element est encore utilise par une autre reference.");
  }
  if (error.code === "23505") throw new Error("Une reference identique existe deja.");
  throw new Error(error.message);
}

export function asSingleRelation<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}
