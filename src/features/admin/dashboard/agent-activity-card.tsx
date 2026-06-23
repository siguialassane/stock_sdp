import { Activity } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AgentActivityCard() {
  return (
    <Card className="xl:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-muted-foreground" />
          Activite des agents
        </CardTitle>
        <CardDescription>Dernieres actions enregistrees par role</CardDescription>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={Activity}
          title="Journal d'activite a venir"
          description="Cette zone sera alimentee par le futur journal d'audit, sans donnees fictives."
        />
      </CardContent>
    </Card>
  );
}
