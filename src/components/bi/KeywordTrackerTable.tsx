import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Search as SearchIcon } from "lucide-react";
import { TrackedKeyword } from "@/types/bi";
import { format } from "date-fns";
import { TablePagination } from "@/components/tables/TablePagination";
import { SortableTableHead, sortData } from "@/components/tables/SortableTableHead";

interface KeywordTrackerTableProps {
  keywords: TrackedKeyword[];
  onStatusChange?: (id: string, status: "active" | "inactive") => void;
  onDelete?: (id: string) => void;
}

export function KeywordTrackerTable({ keywords, onStatusChange, onDelete }: KeywordTrackerTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(new Set());
  const handlePinToggle = (field: string) => { setPinnedColumns(prev => { const next = new Set(prev); if (next.has(field)) next.delete(field); else next.add(field); return next; }); };

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(keywords, sortField, sortDirection);
  const paginatedKeywords = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (dateString: string) => format(new Date(dateString), "MMM dd, yyyy HH:mm");

  const sp = { sortField, sortDirection, onSort: handleSort };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <SortableTableHead field="keyword" {...sp}>Keyword</SortableTableHead>
            <SortableTableHead field="addedAt" {...sp}>Added At</SortableTableHead>
            <SortableTableHead field="updatedAt" {...sp}>Updated At</SortableTableHead>
            <SortableTableHead field="region" {...sp} className="text-center" align="center">Region</SortableTableHead>
            <TableHead className="text-center">Channels</TableHead>
            <SortableTableHead field="status" {...sp} className="text-center" align="center">Status</SortableTableHead>
            <TableHead className="text-center w-[80px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedKeywords.map((keyword) => (
            <TableRow key={keyword.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{keyword.keyword}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{formatDate(keyword.addedAt)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{formatDate(keyword.updatedAt)}</TableCell>
              <TableCell className="text-center">
                <span className="flex items-center justify-center gap-1.5">
                  <span>{keyword.regionFlag}</span>
                  <span className="text-sm text-muted-foreground">{keyword.region}</span>
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  {keyword.channels.includes("organic") && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      <SearchIcon className="h-3 w-3" />Organic
                    </span>
                  )}
                  {keyword.channels.includes("sponsored") && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Sponsored</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Switch checked={keyword.status === "active"} onCheckedChange={(checked) => onStatusChange?.(keyword.id, checked ? "active" : "inactive")} />
              </TableCell>
              <TableCell className="text-center">
                <Button variant="ghost" size="icon" onClick={() => onDelete?.(keyword.id)} className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={keywords.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
