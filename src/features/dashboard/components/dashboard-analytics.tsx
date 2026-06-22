import { Activity, BarChart3, Bell, User } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEVICE_DATA, REFERRER_DATA } from "@/features/dashboard/constants";
import { HorizontalStatList } from "@/features/dashboard/components/horizontal-stat-list";
import { OverviewBars } from "@/features/dashboard/components/overview-bars";
import type { OverviewPoint } from "@/features/dashboard/types";

interface DashboardAnalyticsProps {
  overview: OverviewPoint[];
}

export function DashboardAnalytics({ overview }: DashboardAnalyticsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Traffic overview</CardTitle>
          <CardDescription>Zone reservee pour les futurs indicateurs de navigation et d'usage.</CardDescription>
        </CardHeader>
        <CardContent>
          <OverviewBars data={overview.slice(-8)} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Clics totaux"
          value="0"
          helper="Aucune donnee analytics pour le moment"
          icon={BarChart3}
        />
        <MetricCard
          title="Visiteurs uniques"
          value="0"
          helper="Aucune donnee analytics pour le moment"
          icon={User}
        />
        <MetricCard
          title="Taux de rebond"
          value="0%"
          helper="Aucune donnee analytics pour le moment"
          icon={Activity}
        />
        <MetricCard
          title="Session moyenne"
          value="0m 00s"
          helper="Aucune donnee analytics pour le moment"
          icon={Bell}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Referrers</CardTitle>
            <CardDescription>Sources de trafic a afficher apres branchement des donnees.</CardDescription>
          </CardHeader>
          <CardContent>
            <HorizontalStatList
              items={REFERRER_DATA}
              formatter={(value) => `${value}`}
              barClassName="bg-primary"
            />
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Devices</CardTitle>
            <CardDescription>Repartition des appareils des que les donnees seront collectees.</CardDescription>
          </CardHeader>
          <CardContent>
            <HorizontalStatList
              items={DEVICE_DATA}
              formatter={(value) => `${value}%`}
              barClassName="bg-chart-2"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
