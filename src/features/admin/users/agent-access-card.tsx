import { Check, Copy, KeyRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Agent } from "@/features/admin/types";

export function AgentAccessCard({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const activationPath = `/login?identifier=${encodeURIComponent(agent.identifiant ?? "")}`;
  const accessText = [
    `Agent : ${agent.nom}`,
    `Identifiant : ${agent.identifiant ?? "A generer"}`,
    `Mot de passe initial : ${agent.motDePasseInitial ?? agent.codeAgent ?? "-"}`,
    `Lien : ${window.location.origin}${activationPath}`,
  ].join("\n");

  const copyAccess = async () => {
    await navigator.clipboard.writeText(accessText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Card className="border-emerald-500/30 bg-emerald-500/[0.06]">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
          <KeyRound className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium">Premier acces prepare pour {agent.nom}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Identifiant : <span className="font-medium text-foreground">{agent.identifiant ?? "A generer"}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Mot de passe initial :{" "}
            <span className="font-mono font-semibold text-foreground">
              {agent.motDePasseInitial ?? agent.codeAgent}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Premiere connexion : l&apos;agent saisit son identifiant et son mot de passe initial, puis definit son
            nouveau mot de passe.
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={copyAccess}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copie" : "Copier l'acces"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
