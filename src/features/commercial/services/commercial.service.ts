import { readAuthSession } from "@/features/auth/auth-storage";
import type {
  CommercialCatalogItem,
  CommercialSaleCancelInput,
  CommercialCustomer,
  CommercialCustomerInput,
  CommercialDashboardData,
  CommercialSale,
  CommercialSaleInput,
  CommercialSaleLine,
} from "@/features/commercial/types";
import { supabase } from "@/lib/supabase/client";

interface CommercialDashboardRow {
  full_name: string;
  email: string;
  active_product_count: number;
  active_type_count: number;
  active_variant_count: number;
}

interface CommercialCatalogRow {
  product_id: string;
  product_name: string;
  type_name: string;
  variant_id: string;
  unit_code: string;
  sku: string;
  sale_price: number | string | null;
}

interface CommercialCustomerRow {
  id: string;
  full_name: string;
  tier: CommercialCustomer["tier"];
  phone: string | null;
  address: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

interface CommercialSaleRow {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_tier: CommercialCustomer["tier"];
  status: CommercialSale["status"];
  total_amount: number | string | null;
  line_count: number | null;
  notes: string | null;
  cancel_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
  lines: CommercialSaleLineRow[] | null;
}

interface CommercialSaleLineRow {
  id: string;
  variantId: string;
  productName: string;
  typeName: string;
  unitCode: string;
  sku: string;
  quantity: number | string;
  unitPrice: number | string;
  lineTotal: number | string;
}

function fail(error: { message: string } | null) {
  if (!error) return;
  throw new Error(error.message);
}

function getCommercialSessionToken() {
  const session = readAuthSession();
  if (!session?.sessionToken) throw new Error("Session Commerciale invalide. Reconnectez-vous.");
  return session.sessionToken;
}

function mapCustomer(row: CommercialCustomerRow): CommercialCustomer {
  return {
    id: row.id,
    fullName: row.full_name,
    tier: row.tier,
    phone: row.phone ?? "",
    address: row.address ?? "",
    notes: row.notes ?? "",
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

function mapSaleLine(row: CommercialSaleLineRow): CommercialSaleLine {
  return {
    id: row.id,
    variantId: row.variantId,
    productName: row.productName,
    typeName: row.typeName,
    unitCode: row.unitCode,
    sku: row.sku,
    quantity: Number(row.quantity ?? 0),
    unitPrice: Number(row.unitPrice ?? 0),
    lineTotal: Number(row.lineTotal ?? 0),
  };
}

function mapSale(row: CommercialSaleRow): CommercialSale {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerTier: row.customer_tier,
    status: row.status,
    totalAmount: Number(row.total_amount ?? 0),
    lineCount: Number(row.line_count ?? 0),
    notes: row.notes ?? "",
    cancelReason: row.cancel_reason ?? "",
    cancelledAt: row.cancelled_at ?? undefined,
    createdAt: row.created_at,
    lines: (row.lines ?? []).map(mapSaleLine),
  };
}

export async function fetchCommercialDashboard(): Promise<CommercialDashboardData> {
  const result = await supabase.rpc("get_commercial_dashboard_by_session", {
    p_session_token: getCommercialSessionToken(),
  });
  fail(result.error);

  const row = (result.data?.[0] ?? null) as CommercialDashboardRow | null;
  if (!row) throw new Error("Le profil Commercial est introuvable.");

  return {
    fullName: row.full_name,
    email: row.email,
    activeProductCount: Number(row.active_product_count ?? 0),
    activeTypeCount: Number(row.active_type_count ?? 0),
    activeVariantCount: Number(row.active_variant_count ?? 0),
  };
}

export async function fetchCommercialCatalog(): Promise<CommercialCatalogItem[]> {
  const result = await supabase.rpc("get_commercial_catalog_by_session", {
    p_session_token: getCommercialSessionToken(),
  });
  fail(result.error);

  return ((result.data ?? []) as CommercialCatalogRow[]).map((row) => ({
    productId: row.product_id,
    productName: row.product_name,
    typeName: row.type_name,
    variantId: row.variant_id,
    unitCode: row.unit_code,
    sku: row.sku,
    salePrice: Number(row.sale_price ?? 0),
  }));
}

export async function fetchCommercialCustomers(): Promise<CommercialCustomer[]> {
  const result = await supabase.rpc("get_commercial_customers_by_session", {
    p_session_token: getCommercialSessionToken(),
  });
  fail(result.error);

  return ((result.data ?? []) as CommercialCustomerRow[]).map(mapCustomer);
}

export async function createCommercialCustomer(input: CommercialCustomerInput): Promise<CommercialCustomer> {
  const result = await supabase.rpc("create_commercial_customer_by_session", {
    p_session_token: getCommercialSessionToken(),
    p_full_name: input.fullName,
    p_tier: input.tier,
    p_phone: input.phone,
    p_address: input.address,
    p_notes: input.notes,
  });
  fail(result.error);

  const row = (result.data?.[0] ?? null) as CommercialCustomerRow | null;
  if (!row) throw new Error("Le client n'a pas pu etre cree.");
  return mapCustomer(row);
}

export async function updateCommercialCustomer(
  customerId: string,
  input: CommercialCustomerInput,
): Promise<CommercialCustomer> {
  const result = await supabase.rpc("update_commercial_customer_by_session", {
    p_session_token: getCommercialSessionToken(),
    p_customer_id: customerId,
    p_full_name: input.fullName,
    p_tier: input.tier,
    p_phone: input.phone,
    p_address: input.address,
    p_notes: input.notes,
    p_is_active: input.isActive,
  });
  fail(result.error);

  const row = (result.data?.[0] ?? null) as CommercialCustomerRow | null;
  if (!row) throw new Error("Le client n'a pas pu etre mis a jour.");
  return mapCustomer(row);
}

export async function fetchCommercialSales(): Promise<CommercialSale[]> {
  const result = await supabase.rpc("get_commercial_sales_by_session", {
    p_session_token: getCommercialSessionToken(),
  });
  fail(result.error);

  return ((result.data ?? []) as CommercialSaleRow[]).map(mapSale);
}

export async function createCommercialSale(input: CommercialSaleInput): Promise<CommercialSale> {
  const result = await supabase.rpc("create_commercial_sale_by_session", {
    p_session_token: getCommercialSessionToken(),
    p_customer_id: input.customerId,
    p_notes: input.notes,
    p_lines: input.lines.map((line) => ({
      product_variant_id: line.variantId,
      quantity: line.quantity,
      unit_price: line.unitPrice,
    })),
  });
  fail(result.error);

  const row = (result.data?.[0] ?? null) as CommercialSaleRow | null;
  if (!row) throw new Error("La vente n'a pas pu etre creee.");
  return mapSale(row);
}

export async function updateCommercialSale(
  saleId: string,
  input: CommercialSaleInput,
): Promise<CommercialSale> {
  const result = await supabase.rpc("update_commercial_sale_by_session", {
    p_session_token: getCommercialSessionToken(),
    p_sale_id: saleId,
    p_customer_id: input.customerId,
    p_notes: input.notes,
    p_lines: input.lines.map((line) => ({
      product_variant_id: line.variantId,
      quantity: line.quantity,
      unit_price: line.unitPrice,
    })),
  });
  fail(result.error);

  const row = (result.data?.[0] ?? null) as CommercialSaleRow | null;
  if (!row) throw new Error("La commande n'a pas pu etre mise a jour.");
  return mapSale(row);
}

export async function cancelCommercialSale(
  saleId: string,
  input: CommercialSaleCancelInput,
): Promise<CommercialSale> {
  const result = await supabase.rpc("cancel_commercial_sale_by_session", {
    p_session_token: getCommercialSessionToken(),
    p_sale_id: saleId,
    p_cancel_reason: input.reason,
  });
  fail(result.error);

  const row = (result.data?.[0] ?? null) as CommercialSaleRow | null;
  if (!row) throw new Error("La commande n'a pas pu etre annulee.");
  return mapSale(row);
}
