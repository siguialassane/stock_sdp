/**
 * Formate un montant en franc CFA (XOF), format francais.
 * Separateur de milliers en espace insécable : "5 000 XOF".
 * Le franc CFA n'ayant pas de subdivision usuelle, on force 0 decimale.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(value);
}
