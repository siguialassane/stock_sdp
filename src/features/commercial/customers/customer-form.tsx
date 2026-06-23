import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CommercialCustomer, CommercialCustomerInput, CustomerTier } from "@/features/commercial/types";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const textareaClass =
  "flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function CustomerForm({
  initialCustomer,
  isSaving,
  onCancel,
  onSubmit,
}: {
  initialCustomer?: CommercialCustomer | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (input: CommercialCustomerInput) => Promise<void>;
}) {
  const [fullName, setFullName] = useState(initialCustomer?.fullName ?? "");
  const [tier, setTier] = useState<CustomerTier>(initialCustomer?.tier ?? "grossiste");
  const [phone, setPhone] = useState(initialCustomer?.phone ?? "");
  const [address, setAddress] = useState(initialCustomer?.address ?? "");
  const [notes, setNotes] = useState(initialCustomer?.notes ?? "");
  const [isActive, setIsActive] = useState(initialCustomer?.isActive ?? true);
  const [error, setError] = useState("");

  const isEditMode = Boolean(initialCustomer);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Le nom du client est obligatoire.");
      return;
    }

    try {
      await onSubmit({
        fullName: fullName.trim(),
        tier,
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        isActive,
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enregistrement impossible.");
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/[0.025]">
      <CardHeader>
        <CardTitle className="text-base">{isEditMode ? "Modifier le client" : "Creer un client"}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Renseignez la fiche client une seule fois pour reutiliser ensuite ce contact dans les ventes.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Nom complet</Label>
            <Input
              id="customer-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nom du grossiste ou demi-grossiste"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-tier">Categorie client</Label>
            <select
              id="customer-tier"
              className={selectClass}
              value={tier}
              onChange={(event) => setTier(event.target.value as CustomerTier)}
            >
              <option value="grossiste">Grossiste</option>
              <option value="demi_grossiste">Demi-grossiste</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-phone">Telephone</Label>
            <Input
              id="customer-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Telephone du client"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-address">Adresse</Label>
            <Input
              id="customer-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Adresse ou zone de livraison"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="customer-notes">Notes</Label>
            <textarea
              id="customer-notes"
              className={textareaClass}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Remarques utiles pour le Commercial"
            />
          </div>

          {isEditMode ? (
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />
              Client actif
            </label>
          ) : null}

          {error ? <p className="text-sm text-destructive md:col-span-2">{error}</p> : null}

          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (isEditMode ? "Enregistrement..." : "Creation...") : isEditMode ? "Enregistrer" : "Creer le client"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
