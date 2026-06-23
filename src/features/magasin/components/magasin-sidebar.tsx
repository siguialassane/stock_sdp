import { ChevronLeft, ChevronRight, LogOut, User, Warehouse } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { MAGASIN_NAV_ITEMS } from "@/features/magasin/constants";
import { useAuth } from "@/features/auth/auth-context";
import { cn } from "@/lib/utils";

interface MagasinSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

/**
 * Barre laterale de l'ecran Magasin.
 * Clone de la sidebar Admin/Commercial (sticky h-screen, bloc user + deconnexion
 * fixe en bas), avec le menu specifique Magasin (Stock, Receptions, Sorties).
 */
export function MagasinSidebar({
  mobileOpen,
  onCloseMobile,
  onLogout,
  onToggleSidebar,
  sidebarOpen,
}: MagasinSidebarProps) {
  const { session } = useAuth();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 md:transition-[width]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          sidebarOpen ? "md:w-72" : "md:w-20",
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Warehouse className="h-5 w-5" />
          </div>
          {sidebarOpen ? (
            <div>
              <div className="font-semibold">StockFlow</div>
              <div className="text-xs text-muted-foreground">Espace Magasin</div>
            </div>
          ) : null}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto px-3 py-5">
          {MAGASIN_NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
              activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground" }}
              inactiveProps={{ className: "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen ? <span>{item.label}</span> : null}
            </Link>
          ))}
        </div>

        <div className="border-t p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            {sidebarOpen ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{session?.displayName ?? "Magasinier"}</p>
                <p className="truncate text-xs text-muted-foreground">{session?.email}</p>
              </div>
            ) : null}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={onToggleSidebar}>
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            {sidebarOpen ? (
              <Button type="button" variant="outline" className="flex-1" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Deconnexion
              </Button>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
}
