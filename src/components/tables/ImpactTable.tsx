import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ImpactComparison } from "@/types/advertising";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { TablePagination } from "./TablePagination";
import { SortableTableHead, sortData } from "./SortableTableHead";

interface ImpactTableProps {
  data: ImpactComparison[];
  searchQuery?: string;
  showType?: boolean;
}

export function ImpactTable({ data, searchQuery = "", showType = true }: ImpactTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(new Set());
  const handlePinToggle = (field: string) => { setPinnedColumns(prev => { const next = new Set(prev); if (next.has(field)) next.delete(field); else next.add(field); return next; }); };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(filteredData, sortField, sortDirection);
  const paginatedData = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const calculateDelta = (baseline: number, impact: number) => {
    if (baseline === 0) return impact > 0 ? 100 : 0;
    return ((impact - baseline) / baseline) * 100;
  };

  const DeltaCell = ({ baseline, impact, format = "number" }: { baseline: number; impact: number; format?: string }) => {
    const delta = calculateDelta(baseline, impact);
    const isPositive = delta > 0;
    const isNeutral = delta === 0;
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="text-muted-foreground">
          {format === "currency" ? formatCurrency(baseline) : format === "percent" ? formatPercent(baseline) : formatNumber(baseline)}
        </span>
        <span className="text-foreground">→</span>
        <span className="font-medium">
          {format === "currency" ? formatCurrency(impact) : format === "percent" ? formatPercent(impact) : formatNumber(impact)}
        </span>
        <span className={cn("flex items-center gap-1 text-xs font-medium", isNeutral ? "text-muted-foreground" : isPositive ? "text-success" : "text-destructive")}>
          {!isNeutral && (isPositive ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />)}
          {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
    );
  };

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <SortableTableHead field="name" {...sp} className="min-w-[250px] sticky left-0 z-10 bg-muted">Name</SortableTableHead>
              <SortableTableHead field="impactPercentage" {...sp} className="w-28 text-center" align="center">Impact</SortableTableHead>
              <SortableTableHead field="impressions" {...sp} className="min-w-[180px] text-right" align="right">Impressions</SortableTableHead>
              <SortableTableHead field="clicks" {...sp} className="min-w-[150px] text-right" align="right">Clicks</SortableTableHead>
              <SortableTableHead field="ctr" {...sp} className="min-w-[140px] text-right" align="right">CTR</SortableTableHead>
              <SortableTableHead field="adSpend" {...sp} className="min-w-[180px] text-right" align="right">Ad Spend</SortableTableHead>
              <SortableTableHead field="adSales" {...sp} className="min-w-[180px] text-right" align="right">Ad Sales</SortableTableHead>
              <SortableTableHead field="roas" {...sp} className="min-w-[140px] text-right" align="right">ROAS</SortableTableHead>
              <SortableTableHead field="acos" {...sp} className="min-w-[140px] text-right" align="right">ACOS</SortableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => {
              const isPositive = item.impactPercentage > 0;
              const isNeutral = item.impactPercentage === 0;
              return (
                <TableRow key={item.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2">
                      {showType && item.type && (
                        <Badge variant="outline" className={cn("text-xs", item.type === "auto" ? "border-primary/30 bg-primary/5 text-primary" : "border-secondary/30 bg-secondary/5 text-secondary-foreground")}>
                          {item.type === "auto" ? "Auto" : "Manual"}
                        </Badge>
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("gap-1", isNeutral ? "border-muted bg-muted text-muted-foreground" : isPositive ? "border-success/30 bg-success/10 text-success" : "border-destructive/30 bg-destructive/10 text-destructive")}>
                      {isPositive ? <ArrowUp className="h-3 w-3" /> : !isNeutral ? <ArrowDown className="h-3 w-3" /> : null}
                      {Math.abs(item.impactPercentage).toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell><DeltaCell baseline={item.baseline.impressions} impact={item.impact.impressions} /></TableCell>
                  <TableCell><DeltaCell baseline={item.baseline.clicks} impact={item.impact.clicks} /></TableCell>
                  <TableCell><DeltaCell baseline={item.baseline.ctr} impact={item.impact.ctr} format="percent" /></TableCell>
                  <TableCell><DeltaCell baseline={item.baseline.adSpend} impact={item.impact.adSpend} format="currency" /></TableCell>
                  <TableCell><DeltaCell baseline={item.baseline.adSales} impact={item.impact.adSales} format="currency" /></TableCell>
                  <TableCell><DeltaCell baseline={item.baseline.roas} impact={item.impact.roas} format="decimal" /></TableCell>
                  <TableCell><DeltaCell baseline={item.baseline.acos} impact={item.impact.acos} format="percent" /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={filteredData.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
