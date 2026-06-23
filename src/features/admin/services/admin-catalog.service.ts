import { fail } from "@/features/admin/services/admin-service.shared";
import type {
  Product,
  ProductType,
  ProductVariant,
  UnitOfMeasure,
} from "@/features/admin/types";
import { supabase } from "@/lib/supabase/client";

type CatalogItemKind = "type" | "product" | "variant";

const CATALOG_TABLES = {
  type: "product_types",
  product: "products",
  variant: "product_variants",
} as const;

export async function createType(nom: string, code: string) {
  const result = await supabase
    .from("product_types")
    .insert({ name: nom, code })
    .select("id,name,code,is_active,created_at")
    .single();
  fail(result.error);

  return {
    id: result.data.id,
    nom: result.data.name,
    code: result.data.code,
    actif: result.data.is_active,
    createdAt: result.data.created_at,
  } as ProductType;
}

export async function createProduct(typeId: string, nom: string, description: string) {
  const result = await supabase
    .from("products")
    .insert({ type_id: typeId, name: nom, description: description || null })
    .select("id,type_id,name,description,is_active,created_at")
    .single();
  fail(result.error);

  return {
    id: result.data.id,
    typeId: result.data.type_id,
    nom: result.data.name,
    description: result.data.description ?? "",
    actif: result.data.is_active,
    variantes: [],
    createdAt: result.data.created_at,
  } as Product;
}

export async function createVariant(
  productId: string,
  unite: UnitOfMeasure,
  code: string,
  prix: number,
) {
  const unitResult = await supabase.from("unit_of_measure").select("id").eq("code", unite).single();
  fail(unitResult.error);

  const result = await supabase
    .from("product_variants")
    .insert({ product_id: productId, unit_id: unitResult.data.id, sku: code, default_sale_price: prix })
    .select("id,product_id,sku,default_sale_price,is_active,created_at")
    .single();
  fail(result.error);

  return {
    id: result.data.id,
    productId: result.data.product_id,
    unite,
    code: result.data.sku,
    prix: Number(result.data.default_sale_price),
    actif: result.data.is_active,
    createdAt: result.data.created_at,
  } as ProductVariant;
}

export async function updateType(id: string, nom: string, code: string) {
  const result = await supabase.from("product_types").update({ name: nom, code }).eq("id", id);
  fail(result.error);
}

export async function updateProduct(
  id: string,
  typeId: string,
  nom: string,
  description: string,
) {
  const result = await supabase
    .from("products")
    .update({ type_id: typeId, name: nom, description: description || null })
    .eq("id", id);
  fail(result.error);
}

export async function updateVariant(
  id: string,
  productId: string,
  unite: UnitOfMeasure,
  code: string,
  prix: number,
) {
  const unitResult = await supabase.from("unit_of_measure").select("id").eq("code", unite).single();
  fail(unitResult.error);
  const result = await supabase
    .from("product_variants")
    .update({ product_id: productId, unit_id: unitResult.data.id, sku: code, default_sale_price: prix })
    .eq("id", id);
  fail(result.error);
}

export async function deleteCatalogItem(kind: CatalogItemKind, id: string) {
  const result = await supabase.from(CATALOG_TABLES[kind]).delete().eq("id", id);
  fail(result.error);
}

export async function setCatalogItemActive(
  kind: CatalogItemKind,
  id: string,
  isActive: boolean,
) {
  const result = await supabase.from(CATALOG_TABLES[kind]).update({ is_active: isActive }).eq("id", id);
  fail(result.error);
}
