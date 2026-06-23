import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

interface MagasinHeaderProps {
  onOpenMobile: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  title: string;
}

/**
 * Header de l'ecran Magasin. Memes regles visuelles que les autres headers :
 * sticky top-0, backdrop-blur, hauteur h-16, theme toggle a droite.
 */
export function MagasinHeader({ onOpenMobile, onToggleSidebar, sidebarOpen, title }: MagasinHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="icon" className="md:hidden" onClick={onOpenMobile}>
            <Menu className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" className="hidden md:inline-flex" onClick={onToggleSidebar}>
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
            <p className="hidden text-sm text-muted-foreground md:block">
              Receptions, stock et validation des sorties.
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
