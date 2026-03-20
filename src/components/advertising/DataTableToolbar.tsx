import { useState } from "react";
import { Search, Filter, Download, Columns, X, Pencil, Plus } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
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
  leftContent,
  rightContent,
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
    <div className="space-y-1.5">
      {/* Main Toolbar Row */}
      <div className="flex items-center justify-between gap-2">
        {/* Left Side: leftContent + Search */}
        <div className="flex items-center gap-2">
          {leftContent}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 w-56 pl-8 text-sm"
            />
          </div>
        </div>

        {/* Right Side: Columns + Filter + Download + Edit toggle */}
        <div className="flex items-center gap-1">
          {/* Columns Dropdown */}
          {columns.length > 0 && onColumnToggle && (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs cursor-pointer">
                      <Columns className="h-3.5 w-3.5" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Toggle column visibility</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-52 p-0">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      value={columnSearch}
                      onChange={(e) => setColumnSearch(e.target.value)}
                      placeholder="Search columns..."
                      className="h-7 pl-7 text-xs"
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-1 border-b border-border">
                  <button onClick={onSelectAllColumns} className="text-xs text-primary hover:underline cursor-pointer">Select All</button>
                  <button onClick={onClearAllColumns} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Clear All</button>
                </div>
                <div className="max-h-[200px] overflow-auto p-1">
                  {filteredColumns.map((column) => (
                    <button
                      key={column.id}
                      onClick={() => onColumnToggle(column.id)}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1 text-xs hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Checkbox checked={column.visible} className="pointer-events-none h-3.5 w-3.5" />
                      <span className="text-foreground">{column.label}</span>
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Filter Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs cursor-pointer"
                onClick={handleOpenFilter}
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
                {activeFilters.length > 0 && (
                  <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add or manage filters</TooltipContent>
          </Tooltip>

          {/* Download Button */}
          {onDownload && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer" onClick={onDownload}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download data</TooltipContent>
            </Tooltip>
          )}

          {rightContent}

          {/* Edit Mode Toggle — Pencil icon, far right */}
          {showViewToggle && onViewModeChange && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 ml-1 cursor-pointer",
                    viewMode === "edit" && "bg-primary/10 text-primary"
                  )}
                  onClick={() => onViewModeChange(viewMode === "view" ? "edit" : "view")}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{viewMode === "edit" ? "Switch to View mode" : "Switch to Edit mode"}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Active Filters Display — compact */}
      {activeFilters.length > 0 && !filterPanelOpen && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] text-muted-foreground">Filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter.id} variant="secondary" className="gap-0.5 pr-0.5 text-[10px] h-5">
              <span>{filter.field} {filter.operator} {filter.value}</span>
              <button
                onClick={() => onFiltersChange?.(activeFilters.filter((f) => f.id !== filter.id))}
                className="rounded-full p-0.5 hover:bg-muted cursor-pointer"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
          <button onClick={clearAllFilters} className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer">
            Clear all
          </button>
        </div>
      )}

      {/* Compact Inline Filter Builder */}
      {filterPanelOpen && (
        <div className="rounded-md bg-muted/30 p-2 space-y-1.5">
          {draftFilters.map((rule, idx) => (
            <div key={rule.id} className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground w-8 shrink-0">{idx === 0 ? "Where" : "And"}</span>
              <Select value={rule.field} onValueChange={(v) => updateFilterRule(rule.id, "field", v)}>
                <SelectTrigger className="h-6 w-[120px] text-[11px]"><SelectValue placeholder="Field" /></SelectTrigger>
                <SelectContent>
                  {filterFields.map((f) => (<SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={rule.operator} onValueChange={(v) => updateFilterRule(rule.id, "operator", v)}>
                <SelectTrigger className="h-6 w-[90px] text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {OPERATORS.map((op) => (<SelectItem key={op} value={op} className="text-xs">{op}</SelectItem>))}
                </SelectContent>
              </Select>
              <Input
                value={rule.value}
                onChange={(e) => updateFilterRule(rule.id, "value", e.target.value)}
                placeholder="Value..."
                className="h-6 w-[100px] text-[11px]"
              />
              <button onClick={() => removeFilterRule(rule.id)} className="p-0.5 hover:bg-muted rounded cursor-pointer">
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button onClick={addFilterRule} className="flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer">
              <Plus className="h-3 w-3" />Add
            </button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={cancelFilters} className="h-6 text-[11px] px-2">Cancel</Button>
              <Button size="sm" onClick={applyFilters} className="h-6 text-[11px] px-2">Apply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
