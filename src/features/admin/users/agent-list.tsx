import { useMemo, useState } from "react";
import { Eye, Pencil, Power, Trash2, UserPlus, X } from "lucide-react";

import { useAuth } from "@/features/auth/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { useAdminStore } from "@/features/admin/store/admin-store";
import type { Agent } from "@/features/admin/types";
import { AgentDetailDialog } from "@/features/admin/users/agent-detail-dialog";

function statusLabel(agent: Agent) {
  return agent.statut === "active" ? "Actif" : agent.statut === "pending" ? "Activation en attente" : "Suspendu";
}

export function AgentList({ onCreate, onEdit }: { onCreate: () => void; onEdit: (agent: Agent) => void }) {
  const { session } = useAuth();
  const { agents, toggleAgent, deleteAgent } = useAdminStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyDeleteId, setBusyDeleteId] = useState<string | null>(null);
  const [busyToggleId, setBusyToggleId] = useState<string | null>(null);

  const selectedAgent = useMemo(() => agents.find((agent) => agent.id === selectedAgentId) ?? null, [agents, selectedAgentId]);

  const handleDelete = async (agent: Agent) => {
    if (session?.email && session.email.toLowerCase() === agent.email.toLowerCase()) return;
    setBusyDeleteId(agent.id);
    try {
      await deleteAgent(agent.id);
      setConfirmingId(null);
      setSelectedAgentId((current) => current === agent.id ? null : current);
    } finally {
      setBusyDeleteId(null);
    }
  };

  const handleToggle = async (agentId: string) => {
    setBusyToggleId(agentId);
    try {
      await toggleAgent(agentId);
    } finally {
      setBusyToggleId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agents ({agents.length})</CardTitle>
        </CardHeader>
        <CardContent className={agents.length ? "p-0" : undefined}>
          {agents.length === 0 ? (
            <EmptyState icon={UserPlus} title="Aucun agent cree" description="Creez les comptes Magasin, Commercial et Caisse." action={<Button type="button" variant="outline" onClick={onCreate}>Creer le premier agent</Button>} />
          ) : (
            <div className="divide-y">
              {agents.map((agent) => {
                const isCurrentSession = Boolean(session?.email && session.email.toLowerCase() === agent.email.toLowerCase());
                const isConfirming = confirmingId === agent.id;
                return (
                  <div key={agent.id} className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {agent.nom.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{agent.nom}</p>
                        <Badge variant="outline">{agent.role}</Badge>
                        <Badge variant={agent.statut === "active" ? "success" : agent.statut === "pending" ? "warning" : "secondary"}>{statusLabel(agent)}</Badge>
                        {isCurrentSession ? <Badge variant="outline">Session actuelle</Badge> : null}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{agent.email} - {agent.codeAgent}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setSelectedAgentId(agent.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => onEdit(agent)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                      <Button type="button" variant="outline" size="sm" disabled={busyToggleId === agent.id} onClick={() => void handleToggle(agent.id)}>
                        <Power className="mr-2 h-4 w-4" />
                        {busyToggleId === agent.id ? "Traitement..." : agent.statut === "suspended" ? "Retablir" : "Suspendre"}
                      </Button>
                      {isConfirming ? (
                        <div className="flex items-center gap-2 rounded-lg bg-destructive/5 px-2 py-1">
                          <span className="text-sm text-destructive">Confirmer ?</span>
                          <Button type="button" variant="destructive" size="sm" disabled={busyDeleteId === agent.id || isCurrentSession} onClick={() => void handleDelete(agent)}>
                            {busyDeleteId === agent.id ? "Suppression..." : "Supprimer"}
                          </Button>
                          <Button type="button" variant="ghost" size="icon" aria-label="Annuler la suppression" onClick={() => setConfirmingId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" disabled={isCurrentSession} onClick={() => setConfirmingId(agent.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAgent ? (
        <AgentDetailDialog agent={selectedAgent} onClose={() => setSelectedAgentId(null)}>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              L'Admin peut ajuster ce compte, suspendre son acces, ou supprimer l'agent s'il ne doit plus utiliser l'application.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => { setSelectedAgentId(null); onEdit(selectedAgent); }}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button type="button" variant="outline" disabled={busyToggleId === selectedAgent.id} onClick={() => void handleToggle(selectedAgent.id)}>
                <Power className="mr-2 h-4 w-4" />
                {busyToggleId === selectedAgent.id ? "Traitement..." : selectedAgent.statut === "suspended" ? "Retablir" : "Suspendre"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                disabled={Boolean(session?.email && session.email.toLowerCase() === selectedAgent.email.toLowerCase()) || busyDeleteId === selectedAgent.id}
                onClick={() => void handleDelete(selectedAgent)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {busyDeleteId === selectedAgent.id ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
            {session?.email && session.email.toLowerCase() === selectedAgent.email.toLowerCase() ? (
              <p className="text-xs text-muted-foreground">La session Admin actuellement connectee ne peut pas etre supprimee depuis cet ecran.</p>
            ) : null}
          </div>
        </AgentDetailDialog>
      ) : null}
    </>
  );
}
