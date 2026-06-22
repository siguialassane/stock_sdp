import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { InventoryItem } from "@/features/dashboard/types";

function getStatusVariant(status: InventoryItem["statut"]): BadgeProps["variant"] {
  if (status === "En stock") return "success";
  if (status === "Stock faible") return "warning";
  return "danger";
}

interface InventoryStatusBadgeProps {
  status: InventoryItem["statut"];
}

export function InventoryStatusBadge({ status }: InventoryStatusBadgeProps) {
  return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
}
