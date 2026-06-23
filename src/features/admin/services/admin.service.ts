import type {
  AdminSettingsData,
  Agent,
  Product,
  ProductType,
  ProductVariant,
  RoleName,
  UnitOfMeasure,
} from "@/features/admin/types";
import { supabase } from "@/lib/supabase/client";

interface AdminData {
  types: ProductType[];
  products: Product[];
  agents: Agent[];
  settings: AdminSettingsData;
}

interface ProvisionedAccess {
  login_identifier: string;
  initial_password: string | null;
  must_change_password: boolean;
}

const defaultSettings: AdminSettingsData = {
  companyName: "",
  companyContact: "",
  warehouseName: "",
  warehouseAddress: "",
  lowStockThreshold: 10,
  salesPrefix: "VTE-",
  receiptPrefix: "REC-",
};

function fail(error: { message: string; code?: string } | null) {
  if (!error) return;
  if (error.code === "23503") {
    throw new Error("Suppression impossible : cet element est encore utilise par une autre reference.");
  }
  if (error.code === "23505") throw new Error("Une reference identique existe deja.");
  throw new Error(error.message);
}

function asSingleRelation<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

export async function fetchAdminData(): Promise<AdminData> {
  const session = await supabase.auth.getSession();
  if (!session.data.session) throw new Error("Session Supabase absente. Reconnectez-vous.");

  const [typesResult, productsResult, variantsResult, agentsResult, settingsResult, warehouseResult] =
    await Promise.all([
      supabase.from("product_types").select("id,name,code,is_active,created_at").order("name"),
      supabase.from("products").select("id,type_id,name,description,is_active,created_at").order("name"),
      supabase
        .from("product_variants")
        .select("id,product_id,sku,default_sale_price,is_active,created_at,unit_of_measure!inner(code)")
        .order("sku"),
      supabase
        .from("app_users")
        .select(
          "id,full_name,email,status,agent_code,first_login_required,last_login_at,created_at,roles!inner(name),app_user_credentials(login_identifier,must_change_password)",
        )
        .order("full_name"),
      supabase
        .from("app_settings")
        .select("company_name,company_contact,default_low_stock_threshold,sales_prefix,receipt_prefix")
        .eq("id", 1)
        .single(),
      supabase.from("warehouses").select("name,address").eq("is_primary", true).maybeSingle(),
    ]);

  [typesResult, productsResult, variantsResult, agentsResult, settingsResult, warehouseResult].forEach(
    (result) => fail(result.error),
  );

  const types: ProductType[] = (typesResult.data ?? []).map((item) => ({
    id: item.id,
    nom: item.name,
    code: item.code,
    actif: item.is_active,
    createdAt: item.created_at,
  }));

  const variants: ProductVariant[] = (variantsResult.data ?? []).map((item) => {
    const unit = asSingleRelation(item.unit_of_measure);
    return {
      id: item.id,
      productId: item.product_id,
      unite: unit.code as UnitOfMeasure,
      code: item.sku,
      prix: Number(item.default_sale_price),
      actif: item.is_active,
      createdAt: item.created_at,
    };
  });

  const products: Product[] = (productsResult.data ?? []).map((item) => ({
    id: item.id,
    typeId: item.type_id,
    nom: item.name,
    description: item.description ?? "",
    actif: item.is_active,
    createdAt: item.created_at,
    variantes: variants.filter((variant) => variant.productId === item.id),
  }));

  const agents: Agent[] = (agentsResult.data ?? []).map((item) => {
    const role = asSingleRelation(item.roles);
    const credentials = asSingleRelation(item.app_user_credentials);

    return {
      id: item.id,
      nom: item.full_name,
      email: item.email,
      role: role.name as RoleName,
      actif: item.status === "active",
      statut: item.status,
      codeAgent: item.agent_code,
      identifiant: credentials?.login_identifier ?? undefined,
      premierAcces: item.first_login_required,
      derniereConnexion: item.last_login_at ?? undefined,
      createdAt: item.created_at,
    };
  });

  const dbSettings = settingsResult.data;

  return {
    types,
    products,
    agents,
    settings: {
      ...defaultSettings,
      companyName: dbSettings.company_name,
      companyContact: dbSettings.company_contact,
      warehouseName: warehouseResult.data?.name ?? "",
      warehouseAddress: warehouseResult.data?.address ?? "",
      lowStockThreshold: Number(dbSettings.default_low_stock_threshold),
      salesPrefix: dbSettings.sales_prefix,
      receiptPrefix: dbSettings.receipt_prefix,
    },
  };
}

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

export async function createVariant(productId: string, unite: UnitOfMeasure, code: string, prix: number) {
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

export async function updateProduct(id: string, typeId: string, nom: string, description: string) {
  const result = await supabase
    .from("products")
    .update({ type_id: typeId, name: nom, description: description || null })
    .eq("id", id);
  fail(result.error);
}

export async function updateVariant(id: string, productId: string, unite: UnitOfMeasure, code: string, prix: number) {
  const unitResult = await supabase.from("unit_of_measure").select("id").eq("code", unite).single();
  fail(unitResult.error);

  const result = await supabase
    .from("product_variants")
    .update({ product_id: productId, unit_id: unitResult.data.id, sku: code, default_sale_price: prix })
    .eq("id", id);
  fail(result.error);
}

export async function deleteCatalogItem(kind: "type" | "product" | "variant", id: string) {
  const table = { type: "product_types", product: "products", variant: "product_variants" }[kind];
  const result = await supabase.from(table).delete().eq("id", id);
  fail(result.error);
}

export async function setCatalogItemActive(kind: "type" | "product" | "variant", id: string, isActive: boolean) {
  const table = { type: "product_types", product: "products", variant: "product_variants" }[kind];
  const result = await supabase.from(table).update({ is_active: isActive }).eq("id", id);
  fail(result.error);
}

export async function createAgent(input: {
  fullName: string;
  email: string;
  role: RoleName;
  agentCode: string;
}) {
  const roleResult = await supabase.from("roles").select("id").eq("code", input.role.toLowerCase()).single();
  fail(roleResult.error);

  const result = await supabase
    .from("app_users")
    .insert({
      role_id: roleResult.data.id,
      full_name: input.fullName,
      email: input.email,
      agent_code: input.agentCode,
      status: "pending",
      first_login_required: true,
    })
    .select("id,full_name,email,status,agent_code,first_login_required,created_at")
    .single();
  fail(result.error);

  const accessResult = await supabase.rpc("provision_app_user_credentials", {
    p_app_user_id: result.data.id,
    p_login_identifier: null,
    p_force_reset: false,
  });
  fail(accessResult.error);

  const access = accessResult.data?.[0] as ProvisionedAccess | undefined;

  return {
    id: result.data.id,
    nom: result.data.full_name,
    email: result.data.email,
    role: input.role,
    actif: false,
    statut: result.data.status,
    codeAgent: result.data.agent_code,
    identifiant: access?.login_identifier,
    motDePasseInitial: access?.initial_password ?? result.data.agent_code,
    premierAcces: result.data.first_login_required,
    createdAt: result.data.created_at,
  } as Agent;
}

export async function updateAgent(input: {
  id: string;
  fullName: string;
  email: string;
  role: RoleName;
  agentCode: string;
}) {
  const roleResult = await supabase.from("roles").select("id").eq("code", input.role.toLowerCase()).single();
  fail(roleResult.error);

  const result = await supabase
    .from("app_users")
    .update({
      role_id: roleResult.data.id,
      full_name: input.fullName,
      email: input.email,
      agent_code: input.agentCode,
    })
    .eq("id", input.id)
    .select("id,full_name,email,status,agent_code,first_login_required,last_login_at,created_at")
    .single();
  fail(result.error);

  const accessResult = await supabase.rpc("provision_app_user_credentials", {
    p_app_user_id: result.data.id,
    p_login_identifier: null,
    p_force_reset: false,
  });
  fail(accessResult.error);

  const access = accessResult.data?.[0] as ProvisionedAccess | undefined;

  return {
    id: result.data.id,
    nom: result.data.full_name,
    email: result.data.email,
    role: input.role,
    actif: result.data.status === "active",
    statut: result.data.status,
    codeAgent: result.data.agent_code,
    identifiant: access?.login_identifier,
    motDePasseInitial: access?.initial_password ?? undefined,
    premierAcces: result.data.first_login_required,
    derniereConnexion: result.data.last_login_at ?? undefined,
    createdAt: result.data.created_at,
  } as Agent;
}

export async function setAgentStatus(id: string, status: Agent["statut"]) {
  const result = await supabase.from("app_users").update({ status }).eq("id", id);
  fail(result.error);
}

export async function deleteAgent(id: string) {
  const result = await supabase.from("app_users").delete().eq("id", id);
  fail(result.error);
}

export async function persistSettings(settings: AdminSettingsData) {
  const settingsResult = await supabase
    .from("app_settings")
    .update({
      company_name: settings.companyName,
      company_contact: settings.companyContact,
      default_low_stock_threshold: settings.lowStockThreshold,
      sales_prefix: settings.salesPrefix,
      receipt_prefix: settings.receiptPrefix,
    })
    .eq("id", 1);
  fail(settingsResult.error);

  const existing = await supabase.from("warehouses").select("id").eq("is_primary", true).maybeSingle();
  fail(existing.error);

  const warehouseResult = existing.data
    ? await supabase
        .from("warehouses")
        .update({ name: settings.warehouseName, address: settings.warehouseAddress })
        .eq("id", existing.data.id)
    : await supabase.from("warehouses").insert({
        name: settings.warehouseName,
        address: settings.warehouseAddress,
        is_primary: true,
      });
  fail(warehouseResult.error);
}
