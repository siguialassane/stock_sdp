import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Agent } from "@/features/admin/types";

function formatDate(value?: string) {
  if (!value) return "Jamais";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function AgentDetailDialog({ agent, children, onClose }: { agent: Agent; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="agent-detail-title">
      <button type="button" className="absolute inset-0 bg-black/45 backdrop-blur-sm" aria-label="Fermer les details agent" onClick={onClose} />
      <Card className="relative z-10 max-h-[88vh] w-full max-w-3xl overflow-y-auto shadow-2xl">
        <CardHeader className="sticky top-0 z-10 flex-row items-start justify-between border-b bg-background/95 backdrop-blur">
          <div>
            <CardTitle id="agent-detail-title" className="text-xl">{agent.nom}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{agent.email} - {agent.codeAgent}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Fermer" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-4 rounded-xl border bg-muted/20 p-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role</p>
              <p className="mt-2 font-medium">{agent.role}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Statut</p>
              <p className="mt-2 font-medium">{agent.statut === "active" ? "Actif" : agent.statut === "pending" ? "Activation en attente" : "Suspendu"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Cree le</p>
              <p className="mt-2 font-medium">{formatDate(agent.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Derniere connexion</p>
              <p className="mt-2 font-medium">{formatDate(agent.derniereConnexion)}</p>
            </div>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
