import { useState } from "react";
import { ChevronDown, ChevronRight, Search, Filter, Download, Upload, Columns } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GeographicalData } from "@/types/profitability";
import { cn } from "@/lib/utils";

interface RegionalTableProps {
  data: GeographicalData[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

export function RegionalTable({ data }: RegionalTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [viewLevel, setViewLevel] = useState<"state" | "product">("state");

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderRow = (region: GeographicalData, isChild = false) => {
    const hasChildren = region.children && region.children.length > 0;
    const isExpanded = expandedRows.has(region.id);

    return (
      <>
        <TableRow
          key={region.id}
          className={cn("hover:bg-muted/30 group", isChild && "bg-muted/10")}
        >
          <TableCell className={cn("sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] transition-colors", isChild ? "bg-muted/10 group-hover:bg-muted/30" : "bg-card group-hover:bg-muted/30")}>
            <div className={cn("flex items-center gap-2", isChild && "pl-8")}>
              {hasChildren ? (
                <button
                  onClick={() => toggleRow(region.id)}
                  className="p-0.5 hover:bg-muted rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <span className="w-5" />
              )}
              {region.flag && <span className="text-lg">{region.flag}</span>}
              <span className="font-medium">{region.region}</span>
            </div>
          </TableCell>
          <TableCell className="text-right">{formatNumber(region.stocks)}</TableCell>
          <TableCell className="text-right">{formatNumber(region.orders)}</TableCell>
          <TableCell className="text-right">{formatNumber(region.unitsSold)}</TableCell>
          <TableCell className="text-right text-foreground">{formatNumber(region.refunds)}</TableCell>
          <TableCell className="text-right">{formatCurrency(region.sales)}</TableCell>
          <TableCell className="text-right">{formatCurrency(region.amazonFees)}</TableCell>
          <TableCell className="text-right">{formatNumber(region.sellableReturns)}</TableCell>
          <TableCell className="text-center">
            <button className="text-xs text-primary hover:underline">More</button>
          </TableCell>
        </TableRow>
        {hasChildren &&
          isExpanded &&
          region.children!.map((child) => renderRow(child, true))}
      </>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border">
            <button
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors",
                viewLevel === "state"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => setViewLevel("state")}
            >
              State Level
            </button>
            <button
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors",
                viewLevel === "product"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => setViewLevel("product")}
            >
              Product Level
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search region..." className="pl-10" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload COGS
          </Button>
          <Button variant="outline" size="sm">
            <Columns className="mr-2 h-4 w-4" />
            Columns
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="sticky left-0 z-20 bg-muted min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Region
              </TableHead>
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
          <TableBody>{data.map((region) => renderRow(region))}</TableBody>
        </Table>
      </div>
    </div>
  );
}
