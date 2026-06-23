import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductType } from "@/features/admin/types";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

interface ProductIdentityFieldsProps {
  description: string;
  name: string;
  typeId: string;
  types: ProductType[];
  onDescriptionChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function ProductIdentityFields({
  description,
  name,
  typeId,
  types,
  onDescriptionChange,
  onNameChange,
  onTypeChange,
}: ProductIdentityFieldsProps) {
  return (
    <>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="product-type">Type</Label>
        <select
          id="product-type"
          className={selectClass}
          value={typeId}
          onChange={(event) => onTypeChange(event.target.value)}
        >
          <option value="">Selectionner...</option>
          {types.filter((item) => item.actif || item.id === typeId).map((item) => (
            <option key={item.id} value={item.id}>{item.nom} - {item.code}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="product-name">Nom du produit</Label>
        <Input
          id="product-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Ex. Carpe entiere"
          autoFocus
        />
      </div>
      <div className="space-y-2 md:col-span-2 xl:col-span-4">
        <Label htmlFor="product-description">Description</Label>
        <Input
          id="product-description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Description facultative"
        />
      </div>
    </>
  );
}
