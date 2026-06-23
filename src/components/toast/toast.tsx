import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
} from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "error" | "warning";
type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
}

interface ToastOptions {
  title?: string;
  message: string;
  variant?: Variant;
  duration?: number;
  position?: Position;
  actions?: ActionButton;
  onDismiss?: () => void;
}

const variantStyles: Record<Variant, string> = {
  default: "bg-card border-border text-foreground",
  success: "bg-card border-green-600/50",
  error: "bg-card border-destructive/50",
  warning: "bg-card border-amber-600/50",
};

const titleColor: Record<Variant, string> = {
  default: "text-foreground",
  success: "text-green-600 dark:text-green-400",
  error: "text-destructive",
  warning: "text-amber-600 dark:text-amber-400",
};

const iconColor: Record<Variant, string> = {
  default: "text-muted-foreground",
  success: "text-green-600 dark:text-green-400",
  error: "text-destructive",
  warning: "text-amber-600 dark:text-amber-400",
};

const variantIcons: Record<Variant, React.ComponentType<{ className?: string }>> = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
};

const actionButtonClass: Record<Variant, string> = {
  default: "text-foreground border-border hover:bg-muted/10 dark:hover:bg-muted/20",
  success: "text-green-600 border-green-600 hover:bg-green-600/10 dark:hover:bg-green-400/20",
  error: "text-destructive border-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20",
  warning: "text-amber-600 border-amber-600 hover:bg-amber-600/10 dark:hover:bg-amber-400/20",
};

function renderToast(options: Required<Pick<ToastOptions, "message">> & ToastOptions) {
  const variant = options.variant ?? "default";
  const Icon = variantIcons[variant];

  sonnerToast.custom(
    (id) => (
      <div
        className={cn(
          "flex w-full max-w-xs animate-in items-center justify-between rounded-xl border p-3 shadow-md duration-300 fade-in slide-in-from-bottom-4",
          variantStyles[variant],
        )}
      >
        <div className="flex items-start gap-2">
          <Icon className={cn("mt-0.5 h-4 w-4 flex-shrink-0", iconColor[variant])} />
          <div className="space-y-0.5">
            {options.title && (
              <h3 className={cn("text-xs font-medium leading-none", titleColor[variant])}>
                {options.title}
              </h3>
            )}
            <p className="text-xs text-muted-foreground">{options.message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {options.actions?.label && (
            <Button
              variant={options.actions.variant || "outline"}
              size="sm"
              onClick={() => {
                options.actions!.onClick();
                sonnerToast.dismiss(id);
              }}
              className={cn("cursor-pointer", actionButtonClass[variant])}
            >
              {options.actions.label}
            </Button>
          )}

          <button
            type="button"
            onClick={() => {
              sonnerToast.dismiss(id);
              options.onDismiss?.();
            }}
            className="rounded-full p-1 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring dark:hover:bg-muted/30"
            aria-label="Fermer la notification"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      </div>
    ),
    {
      duration: options.duration ?? 4000,
      position: options.position ?? "bottom-right",
      id: crypto.randomUUID(),
    },
  );
}

export function useToast() {
  return {
    show(options: ToastOptions) {
      renderToast(options);
    },
    success(options: Omit<ToastOptions, "variant">) {
      renderToast({ ...options, variant: "success" });
    },
    error(options: Omit<ToastOptions, "variant">) {
      renderToast({ ...options, variant: "error" });
    },
    warning(options: Omit<ToastOptions, "variant">) {
      renderToast({ ...options, variant: "warning" });
    },
    info(options: Omit<ToastOptions, "variant">) {
      renderToast({ ...options, variant: "default" });
    },
    dismiss: sonnerToast.dismiss,
  };
}

interface ToasterProps {
  position?: Position;
}

export function Toaster({ position = "bottom-right" }: ToasterProps = {}) {
  return (
    <SonnerToaster
      position={position}
      toastOptions={{ unstyled: true, className: "flex justify-end" }}
    />
  );
}
