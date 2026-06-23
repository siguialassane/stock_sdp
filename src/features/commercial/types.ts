export type CustomerTier = "grossiste" | "demi_grossiste";
export type CommercialSaleStatus =
  | "draft"
  | "submitted"
  | "awaiting_payment"
  | "partially_paid"
  | "paid"
  | "ready_for_release"
  | "released"
  | "completed"
  | "cancelled";

export interface CommercialDashboardData {
  fullName: string;
  email: string;
  activeProductCount: number;
  activeTypeCount: number;
  activeVariantCount: number;
}

export interface CommercialCatalogItem {
  productId: string;
  productName: string;
  typeName: string;
  variantId: string;
  unitCode: string;
  sku: string;
  salePrice: number;
}

export interface CommercialCustomer {
  id: string;
  fullName: string;
  tier: CustomerTier;
  phone: string;
  address: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
}

export interface CommercialCustomerInput {
  fullName: string;
  tier: CustomerTier;
  phone: string;
  address: string;
  notes: string;
  isActive: boolean;
}

export interface CommercialSaleLine {
  id: string;
  variantId: string;
  productName: string;
  typeName: string;
  unitCode: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CommercialSale {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerTier: CustomerTier;
  status: CommercialSaleStatus;
  totalAmount: number;
  lineCount: number;
  notes: string;
  cancelReason: string;
  cancelledAt?: string;
  createdAt: string;
  lines: CommercialSaleLine[];
}

export interface CommercialSaleDraftLine {
  variantId: string;
  quantity: string;
  unitPrice?: number;
}

export interface CommercialSaleInput {
  customerId: string;
  notes: string;
  lines: Array<{
    variantId: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export interface CommercialSaleCancelInput {
  reason: string;
}

export const EDITABLE_COMMERCIAL_SALE_STATUSES = [
  "draft",
  "submitted",
  "awaiting_payment",
] as const satisfies CommercialSaleStatus[];

export function canEditCommercialSale(status: CommercialSaleStatus) {
  return EDITABLE_COMMERCIAL_SALE_STATUSES.includes(
    status as (typeof EDITABLE_COMMERCIAL_SALE_STATUSES)[number],
  );
}
