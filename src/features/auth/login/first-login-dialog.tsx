import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AppRole } from "@/features/auth/types";

export interface PendingFirstLogin {
  identifier: string;
  fullName: string;
  role: Exclude<AppRole, "Admin">;
  sessionToken: string;
}

interface FirstLoginDialogProps {
  confirmPassword: string;
  error: string;
  isSaving: boolean;
  newPassword: string;
  pendingLogin: PendingFirstLogin;
  onClose: () => void;
  onConfirmPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export function FirstLoginDialog({
  confirmPassword,
  error,
  isSaving,
  newPassword,
  pendingLogin,
  onClose,
  onConfirmPasswordChange,
  onNewPasswordChange,
  onSubmit,
}: FirstLoginDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="first-login-title">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        aria-label="Fermer"
        onClick={() => !isSaving && onClose()}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border bg-background p-6 shadow-2xl">
        <div className="space-y-2">
          <h2 id="first-login-title" className="text-xl font-semibold">Premiere connexion</h2>
          <p className="text-sm text-muted-foreground">
            {pendingLogin.fullName}, definissez votre mot de passe personnel pour acceder a l'espace {pendingLogin.role}.
          </p>
        </div>

        <div className="mt-5 rounded-xl border bg-muted/30 p-4 text-sm">
          <p><span className="font-medium">Identifiant :</span> {pendingLogin.identifier}</p>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => onNewPasswordChange(event.target.value)}
              placeholder="Minimum 6 caracteres"
              autoComplete="new-password"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
              placeholder="Retapez le mot de passe"
              autoComplete="new-password"
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? "Activation..." : "Enregistrer le mot de passe"}
            </Button>
            <Button type="button" variant="outline" disabled={isSaving} onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
