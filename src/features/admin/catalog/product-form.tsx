import { useState, type FormEvent } from "react";
import { Pencil, Plus, X } from "lucide-react";

import { AmountInput } from "@/components/amount-input";
import { useToast } from "@/components/toast/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CatalogEditTarget } from "@/features/admin/catalog/catalog-types";
import { useAdminStore } from "@/features/admin/store/admin-store";
import { formatCurrency } from "@/lib/format/currency";

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

export function ProductForm({
  target,
  parentProductId,
  onClose,
  onEditVariant,
  onAddVariant,
}: {
  target?: CatalogEditTarget;
  parentProductId?: string;
  onClose: () => void;
  onEditVariant?: (variantId: string) => void;
  onAddVariant?: (productId: string) => void;
}) {
  const store = useAdminStore();
  const toast = useToast();
  const product = target?.kind === "product" ? store.products.find((item) => item.id === target.id) : undefined;
  const variant = target?.kind === "variant" ? store.products.flatMap((item) => item.variantes).find((item) => item.id === target.id) : undefined;
  const variantOnly = Boolean(parentProductId || variant);
  const [typeId, setTypeId] = useState(product?.typeId ?? "");
  const [name, setName] = useState(product?.nom ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [productId, setProductId] = useState(parentProductId ?? variant?.productId ?? "");
  const [unit, setUnit] = useState<"carton" | "kilo">(variant?.unite ?? "carton");
  const [code, setCode] = useState(variant?.code ?? "");
  const [price, setPrice] = useState(variant ? String(variant.prix) : "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!variantOnly && (!typeId || !name.trim())) return setError("Le type et le nom du produit sont obligatoires.");
    if (variantOnly && !productId) return setError("Selectionnez le produit concerne.");

    const numericPrice = Number(price);
    if (target?.kind !== "product" && (!code.trim() || !Number.isFinite(numericPrice) || numericPrice < 0)) {
      return setError("Le code et un prix valide sont obligatoires.");
    }

    setSaving(true);

    try {
      if (target?.kind === "product") {
        await store.updateProduct(target.id, typeId, name.trim(), description.trim());
        toast.success({ title: "Produit modifie", message: `${name.trim()} a ete mis a jour.` });
      } else if (target?.kind === "variant") {
        await store.updateVariant(target.id, productId, unit, code.trim().toUpperCase(), numericPrice);
        toast.success({ title: "Variante modifiee", message: `La variante ${code.trim().toUpperCase()} a ete mise a jour.` });
      } else if (parentProductId) {
        await store.addVariant(parentProductId, unit, code.trim().toUpperCase(), numericPrice);
        toast.success({ title: "Variante ajoutee", message: `La variante ${code.trim().toUpperCase()} a ete creee.` });
      } else {
        const createdProduct = await store.addProduct(typeId, name.trim(), description.trim());
        await store.addVariant(createdProduct.id, unit, code.trim().toUpperCase(), numericPrice);
        toast.success({ title: "Produit cree", message: `${name.trim()} et sa premiere variante ont ete enregistres.` });
      }

      onClose();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Enregistrement impossible.";
      setError(message);
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
          <Button type="button" variant="outline" className="mt-4" onClick={onClose}>
            Fermer
          </Button>
        </CardContent>
      </Card>
    );
  }

  const title = target?.kind === "product" ? "Modifier le produit" : target?.kind === "variant" ? "Modifier la variante" : parentProductId ? "Ajouter une variante" : "Nouveau produit et premiere variante";

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
            <>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="product-type">Type</Label>
                <select id="product-type" className={selectClass} value={typeId} onChange={(event) => setTypeId(event.target.value)}>
                  <option value="">Selectionner...</option>
                  {store.types.filter((item) => item.actif || item.id === typeId).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nom} - {item.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="product-name">Nom du produit</Label>
                <Input id="product-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Carpe entiere" autoFocus />
              </div>

              <div className="space-y-2 md:col-span-2 xl:col-span-4">
                <Label htmlFor="product-description">Description</Label>
                <Input id="product-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description facultative" />
              </div>
            </>
          ) : null}

          {target?.kind !== "product" ? (
            <>
              <div className="md:col-span-2 xl:col-span-4">
                <p className="text-sm font-medium">{variantOnly ? "Variante" : "Premiere variante"}</p>
              </div>

              {variant ? (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="variant-product">Produit</Label>
                  <select id="variant-product" className={selectClass} value={productId} onChange={(event) => setProductId(event.target.value)}>
                    {store.products.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nom}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="variant-unit">Unite</Label>
                <select id="variant-unit" className={selectClass} value={unit} onChange={(event) => setUnit(event.target.value as "carton" | "kilo")}>
                  <option value="carton">Carton</option>
                  <option value="kilo">Kilo</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="variant-code">Code interne</Label>
                <Input id="variant-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="EX. TIL-CAR" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="variant-price">Prix de vente</Label>
                <AmountInput id="variant-price" value={price} onChange={setPrice} placeholder="0" />
              </div>
            </>
          ) : product ? (
            <div className="space-y-4 md:col-span-2 xl:col-span-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Variantes existantes</p>
                  <p className="text-sm text-muted-foreground">Les variantes de ce produit restent visibles et modifiables depuis ici.</p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onAddVariant?.(product.id);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une variante
                </Button>
              </div>

              {product.variantes.length ? (
                <div className="divide-y rounded-lg border bg-background">
                  {product.variantes.map((item) => (
                    <div key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium capitalize">{item.unite}</p>
                          <Badge variant={item.actif ? "outline" : "secondary"}>{item.actif ? "Active" : "Inactive"}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.code} - Prix : {formatCurrency(item.prix)}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onClose();
                          onEditVariant?.(item.id);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier la variante
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                  Ce produit n'a pas encore de variante. Ajoutez-en une pour completer sa vente.
                </p>
              )}
            </div>
          ) : null}

          {error ? <p className="text-sm text-destructive md:col-span-2 xl:col-span-4">{error}</p> : null}

          <div className="flex gap-2 md:col-span-2 xl:col-span-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button type="button" variant="outline" disabled={saving} onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
