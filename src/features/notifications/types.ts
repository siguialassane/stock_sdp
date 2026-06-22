export type NotificationType = "stock" | "vente";

export type NotificationLevel = "warning" | "info";

export interface AppNotification {
  id: number;
  type: NotificationType;
  titre: string;
  description: string;
  /** Optionnel: montant ou quantite mis en avant. */
  valeur?: string;
  niveau: NotificationLevel;
  /** ISO date ou libelle court pour le tri/affichage. */
  horodatage: string;
}
