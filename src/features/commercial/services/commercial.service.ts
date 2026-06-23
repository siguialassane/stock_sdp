import { readAuthSession } from "@/features/auth/auth-storage";
import type {
  CommercialCatalogItem,
  CommercialSaleCancelInput,
  CommercialCustomer,
  CommercialCustomerInput,
  CommercialSale,
  CommercialSaleInput,
} from "@/features/commercial/types";
import { mapCustomer, mapSale } from "@/features/commercial/services/commercial-service.mappers";
import type {
  CommercialCatalogRow,
  CommercialCustomerRow,
  CommercialSaleRow,
} from "@/features/commercial/services/commercial-service.types";
import { supabase } from "@/lib/supabase/client";

function fail(error: { message: string } | null) {
  if (!error) return;
  throw new Error(error.message);
}

function getCommercialSessionToken() {
  const session = readAuthSession();
  if (!session?.sessionToken) throw new Error("Session Commerciale invalide. Reconnectez-vous.");
  return session.sessionToken;
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
