import {
  asSingleRelation,
  defaultAdminSettings,
  fail,
  type AdminData,
} from "@/features/admin/services/admin-service.shared";
import type {
  Agent,
  Product,
  ProductType,
  ProductVariant,
  RoleName,
  UnitOfMeasure,
} from "@/features/admin/types";
import { supabase } from "@/lib/supabase/client";

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
      ...defaultAdminSettings,
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
