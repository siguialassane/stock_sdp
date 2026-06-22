import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/features/admin/store/admin-store";
import type { Agent, RoleName } from "@/features/admin/types";

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function buildAgentCode(role: RoleName) {
  const prefix = { Admin: "ADM", Magasin: "MAG", Commercial: "COM", Caisse: "CAI" }[role];
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function AgentForm({ onCancel, onSaved, initialAgent }: { onCancel: () => void; onSaved: (agent: Agent) => void; initialAgent?: Agent | null }) {
  const { agents, addAgent, updateAgent } = useAdminStore();
  const [fullName, setFullName] = useState(initialAgent?.nom ?? "");
  const [email, setEmail] = useState(initialAgent?.email ?? "");
  const [role, setRole] = useState<RoleName>(initialAgent?.role ?? "Magasin");
  const [agentCode, setAgentCode] = useState(initialAgent?.codeAgent ?? buildAgentCode(initialAgent?.role ?? "Magasin"));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isEditMode = Boolean(initialAgent);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!fullName.trim() || !email.trim() || !agentCode.trim()) return setError("Le nom, l'email et le code agent sont obligatoires.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Saisissez une adresse email valide.");
    if (agents.some((agent) => agent.id !== initialAgent?.id && agent.email.toLowerCase() === email.trim().toLowerCase())) return setError("Un agent utilise deja cette adresse email.");
    if (agents.some((agent) => agent.id !== initialAgent?.id && agent.codeAgent?.toLowerCase() === agentCode.trim().toLowerCase())) return setError("Un agent utilise deja ce code.");
    if (role === "Caisse" && agents.filter((agent) => agent.id !== initialAgent?.id && agent.role === "Caisse" && agent.actif).length >= 3) return setError("La limite de trois agents Caisse actifs est atteinte.");
    setIsSaving(true);
    try {
      const saved = isEditMode
        ? await updateAgent({ id: initialAgent!.id, fullName: fullName.trim(), email: email.trim().toLowerCase(), role, agentCode: agentCode.trim().toUpperCase() })
        : await addAgent({ fullName: fullName.trim(), email: email.trim().toLowerCase(), role, agentCode: agentCode.trim().toUpperCase() });
      onSaved(saved);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enregistrement impossible.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-primary/25 bg-primary/[0.025]">
      <CardHeader><CardTitle className="text-base">{isEditMode ? "Modifier un agent" : "Creer un agent"}</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2"><Label htmlFor="agent-name">Nom complet</Label><Input id="agent-name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Nom de l'agent" autoFocus /></div>
          <div className="space-y-2"><Label htmlFor="agent-email">Email</Label><Input id="agent-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="agent@entreprise.com" /></div>
          <div className="space-y-2"><Label htmlFor="agent-role">Role</Label><select id="agent-role" className={selectClass} value={role} onChange={(event) => { const nextRole = event.target.value as RoleName; setRole(nextRole); if (!isEditMode) setAgentCode(buildAgentCode(nextRole)); }}><option value="Magasin">Magasin</option><option value="Commercial">Commercial</option><option value="Caisse">Caisse</option><option value="Admin">Admin</option></select></div>
          <div className="space-y-2 md:col-span-2 xl:col-span-3"><Label htmlFor="agent-code">Code agent</Label><Input id="agent-code" value={agentCode} onChange={(event) => setAgentCode(event.target.value.toUpperCase())} placeholder="MAG-ABCDE" /><p className="text-xs text-muted-foreground">Ce code sert au premier acces et peut etre ajuste par l'Admin.</p></div>
          {error && <p className="text-sm text-destructive md:col-span-2 xl:col-span-3">{error}</p>}
          <div className="flex gap-2 md:col-span-2 xl:col-span-3"><Button type="submit" disabled={isSaving}>{isSaving ? (isEditMode ? "Enregistrement..." : "Creation...") : (isEditMode ? "Enregistrer" : "Creer l'agent")}</Button><Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>Annuler</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}
