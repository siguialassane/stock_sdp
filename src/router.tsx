import {
  Navigate,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

import { AdminCatalog } from "@/features/admin/catalog/admin-catalog";
import { AdminDashboard } from "@/features/admin/dashboard/admin-dashboard";
import { AdminSettings } from "@/features/admin/settings/admin-settings";
import { AdminUsers } from "@/features/admin/users/admin-users";
import { readAuthSession } from "@/features/auth/auth-storage";
import type { AppRole } from "@/features/auth/types";
import { CommercialCustomers } from "@/features/commercial/customers/commercial-customers";
import { CommercialDashboard } from "@/features/commercial/dashboard/commercial-dashboard";
import { CommercialOrders } from "@/features/commercial/orders/commercial-orders";
import { CommercialSales } from "@/features/commercial/sales/commercial-sales";
import { MagasinReceptions } from "@/features/magasin/receptions/magasin-receptions";
import { MagasinSorties } from "@/features/magasin/sorties/magasin-sorties";
import { MagasinDashboard } from "@/features/magasin/dashboard/magasin-dashboard";
import { MagasinStock } from "@/features/magasin/stock/magasin-stock";
import AdminPage from "@/pages/AdminPage";
import CommercialPage from "@/pages/CommercialPage";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import MagasinPage from "@/pages/MagasinPage";

function homeRouteForRole(role?: AppRole) {
  if (role === "Admin") return "/admin/dashboard" as const;
  if (role === "Magasin") return "/magasin/dashboard" as const;
  if (role === "Commercial") return "/commercial/dashboard" as const;
  return "/login" as const;
}

function requireSession(role?: AppRole | AppRole[]) {
  const session = readAuthSession();
  const acceptedRoles = Array.isArray(role) ? role : role ? [role] : undefined;

  if (!session || (acceptedRoles && !acceptedRoles.includes(session.role))) {
    throw redirect({ to: "/login" });
  }
}

const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: () => <Navigate to="/" replace />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const session = readAuthSession();
    throw redirect({ to: homeRouteForRole(session?.role) });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: () => requireSession(),
  component: DashboardPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: () => requireSession("Admin"),
  component: AdminPage,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/admin/dashboard" });
  },
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "dashboard",
  component: AdminDashboard,
});

const adminCatalogRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "catalogue",
  component: AdminCatalog,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "utilisateurs",
  component: AdminUsers,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "parametres",
  component: AdminSettings,
});

const commercialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/commercial",
  beforeLoad: () => requireSession("Commercial"),
  component: CommercialPage,
});

const commercialIndexRoute = createRoute({
  getParentRoute: () => commercialRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/commercial/dashboard" });
  },
});

const commercialDashboardRoute = createRoute({
  getParentRoute: () => commercialRoute,
  path: "dashboard",
  component: CommercialDashboard,
});

const commercialSalesRoute = createRoute({
  getParentRoute: () => commercialRoute,
  path: "ventes",
  component: CommercialSales,
});

const commercialOrdersRoute = createRoute({
  getParentRoute: () => commercialRoute,
  path: "commandes",
  component: CommercialOrders,
});

const commercialCustomersRoute = createRoute({
  getParentRoute: () => commercialRoute,
  path: "clients",
  component: CommercialCustomers,
});

const magasinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/magasin",
  beforeLoad: () => requireSession("Magasin"),
  component: MagasinPage,
});

const magasinIndexRoute = createRoute({
  getParentRoute: () => magasinRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/magasin/dashboard" });
  },
});

const magasinDashboardRoute = createRoute({
  getParentRoute: () => magasinRoute,
  path: "dashboard",
  component: MagasinDashboard,
});

const magasinStockRoute = createRoute({
  getParentRoute: () => magasinRoute,
  path: "stock",
  component: MagasinStock,
});

const magasinReceptionsRoute = createRoute({
  getParentRoute: () => magasinRoute,
  path: "receptions",
  component: MagasinReceptions,
});

const magasinSortiesRoute = createRoute({
  getParentRoute: () => magasinRoute,
  path: "sorties",
  component: MagasinSorties,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  adminRoute.addChildren([
    adminIndexRoute,
    adminDashboardRoute,
    adminCatalogRoute,
    adminUsersRoute,
    adminSettingsRoute,
  ]),
  commercialRoute.addChildren([
    commercialIndexRoute,
    commercialDashboardRoute,
    commercialCustomersRoute,
    commercialSalesRoute,
    commercialOrdersRoute,
  ]),
  magasinRoute.addChildren([
    magasinIndexRoute,
    magasinDashboardRoute,
    magasinStockRoute,
    magasinReceptionsRoute,
    magasinSortiesRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
