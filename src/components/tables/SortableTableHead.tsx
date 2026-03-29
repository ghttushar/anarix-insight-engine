import { ReactNode } from "react";
import { TableHead } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableTableHeadProps {
  children: ReactNode;
  field: string;
  sortField?: string | null;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
  pinnedColumns?: Set<string>;
  onPinToggle?: (field: string) => void;
  className?: string;
  align?: "left" | "right" | "center";
  isFixed?: boolean;
}

export function SortableTableHead({
  children,
  field,
  sortField,
  sortDirection,
  onSort,
  pinnedColumns,
  onPinToggle,
  className,
  align = "left",
  isFixed = false,
}: SortableTableHeadProps) {
  const isActive = sortField === field;
  const isPinned = pinnedColumns?.has(field) ?? false;

  return (
    <TableHead
      className={cn("group/sort select-none", onSort && "cursor-pointer", className)}
      onClick={() => onSort?.(field)}
    >
      <div
        className={cn(
          "flex items-center gap-1.5",
          align === "right" && "justify-end",
          align === "center" && "justify-center"
        )}
      >
        <span>{children}</span>

        {/* Sort arrow — invisible by default, faint on hover, primary when active */}
        {onSort && (
          <span className={cn(
            "shrink-0 transition-opacity",
            isActive ? "opacity-100" : "opacity-0 group-hover/sort:opacity-40"
          )}>
            {isActive && sortDirection === "desc"
              ? <ArrowDown className="h-3 w-3 text-primary" />
              : <ArrowUp className={cn("h-3 w-3", isActive ? "text-primary" : "text-muted-foreground")} />
            }
          </span>
        )}

        {/* Pin radio button — only on non-fixed columns when onPinToggle is provided */}
        {!isFixed && onPinToggle && (
          <button
            onClick={(e) => { e.stopPropagation(); onPinToggle(field); }}
            className="shrink-0 cursor-pointer"
            title={isPinned ? "Unpin column" : "Pin column"}
          >
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full border transition-all",
                isPinned
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/40 opacity-50 group-hover/sort:opacity-80"
              )}
            />
          </button>
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
