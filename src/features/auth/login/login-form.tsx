import { Eye, EyeOff, Sparkles } from "lucide-react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  error: string;
  identifier: string;
  isLoading: boolean;
  password: string;
  passwordVisible: boolean;
  onIdentifierChange: (value: string) => void;
  onIdentifierFocusChange: (focused: boolean) => void;
  onPasswordChange: (value: string) => void;
  onPasswordFocusChange: (focused: boolean) => void;
  onPasswordVisibleChange: (visible: boolean) => void;
  onSubmit: (event: FormEvent) => void;
}

export function LoginForm({
  error,
  identifier,
  isLoading,
  password,
  passwordVisible,
  onIdentifierChange,
  onIdentifierFocusChange,
  onPasswordChange,
  onPasswordFocusChange,
  onPasswordVisibleChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="w-full max-w-[480px]">
      <div className="mb-12 flex items-center justify-center gap-2 text-lg font-semibold lg:hidden">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="size-4 text-primary" />
        </div>
        <span>StockFlow</span>
      </div>

      <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-[400px] flex-col space-y-8 pt-6">
        <div className="space-y-3">
          <Label htmlFor="username" className="text-base font-medium">Identifiant</Label>
          <Input
            id="username"
            type="text"
            placeholder="admin ou COM-AB12CD"
            value={identifier}
            autoComplete="username"
            onChange={(event) => onIdentifierChange(event.target.value)}
            onFocus={() => onIdentifierFocusChange(true)}
            onBlur={() => onIdentifierFocusChange(false)}
            required
            className="h-14 border-border/60 bg-background px-4 text-base focus:border-primary"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-base font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              autoComplete="current-password"
              onChange={(event) => onPasswordChange(event.target.value)}
              onFocus={() => onPasswordFocusChange(true)}
              onBlur={() => onPasswordFocusChange(false)}
              required
              className="h-14 border-border/60 bg-background px-4 pr-12 text-base focus:border-primary"
            />
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onPasswordVisibleChange(!passwordVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={passwordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {passwordVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <Button type="submit" className="h-14 w-full text-lg font-medium" size="lg" disabled={isLoading}>
          {isLoading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
