import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

import * as adminService from "@/features/admin/services/admin.service";
import type { AdminSettingsData, Agent, Product, ProductType, RoleName, UnitOfMeasure } from "@/features/admin/types";

interface AdminStoreValue {
  types: ProductType[]; products: Product[]; agents: Agent[]; settings: AdminSettingsData;
  isLoading: boolean; error: string;
  addType: (name: string, code: string) => Promise<ProductType>;
  addProduct: (typeId: string, name: string, description: string) => Promise<Product>;
  addVariant: (productId: string, unit: UnitOfMeasure, code: string, price: number) => Promise<void>;
  updateType: (id: string, name: string, code: string) => Promise<void>;
  updateProduct: (id: string, typeId: string, name: string, description: string) => Promise<void>;
  updateVariant: (id: string, productId: string, unit: UnitOfMeasure, code: string, price: number) => Promise<void>;
  deleteCatalogItem: (kind: "type" | "product" | "variant", id: string) => Promise<void>;
  addAgent: (input: { fullName: string; email: string; role: RoleName; agentCode?: string }) => Promise<Agent>;
  updateAgent: (input: { id: string; fullName: string; email: string; role: RoleName; agentCode: string }) => Promise<Agent>;
  deleteAgent: (id: string) => Promise<void>;
  toggleCatalogItem: (kind: "type" | "product" | "variant", id: string) => Promise<void>;
  toggleAgent: (id: string) => Promise<void>;
  saveSettings: (settings: AdminSettingsData) => Promise<void>;
}

const DEFAULT_SETTINGS: AdminSettingsData = { companyName: "", companyContact: "", warehouseName: "", warehouseAddress: "", lowStockThreshold: 10, salesPrefix: "VTE-", receiptPrefix: "REC-" };
const AdminStoreContext = createContext<AdminStoreValue | null>(null);

export function AdminStoreProvider({ children }: PropsWithChildren) {
  const [types, setTypes] = useState<ProductType[]>([]); const [products, setProducts] = useState<Product[]>([]); const [agents, setAgents] = useState<Agent[]>([]); const [settings, setSettings] = useState(DEFAULT_SETTINGS); const [isLoading, setIsLoading] = useState(true); const [error, setError] = useState("");

  useEffect(() => { let active = true; adminService.fetchAdminData().then((data) => { if (!active) return; setTypes(data.types); setProducts(data.products); setAgents(data.agents); setSettings(data.settings); }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Chargement Supabase impossible."); }).finally(() => { if (active) setIsLoading(false); }); return () => { active = false; }; }, []);

  const run = async <Result,>(operation: () => Promise<Result>) => { setError(""); try { return await operation(); } catch (reason) { const message = reason instanceof Error ? reason.message : "Operation Supabase impossible."; setError(message); throw reason; } };
  const addType = async (name: string, code: string) => { const item = await run(() => adminService.createType(name, code)); setTypes((current) => [...current, item]); return item; };
  const addProduct = async (typeId: string, name: string, description: string) => { const item = await run(() => adminService.createProduct(typeId, name, description)); setProducts((current) => [...current, item]); return item; };
  const addVariant = async (productId: string, unit: UnitOfMeasure, code: string, price: number) => { const item = await run(() => adminService.createVariant(productId, unit, code, price)); setProducts((current) => current.map((product) => product.id === productId ? { ...product, variantes: [...product.variantes, item] } : product)); };
  const updateType = async (id: string, name: string, code: string) => { await run(() => adminService.updateType(id, name, code)); setTypes((current) => current.map((item) => item.id === id ? { ...item, nom: name, code } : item)); };
  const updateProduct = async (id: string, typeId: string, name: string, description: string) => { await run(() => adminService.updateProduct(id, typeId, name, description)); setProducts((current) => current.map((item) => item.id === id ? { ...item, typeId, nom: name, description } : item)); };
  const updateVariant = async (id: string, productId: string, unit: UnitOfMeasure, code: string, price: number) => { const previousProduct = products.find((item) => item.variantes.some((variant) => variant.id === id)); const previousVariant = previousProduct?.variantes.find((variant) => variant.id === id); if (!previousVariant) return; await run(() => adminService.updateVariant(id, productId, unit, code, price)); const updated = { ...previousVariant, productId, unite: unit, code, prix: price }; setProducts((current) => current.map((product) => ({ ...product, variantes: product.id === productId ? [...product.variantes.filter((variant) => variant.id !== id), updated] : product.variantes.filter((variant) => variant.id !== id) }))); };
  const deleteCatalogItem = async (kind: "type" | "product" | "variant", id: string) => { await run(() => adminService.deleteCatalogItem(kind, id)); if (kind === "type") setTypes((current) => current.filter((item) => item.id !== id)); else if (kind === "product") setProducts((current) => current.filter((item) => item.id !== id)); else setProducts((current) => current.map((product) => ({ ...product, variantes: product.variantes.filter((variant) => variant.id !== id) }))); };
  const addAgent = async (input: { fullName: string; email: string; role: RoleName; agentCode?: string }) => { const prefix = { Admin: "ADM", Magasin: "MAG", Commercial: "COM", Caisse: "CAI" }[input.role]; const agentCode = input.agentCode?.trim() || `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`; const agent = await run(() => adminService.createAgent({ ...input, agentCode })); setAgents((current) => [...current, agent]); return agent; };
  const updateAgent = async (input: { id: string; fullName: string; email: string; role: RoleName; agentCode: string }) => {
    const updated = await run(() => adminService.updateAgent(input));
    setAgents((current) => current.map((item) => item.id === input.id ? updated : item));
    return updated;
  };
  const deleteAgent = async (id: string) => {
    await run(() => adminService.deleteAgent(id));
    setAgents((current) => current.filter((item) => item.id !== id));
  };
  const toggleCatalogItem = async (kind: "type" | "product" | "variant", id: string) => { const currentItem = kind === "type" ? types.find((item) => item.id === id) : kind === "product" ? products.find((item) => item.id === id) : products.flatMap((item) => item.variantes).find((item) => item.id === id); if (!currentItem) return; await run(() => adminService.setCatalogItemActive(kind, id, !currentItem.actif)); if (kind === "type") setTypes((current) => current.map((item) => item.id === id ? { ...item, actif: !item.actif } : item)); else setProducts((current) => current.map((product) => kind === "product" && product.id === id ? { ...product, actif: !product.actif } : { ...product, variantes: product.variantes.map((variant) => variant.id === id ? { ...variant, actif: !variant.actif } : variant) })); };
  const toggleAgent = async (id: string) => { const agent = agents.find((item) => item.id === id); if (!agent) return; const statut = agent.statut === "suspended" ? (agent.premierAcces ? "pending" : "active") : "suspended"; await run(() => adminService.setAgentStatus(id, statut)); setAgents((current) => current.map((item) => item.id === id ? { ...item, statut, actif: statut === "active" } : item)); };
  const saveSettings = async (value: AdminSettingsData) => { await run(() => adminService.persistSettings(value)); setSettings(value); };

  return <AdminStoreContext.Provider value={{ types, products, agents, settings, isLoading, error, addType, addProduct, addVariant, updateType, updateProduct, updateVariant, deleteCatalogItem, addAgent, updateAgent, deleteAgent, toggleCatalogItem, toggleAgent, saveSettings }}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore() { const context = useContext(AdminStoreContext); if (!context) throw new Error("useAdminStore must be used within AdminStoreProvider."); return context; }
