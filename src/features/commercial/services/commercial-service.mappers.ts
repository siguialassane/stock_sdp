import type {
  CommercialCustomer,
  CommercialSale,
  CommercialSaleLine,
} from "@/features/commercial/types";
import type {
  CommercialCustomerRow,
  CommercialSaleLineRow,
  CommercialSaleRow,
} from "@/features/commercial/services/commercial-service.types";

export function mapCustomer(row: CommercialCustomerRow): CommercialCustomer {
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

export function mapSale(row: CommercialSaleRow): CommercialSale {
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
