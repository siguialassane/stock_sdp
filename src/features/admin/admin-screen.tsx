import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";

import { AdminHeader } from "@/features/admin/components/admin-header";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { ADMIN_NAV_ITEMS } from "@/features/admin/constants";

interface AdminScreenProps {
  onLogout: () => void;
}

/**
 * Shell de l'ecran Admin.
 * Meme layout grid que le dashboard (grid md:grid-cols-[auto_1fr], sidebar
 * sticky + header sticky + main scrollable), mais la zone de contenu est
 * deleguee a <Outlet/> pour les sous-routes TanStack Router.
 */
export function AdminScreen({ onLogout }: AdminScreenProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Titre dynamique du header selon la sous-route active.
  const activeItem = ADMIN_NAV_ITEMS.find((item) =>
    location.pathname === item.to,
  );
  const title = activeItem?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="grid min-h-screen md:grid-cols-[auto_1fr]">
        <AdminSidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onLogout={() => {
            onLogout();
            void navigate({ to: "/login", replace: true });
          }}
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        <div className="flex min-w-0 flex-col">
          <AdminHeader
            onOpenMobile={() => setMobileOpen(true)}
            onToggleSidebar={handleToggleSidebar}
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
