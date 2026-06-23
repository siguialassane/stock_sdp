// Types du domaine Magasin.
// Front uniquement pour ce jet : structures pretes pour Supabase plus tard.
// Le Magasin gere les receptions fournisseur, le stock et la validation des
// sorties de ventes (voir plan.md : Flux operationnels).

/* ------------------------------------------------------------------ */
/* Stock                                                              */
/* ------------------------------------------------------------------ */

/** Etat de stock d'une variante dans l'entrepot unique. */
export interface StockBalance {
  id: string;
  /** Libelle produit (type + nom) pour l'affichage. */
  produit: string;
  varianteCode: string;
  unite: "carton" | "kilo";
  quantite: number;
  /** Seuil en dessous duquel une alerte est levee. */
  seuilAlerte: number;
}

/** Niveau de severite d'une alerte de stock. */
export type StockAlertSeverity = "warning" | "danger";

/** Alerte de stock faible ou de rupture. */
export interface StockAlert {
  id: string;
  produit: string;
  varianteCode: string;
  quantite: number;
  severite: StockAlertSeverity;
}

/* ------------------------------------------------------------------ */
/* Receptions                                                         */
/* ------------------------------------------------------------------ */

/** Statut d'une reception fournisseur. */
export type ReceptionStatus = "pending" | "received" | "cancelled";

/** Reception de marchandise fournisseur. */
export interface Reception {
  id: string;
  numero: string;
  fournisseur: string;
  datePrevue: string;
  lignes: number;
  statut: ReceptionStatus;
}

/* ------------------------------------------------------------------ */
/* Sorties de ventes                                                  */
/* ------------------------------------------------------------------ */

/** Statut d'une sortie de vente (a valider par le Magasin). */
export type SortieStatus = "ready_for_release" | "released";

/** Sortie de vente prete a etre validee par le Magasin. */
export interface Sortie {
  id: string;
  numero: string;
  client: string;
  commercial: string;
  datePreparation: string;
  lignes: number;
  montantTotal: number;
  statut: SortieStatus;
}

/* ------------------------------------------------------------------ */
/* Tableau de bord Magasin                                            */
/* ------------------------------------------------------------------ */

/** KPIs affiches dans le tableau de bord Magasin. */
export interface MagasinKpis {
  referencesEnStock: number;
  receptionsEnAttente: number;
  sortiesAValider: number;
  alertesStock: number;
}
