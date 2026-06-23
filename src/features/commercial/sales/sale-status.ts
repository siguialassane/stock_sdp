import type { CommercialSale } from "@/features/commercial/types";

export function formatCommercialSaleDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getCommercialSaleStatusLabel(status: CommercialSale["status"]) {
  return {
    draft: "Brouillon",
    submitted: "Soumise",
    awaiting_payment: "En attente paiement",
    partially_paid: "Paiement partiel",
    paid: "Payee",
    ready_for_release: "Prete a sortir",
    released: "Sortie validee",
    completed: "Terminee",
    cancelled: "Annulee",
  }[status];
}

export function getCommercialSaleStatusVariant(status: CommercialSale["status"]) {
  if (status === "awaiting_payment" || status === "partially_paid") return "warning" as const;
  if (status === "cancelled") return "danger" as const;
  if (status === "paid" || status === "ready_for_release" || status === "completed") {
    return "success" as const;
  }

  return "outline" as const;
}
