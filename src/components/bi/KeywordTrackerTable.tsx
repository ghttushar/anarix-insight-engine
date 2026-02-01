import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Search as SearchIcon, Eye, EyeOff } from "lucide-react";
import { TrackedKeyword } from "@/types/bi";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface KeywordTrackerTableProps {
  keywords: TrackedKeyword[];
  onStatusChange?: (id: string, status: "active" | "inactive") => void;
  onDelete?: (id: string) => void;
}

export function KeywordTrackerTable({ keywords, onStatusChange, onDelete }: KeywordTrackerTableProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Keyword</TableHead>
            <TableHead>Added At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-center">Region</TableHead>
            <TableHead className="text-center">Channels</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center w-[80px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((keyword) => (
            <TableRow key={keyword.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{keyword.keyword}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(keyword.addedAt)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(keyword.updatedAt)}
              </TableCell>
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
                      <SearchIcon className="h-3 w-3" />
                      Organic
                    </span>
                  )}
                  {keyword.channels.includes("sponsored") && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Sponsored
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={keyword.status === "active"}
                  onCheckedChange={(checked) =>
                    onStatusChange?.(keyword.id, checked ? "active" : "inactive")
                  }
                />
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete?.(keyword.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
