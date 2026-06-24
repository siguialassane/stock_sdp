import { useMemo, useState } from "react";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Power,
  Search,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";

import { useAuth } from "@/features/auth/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAdminStore } from "@/features/admin/store/admin-store";
import type { Agent, RoleName } from "@/features/admin/types";
import { formatAgentDate } from "@/features/admin/users/agent-display";
import { AgentDetailDialog } from "@/features/admin/users/agent-detail-dialog";
import { AgentRoleBadge } from "@/features/admin/users/agent-role-badge";
import { AgentStatus } from "@/features/admin/users/agent-status";

const roleFilters: Array<{ value: "all" | RoleName; label: string }> = [
  { value: "all", label: "Tous les roles" },
  { value: "Admin", label: "Admin" },
  { value: "Magasin", label: "Magasin" },
  { value: "Commercial", label: "Commercial" },
  { value: "Caisse", label: "Caisse" },
];

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary sm:w-auto";

export function AgentList({
  onCreate,
  onEdit,
}: {
  onCreate: () => void;
  onEdit: (agent: Agent) => void;
}) {
  const { session } = useAuth();
  const { agents, toggleAgent, deleteAgent } = useAdminStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyDeleteId, setBusyDeleteId] = useState<string | null>(null);
  const [busyToggleId, setBusyToggleId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | RoleName>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) ?? null,
    [agents, selectedAgentId],
  );

  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return agents.filter((agent) => {
      if (roleFilter !== "all" && agent.role !== roleFilter) return false;
      if (!query) return true;
      return (
        agent.nom.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        (agent.codeAgent?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [agents, roleFilter, search]);

  const handleDelete = async (agent: Agent) => {
    if (session?.email && session.email.toLowerCase() === agent.email.toLowerCase()) return;
    setBusyDeleteId(agent.id);
    try {
      await deleteAgent(agent.id);
      setConfirmingId(null);
      setOpenMenuId(null);
      setSelectedAgentId((current) => (current === agent.id ? null : current));
    } finally {
      setBusyDeleteId(null);
    }
  };

  const handleToggle = async (agentId: string) => {
    setBusyToggleId(agentId);
    try {
      await toggleAgent(agentId);
      setOpenMenuId(null);
    } finally {
      setBusyToggleId(null);
    }
  };

  const isCurrentSession = (agent: Agent) =>
    Boolean(session?.email && session.email.toLowerCase() === agent.email.toLowerCase());

  return (
    <>
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base">Liste des agents</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredAgents.length} sur {agents.length} affiche{filteredAgents.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher par nom, email ou code..."
                className="pl-9"
                aria-label="Rechercher un agent"
              />
            </div>
            <select
              className={selectClass}
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as "all" | RoleName)}
              aria-label="Filtrer par role"
            >
              {roleFilters.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent className={agents.length ? "p-0" : undefined}>
          {agents.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title="Aucun agent cree"
              description="Creez les comptes Magasin, Commercial et Caisse."
              action={
                <Button type="button" variant="outline" onClick={onCreate}>
                  Creer le premier agent
                </Button>
              }
            />
          ) : filteredAgents.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Aucun agent correspond a votre recherche.
            </div>
          ) : (
            <div>
              <div
                className="hidden border-b bg-muted/30 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_auto] md:gap-4"
              >
                <span>Utilisateur</span>
                <span>Role</span>
                <span>Statut</span>
                <span>Derniere connexion</span>
                <span className="text-right">Actions</span>
              </div>

              <div className="divide-y">
                {filteredAgents.map((agent) => {
                  const currentSession = isCurrentSession(agent);
                  const isConfirming = confirmingId === agent.id;

                  return (
                    <div
                      key={agent.id}
                      className="px-5 py-4 transition-colors hover:bg-muted/20"
                    >
                      <div className="grid gap-4 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_auto] md:items-center md:gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {agent.nom.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium leading-tight">
                              {agent.nom}
                              {currentSession ? (
                                <Badge variant="outline" className="ml-2 text-[10px] font-normal">
                                  Session actuelle
                                </Badge>
                              ) : null}
                            </p>
                            <p className="mt-0.5 truncate text-sm text-muted-foreground">{agent.email}</p>
                            <p className="mt-0.5 font-mono text-xs text-muted-foreground/80">{agent.codeAgent}</p>
                          </div>
                        </div>

                        <div>
                          <AgentRoleBadge role={agent.role} />
                        </div>

                        <div>
                          <AgentStatus agent={agent} />
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {formatAgentDate(agent.derniereConnexion)}
                        </div>

                        <div className="flex items-center justify-end gap-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={`Voir les details de ${agent.nom}`}
                            onClick={() => setSelectedAgentId(agent.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={`Modifier ${agent.nom}`}
                            onClick={() => onEdit(agent)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Popover
                            open={openMenuId === agent.id}
                            onOpenChange={(open) => {
                              setOpenMenuId(open ? agent.id : null);
                              if (!open) setConfirmingId(null);
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label={`Actions pour ${agent.nom}`}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-52 p-1">
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                                disabled={busyToggleId === agent.id}
                                onClick={() => void handleToggle(agent.id)}
                              >
                                <Power className="h-4 w-4" />
                                {busyToggleId === agent.id
                                  ? "Traitement..."
                                  : agent.statut === "suspended"
                                    ? "Retablir l'acces"
                                    : "Suspendre"}
                              </button>

                              {isConfirming ? (
                                <div className="space-y-2 px-2 py-2">
                                  <p className="text-xs text-destructive">Confirmer la suppression ?</p>
                                  <div className="flex gap-1">
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="flex-1"
                                      disabled={busyDeleteId === agent.id || currentSession}
                                      onClick={() => void handleDelete(agent)}
                                    >
                                      {busyDeleteId === agent.id ? "..." : "Supprimer"}
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 shrink-0"
                                      aria-label="Annuler"
                                      onClick={() => setConfirmingId(null)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                                  disabled={currentSession}
                                  onClick={() => setConfirmingId(agent.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Supprimer
                                </button>
                              )}
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAgent ? (
        <AgentDetailDialog
          agent={selectedAgent}
          isCurrentSession={isCurrentSession(selectedAgent)}
          busyToggle={busyToggleId === selectedAgent.id}
          busyDelete={busyDeleteId === selectedAgent.id}
          onClose={() => setSelectedAgentId(null)}
          onEdit={() => {
            setSelectedAgentId(null);
            onEdit(selectedAgent);
          }}
          onToggle={() => void handleToggle(selectedAgent.id)}
          onDelete={() => void handleDelete(selectedAgent)}
        />
      ) : null}
    </>
  );
}
