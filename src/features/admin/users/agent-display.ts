import type { Agent, RoleName } from "@/features/admin/types";

export function agentStatusLabel(agent: Agent) {
  if (agent.statut === "active") return "Actif";
  if (agent.statut === "pending") return "Activation en attente";
  return "Suspendu";
}

export function agentStatusVariant(agent: Agent): "success" | "warning" | "secondary" {
  if (agent.statut === "active") return "success";
  if (agent.statut === "pending") return "warning";
  return "secondary";
}

export function formatAgentDate(value?: string, withTime = false) {
  if (!value) return "Jamais";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
  }).format(new Date(value));
}

export function roleAccentClass(role: RoleName) {
  switch (role) {
    case "Admin":
      return "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300";
    case "Magasin":
      return "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300";
    case "Commercial":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
    case "Caisse":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
  }
}
