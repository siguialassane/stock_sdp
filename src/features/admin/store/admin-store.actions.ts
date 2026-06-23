import type { Dispatch, SetStateAction } from "react";

import * as catalogService from "@/features/admin/services/admin-catalog.service";
import { persistSettings } from "@/features/admin/services/admin-settings.service";
import { createAdminAgentActions } from "@/features/admin/store/admin-agent.actions";
import type { CatalogItemKind } from "@/features/admin/store/admin-store.types";
import type {
  AdminSettingsData,
  Agent,
  Product,
  ProductType,
  UnitOfMeasure,
} from "@/features/admin/types";
interface AdminStoreActionContext {
  agents: Agent[];
  products: Product[];
  types: ProductType[];
  setAgents: Dispatch<SetStateAction<Agent[]>>;
  setError: Dispatch<SetStateAction<string>>;
  setProducts: Dispatch<SetStateAction<Product[]>>;
  setSettings: Dispatch<SetStateAction<AdminSettingsData>>;
  setTypes: Dispatch<SetStateAction<ProductType[]>>;
}

export function createAdminStoreActions(context: AdminStoreActionContext) {
  const run = async <Result,>(operation: () => Promise<Result>) => {
    context.setError("");
    try {
      return await operation();
    } catch (reason) {
      context.setError(reason instanceof Error ? reason.message : "Operation Supabase impossible.");
      throw reason;
    }
  };

  const addType = async (name: string, code: string) => {
    const item = await run(() => catalogService.createType(name, code));
    context.setTypes((current) => [...current, item]);
    return item;
  };

  const addProduct = async (typeId: string, name: string, description: string) => {
    const item = await run(() => catalogService.createProduct(typeId, name, description));
    context.setProducts((current) => [...current, item]);
    return item;
  };

  const addVariant = async (
    productId: string,
    unit: UnitOfMeasure,
    code: string,
    price: number,
  ) => {
    const item = await run(() => catalogService.createVariant(productId, unit, code, price));
    context.setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? { ...product, variantes: [...product.variantes, item] }
          : product,
      ),
    );
  };

  const updateType = async (id: string, name: string, code: string) => {
    await run(() => catalogService.updateType(id, name, code));
    context.setTypes((current) =>
      current.map((item) => (item.id === id ? { ...item, nom: name, code } : item)),
    );
  };

  const updateProduct = async (
    id: string,
    typeId: string,
    name: string,
    description: string,
  ) => {
    await run(() => catalogService.updateProduct(id, typeId, name, description));
    context.setProducts((current) =>
      current.map((item) =>
        item.id === id ? { ...item, typeId, nom: name, description } : item,
      ),
    );
  };

  const updateVariant = async (
    id: string,
    productId: string,
    unit: UnitOfMeasure,
    code: string,
    price: number,
  ) => {
    const previousVariant = context.products
      .flatMap((product) => product.variantes)
      .find((variant) => variant.id === id);
    if (!previousVariant) throw new Error("Variante introuvable.");

    await run(() => catalogService.updateVariant(id, productId, unit, code, price));
    const updatedVariant = { ...previousVariant, productId, unite: unit, code, prix: price };
    context.setProducts((current) =>
      current.map((product) => ({
        ...product,
        variantes:
          product.id === productId
            ? [...product.variantes.filter((variant) => variant.id !== id), updatedVariant]
            : product.variantes.filter((variant) => variant.id !== id),
      })),
    );
  };

  const deleteCatalogItem = async (kind: CatalogItemKind, id: string) => {
    await run(() => catalogService.deleteCatalogItem(kind, id));
    if (kind === "type") {
      context.setTypes((current) => current.filter((item) => item.id !== id));
    } else if (kind === "product") {
      context.setProducts((current) => current.filter((item) => item.id !== id));
    } else {
      context.setProducts((current) =>
        current.map((product) => ({
          ...product,
          variantes: product.variantes.filter((variant) => variant.id !== id),
        })),
      );
    }
  };

  const toggleCatalogItem = async (kind: CatalogItemKind, id: string) => {
    const item =
      kind === "type"
        ? context.types.find((type) => type.id === id)
        : kind === "product"
          ? context.products.find((product) => product.id === id)
          : context.products.flatMap((product) => product.variantes).find((variant) => variant.id === id);
    if (!item) throw new Error("Reference introuvable.");

    await run(() => catalogService.setCatalogItemActive(kind, id, !item.actif));
    if (kind === "type") {
      context.setTypes((current) =>
        current.map((type) => (type.id === id ? { ...type, actif: !type.actif } : type)),
      );
    } else {
      context.setProducts((current) =>
        current.map((product) =>
          kind === "product" && product.id === id
            ? { ...product, actif: !product.actif }
            : {
                ...product,
                variantes: product.variantes.map((variant) =>
                  variant.id === id ? { ...variant, actif: !variant.actif } : variant,
                ),
              },
        ),
      );
    }
  };

  const saveSettings = async (settings: AdminSettingsData) => {
    await run(() => persistSettings(settings));
    context.setSettings(settings);
  };

  const agentActions = createAdminAgentActions({
    agents: context.agents,
    setAgents: context.setAgents,
    setError: context.setError,
  });

  return {
    ...agentActions,
    addProduct,
    addType,
    addVariant,
    deleteCatalogItem,
    saveSettings,
    toggleCatalogItem,
    updateProduct,
    updateType,
    updateVariant,
  };
}
