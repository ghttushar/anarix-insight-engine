import { useState } from "react";
import { Search, Filter, Download, Columns, X, Eye, Edit, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FilterRule {
  id: string;
  field: string;
  operator: string;
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
  activeFilters?: FilterRule[];
  onFiltersChange?: (filters: FilterRule[]) => void;
  columns?: Column[];
  onColumnToggle?: (columnId: string) => void;
  onSelectAllColumns?: () => void;
  onClearAllColumns?: () => void;
  onDownload?: () => void;
  onFilter?: () => void;
  filterCount?: number;
  viewMode?: "view" | "edit";
  onViewModeChange?: (mode: "view" | "edit") => void;
  showViewToggle?: boolean;
  filterFields?: string[];
}

const OPERATORS = ["is", "is not", "contains", "starts with", "greater than", "less than"];

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  activeFilters = [],
  onFiltersChange,
  columns = [],
  onColumnToggle,
  onSelectAllColumns,
  onClearAllColumns,
  onDownload,
  onFilter,
  filterCount = 0,
  viewMode = "view",
  onViewModeChange,
  showViewToggle = false,
  filterFields = [],
}: DataTableToolbarProps) {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<FilterRule[]>(activeFilters);
  const [columnSearch, setColumnSearch] = useState("");

  const handleOpenFilter = () => {
    setDraftFilters(activeFilters.length > 0 ? [...activeFilters] : [{ id: crypto.randomUUID(), field: filterFields[0] || "", operator: "is", value: "" }]);
    setFilterPanelOpen(true);
  };

  const addFilterRule = () => {
    setDraftFilters([...draftFilters, { id: crypto.randomUUID(), field: filterFields[0] || "", operator: "is", value: "" }]);
  };

  const removeFilterRule = (id: string) => {
    setDraftFilters(draftFilters.filter((f) => f.id !== id));
  };

  const updateFilterRule = (id: string, key: keyof FilterRule, value: string) => {
    setDraftFilters(draftFilters.map((f) => f.id === id ? { ...f, [key]: value } : f));
  };

  const applyFilters = () => {
    const valid = draftFilters.filter((f) => f.field && f.value);
    onFiltersChange?.(valid);
    setFilterPanelOpen(false);
  };

  const cancelFilters = () => {
    setFilterPanelOpen(false);
    setDraftFilters(activeFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange?.([]);
    setFilterPanelOpen(false);
    setDraftFilters([]);
  };

  const filteredColumns = columns.filter((c) =>
    c.label.toLowerCase().includes(columnSearch.toLowerCase())
  );

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
                  viewMode === "view" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
              <button
                onClick={() => onViewModeChange("edit")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === "edit" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
              <DropdownMenuContent align="end" className="w-56 p-0">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={columnSearch}
                      onChange={(e) => setColumnSearch(e.target.value)}
                      placeholder="Search columns..."
                      className="h-8 pl-8 text-xs"
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
                  <button onClick={onSelectAllColumns} className="text-xs text-primary hover:underline">Select All</button>
                  <button onClick={onClearAllColumns} className="text-xs text-muted-foreground hover:text-foreground">Clear All</button>
                </div>
                <div className="max-h-[240px] overflow-auto p-1">
                  {filteredColumns.map((column) => (
                    <button
                      key={column.id}
                      onClick={() => onColumnToggle(column.id)}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                    >
                      <Checkbox checked={column.visible} className="pointer-events-none" />
                      <span className="text-foreground">{column.label}</span>
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5"
            onClick={handleOpenFilter}
          >
            <Filter className="h-4 w-4" />
            Filter
            {activeFilters.length > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeFilters.length}
              </span>
            )}
          </Button>

          {/* Download Button */}
          {onDownload && (
            <Button variant="outline" size="sm" className="h-9" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && !filterPanelOpen && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter.id} variant="secondary" className="gap-1.5 pr-1">
              <span>{filter.field} {filter.operator} {filter.value}</span>
              <button
                onClick={() => onFiltersChange?.(activeFilters.filter((f) => f.id !== filter.id))}
                className="rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <button onClick={clearAllFilters} className="text-xs text-muted-foreground hover:text-foreground">
            Clear all
          </button>
        </div>
      )}

      {/* Inline Filter Builder Panel */}
      {filterPanelOpen && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Filter Rules</span>
          </div>
          {draftFilters.map((rule, idx) => (
            <div key={rule.id} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-12">{idx === 0 ? "Where" : "And"}</span>
              <Select value={rule.field} onValueChange={(v) => updateFilterRule(rule.id, "field", v)}>
                <SelectTrigger className="h-8 w-[160px] text-xs">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {filterFields.map((f) => (
                    <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={rule.operator} onValueChange={(v) => updateFilterRule(rule.id, "operator", v)}>
                <SelectTrigger className="h-8 w-[120px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.map((op) => (
                    <SelectItem key={op} value={op} className="text-xs">{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={rule.value}
                onChange={(e) => updateFilterRule(rule.id, "value", e.target.value)}
                placeholder="Value..."
                className="h-8 w-[140px] text-xs"
              />
              <button onClick={() => removeFilterRule(rule.id)} className="p-1 hover:bg-muted rounded">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <button onClick={addFilterRule} className="flex items-center gap-1 text-xs text-primary hover:underline">
              <Plus className="h-3.5 w-3.5" />
              Add Filter
            </button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={cancelFilters} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={applyFilters} className="h-8 text-xs">Apply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
