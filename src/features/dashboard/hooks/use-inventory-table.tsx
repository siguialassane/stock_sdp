import { useDeferredValue, useMemo, useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format/currency";
import { InventoryStatusBadge } from "@/features/inventory/components/inventory-status-badge";
import type { InventoryItem } from "@/features/dashboard/types";

export function useInventoryTable(inventory: InventoryItem[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        accessorKey: "produit",
        header: "Produit",
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <div className="font-medium">{row.original.produit}</div>
            <div className="text-xs text-muted-foreground">{row.original.categorie}</div>
          </div>
        ),
      },
      {
        accessorKey: "categorie",
        header: "Categorie",
      },
      {
        accessorKey: "quantite",
        header: "Quantite",
      },
      {
        accessorKey: "prixUnitaire",
        header: "Prix unitaire",
        cell: ({ row }) => formatCurrency(row.original.prixUnitaire),
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => <InventoryStatusBadge status={row.original.statut} />,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: () => (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: inventory,
    columns,
    state: {
      sorting,
      globalFilter: deferredSearchQuery,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return {
    columns,
    flexRender,
    searchQuery,
    setSearchQuery,
    table,
  };
}
