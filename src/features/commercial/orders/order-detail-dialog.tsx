import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrderDetailDialog({
  children,
  subtitle,
  title,
  onClose,
}: {
  children: ReactNode;
  subtitle: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        aria-label="Fermer les details commande"
        onClick={onClose}
      />
      <Card className="relative z-10 max-h-[88vh] w-full max-w-5xl overflow-y-auto shadow-2xl">
        <CardHeader className="sticky top-0 z-10 flex-row items-start justify-between border-b bg-background/95 backdrop-blur">
          <div>
            <CardTitle id="order-detail-title" className="text-xl">
              {title}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Fermer" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
