import { useEffect, useState, type FormEvent } from "react";
import { Building2, CheckCircle2, Hash, MapPin, Ruler, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SettingsSection } from "@/features/admin/settings/settings-section";
import { useAdminStore } from "@/features/admin/store/admin-store";
import type { AdminSettingsData } from "@/features/admin/types";

export function AdminSettings() {
  const { settings, saveSettings } = useAdminStore();
  const [form, setForm] = useState<AdminSettingsData>(settings);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setForm(settings), [settings]);

  const update = <Key extends keyof AdminSettingsData>(key: Key, value: AdminSettingsData[Key]) => setForm((current) => ({ ...current, [key]: value }));
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!form.companyName.trim() || !form.warehouseName.trim()) return setError("Le nom de l'entreprise et celui de l'entrepot sont obligatoires.");
    if (form.lowStockThreshold < 0) return setError("Le seuil de stock ne peut pas etre negatif.");
    if (!form.salesPrefix.trim() || !form.receiptPrefix.trim()) return setError("Les prefixes de numerotation sont obligatoires.");
    setIsSaving(true);
    try {
      await saveSettings(form);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enregistrement impossible.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminPageHeader title="Parametres" description="Configuration globale partagee par tous les modules." action={<Button type="submit" disabled={isSaving}>{saved && <CheckCircle2 className="mr-2 h-4 w-4" />}{isSaving ? "Enregistrement..." : saved ? "Enregistre" : "Enregistrer"}</Button>} />
      {error && <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
      <SettingsSection icon={Building2} title="Entreprise" description="Identite affichee sur les futurs documents"><Field id="company-name" label="Nom" value={form.companyName} onChange={(value) => update("companyName", value)} placeholder="Nom de l'entreprise" /><Field id="company-contact" label="Contact" value={form.companyContact} onChange={(value) => update("companyContact", value)} placeholder="Email ou telephone" /></SettingsSection>
      <SettingsSection icon={MapPin} title="Entrepot" description="Entrepot unique de la version 1"><Field id="warehouse-name" label="Nom" value={form.warehouseName} onChange={(value) => update("warehouseName", value)} placeholder="Entrepot principal" /><Field id="warehouse-address" label="Adresse" value={form.warehouseAddress} onChange={(value) => update("warehouseAddress", value)} placeholder="Adresse de l'entrepot" /></SettingsSection>
      <SettingsSection icon={Ruler} title="Unites de vente" description="Unites disponibles pour les variantes"><div className="flex items-center gap-2"><Badge variant="success">Carton</Badge><Badge variant="success">Kilo</Badge></div><p className="text-sm text-muted-foreground">Les conversions automatiques ne sont pas actives au v1.</p></SettingsSection>
      <SettingsSection icon={TriangleAlert} title="Seuils d'alerte" description="Valeur par defaut pour signaler un stock faible"><Field id="low-stock" label="Seuil stock faible" type="number" value={String(form.lowStockThreshold)} onChange={(value) => update("lowStockThreshold", Number(value))} placeholder="10" /></SettingsSection>
      <SettingsSection icon={Hash} title="Numerotation" description="Prefixes utilises pour les futurs documents"><Field id="sales-prefix" label="Prefixe ventes" value={form.salesPrefix} onChange={(value) => update("salesPrefix", value.toUpperCase())} placeholder="VTE-" /><Field id="receipt-prefix" label="Prefixe receptions" value={form.receiptPrefix} onChange={(value) => update("receiptPrefix", value.toUpperCase())} placeholder="REC-" /></SettingsSection>
      <div className="flex justify-end"><Button type="submit" size="lg">Enregistrer tous les parametres</Button></div>
    </form>
  );
}

function Field({ id, label, value, onChange, placeholder, type = "text" }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: "text" | "number" }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} min={type === "number" ? "0" : undefined} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></div>;
}
