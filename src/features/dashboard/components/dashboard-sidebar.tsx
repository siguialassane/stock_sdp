import { ChevronLeft, ChevronRight, LayoutDashboard, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NAV_ITEMS } from "@/features/dashboard/constants";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  onLogout: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function DashboardSidebar({
  onLogout,
  onToggleSidebar,
  sidebarOpen,
}: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen border-r bg-sidebar text-sidebar-foreground transition-all duration-300 md:flex md:flex-col",
        sidebarOpen ? "w-72" : "w-20",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        {sidebarOpen && (
          <div>
            <div className="font-semibold">StockFlow</div>
            <div className="text-xs text-muted-foreground">Admin dashboard</div>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-3 py-5">
        <div className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </div>

        {sidebarOpen && (
          <Card className="border-sidebar-border bg-sidebar-accent/50 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Performance</CardTitle>
              <CardDescription>Livraison et stock ce mois-ci</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Objectif ventes</span>
                  <span>78%</span>
                </div>
                <div className="h-2 rounded-full bg-sidebar-border">
                  <div className="h-2 w-[78%] rounded-full bg-sidebar-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Disponibilite stock</span>
                  <span>91%</span>
                </div>
                <div className="h-2 rounded-full bg-sidebar-border">
                  <div className="h-2 w-[91%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Admin User</p>
              <p className="truncate text-xs text-muted-foreground">admin@stockflow.app</p>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={onToggleSidebar}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          {sidebarOpen && (
            <Button type="button" variant="outline" className="flex-1" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Deconnexion
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
