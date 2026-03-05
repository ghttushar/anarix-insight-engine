import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { PnLParameterTable } from "@/components/profitability/PnLParameterTable";
import { ProductsPnLTable } from "@/components/profitability/ProductsPnLTable";
import { ProductDetailPanel } from "@/components/profitability/ProductDetailPanel";
import { ProductsOrdersToggle } from "@/components/profitability/ProductsOrdersToggle";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { pnlData, profitabilityProducts } from "@/data/mockProfitability";
import { ProfitabilityProduct } from "@/types/profitability";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Download, Play } from "lucide-react";
import { toast } from "sonner";

const COLUMN_DEFS = [
  { id: "units", label: "Units", visible: true },
  { id: "refundUnits", label: "Refund Units", visible: true },
  { id: "cancelledUnits", label: "Cancelled Units", visible: true },
  { id: "gmv", label: "GMV", visible: true },
  { id: "authSales", label: "Auth Sales", visible: true },
  { id: "refundSales", label: "Refund Sales", visible: true },
  { id: "cancelledSales", label: "Cancelled Sales", visible: true },
  { id: "adSpend", label: "Ad Spend", visible: true },
  { id: "commissionProduct", label: "Comm. Product", visible: true },
];

const FILTER_FIELDS = ["Product Name", "Item ID", "SKU", "Net Profit", "Units"];

export default function ProfitLoss() {
  const weeks = ["Week-05", "Week-04", "Week-02", "Week-01"];
  const [dateRange, setDateRange] = useState("quarter");
  const [selectedCount] = useState(5);
  const [tableTab, setTableTab] = useState<"products" | "orders">("products");
  const [searchValue, setSearchValue] = useState("");
  const [columns, setColumns] = useState(COLUMN_DEFS);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [detailProduct, setDetailProduct] = useState<ProfitabilityProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredProducts = profitabilityProducts.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.itemId.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleRun = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
    toast.info("Refreshing data...");
  };

  const handleDownload = () => {
    toast.success("Exporting data as CSV...");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Profit & Loss"
          subtitle="Detailed P&L breakdown by period"
          actions={
            <>
              <Badge variant="secondary" className="px-3 py-1">{selectedCount} Product(s) Selected</Badge>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px] h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week (by days)</SelectItem>
                  <SelectItem value="month">Month (by days)</SelectItem>
                  <SelectItem value="quarter">A Quarter / 3 months</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleRun} disabled={isLoading}>
                <Play className="mr-2 h-4 w-4" />{isLoading ? "Running..." : "Run"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}><Download className="h-4 w-4" /></Button>
            </>
          }
        />

        <PnLParameterTable data={pnlData} weeks={weeks} />

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <ProductsOrdersToggle activeTab={tableTab} onTabChange={setTableTab} />
            </div>
            <DataTableToolbar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Search by Product Name / Item ID / SKU..."
              columns={columns}
              onColumnToggle={(id) => setColumns((prev) => prev.map((c) => c.id === id ? { ...c, visible: !c.visible } : c))}
              onSelectAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: true })))}
              onClearAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: false })))}
              activeFilters={activeFilters}
              onFiltersChange={setActiveFilters}
              filterFields={FILTER_FIELDS}
              onDownload={handleDownload}
            />
          </div>

          <ProductsPnLTable
            products={filteredProducts}
            visibleColumns={columns.filter((c) => c.visible).map((c) => c.id)}
            onMoreClick={(product) => setDetailProduct(product)}
          />
        </div>
      </div>

      <ProductDetailPanel product={detailProduct} isOpen={!!detailProduct} onClose={() => setDetailProduct(null)} />
    </AppLayout>
  );
}
