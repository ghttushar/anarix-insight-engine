import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { GeographicalData } from "@/types/profitability";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { TablePagination } from "@/components/tables/TablePagination";

interface RegionalTableProps {
  data: GeographicalData[];
  searchValue?: string;
  showDeltas?: boolean;
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

export function RegionalTable({ data, searchValue = "", showDeltas = false }: RegionalTableProps) {
  const { formatCurrency } = useCurrency();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredData = searchValue
    ? data.filter((r) => r.region.toLowerCase().includes(searchValue.toLowerCase()))
    : data;

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const NumCell = ({ value, formatted, id, metric }: { value: number; formatted: string; id: string; metric: string }) => (
    <div className="flex flex-col items-end">
      <span className="text-foreground">{formatted}</span>
      {showDeltas && <DeltaBadge value={getDelta(id, metric)} />}
    </div>
  );

  const renderRow = (region: GeographicalData, isChild = false) => {
    const hasChildren = region.children && region.children.length > 0;
    const isExpanded = expandedRows.has(region.id);

    return (
      <>
        <TableRow key={region.id} className={cn("hover:bg-muted/30 group cursor-pointer transition-colors", isChild && "bg-muted/10")}>
          <TableCell className={cn("sticky left-0 z-10 border-r border-border transition-colors", isChild ? "bg-muted group-hover:bg-muted" : "bg-background group-hover:bg-muted")}>
            <div className={cn("flex items-center gap-2", isChild && "pl-8")}>
              {hasChildren ? (
                <button onClick={() => toggleRow(region.id)} className="p-0.5 hover:bg-muted rounded">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : (
                <span className="w-5" />
              )}
              {region.flag && <span className="text-lg">{region.flag}</span>}
              <span className="font-medium text-foreground">{region.region}</span>
            </div>
          </TableCell>
          <TableCell className="text-right"><NumCell value={region.stocks} formatted={formatNumber(region.stocks)} id={region.id} metric="stocks" /></TableCell>
          <TableCell className="text-right"><NumCell value={region.orders} formatted={formatNumber(region.orders)} id={region.id} metric="orders" /></TableCell>
          <TableCell className="text-right"><NumCell value={region.unitsSold} formatted={formatNumber(region.unitsSold)} id={region.id} metric="unitsSold" /></TableCell>
          <TableCell className="text-right"><NumCell value={region.refunds} formatted={formatNumber(region.refunds)} id={region.id} metric="refunds" /></TableCell>
          <TableCell className="text-right"><NumCell value={region.sales} formatted={formatCurrency(region.sales)} id={region.id} metric="sales" /></TableCell>
          <TableCell className="text-right"><NumCell value={region.amazonFees} formatted={formatCurrency(region.amazonFees)} id={region.id} metric="amazonFees" /></TableCell>
          <TableCell className="text-right"><NumCell value={region.sellableReturns} formatted={formatNumber(region.sellableReturns)} id={region.id} metric="sellableReturns" /></TableCell>
          <TableCell className="text-center">
            <button className="text-xs text-primary hover:underline">More</button>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && region.children!.map((child) => renderRow(child, true))}
      </>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="sticky left-0 z-20 bg-muted min-w-[200px] border-r border-border">Region</TableHead>
              <TableHead className="text-right">Stocks</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Units Sold</TableHead>
              <TableHead className="text-right">Refunds</TableHead>
              <TableHead className="text-right">Sales</TableHead>
              <TableHead className="text-right">Amazon Fees</TableHead>
              <TableHead className="text-right">Sellable Returns</TableHead>
              <TableHead className="text-center">Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{paginatedData.map((region) => renderRow(region))}</TableBody>
        </Table>
      </div>
      <TablePagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={filteredData.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
