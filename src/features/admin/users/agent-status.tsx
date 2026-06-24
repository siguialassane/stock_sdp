import { Badge } from "@/components/ui/badge";
import type { Agent } from "@/features/admin/types";
import { agentStatusLabel, agentStatusVariant } from "@/features/admin/users/agent-display";

export function AgentStatus({ agent, className = "" }: { agent: Agent; className?: string }) {
  return (
    <Badge variant={agentStatusVariant(agent)} className={className}>
      {agentStatusLabel(agent)}
    </Badge>
  );
}
