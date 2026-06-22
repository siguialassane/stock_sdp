import { useEffect, useState, type ChangeEvent } from "react";

import { Input } from "@/components/ui/input";

interface AmountInputProps {
  id?: string;
  value: string;
  onChange: (rawValue: string) => void;
  placeholder?: string;
}

/**
 * Champ de saisie de montant formate avec separateur de milliers (espace
 * insécable) pendant la frappe : l'utilisateur tape "10000", l'input affiche
 * "10 000". La valeur remontee a onChange reste brute (chiffres uniquement),
 * afin de rester compatible avec Number() cote formulaire.
 *
 * Suffixe "XOF" a droite via un wrapper, pour rappeler la devise sans
 * perturber la saisie.
 */
export function AmountInput({ id, value, onChange, placeholder }: AmountInputProps) {
  const [display, setDisplay] = useState(() => formatGrouped(value));

  // Synchronise l'affichage si la valeur brute change de l'exterieur
  // (ex: initialisation d'une variante a modifier).
  useEffect(() => {
    setDisplay(formatGrouped(value));
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/[^\d]/g, "");
    onChange(digits);
    setDisplay(formatGrouped(digits));
  };

  return (
    <div className="relative">
      <Input
        id={id}
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        placeholder={placeholder ?? "0"}
        className="pr-12"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        XOF
      </span>
    </div>
  );
}

/** Formate une chaine de chiffres en groupes de milliers : "10000" -> "10 000". */
function formatGrouped(digits: string): string {
  const clean = digits.replace(/[^\d]/g, "");
  if (!clean) return "";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Number(clean));
}
