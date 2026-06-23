import { Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

export const AdminCatalog = lazy(() => import("@/features/admin/catalog/admin-catalog").then((module) => ({ default: module.AdminCatalog })));
export const AdminDashboard = lazy(() => import("@/features/admin/dashboard/admin-dashboard").then((module) => ({ default: module.AdminDashboard })));
export const AdminSettings = lazy(() => import("@/features/admin/settings/admin-settings").then((module) => ({ default: module.AdminSettings })));
export const AdminUsers = lazy(() => import("@/features/admin/users/admin-users").then((module) => ({ default: module.AdminUsers })));
export const CommercialCustomers = lazy(() => import("@/features/commercial/customers/commercial-customers").then((module) => ({ default: module.CommercialCustomers })));
export const CommercialDashboard = lazy(() => import("@/features/commercial/dashboard/commercial-dashboard").then((module) => ({ default: module.CommercialDashboard })));
export const CommercialOrders = lazy(() => import("@/features/commercial/orders/commercial-orders").then((module) => ({ default: module.CommercialOrders })));
export const CommercialSales = lazy(() => import("@/features/commercial/sales/commercial-sales").then((module) => ({ default: module.CommercialSales })));
export const MagasinDashboard = lazy(() => import("@/features/magasin/dashboard/magasin-dashboard").then((module) => ({ default: module.MagasinDashboard })));
export const MagasinReceptions = lazy(() => import("@/features/magasin/receptions/magasin-receptions").then((module) => ({ default: module.MagasinReceptions })));
export const MagasinSorties = lazy(() => import("@/features/magasin/sorties/magasin-sorties").then((module) => ({ default: module.MagasinSorties })));
export const MagasinStock = lazy(() => import("@/features/magasin/stock/magasin-stock").then((module) => ({ default: module.MagasinStock })));
export const AdminPage = lazy(() => import("@/pages/AdminPage"));
export const CommercialPage = lazy(() => import("@/pages/CommercialPage"));
export const LoginPage = lazy(() => import("@/pages/LoginPage"));
export const MagasinPage = lazy(() => import("@/pages/MagasinPage"));

export function RootLayout() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Chargement...</div>}>
      <Outlet />
    </Suspense>
  );
}
