import { cn } from "@/lib/utils";

interface HorizontalStatListProps {
  items: Array<{ name: string; value: number }>;
  formatter: (value: number) => string;
  barClassName: string;
}

export function HorizontalStatList({
  items,
  formatter,
  barClassName,
}: HorizontalStatListProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center text-sm text-muted-foreground">
        Aucune donnee disponible.
      </div>
    );
  }

  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="truncate text-sm text-foreground">{item.name}</span>
              <span className="text-xs font-medium text-muted-foreground">
                {formatter(item.value)}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted">
              <div
                className={cn("h-2.5 rounded-full", barClassName)}
                style={{ width: `${Math.round((item.value / maxValue) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
