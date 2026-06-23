import type {
  CommercialCatalogItem,
  CommercialSale,
  CommercialSaleDraftLine,
} from "@/features/commercial/types";

export function createSaleDraftLine(
  line?: Partial<Omit<CommercialSaleDraftLine, "draftId">>,
): CommercialSaleDraftLine {
  return {
    draftId: crypto.randomUUID(),
    variantId: line?.variantId ?? "",
    quantity: line?.quantity ?? "1",
    unitPrice: line?.unitPrice,
  };
}

export function createSaleDraftLines(sale?: CommercialSale | null) {
  if (!sale?.lines.length) return [createSaleDraftLine()];

  return sale.lines.map((line) =>
    createSaleDraftLine({
      variantId: line.variantId,
      quantity: String(line.quantity),
      unitPrice: line.unitPrice,
    }),
  );
}

export function getSaleLineValues(
  line: CommercialSaleDraftLine,
  catalog: CommercialCatalogItem[],
) {
  const variant = catalog.find((item) => item.variantId === line.variantId);
  const quantity = Number(line.quantity);
  const unitPrice = line.unitPrice ?? variant?.salePrice ?? 0;
  const lineTotal =
    (variant || line.unitPrice !== undefined) && Number.isFinite(quantity) && quantity > 0
      ? quantity * unitPrice
      : 0;

  return { lineTotal, quantity, unitPrice, variant };
}

export function calculateSaleTotal(
  lines: CommercialSaleDraftLine[],
  catalog: CommercialCatalogItem[],
) {
  return lines.reduce(
    (total, line) => total + getSaleLineValues(line, catalog).lineTotal,
    0,
  );
}
