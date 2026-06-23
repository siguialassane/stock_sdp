import { useState, type FormEvent } from "react";
import { Ban, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommercialSale } from "@/features/commercial/types";

const textareaClass =
  "flex min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function CancelOrderDialog({
  isSaving,
  order,
  onClose,
  onConfirm,
}: {
  isSaving: boolean;
  order: CommercialSale;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState(order.cancelReason);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedReason = reason.trim();

    if (!normalizedReason) {
      setError("Le motif d'annulation est obligatoire.");
      return;
    }

    setError("");
    await onConfirm(normalizedReason);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-order-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label="Fermer la fenetre d'annulation"
        onClick={() => !isSaving && onClose()}
      />

      <Card className="relative z-10 w-full max-w-2xl shadow-2xl">
        <CardHeader className="flex-row items-start justify-between gap-4 border-b">
          <div>
            <CardTitle id="cancel-order-title" className="flex items-center gap-2 text-xl">
              <Ban className="h-5 w-5 text-red-500" />
              Annuler la commande
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.customerName} - {order.orderNumber}
            </p>
          </div>

          <Button type="button" variant="ghost" size="icon" aria-label="Fermer" onClick={onClose} disabled={isSaving}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Cette annulation restera visible plus tard dans le menu Caisse avec son motif.
            </div>

            <div className="space-y-2">
              <label htmlFor="cancel-order-reason" className="text-sm font-medium">
                Motif d'annulation
              </label>
              <textarea
                id="cancel-order-reason"
                className={textareaClass}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Expliquez pourquoi cette commande est annulee"
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isSaving ? "Annulation..." : "Confirmer l'annulation"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Retour
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
