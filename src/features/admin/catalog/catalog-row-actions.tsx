import { useState } from "react";
import { Check, Loader2, Pencil, Power, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CatalogRowActionsProps {
  active: boolean;
  onEdit: () => void;
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
}

/**
 * Groupe d'actions compact (icones) affiche directement sur chaque ligne du
 * catalogue (produits et types). Permet de Voir / Modifier / Activer-Désactiver
 * / Supprimer sans ouvrir le modal.
 *
 * La suppression demande une confirmation inline (icone -> Check/X) pour eviter
 * tout effacement involontaire, meme depuis la ligne.
 */
export function CatalogRowActions({
  active,
  onEdit,
  onToggle,
  onDelete,
}: CatalogRowActionsProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
      setConfirming(false);
    } catch {
      return;
    } finally {
      setDeleting(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="destructive"
          size="icon"
          disabled={deleting}
          aria-label="Confirmer la suppression"
          onClick={() => void handleDelete()}
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Annuler la suppression"
          onClick={() => setConfirming(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button type="button" variant="ghost" size="icon" aria-label="Modifier" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={active ? "Desactiver" : "Activer"}
        onClick={() => void onToggle()}
      >
        <Power className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        aria-label="Supprimer"
        onClick={() => setConfirming(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
