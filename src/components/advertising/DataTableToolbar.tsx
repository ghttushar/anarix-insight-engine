import { useState } from "react";
import { Search, Filter, Download, Columns, X, Pencil, Plus, Trash2, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showDeltas?: boolean;
  onShowDeltasChange?: (show: boolean) => void;
}

const OPERATORS = [
  "is",
  "is not",
  "contains",
  "starts with",
  "is less than",
  "is greater than",
  "is less than or equal to",
  "is greater than or equal to",
];

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
  showDeltas,
  onShowDeltasChange,
}: DataTableToolbarProps) {
  const [draftFilters, setDraftFilters] = useState<FilterRule[]>(activeFilters);
  const [columnSearch, setColumnSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const handleOpenFilter = () => {
    setDraftFilters(activeFilters.length > 0 ? [...activeFilters] : [{ id: crypto.randomUUID(), field: filterFields[0] || "", operator: "is", value: "" }]);
    setFilterOpen(true);
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
    setFilterOpen(false);
  };

  const cancelFilters = () => {
    setFilterOpen(false);
    setDraftFilters(activeFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange?.([]);
    setFilterOpen(false);
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

        {/* Right Side: rightContent → Deltas → Columns → Filter → Download → Edit toggle */}
        <div className="flex items-center gap-1">
          {rightContent}

          {/* Show Deltas Toggle */}
          {onShowDeltasChange !== undefined && (
            <div className="flex items-center gap-1.5 mr-1 px-2 py-1 rounded-md border border-border/50">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">Δ</span>
              <Switch
                checked={showDeltas ?? false}
                onCheckedChange={onShowDeltasChange}
                className="h-4 w-7 data-[state=checked]:bg-primary"
              />
            </div>
          )}

          {/* Columns Dropdown */}
          {columns.length > 0 && onColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs cursor-pointer" title="Toggle column visibility">
                  <Columns className="h-3.5 w-3.5" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
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

          {/* Filter Button — Floating Popover */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs cursor-pointer"
                onClick={handleOpenFilter}
                title="Add or manage filters"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
                {activeFilters.length > 0 && (
                  <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[520px] p-3 space-y-2">
              <p className="text-xs font-medium text-foreground">Filters</p>
              <div className="space-y-1.5">
                {draftFilters.map((rule, idx) => (
                  <div key={rule.id} className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground w-10 shrink-0">{idx === 0 ? "Where" : "And"}</span>
                    <Select value={rule.field} onValueChange={(v) => updateFilterRule(rule.id, "field", v)}>
                      <SelectTrigger className="h-7 w-[130px] text-[11px]"><SelectValue placeholder="Field" /></SelectTrigger>
                      <SelectContent>
                        {filterFields.map((f) => (<SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Select value={rule.operator} onValueChange={(v) => updateFilterRule(rule.id, "operator", v)}>
                      <SelectTrigger className="h-7 w-[160px] text-[11px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {OPERATORS.map((op) => (<SelectItem key={op} value={op} className="text-xs">{op}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={rule.value}
                      onChange={(e) => updateFilterRule(rule.id, "value", e.target.value)}
                      placeholder="Value..."
                      className="h-7 w-[110px] text-[11px]"
                    />
                    <button onClick={() => removeFilterRule(rule.id)} className="p-1 hover:bg-muted rounded cursor-pointer" title="Remove filter">
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <button onClick={addFilterRule} className="flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer">
                  <Plus className="h-3 w-3" />Add Filter
                </button>
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="sm" onClick={cancelFilters} className="h-7 text-xs px-3">Cancel</Button>
                  <Button size="sm" onClick={applyFilters} className="h-7 text-xs px-3">Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Download Button */}
          {onDownload && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer" onClick={onDownload} title="Download data">
              <Download className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Edit Mode Toggle — Pencil icon, far right */}
          {showViewToggle && onViewModeChange && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 ml-1 cursor-pointer",
                viewMode === "edit" && "bg-primary/10 text-primary"
              )}
              onClick={() => onViewModeChange(viewMode === "view" ? "edit" : "view")}
              title={viewMode === "edit" ? "Switch to View mode" : "Switch to Edit mode"}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display — compact */}
      {activeFilters.length > 0 && !filterOpen && (
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
    </div>
  );
}
