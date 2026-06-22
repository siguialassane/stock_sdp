import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CatalogEditTarget } from "@/features/admin/catalog/catalog-types";
import { generateTypeCode } from "@/features/admin/catalog/type-code";
import { useAdminStore } from "@/features/admin/store/admin-store";

export function TypeForm({ target, onClose }: { target?: CatalogEditTarget; onClose: () => void }) {
  const store = useAdminStore();
  const editing = target?.kind === "type" ? store.types.find((item) => item.id === target.id) : undefined;
  const [name, setName] = useState(editing?.nom ?? "");
  const [code, setCode] = useState(editing?.code ?? "");
  const [codeEdited, setCodeEdited] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleNameChange = (value: string) => { setName(value); if (!codeEdited) setCode(generateTypeCode(value)); };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); setError("");
    const normalizedCode = generateTypeCode(code || name);
    if (!name.trim() || !normalizedCode) return setError("Le nom et le code du type sont obligatoires.");
    if (store.types.some((item) => item.id !== editing?.id && item.nom.toLowerCase() === name.trim().toLowerCase())) return setError("Ce nom de type existe deja.");
    if (store.types.some((item) => item.id !== editing?.id && item.code === normalizedCode)) return setError("Ce code de type existe deja.");
    setSaving(true);
    try { if (editing) await store.updateType(editing.id, name.trim(), normalizedCode); else await store.addType(name.trim(), normalizedCode); onClose(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Enregistrement impossible."); } finally { setSaving(false); }
  };

  return <Card className="border-primary/25 bg-primary/[0.025]"><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-base">{editing ? "Modifier le type" : "Nouveau type"}</CardTitle><Button type="button" variant="ghost" size="icon" aria-label="Fermer" onClick={onClose}><X className="h-4 w-4" /></Button></CardHeader><CardContent><form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="type-name">Nom du type</Label><Input id="type-name" value={name} onChange={(event) => handleNameChange(event.target.value)} placeholder="Ex. Poisson Carpe" autoFocus /></div><div className="space-y-2"><Label htmlFor="type-code">Code du type</Label><Input id="type-code" value={code} onChange={(event) => { setCodeEdited(true); setCode(generateTypeCode(event.target.value)); }} placeholder="POISSON_CARPE" className="font-mono" /><p className="text-xs text-muted-foreground">Genere automatiquement depuis le nom, puis modifiable.</p></div>{error && <p className="text-sm text-destructive md:col-span-2">{error}</p>}<div className="flex gap-2 md:col-span-2"><Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button><Button type="button" variant="outline" disabled={saving} onClick={onClose}>Annuler</Button></div></form></CardContent></Card>;
}
