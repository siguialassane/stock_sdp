import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { clearAuthSession, readAuthSession, writeAuthSession } from "@/features/auth/auth-storage";
import type { AuthSession } from "@/features/auth/types";
import { signOut } from "@/features/auth/auth.service";

interface AuthContextValue {
  session: AuthSession | null;
  login: (session: AuthSession) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession());

  const login = (nextSession: AuthSession) => {
    writeAuthSession(nextSession);
    setSession(nextSession);
  };

  const logout = async () => {
    const currentSession = session;
    clearAuthSession();
    setSession(null);
    queryClient.clear();
    await signOut(currentSession);
  };

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
