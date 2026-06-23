import { ShieldAlert } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function OperationalWatchCard() {
  return (
    <Card className="xl:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          Surveillance operationnelle
        </CardTitle>
        <CardDescription>Points de blocage et ruptures a surveiller</CardDescription>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={ShieldAlert}
          title="Surveillance a venir"
          description="Les alertes apparaitront lorsque les flux Stock et Caisse seront branches."
        />
      </CardContent>
    </Card>
  );
}
