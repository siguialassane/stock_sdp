export type AppRole = "Admin" | "Magasin" | "Commercial" | "Caisse";

export interface AuthSession {
  username: string;
  displayName: string;
  email: string;
  role: AppRole;
}
