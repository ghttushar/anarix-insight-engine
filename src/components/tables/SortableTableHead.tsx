import { ReactNode } from "react";
import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableTableHeadProps {
  children: ReactNode;
  field: string;
  sortField: string | null;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
  align?: "left" | "right" | "center";
}

export function SortableTableHead({
  children,
  field,
  sortField,
  sortDirection,
  onSort,
  className,
  align = "left",
}: SortableTableHeadProps) {
  const isActive = sortField === field;

  return (
    <TableHead
      className={cn("group/sort cursor-pointer select-none", className)}
      onClick={() => onSort(field)}
    >
      <div
        className={cn(
          "flex items-center gap-1",
          align === "right" && "justify-end",
          align === "center" && "justify-center"
        )}
      >
        <span>{children}</span>
        {isActive ? (
          sortDirection === "asc" ? (
            <ArrowUp className="h-3 w-3 text-primary shrink-0" />
          ) : (
            <ArrowDown className="h-3 w-3 text-primary shrink-0" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/sort:opacity-40 text-muted-foreground" />
        )}
      </div>
    </TableHead>
  );
}

// Reusable sort hook logic
export function useSortState<T = string>(defaultField: T | null = null) {
  return {
    defaultSortField: defaultField,
    defaultSortDirection: "asc" as const,
  };
}

export function getSortHandler(
  sortField: string | null,
  setSortField: (f: string | null) => void,
  sortDirection: "asc" | "desc",
  setSortDirection: (d: "asc" | "desc") => void
) {
  return (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection("asc");
      } else {
        setSortDirection("desc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
}

export function sortData<T>(data: T[], sortField: string | null, sortDirection: "asc" | "desc"): T[] {
  if (!sortField) return data;
  return [...data].sort((a, b) => {
    const aVal = (a as any)[sortField];
    const bVal = (b as any)[sortField];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });
}
