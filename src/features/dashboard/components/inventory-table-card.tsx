import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { type Table, type ColumnDef, flexRender } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "@/features/dashboard/types";

interface InventoryTableCardProps {
  columns: ColumnDef<InventoryItem>[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  table: Table<InventoryItem>;
}

export function InventoryTableCard({
  columns,
  isLoading,
  searchQuery,
  setSearchQuery,
  table,
}: InventoryTableCardProps) {
  return (
    <Card>
      <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <CardTitle>Inventaire</CardTitle>
          <CardDescription>
            Table alimentee avec @tanstack/react-table et recherche locale.
          </CardDescription>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Filtrer produits, categories, statuts..."
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            className={cn(
                              "inline-flex items-center gap-2",
                              header.column.getCanSort() && "hover:text-foreground",
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      Chargement du dashboard...
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      {searchQuery.trim().length > 0
                        ? "Aucun resultat pour cette recherche."
                        : "Aucun article en stock pour le moment."}
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b last:border-b-0 hover:bg-muted/30">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-4 text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Affichage de{" "}
            <span className="font-medium text-foreground">{table.getRowModel().rows.length}</span>{" "}
            ligne(s) sur{" "}
            <span className="font-medium text-foreground">{table.getFilteredRowModel().rows.length}</span>.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
