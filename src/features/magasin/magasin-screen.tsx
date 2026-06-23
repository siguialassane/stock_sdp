import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";

import { MagasinHeader } from "@/features/magasin/components/magasin-header";
import { MagasinSidebar } from "@/features/magasin/components/magasin-sidebar";
import { MAGASIN_NAV_ITEMS } from "@/features/magasin/constants";

interface MagasinScreenProps {
  onLogout: () => void;
}

/**
 * Shell de l'ecran Magasin.
 * Meme layout grid que les autres ecrans (grid md:grid-cols-[auto_1fr],
 * sidebar sticky + header sticky + main scrollable), contenu delegue a <Outlet/>.
 */
export function MagasinScreen({ onLogout }: MagasinScreenProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeItem = MAGASIN_NAV_ITEMS.find((item) => location.pathname === item.to);
  const title = activeItem?.label ?? "Magasin";

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="grid min-h-screen md:grid-cols-[auto_1fr]">
        <MagasinSidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onLogout={() => {
            onLogout();
            void navigate({ to: "/login", replace: true });
          }}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
        />

        <div className="flex min-w-0 flex-col">
          <MagasinHeader
            onOpenMobile={() => setMobileOpen(true)}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            sidebarOpen={sidebarOpen}
            title={title}
          />

          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
