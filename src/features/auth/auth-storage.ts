import type { AuthSession } from "@/features/auth/types";

const AUTH_STORAGE_KEY = "stockflow.auth.v2";

export function readAuthSession(): AuthSession | null {
  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) return null;

  try {
    const session = JSON.parse(rawSession) as Partial<AuthSession>;
    if (!session.username || !session.role) return null;

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
