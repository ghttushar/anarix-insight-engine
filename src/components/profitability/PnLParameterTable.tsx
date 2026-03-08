import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PnLRow } from "@/types/profitability";
import { cn } from "@/lib/utils";

interface PnLParameterTableProps {
  data: PnLRow[];
  weeks: string[];
}

const formatValue = (value: number | null, isCurrency: boolean = true): string => {
  if (value === null) return "-";
  if (isCurrency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US").format(value);
};

export function PnLParameterTable({ data, weeks }: PnLParameterTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    data.forEach((row) => {
      if (row.isExpanded) initial.add(row.id);
    });
    return initial;
  });

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

  const renderRow = (row: PnLRow, isCurrency: boolean = true) => {
    const isExpanded = expandedRows.has(row.id);
    const hasChildren = row.children && row.children.length > 0;

    return (
      <>
        <TableRow
          key={row.id}
          className={cn(
            "hover:bg-muted/30 group",
            row.isParent && "font-medium bg-muted"
          )}
        >
          <TableCell className={cn("sticky left-0 z-10 group-hover:bg-muted transition-colors", row.isParent ? "bg-muted" : "bg-background")}>
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${row.indent * 20}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleRow(row.id)}
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
              <span>{row.parameter}</span>
            </div>
          </TableCell>
          {weeks.map((week) => (
            <TableCell key={week} className="text-right">
              {formatValue(row.weeklyValues[week], isCurrency)}
            </TableCell>
          ))}
          <TableCell className="text-right font-medium">
            {formatValue(row.total, isCurrency)}
          </TableCell>
        </TableRow>
        {hasChildren &&
          isExpanded &&
          row.children!.map((child) =>
            renderRow(child, !child.parameter.toLowerCase().includes("unit"))
          )}
      </>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="sticky left-0 z-10 bg-muted min-w-[200px]">
              Parameter / Date
            </TableHead>
            {weeks.map((week) => (
              <TableHead key={week} className="text-right min-w-[100px]">
                {week}
              </TableHead>
            ))}
            <TableHead className="text-right min-w-[120px] font-semibold">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) =>
            renderRow(row, !row.parameter.toLowerCase().includes("unit"))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
