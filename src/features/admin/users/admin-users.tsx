import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import type { Agent } from "@/features/admin/types";
import { AgentAccessCard } from "@/features/admin/users/agent-access-card";
import { AgentForm } from "@/features/admin/users/agent-form";
import { AgentList } from "@/features/admin/users/agent-list";

export function AdminUsers() {
  const [formOpen, setFormOpen] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const handleSaved = (agent: Agent) => {
    setCreatedAgent(editingAgent ? null : agent);
    setEditingAgent(null);
    setFormOpen(false);
  };

  const openCreate = () => {
    setEditingAgent(null);
    setFormOpen(true);
  };

  const openEdit = (agent: Agent) => {
    setCreatedAgent(null);
    setEditingAgent(agent);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Utilisateurs" description="Agents, roles et premiers acces de l'application." action={<Button type="button" onClick={openCreate}><UserPlus className="mr-2 h-4 w-4" />Nouvel agent</Button>} />
      {createdAgent && <AgentAccessCard agent={createdAgent} onClose={() => setCreatedAgent(null)} />}
      {formOpen && <AgentForm onCancel={() => { setFormOpen(false); setEditingAgent(null); }} onSaved={handleSaved} initialAgent={editingAgent} />}
      {!formOpen && <AgentList onCreate={openCreate} onEdit={openEdit} />}
    </div>
  );
}
