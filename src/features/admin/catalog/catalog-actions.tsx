import { useState } from "react";
import { Pencil, Power, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CatalogActions({ active, onEdit, onToggle, onDelete }: { active: boolean; onEdit: () => void; onToggle: () => Promise<void>; onDelete: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try { await onDelete(); setConfirming(false); } catch { return; } finally { setDeleting(false); }
  };

  if (confirming) return <div className="flex flex-wrap items-center gap-2 rounded-lg bg-destructive/5 p-2"><span className="text-sm text-destructive">Confirmer ?</span><Button type="button" variant="destructive" size="sm" disabled={deleting} onClick={() => void handleDelete()}>{deleting ? "Suppression..." : "Supprimer"}</Button><Button type="button" variant="ghost" size="icon" aria-label="Annuler la suppression" onClick={() => setConfirming(false)}><X className="h-4 w-4" /></Button></div>;

  return <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" size="sm" onClick={onEdit}><Pencil className="mr-2 h-4 w-4" />Modifier</Button><Button type="button" variant="outline" size="sm" onClick={() => void onToggle()}><Power className="mr-2 h-4 w-4" />{active ? "Desactiver" : "Activer"}</Button><Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setConfirming(true)}><Trash2 className="mr-2 h-4 w-4" />Supprimer</Button></div>;
}
