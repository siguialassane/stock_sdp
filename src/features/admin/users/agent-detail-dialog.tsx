import { Pencil, Power, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Agent } from "@/features/admin/types";
import { formatAgentDate } from "@/features/admin/users/agent-display";
import { AgentRoleBadge } from "@/features/admin/users/agent-role-badge";
import { AgentStatus } from "@/features/admin/users/agent-status";

interface AgentDetailDialogProps {
  agent: Agent;
  isCurrentSession: boolean;
  busyToggle: boolean;
  busyDelete: boolean;
  onClose: () => void;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

export function AgentDetailDialog({
  agent,
  isCurrentSession,
  busyToggle,
  busyDelete,
  onClose,
  onEdit,
  onToggle,
  onDelete,
}: AgentDetailDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        aria-label="Fermer les details agent"
        onClick={onClose}
      />
      <Card className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto shadow-2xl">
        <CardHeader className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle id="agent-detail-title" className="text-lg">{agent.nom}</CardTitle>
                <AgentStatus agent={agent} />
                {isCurrentSession ? (
                  <Badge variant="outline" className="text-[10px] font-normal">
                    Session actuelle
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{agent.email}</p>
              <div className="mt-2">
                <AgentRoleBadge role={agent.role} />
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Fermer" onClick={onClose}>
              <span className="text-lg leading-none">&times;</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="rounded-lg border px-4">
            <DetailRow label="Code agent" value={agent.codeAgent ?? "-"} mono />
            <DetailRow label="Cree le" value={formatAgentDate(agent.createdAt, true)} />
            <DetailRow label="Derniere connexion" value={formatAgentDate(agent.derniereConnexion, true)} />
          </div>

          <p className="text-sm text-muted-foreground">
            {agent.statut === "pending"
              ? "Premier acces non complete. Partagez l'identifiant et le mot de passe initial."
              : agent.statut === "suspended"
                ? "Compte suspendu — connexion impossible."
                : "Compte actif."}
          </p>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={busyToggle} onClick={onToggle}>
              <Power className="mr-2 h-4 w-4" />
              {busyToggle
                ? "Traitement..."
                : agent.statut === "suspended"
                  ? "Retablir l'acces"
                  : "Suspendre"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              disabled={isCurrentSession || busyDelete}
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {busyDelete ? "Suppression..." : "Supprimer"}
            </Button>
          </div>

          {isCurrentSession ? (
            <p className="text-xs text-muted-foreground">
              La session Admin connectee ne peut pas etre supprimee depuis cet ecran.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
