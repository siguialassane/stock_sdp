import { fail } from "@/features/admin/services/admin-service.shared";
import type { AdminSettingsData } from "@/features/admin/types";
import { supabase } from "@/lib/supabase/client";

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
