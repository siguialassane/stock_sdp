import type { AppRole, AuthSession } from "@/features/auth/types";
import { supabase } from "@/lib/supabase/client";

interface AppProfileRow {
  full_name: string;
  email: string;
  role_code: Lowercase<AppRole>;
  status: "pending" | "active" | "suspended";
  first_login_required: boolean;
  agent_code: string;
}

interface FirstLoginCandidate {
  full_name: string;
  email: string;
  role_code: Lowercase<AppRole>;
  agent_code: string;
  login_identifier: string;
  session_token: string;
}

interface AppUserAuthRow {
  session_token: string;
  full_name: string;
  email: string;
  role_code: Lowercase<AppRole>;
  status: "pending" | "active" | "suspended";
  login_identifier: string;
  must_change_password: boolean;
  agent_code: string;
}

type SignInResult =
  | { kind: "session"; session: AuthSession }
  | { kind: "first-login"; candidate: FirstLoginCandidate };

function normalizeIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  return trimmed.includes("@") ? trimmed.toLowerCase() : `${trimmed.toLowerCase()}@stockflow.app`;
}

function roleFromCode(roleCode: Lowercase<AppRole>): AppRole {
  return {
    admin: "Admin",
    magasin: "Magasin",
    commercial: "Commercial",
    caisse: "Caisse",
  }[roleCode];
}

function profileToSession(identifier: string, profile: AppProfileRow): AuthSession {
  return {
    username: identifier.trim(),
    displayName: profile.full_name,
    email: profile.email,
    role: roleFromCode(profile.role_code),
    authMode: "supabase",
    loginIdentifier: identifier.trim(),
  };
}

function appUserToSession(profile: AppUserAuthRow): AuthSession {
  return {
    username: profile.login_identifier,
    displayName: profile.full_name,
    email: profile.email,
    role: roleFromCode(profile.role_code),
    authMode: "table",
    sessionToken: profile.session_token,
    loginIdentifier: profile.login_identifier,
  };
}

async function fetchCurrentProfile() {
  const result = await supabase.rpc("get_current_app_profile");
  if (result.error) throw new Error("Le profil applicatif est introuvable.");

  const rows = (result.data ?? []) as AppProfileRow[];
  const profile = rows[0];
  if (!profile) throw new Error("Le profil applicatif est introuvable.");
  return profile;
}

async function touchCurrentLogin() {
  await supabase.rpc("touch_current_login");
}

export async function signInUser(identifier: string, password: string): Promise<SignInResult> {
  const appUserResult = await supabase.rpc("authenticate_app_user", {
    p_identifier: identifier.trim(),
    p_password: password,
  });

  if (appUserResult.error) {
    throw new Error("Connexion agent impossible pour le moment.");
  }

  const appUser = (appUserResult.data?.[0] ?? null) as AppUserAuthRow | null;
  if (appUser) {
    if (appUser.status === "pending" && appUser.must_change_password) {
      return {
        kind: "first-login",
        candidate: {
          full_name: appUser.full_name,
          email: appUser.email,
          role_code: appUser.role_code,
          agent_code: appUser.agent_code,
          login_identifier: appUser.login_identifier,
          session_token: appUser.session_token,
        },
      };
    }

    if (appUser.status !== "active") {
      throw new Error("Ce compte n'est pas actif.");
    }

    return { kind: "session", session: appUserToSession(appUser) };
  }

  const email = normalizeIdentifier(identifier);
  const signInResult = await supabase.auth.signInWithPassword({ email, password });

  if (!signInResult.error) {
    const profile = await fetchCurrentProfile();
    if (profile.status !== "active") {
      await supabase.auth.signOut();
      throw new Error("Ce compte n'est pas actif.");
    }
    await touchCurrentLogin();
    return { kind: "session", session: profileToSession(identifier, profile) };
  }

  throw new Error("Identifiant ou mot de passe incorrect.");
}

export async function completeFirstLogin(input: {
  sessionToken: string;
  newPassword: string;
}): Promise<AuthSession> {
  const activationResult = await supabase.rpc("complete_app_first_login", {
    p_session_token: input.sessionToken,
    p_new_password: input.newPassword,
  });

  if (activationResult.error) {
    throw new Error("Impossible de finaliser la premiere connexion.");
  }

  const profile = activationResult.data?.[0];
  if (!profile) throw new Error("Le compte n'a pas pu etre active.");

  return {
    username: profile.login_identifier,
    displayName: profile.full_name,
    email: profile.email,
    role: roleFromCode(profile.role_code),
    authMode: "table",
    sessionToken: profile.session_token,
    loginIdentifier: profile.login_identifier,
  };
}

export async function signOut(session?: AuthSession | null) {
  if (session?.authMode === "table" && session.sessionToken) {
    await supabase.rpc("revoke_app_session", { p_session_token: session.sessionToken });
    return;
  }

  await supabase.auth.signOut();
}
