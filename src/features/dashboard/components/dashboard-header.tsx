import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";

import { NotificationsPopover } from "@/features/notifications/components/notifications-popover";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  onSearchChange: (value: string) => void;
  onToggleSidebar: () => void;
  searchQuery: string;
  sidebarOpen: boolean;
}

export function DashboardHeader({
  onSearchChange,
  onToggleSidebar,
  searchQuery,
  sidebarOpen,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
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
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
            <p className="hidden text-sm text-muted-foreground md:block">
              Une vue proche du template shadcn-admin adaptee a ton application.
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden w-72 lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Rechercher dans l'inventaire..."
              className="pl-9"
            />
          </div>
          <NotificationsPopover />
          <ThemeToggle />
          <Button type="button" className="hidden sm:inline-flex">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </header>
  );
}
