import { useState } from "react";
import { AlertTriangle, Bell, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { NOTIFICATIONS_MOCK } from "@/mocks/notifications.mock";
import type { AppNotification } from "@/features/notifications/types";

/**
 * Cloche de notifications.
 * - Au chargement, au moins une notification non lue => la cloche clignote en bleu.
 * - Des qu'on ouvre le popover, on marque comme lu => le clignotement s'arrete.
 */
export function NotificationsPopover() {
  const [hasUnread, setHasUnread] = useState(NOTIFICATIONS_MOCK.length > 0);

  // Le popover reste non-contrele ; on se contente de marquer comme lu a l'ouverture
  // pour arreter le clignotement de la cloche.
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setHasUnread(false);
    }
  };

  const count = NOTIFICATIONS_MOCK.length;
  const stockItems = NOTIFICATIONS_MOCK.filter((item) => item.type === "stock");
  const venteItems = NOTIFICATIONS_MOCK.filter((item) => item.type === "vente");

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="icon" className="relative">
          <Bell
            className={cn(
              "h-4 w-4 transition-colors",
              hasUnread && "animate-notification-blink text-blue-500",
            )}
          />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-semibold text-white">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-4">
          <p className="text-sm font-semibold">Notifications</p>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {count} en attente
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {count === 0 ? (
            <div className="flex min-h-40 items-center justify-center px-6 py-8 text-center text-sm text-muted-foreground">
              Aucune notification disponible pour le moment.
            </div>
          ) : (
            <>
              <NotificationSection title="Alertes de stock" items={stockItems} />
              <NotificationSection title="Ventes recentes" items={venteItems} />
            </>
          )}
        </div>

        <div className="border-t p-2">
          <Button type="button" variant="ghost" size="sm" className="w-full">
            Tout marquer comme lu
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface NotificationSectionProps {
  title: string;
  items: AppNotification[];
}

function NotificationSection({ title, items }: NotificationSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="p-2">
      <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => (
          <NotificationRow key={item.id} notification={item} />
        ))}
      </div>
    </div>
  );
}

interface NotificationRowProps {
  notification: AppNotification;
}

function NotificationRow({ notification }: NotificationRowProps) {
  const Icon = notification.type === "stock" ? AlertTriangle : ShoppingCart;
  const isWarning = notification.niveau === "warning";

  return (
    <div className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60">
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isWarning ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{notification.titre}</p>
          {notification.valeur && (
            <span className="shrink-0 text-xs font-semibold text-muted-foreground">
              {notification.valeur}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{notification.description}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground/70">{notification.horodatage}</p>
      </div>
    </div>
  );
}
