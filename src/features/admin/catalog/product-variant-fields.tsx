import { AmountInput } from "@/components/amount-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product, ProductVariant, UnitOfMeasure } from "@/features/admin/types";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

interface ProductVariantFieldsProps {
  code: string;
  price: string;
  productId: string;
  products: Product[];
  unit: UnitOfMeasure;
  variant?: ProductVariant;
  variantOnly: boolean;
  onCodeChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onProductChange: (value: string) => void;
  onUnitChange: (value: UnitOfMeasure) => void;
}

export function ProductVariantFields({
  code,
  price,
  productId,
  products,
  unit,
  variant,
  variantOnly,
  onCodeChange,
  onPriceChange,
  onProductChange,
  onUnitChange,
}: ProductVariantFieldsProps) {
  return (
    <>
      <div className="md:col-span-2 xl:col-span-4">
        <p className="text-sm font-medium">{variantOnly ? "Variante" : "Premiere variante"}</p>
      </div>

      {variant ? (
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="variant-product">Produit</Label>
          <select
            id="variant-product"
            className={selectClass}
            value={productId}
            onChange={(event) => onProductChange(event.target.value)}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.nom}</option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="variant-unit">Unite</Label>
        <select
          id="variant-unit"
          className={selectClass}
          value={unit}
          onChange={(event) => onUnitChange(event.target.value as UnitOfMeasure)}
        >
          <option value="carton">Carton</option>
          <option value="kilo">Kilo</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="variant-code">Code interne</Label>
        <Input
          id="variant-code"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          placeholder="EX. TIL-CAR"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="variant-price">Prix de vente</Label>
        <AmountInput id="variant-price" value={price} onChange={onPriceChange} placeholder="0" />
      </div>
    </>
  );
}
