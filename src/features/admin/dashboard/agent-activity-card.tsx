import { Activity } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { ADMIN_AGENT_ACTIVITIES } from "@/mocks/admin.mock";

/**
 * Bloc 2 : activite recente des agents (Commercial, Caisse, Magasin).
 * Empty state tant que Supabase n'est pas branche.
 */
export function AgentActivityCard() {
  const activities = ADMIN_AGENT_ACTIVITIES;

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
        {activities.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="Aucune activite recente"
            description="Les actions des agents apparaîtront ici."
          />
        ) : (
          <ul className="space-y-3">
            {activities.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {item.agent.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{item.agent}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.horodatage}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{item.action}</p>
                </div>
                <Badge variant="secondary" className="shrink-0">{item.role}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
