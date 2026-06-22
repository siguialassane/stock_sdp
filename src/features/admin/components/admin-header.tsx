import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

import { NotificationsPopover } from "@/features/notifications/components/notifications-popover";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onOpenMobile: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  /** Titre de l'ecran courant (fourni par la route). */
  title: string;
}

/**
 * Header de l'ecran Admin. Memes regles visuelles que le header dashboard :
 * sticky top-0, backdrop-blur, hauteur h-16, actions a droite.
 * La recherche globale est retiree ici (pas pertinente au niveau admin v1),
 * on garde les notifications et le theme toggle.
 */
export function AdminHeader({ onOpenMobile, onToggleSidebar, sidebarOpen, title }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="icon" className="md:hidden" onClick={onOpenMobile}>
            <Menu className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="hidden md:inline-flex"
            onClick={onToggleSidebar}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
            <p className="hidden text-sm text-muted-foreground md:block">
              Supervision et configuration de l'application
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <NotificationsPopover />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
