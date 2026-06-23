// Types du domaine Admin.
// Front uniquement pour ce jet : pas de logique reseau, structures pretes pour Supabase plus tard.

/* ------------------------------------------------------------------ */
/* Referentiel catalogue                                               */
/* ------------------------------------------------------------------ */

/** Type de produit autonome : tilapia, thon, boeuf... */
export interface ProductType {
  id: string;
  nom: string;
  code: string;
  actif: boolean;
  createdAt: string;
}

/** Unite de vente d'une variante. */
export type UnitOfMeasure = "carton" | "kilo";

/** Variante vendable d'un produit : porte unite, prix, code, statut. */
export interface ProductVariant {
  id: string;
  productId: string;
  unite: UnitOfMeasure;
  code: string;
  prix: number;
  actif: boolean;
  createdAt: string;
}

/** Produit parent : porte l'identite metier et ses variantes. */
export interface Product {
  id: string;
  typeId: string;
  typeNom?: string;
  nom: string;
  description?: string;
  actif: boolean;
  variantes: ProductVariant[];
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Agents / utilisateurs                                              */
/* ------------------------------------------------------------------ */

export type RoleName = "Admin" | "Magasin" | "Commercial" | "Caisse";

/** Agent (utilisateur applicatif) cree par l'Admin. */
export interface Agent {
  id: string;
  nom: string;
  email: string;
  role: RoleName;
  actif: boolean;
  statut: "pending" | "active" | "suspended";
  codeAgent?: string;
  identifiant?: string;
  motDePasseInitial?: string;
  premierAcces: boolean;
  derniereConnexion?: string;
  createdAt: string;
}

export interface AdminSettingsData {
  companyName: string;
  companyContact: string;
  warehouseName: string;
  warehouseAddress: string;
  lowStockThreshold: number;
  salesPrefix: string;
  receiptPrefix: string;
}

/* ------------------------------------------------------------------ */
/* Supervision (tableau de bord Admin)                                */
/* ------------------------------------------------------------------ */

/** KPIs affiches dans le bloc "Resume global". */
export interface AdminKpis {
  totalProduitsActifs: number;
  totalAgentsActifs: number;
  ventesEnAttentePaiement: number;
  ventesPretesASortir: number;
  alertesStock: number;
}

/** Activite recente d'un agent. */
export interface AgentActivity {
  id: string;
  agent: string;
  role: RoleName;
  action: string;
  horodatage: string;
}

/** Type d'alerte operationnelle. */
export type OperationalAlertType = "paiement" | "sortie" | "rupture";

/** Niveau de severite d'une alerte. */
export type Severity = "warning" | "danger";

/** Alerte de surveillance operationnelle. */
export interface OperationalAlert {
  id: string;
  type: OperationalAlertType;
  libelle: string;
  severite: Severity;
}
