import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";

import { CommercialHeader } from "@/features/commercial/components/commercial-header";
import { CommercialSidebar } from "@/features/commercial/components/commercial-sidebar";
import { COMMERCIAL_NAV_ITEMS } from "@/features/commercial/constants";
import { CommercialSalesDraftProvider } from "@/features/commercial/store/commercial-sales-draft-context";

interface CommercialScreenProps {
  onLogout: () => void;
}

export function CommercialScreen({ onLogout }: CommercialScreenProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeItem = COMMERCIAL_NAV_ITEMS.find((item) => location.pathname === item.to);
  const title = activeItem?.label ?? "Commercial";

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="grid min-h-screen md:grid-cols-[auto_1fr]">
        <CommercialSidebar
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
          <CommercialHeader
            onOpenMobile={() => setMobileOpen(true)}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            sidebarOpen={sidebarOpen}
            title={title}
          />

          <main className="flex-1 p-4 md:p-6">
            <CommercialSalesDraftProvider>
              <Outlet />
            </CommercialSalesDraftProvider>
          </main>
        </div>
      </div>
    </div>
  );
}
