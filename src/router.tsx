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
import AdminPage from "@/pages/AdminPage";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";

function requireSession(role?: "Admin") {
  const session = readAuthSession();
  if (!session || (role && session.role !== role)) {
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
    throw redirect({ to: session?.role === "Admin" ? "/admin/dashboard" : "/login" });
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
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
