import type {
  AdminSettingsData,
  Agent,
  Product,
  ProductType,
  RoleName,
  UnitOfMeasure,
} from "@/features/admin/types";

export type CatalogItemKind = "type" | "product" | "variant";

export interface AdminStoreValue {
  types: ProductType[];
  products: Product[];
  agents: Agent[];
  settings: AdminSettingsData;
  isLoading: boolean;
  error: string;
  addType: (name: string, code: string) => Promise<ProductType>;
  addProduct: (typeId: string, name: string, description: string) => Promise<Product>;
  addVariant: (productId: string, unit: UnitOfMeasure, code: string, price: number) => Promise<void>;
  updateType: (id: string, name: string, code: string) => Promise<void>;
  updateProduct: (id: string, typeId: string, name: string, description: string) => Promise<void>;
  updateVariant: (id: string, productId: string, unit: UnitOfMeasure, code: string, price: number) => Promise<void>;
  deleteCatalogItem: (kind: CatalogItemKind, id: string) => Promise<void>;
  toggleCatalogItem: (kind: CatalogItemKind, id: string) => Promise<void>;
  addAgent: (input: { fullName: string; email: string; role: RoleName; agentCode?: string }) => Promise<Agent>;
  updateAgent: (input: { id: string; fullName: string; email: string; role: RoleName; agentCode: string }) => Promise<Agent>;
  deleteAgent: (id: string) => Promise<void>;
  toggleAgent: (id: string) => Promise<void>;
  saveSettings: (settings: AdminSettingsData) => Promise<void>;
}
