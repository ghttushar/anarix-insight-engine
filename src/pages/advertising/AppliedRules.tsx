import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { appliedRules, type AppliedRule } from "@/data/mockRules";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  paused: "bg-warning/10 text-warning border-warning/20",
  draft: "bg-muted text-muted-foreground border-muted",
};

type SortKey = "name" | "ruleType" | "entitiesCount" | "frequency" | "lastRun" | "status";

export default function AppliedRules() {
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...appliedRules].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === "number" ? av - (bv as number) : String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });

  const perPage = parseInt(rowsPerPage);
  const totalPages = Math.ceil(sorted.length / perPage);
  const pageData = sorted.slice(page * perPage, (page + 1) * perPage);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === field && <span className="text-[10px]">{sortDir === "asc" ? "▲" : "▼"}</span>}
      </span>
    </TableHead>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Applied Rules"
          subtitle="Manage and monitor all active automation rules"
          actions={
            <Button size="sm" onClick={() => navigate("/advertising/rules/agents")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Rule
            </Button>
          }
        />

        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <SortHeader label="Rule Name" field="name" />
                <SortHeader label="Rule Type" field="ruleType" />
                <SortHeader label="Entities Count" field="entitiesCount" />
                <SortHeader label="Frequency" field="frequency" />
                <SortHeader label="Last Run" field="lastRun" />
                <SortHeader label="Status" field="status" />
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <button
                      className="text-sm font-medium text-primary hover:underline"
                      onClick={() => navigate(`/advertising/rules/edit/${rule.id}`)}
                    >
                      {rule.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{rule.ruleType}</TableCell>
                  <TableCell>
                    <button className="text-sm text-primary hover:underline">
                      {rule.entitiesCount} {rule.entityLabel}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{rule.frequency}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{rule.lastRun}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[rule.status]}>{rule.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => navigate(`/advertising/rules/edit/${rule.id}`)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Rows per page</span>
            <Select value={rowsPerPage} onValueChange={(v) => { setRowsPerPage(v); setPage(0); }}>
              <SelectTrigger className="h-7 w-[65px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Page {page + 1} of {totalPages}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
