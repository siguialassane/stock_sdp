import { useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import type { Agent } from "@/features/admin/types";
import { AgentAccessCard } from "@/features/admin/users/agent-access-card";
import { AgentForm } from "@/features/admin/users/agent-form";
import { AgentList } from "@/features/admin/users/agent-list";
import { AgentStats } from "@/features/admin/users/agent-stats";

export function AdminUsers() {
  const [view, setView] = useState<"list" | "form">("list");
  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const handleSaved = (agent: Agent) => {
    setCreatedAgent(editingAgent ? null : agent);
    setEditingAgent(null);
    setView("list");
  };

  const openCreate = () => {
    setEditingAgent(null);
    setView("form");
  };

  const openEdit = (agent: Agent) => {
    setCreatedAgent(null);
    setEditingAgent(agent);
    setView("form");
  };

  const closeForm = () => {
    setView("list");
    setEditingAgent(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description="Gestion des agents, roles et premiers acces."
        action={
          view === "form" ? (
            <Button type="button" variant="outline" onClick={closeForm}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour a la liste
            </Button>
          ) : (
            <Button type="button" onClick={openCreate}>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvel agent
            </Button>
          )
        }
      />

      {createdAgent ? (
        <AgentAccessCard agent={createdAgent} onClose={() => setCreatedAgent(null)} />
      ) : null}

      {view === "form" ? (
        <AgentForm onCancel={closeForm} onSaved={handleSaved} initialAgent={editingAgent} />
      ) : (
        <>
          <AgentStats />
          <AgentList onCreate={openCreate} onEdit={openEdit} />
        </>
      )}
    </div>
  );
}
