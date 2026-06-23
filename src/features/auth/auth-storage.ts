import type { AuthSession } from "@/features/auth/types";

const AUTH_STORAGE_KEY = "stockflow.auth.v2";
const APP_ROLES = new Set(["Admin", "Magasin", "Commercial", "Caisse"]);

function isValidSession(session: Partial<AuthSession>): session is AuthSession {
  if (!session.username || !session.role || !APP_ROLES.has(session.role)) return false;
  if (session.authMode === "table") return Boolean(session.sessionToken);
  return session.authMode === "supabase" || session.authMode === undefined;
}

export function readAuthSession(): AuthSession | null {
  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) return null;

  try {
    const session = JSON.parse(rawSession) as Partial<AuthSession>;
    if (!isValidSession(session)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return {
      username: session.username,
      displayName: session.displayName ?? session.username,
      email: session.email ?? "",
      role: session.role,
      authMode: session.authMode === "table" ? "table" : "supabase",
      sessionToken: typeof session.sessionToken === "string" ? session.sessionToken : undefined,
      loginIdentifier: typeof session.loginIdentifier === "string" ? session.loginIdentifier : undefined,
    };
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function writeAuthSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
