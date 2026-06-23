import type { Dispatch, SetStateAction } from "react";

import * as usersService from "@/features/admin/services/admin-users.service";
import type { Agent, RoleName } from "@/features/admin/types";

const AGENT_PREFIX: Record<RoleName, string> = {
  Admin: "ADM",
  Magasin: "MAG",
  Commercial: "COM",
  Caisse: "CAI",
};

interface AdminAgentActionContext {
  agents: Agent[];
  setAgents: Dispatch<SetStateAction<Agent[]>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function createAdminAgentActions(context: AdminAgentActionContext) {
  const run = async <Result,>(operation: () => Promise<Result>) => {
    context.setError("");
    try {
      return await operation();
    } catch (reason) {
      context.setError(reason instanceof Error ? reason.message : "Operation Supabase impossible.");
      throw reason;
    }
  };

  const addAgent = async (input: {
    fullName: string;
    email: string;
    role: RoleName;
    agentCode?: string;
  }) => {
    const agentCode =
      input.agentCode?.trim()
      || `${AGENT_PREFIX[input.role]}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const agent = await run(() => usersService.createAgent({ ...input, agentCode }));
    context.setAgents((current) => [...current, agent]);
    return agent;
  };

  const updateAgent = async (input: {
    id: string;
    fullName: string;
    email: string;
    role: RoleName;
    agentCode: string;
  }) => {
    const agent = await run(() => usersService.updateAgent(input));
    context.setAgents((current) =>
      current.map((item) => (item.id === input.id ? agent : item)),
    );
    return agent;
  };

  const deleteAgent = async (id: string) => {
    await run(() => usersService.deleteAgent(id));
    context.setAgents((current) => current.filter((agent) => agent.id !== id));
  };

  const toggleAgent = async (id: string) => {
    const agent = context.agents.find((item) => item.id === id);
    if (!agent) throw new Error("Agent introuvable.");
    const status = agent.statut === "suspended"
      ? agent.premierAcces ? "pending" : "active"
      : "suspended";
    await run(() => usersService.setAgentStatus(id, status));
    context.setAgents((current) =>
      current.map((item) =>
        item.id === id ? { ...item, statut: status, actif: status === "active" } : item,
      ),
    );
  };

  return { addAgent, deleteAgent, toggleAgent, updateAgent };
}
