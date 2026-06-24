import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useToast } from "@/components/toast/toast";
import { useAuth } from "@/features/auth/auth-context";
import { completeFirstLogin, signInUser } from "@/features/auth/auth.service";
import {
  FirstLoginDialog,
  type PendingFirstLogin,
} from "@/features/auth/login/first-login-dialog";
import { LoginForm } from "@/features/auth/login/login-form";
import { LoginIllustration } from "@/features/auth/login/login-illustration";
import { getHomeRoute } from "@/features/auth/role-routes";
import type { AppRole } from "@/features/auth/types";

function roleFromCode(roleCode: Lowercase<AppRole>): Exclude<AppRole, "Admin"> {
  if (roleCode === "magasin") return "Magasin";
  if (roleCode === "commercial") return "Commercial";
  if (roleCode === "caisse") return "Caisse";
  throw new Error("Le compte Admin doit utiliser la connexion administrateur.");
}

function getAvailableHomeRoute(role: AppRole) {
  const route = getHomeRoute(role);
  if (!route) {
    throw new Error(`L'espace ${role} n'est pas encore disponible dans cette version.`);
  }
  return route;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [identifierFocused, setIdentifierFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingFirstLogin, setPendingFirstLogin] = useState<PendingFirstLogin | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstLoginError, setFirstLoginError] = useState("");
  const toast = useToast();
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    const identifierFromLink = new URLSearchParams(window.location.search).get("identifier");
    if (identifierFromLink) setIdentifier(identifierFromLink);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signInUser(identifier.trim(), password);
      if (result.kind === "first-login") {
        setPendingFirstLogin({
          identifier: result.candidate.login_identifier,
          fullName: result.candidate.full_name,
          role: roleFromCode(result.candidate.role_code),
          sessionToken: result.candidate.session_token,
        });
        setNewPassword("");
        setConfirmPassword("");
        setFirstLoginError("");
        return;
      }

      const homeRoute = getAvailableHomeRoute(result.session.role);
      login(result.session);
      toast.success({ title: "Connexion reussie", message: `Bienvenue dans votre espace ${result.session.role}.` });
      await navigate({ to: homeRoute, replace: true });
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Connexion impossible.";
      setError(message);
      toast.error({ title: "Connexion impossible", message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirstLoginActivation = async (event: FormEvent) => {
    event.preventDefault();
    if (!pendingFirstLogin) return;

    setFirstLoginError("");
    if (!getHomeRoute(pendingFirstLogin.role)) {
      setFirstLoginError(`L'espace ${pendingFirstLogin.role} n'est pas encore disponible dans cette version.`);
      return;
    }
    if (newPassword.length < 6) {
      setFirstLoginError("Le nouveau mot de passe doit contenir au moins 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFirstLoginError("La confirmation du mot de passe ne correspond pas.");
      return;
    }

    setIsActivating(true);
    try {
      const session = await completeFirstLogin({
        sessionToken: pendingFirstLogin.sessionToken,
        newPassword,
      });
      const homeRoute = getAvailableHomeRoute(session.role);
      login(session);
      setPendingFirstLogin(null);
      setPassword("");
      toast.success({ title: "Compte active", message: "Votre mot de passe a ete defini. Bonne navigation !" });
      await navigate({ to: homeRoute, replace: true });
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Activation impossible.";
      setFirstLoginError(message);
      toast.error({ title: "Activation impossible", message });
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <LoginIllustration
        hasPassword={password.length > 0}
        identifierFocused={identifierFocused}
        passwordFocused={passwordFocused}
        passwordVisible={passwordVisible}
      />

      <main className="flex items-center justify-center bg-background p-8">
        <LoginForm
          error={error}
          identifier={identifier}
          isLoading={isLoading}
          password={password}
          passwordVisible={passwordVisible}
          onIdentifierChange={setIdentifier}
          onIdentifierFocusChange={setIdentifierFocused}
          onPasswordChange={setPassword}
          onPasswordFocusChange={setPasswordFocused}
          onPasswordVisibleChange={setPasswordVisible}
          onSubmit={handleSubmit}
        />
      </main>

      {pendingFirstLogin ? (
        <FirstLoginDialog
          confirmPassword={confirmPassword}
          error={firstLoginError}
          isSaving={isActivating}
          newPassword={newPassword}
          pendingLogin={pendingFirstLogin}
          onClose={() => setPendingFirstLogin(null)}
          onConfirmPasswordChange={setConfirmPassword}
          onNewPasswordChange={setNewPassword}
          onSubmit={handleFirstLoginActivation}
        />
      ) : null}
    </div>
  );
}
