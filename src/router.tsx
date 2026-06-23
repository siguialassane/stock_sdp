import {
  Navigate,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

import { getHomeRoute } from "@/features/auth/role-routes";
import { requireSession } from "@/features/auth/route-guard";
import { readAuthSession } from "@/features/auth/auth-storage";
import * as Screens from "@/router-components";

const rootRoute = createRootRoute({
  component: Screens.RootLayout,
  notFoundComponent: () => <Navigate to="/" replace />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const session = readAuthSession();
    throw redirect({ to: getHomeRoute(session?.role) ?? "/login" });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: () => {
    const homeRoute = getHomeRoute(readAuthSession()?.role);
    if (homeRoute) throw redirect({ to: homeRoute });
  },
  component: Screens.LoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: () => requireSession("Admin"),
  component: Screens.AdminPage,
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
  component: Screens.AdminDashboard,
});

const adminCatalogRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "catalogue",
  component: Screens.AdminCatalog,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "utilisateurs",
  component: Screens.AdminUsers,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "parametres",
  component: Screens.AdminSettings,
});

const commercialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/commercial",
  beforeLoad: () => requireSession("Commercial"),
  component: Screens.CommercialPage,
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
  component: Screens.CommercialDashboard,
});

const commercialSalesRoute = createRoute({
  getParentRoute: () => commercialRoute,
  path: "ventes",
  component: Screens.CommercialSales,
});

const commercialOrdersRoute = createRoute({
  getParentRoute: () => commercialRoute,
  path: "commandes",
  component: Screens.CommercialOrders,
});

const commercialCustomersRoute = createRoute({
  getParentRoute: () => commercialRoute,
  path: "clients",
  component: Screens.CommercialCustomers,
});

const magasinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/magasin",
  beforeLoad: () => requireSession("Magasin"),
  component: Screens.MagasinPage,
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
  component: Screens.MagasinDashboard,
});

const magasinStockRoute = createRoute({
  getParentRoute: () => magasinRoute,
  path: "stock",
  component: Screens.MagasinStock,
});

const magasinReceptionsRoute = createRoute({
  getParentRoute: () => magasinRoute,
  path: "receptions",
  component: Screens.MagasinReceptions,
});

const magasinSortiesRoute = createRoute({
  getParentRoute: () => magasinRoute,
  path: "sorties",
  component: Screens.MagasinSorties,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRoute.addChildren([adminIndexRoute, adminDashboardRoute, adminCatalogRoute, adminUsersRoute, adminSettingsRoute]),
  commercialRoute.addChildren([commercialIndexRoute, commercialDashboardRoute, commercialCustomersRoute, commercialSalesRoute, commercialOrdersRoute]),
  magasinRoute.addChildren([magasinIndexRoute, magasinDashboardRoute, magasinStockRoute, magasinReceptionsRoute, magasinSortiesRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
