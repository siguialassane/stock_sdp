import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

import { useToast } from "@/components/toast/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CatalogEditTarget } from "@/features/admin/catalog/catalog-types";
import { ProductIdentityFields } from "@/features/admin/catalog/product-identity-fields";
import { ProductVariantFields } from "@/features/admin/catalog/product-variant-fields";
import { ProductVariantsList } from "@/features/admin/catalog/product-variants-list";
import { useAdminStore } from "@/features/admin/store/admin-store";
import type { UnitOfMeasure } from "@/features/admin/types";
interface ProductFormProps {
  target?: CatalogEditTarget;
  parentProductId?: string;
  onClose: () => void;
  onEditVariant?: (variantId: string) => void;
  onAddVariant?: (productId: string) => void;
}

export function ProductForm({
  target,
  parentProductId,
  onClose,
  onEditVariant,
  onAddVariant,
}: ProductFormProps) {
  const store = useAdminStore();
  const toast = useToast();
  const product = target?.kind === "product"
    ? store.products.find((item) => item.id === target.id)
    : undefined;
  const variant = target?.kind === "variant"
    ? store.products.flatMap((item) => item.variantes).find((item) => item.id === target.id)
    : undefined;
  const variantOnly = Boolean(parentProductId || variant);
  const [typeId, setTypeId] = useState(product?.typeId ?? "");
  const [name, setName] = useState(product?.nom ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [productId, setProductId] = useState(parentProductId ?? variant?.productId ?? "");
  const [unit, setUnit] = useState<UnitOfMeasure>(variant?.unite ?? "carton");
  const [code, setCode] = useState(variant?.code ?? "");
  const [price, setPrice] = useState(variant ? String(variant.prix) : "");
  const [createdProductId, setCreatedProductId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const openVariant = (action?: (id: string) => void, id?: string) => {
    if (!action || !id) return;
    onClose();
    action(id);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!variantOnly && (!typeId || !name.trim())) {
      setError("Le type et le nom du produit sont obligatoires.");
      return;
    }
    if (variantOnly && !productId) {
      setError("Selectionnez le produit concerne.");
      return;
    }

    const numericPrice = Number(price);
    if (target?.kind !== "product" && (!code.trim() || !Number.isFinite(numericPrice) || numericPrice < 0)) {
      setError("Le code et un prix valide sont obligatoires.");
      return;
    }

    setSaving(true);
    let productCreatedDuringSubmit = false;
    try {
      if (target?.kind === "product") {
        await store.updateProduct(target.id, typeId, name.trim(), description.trim());
        toast.success({ title: "Produit modifie", message: `${name.trim()} a ete mis a jour.` });
      } else if (target?.kind === "variant") {
        await store.updateVariant(target.id, productId, unit, code.trim().toUpperCase(), numericPrice);
        toast.success({ title: "Variante modifiee", message: `${code.trim().toUpperCase()} a ete mise a jour.` });
      } else if (parentProductId || createdProductId) {
        await store.addVariant(parentProductId ?? createdProductId, unit, code.trim().toUpperCase(), numericPrice);
        toast.success({ title: "Variante ajoutee", message: `${code.trim().toUpperCase()} a ete creee.` });
      } else {
        const createdProduct = await store.addProduct(typeId, name.trim(), description.trim());
        setCreatedProductId(createdProduct.id);
        productCreatedDuringSubmit = true;
        await store.addVariant(createdProduct.id, unit, code.trim().toUpperCase(), numericPrice);
        toast.success({ title: "Produit cree", message: `${name.trim()} et sa premiere variante ont ete enregistres.` });
      }
      onClose();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Enregistrement impossible.";
      setError(
        createdProductId || productCreatedDuringSubmit
          ? `Le produit est cree. Reessayez seulement la variante : ${message}`
          : message,
      );
      toast.error({ title: "Echec de l'enregistrement", message });
    } finally {
      setSaving(false);
    }
  };

  if (!store.types.length && !variantOnly && !product) {
    return (
      <Card className="border-amber-500/30">
        <CardContent className="p-6">
          <p className="font-medium">Creez d'abord un type.</p>
          <p className="mt-1 text-sm text-muted-foreground">Un produit doit obligatoirement appartenir a un type.</p>
          <Button type="button" variant="outline" className="mt-4" onClick={onClose}>Fermer</Button>
        </CardContent>
      </Card>
    );
  }

  const title = target?.kind === "product"
    ? "Modifier le produit"
    : target?.kind === "variant"
      ? "Modifier la variante"
      : parentProductId
        ? "Ajouter une variante"
        : "Nouveau produit et premiere variante";

  return (
    <Card className="border-primary/25 bg-primary/[0.025]">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button type="button" variant="ghost" size="icon" aria-label="Fermer" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {!variantOnly ? (
            <ProductIdentityFields
              description={description}
              name={name}
              typeId={typeId}
              types={store.types}
              onDescriptionChange={setDescription}
              onNameChange={setName}
              onTypeChange={setTypeId}
            />
          ) : null}

          {target?.kind !== "product" ? (
            <ProductVariantFields
              code={code}
              price={price}
              productId={productId}
              products={store.products}
              unit={unit}
              variant={variant}
              variantOnly={variantOnly}
              onCodeChange={setCode}
              onPriceChange={setPrice}
              onProductChange={setProductId}
              onUnitChange={setUnit}
            />
          ) : product ? (
            <ProductVariantsList
              product={product}
              onAdd={(id) => openVariant(onAddVariant, id)}
              onEdit={(id) => openVariant(onEditVariant, id)}
            />
          ) : null}

          {error ? <p className="text-sm text-destructive md:col-span-2 xl:col-span-4">{error}</p> : null}
          <div className="flex gap-2 md:col-span-2 xl:col-span-4">
            <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
            <Button type="button" variant="outline" disabled={saving} onClick={onClose}>Annuler</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
