import { useState } from "react";
import { Search, Filter, Download, Columns, X, Eye, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Filter {
  id: string;
  label: string;
  value: string;
}

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Filter[];
  onRemoveFilter?: (filterId: string) => void;
  onClearFilters?: () => void;
  columns?: Column[];
  onColumnToggle?: (columnId: string) => void;
  onDownload?: () => void;
  onFilter?: () => void;
  filterCount?: number;
  viewMode?: "view" | "edit";
  onViewModeChange?: (mode: "view" | "edit") => void;
  showViewToggle?: boolean;
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onRemoveFilter,
  onClearFilters,
  columns = [],
  onColumnToggle,
  onDownload,
  onFilter,
  filterCount = 0,
  viewMode = "view",
  onViewModeChange,
  showViewToggle = false,
}: DataTableToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Main Toolbar Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Left Side */}
        <div className="flex items-center gap-2">
          {showViewToggle && onViewModeChange && (
            <div className="flex rounded-lg border border-border bg-background p-0.5">
              <button
                onClick={() => onViewModeChange("view")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === "view"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
              <button
                onClick={() => onViewModeChange("edit")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === "edit"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 w-64 pl-9"
            />
          </div>

          {/* Columns Dropdown */}
          {columns.length > 0 && onColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1.5">
                  <Columns className="h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.visible}
                    onCheckedChange={() => onColumnToggle(column.id)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Filter Button */}
          {onFilter && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={onFilter}
            >
              <Filter className="h-4 w-4" />
              Filter
              {filterCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {filterCount}
                </span>
              )}
            </Button>
          )}

          {/* Download Button */}
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={onDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Row */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filters:</span>
          {filters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="gap-1.5 pr-1"
            >
              <span>
                {filter.label}: {filter.value}
              </span>
              {onRemoveFilter && (
                <button
                  onClick={() => onRemoveFilter(filter.id)}
                  className="rounded-full p-0.5 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
