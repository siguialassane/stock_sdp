import { redirect } from "@tanstack/react-router";

import { readAuthSession } from "@/features/auth/auth-storage";
import type { AppRole } from "@/features/auth/types";

export function requireSession(role?: AppRole | AppRole[]) {
  const session = readAuthSession();
  const acceptedRoles = Array.isArray(role) ? role : role ? [role] : undefined;

  if (!session || (acceptedRoles && !acceptedRoles.includes(session.role))) {
    throw redirect({ to: "/login" });
  }
}
