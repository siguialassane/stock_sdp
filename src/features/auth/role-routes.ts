import type { AppRole } from "@/features/auth/types";

type AppHomeRoute =
  | "/admin/dashboard"
  | "/commercial/dashboard"
  | "/magasin/dashboard";

const HOME_ROUTE_BY_ROLE: Partial<Record<AppRole, AppHomeRoute>> = {
  Admin: "/admin/dashboard",
  Commercial: "/commercial/dashboard",
  Magasin: "/magasin/dashboard",
};

export function getHomeRoute(role?: AppRole): AppHomeRoute | null {
  return role ? HOME_ROUTE_BY_ROLE[role] ?? null : null;
}
