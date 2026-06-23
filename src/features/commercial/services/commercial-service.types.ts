import type {
  CommercialCustomer,
  CommercialSale,
} from "@/features/commercial/types";

export interface CommercialCatalogRow {
  product_id: string;
  product_name: string;
  type_name: string;
  variant_id: string;
  unit_code: string;
  sku: string;
  sale_price: number | string | null;
}

export interface CommercialCustomerRow {
  id: string;
  full_name: string;
  tier: CommercialCustomer["tier"];
  phone: string | null;
  address: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CommercialSaleLineRow {
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

export interface CommercialSaleRow {
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
