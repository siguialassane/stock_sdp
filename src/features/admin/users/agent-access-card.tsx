import { Check, Copy, KeyRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Agent } from "@/features/admin/types";

export function AgentAccessCard({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const activationPath = `/login?agent=${agent.codeAgent}`;
  const accessText = `Agent : ${agent.nom}\nCode : ${agent.codeAgent}\nLien : ${window.location.origin}${activationPath}`;

  const copyAccess = async () => {
    await navigator.clipboard.writeText(accessText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Card className="border-emerald-500/30 bg-emerald-500/[0.06]"><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"><KeyRound className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="font-medium">Premier acces prepare pour {agent.nom}</p><p className="mt-1 text-sm text-muted-foreground">Code agent : <span className="font-mono font-semibold text-foreground">{agent.codeAgent}</span></p><p className="text-xs text-muted-foreground">Le mot de passe sera defini via Supabase Auth lors de l'activation.</p></div><div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={copyAccess}>{copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}{copied ? "Copie" : "Copier l'acces"}</Button><Button type="button" variant="ghost" size="sm" onClick={onClose}>Fermer</Button></div></CardContent></Card>
  );
}
