import type {
  Agent,
  AgentActivity,
  AdminKpis,
  OperationalAlert,
  Product,
  ProductType,
} from "@/features/admin/types";

/**
 * Donnees Admin volontairement videes.
 * Les structures restent en place pour preparer le branchement Supabase,
 * mais aucune donnee fictive n'est inventee (decision V1 front).
 */

export const ADMIN_TYPES: ProductType[] = [];
export const ADMIN_PRODUCTS: Product[] = [];
export const ADMIN_AGENTS: Agent[] = [];
export const ADMIN_AGENT_ACTIVITIES: AgentActivity[] = [];
export const ADMIN_OPERATIONAL_ALERTS: OperationalAlert[] = [];

/** KPIs initialises a zero tant que Supabase n'est pas branche. */
export const ADMIN_KPIS: AdminKpis = {
  totalProduitsActifs: 0,
  totalAgentsActifs: 0,
  ventesEnAttentePaiement: 0,
  ventesPretesASortir: 0,
  alertesStock: 0,
};
