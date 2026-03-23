import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockProductAds, productAdsTotals } from "@/data/mockProductAds";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddProductAdsModal } from "@/components/advertising/AddProductAdsModal";

interface ProductAdsTableProps {
  searchQuery?: string;
  showAddButton?: boolean;
}

export function ProductAdsTable({ searchQuery = "", showAddButton = false }: ProductAdsTableProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<string[]>(["Product Ad Status is ENABLED"]);

  const filteredAds = mockProductAds.filter((ad) =>
    ad.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.itemId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAds.length / rowsPerPage);
  const paginatedAds = filteredAds.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, filteredAds.length);

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === paginatedAds.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedAds.map((a) => a.id)));
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  const NumCell = ({ formatted, id, metric }: { formatted: string; id: string; metric: string }) => (
    <div className="flex flex-col items-end">
      <span className="text-foreground">{formatted}</span>
      <DeltaBadge value={getDelta(id, metric)} />
    </div>
  );

  return (
    <>
      {/* Filter row */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          {activeFilters.map((filter) => (
            <div key={filter} className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground">
              {filter}
              <button onClick={() => removeFilter(filter)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button onClick={() => setActiveFilters([])} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">
            Clear
          </button>
        </div>
      )}

      {/* Add button row */}
      {showAddButton && (
        <div className="flex items-center justify-end mb-3">
          <Button size="sm" className="gap-1.5" onClick={() => setAddModalOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add Product Ads
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-10 sticky left-0 z-10 bg-muted">
                  <Checkbox checked={selectedRows.size === paginatedAds.length && paginatedAds.length > 0} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead className="w-24 sticky left-[40px] z-10 bg-muted">Status</TableHead>
                <TableHead className="min-w-[300px] sticky left-[136px] z-10 bg-muted">Product Ad</TableHead>
                <TableHead className="min-w-[150px]">Ad Group</TableHead>
                <TableHead className="min-w-[150px]">Campaign</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Ad Units</TableHead>
                <TableHead className="text-right">CVR</TableHead>
                <TableHead className="text-right">CPC</TableHead>
                <TableHead className="text-right">Ad Spend</TableHead>
                <TableHead className="text-right">Ad Sales</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead className="text-right">ACOS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAds.map((ad) => (
                <TableRow key={ad.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors">
                    <Checkbox checked={selectedRows.has(ad.id)} onCheckedChange={() => toggleRow(ad.id)} />
                  </TableCell>
                  <TableCell className="sticky left-[40px] z-10 bg-background group-hover:bg-muted transition-colors"><StatusBadge status={ad.status} /></TableCell>
                  <TableCell className="sticky left-[136px] z-10 bg-background group-hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={ad.productImage} alt={ad.productName} className="h-10 w-10 rounded-md object-cover" />
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{ad.productName}</span>
                        <span className="text-xs text-muted-foreground">{ad.itemId} · {ad.sku}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{ad.adGroupName}</TableCell>
                  <TableCell className="text-foreground">{ad.campaignName}</TableCell>
                  <TableCell className="text-right"><NumCell formatted={formatNumber(ad.impressions)} id={ad.id} metric="impressions" /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={formatNumber(ad.clicks)} id={ad.id} metric="clicks" /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={formatPercent(ad.ctr)} id={ad.id} metric="ctr" /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={formatNumber(ad.adUnits)} id={ad.id} metric="adUnits" /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={formatPercent(ad.cvr)} id={ad.id} metric="cvr" /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={formatCurrency(ad.cpc)} id={ad.id} metric="cpc" /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={formatCurrency(ad.adSpend)} id={ad.id} metric="adSpend" /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={formatCurrency(ad.adSpend * 4.2)} id={ad.id} metric="adSales" /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={(4.2).toFixed(2)} id={ad.id} metric="roas" /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={formatPercent(23.8)} id={ad.id} metric="acos" /></TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted font-medium hover:bg-muted">
                <TableCell colSpan={5} className="font-semibold">Total ({filteredAds.length} product ads)</TableCell>
                <TableCell className="text-right text-foreground">{formatNumber(productAdsTotals.impressions)}</TableCell>
                <TableCell className="text-right text-foreground">{formatNumber(productAdsTotals.clicks)}</TableCell>
                <TableCell className="text-right text-foreground">{formatPercent(productAdsTotals.ctr)}</TableCell>
                <TableCell className="text-right text-foreground">{formatNumber(productAdsTotals.adUnits)}</TableCell>
                <TableCell className="text-right text-foreground">{formatPercent(productAdsTotals.cvr)}</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(productAdsTotals.cpc)}</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(productAdsTotals.adSpend)}</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(productAdsTotals.adSpend * 4.2)}</TableCell>
                <TableCell className="text-right text-foreground">{(4.2).toFixed(2)}</TableCell>
                <TableCell className="text-right text-foreground">{formatPercent(23.8)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page</span>
            <Select value={String(rowsPerPage)} onValueChange={(v) => { setRowsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="h-7 w-[65px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{startRow}-{endRow} of {filteredAds.length}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <AddProductAdsModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </>
  );
}
