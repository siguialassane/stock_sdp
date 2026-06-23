export type AppRole = "Admin" | "Magasin" | "Commercial" | "Caisse";
export type AuthMode = "supabase" | "table";

export interface AuthSession {
  username: string;
  displayName: string;
  email: string;
  role: AppRole;
  authMode: AuthMode;
  sessionToken?: string;
  loginIdentifier?: string;
}
