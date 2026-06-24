import type { RoleName } from "@/features/admin/types";
import { roleAccentClass } from "@/features/admin/users/agent-display";
import { cn } from "@/lib/utils";

const rectTagClass = "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium";

export function AgentRoleBadge({ role, className }: { role: RoleName; className?: string }) {
  return (
    <span className={cn(rectTagClass, roleAccentClass(role), className)}>
      {role}
    </span>
  );
}
