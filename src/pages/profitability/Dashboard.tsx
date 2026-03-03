import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PeriodSummaryCard } from "@/components/profitability/PeriodSummaryCard";
import { ProfitabilityTrendChart } from "@/components/profitability/ProfitabilityTrendChart";
import { ProductsPnLTable } from "@/components/profitability/ProductsPnLTable";
import { COGSEditModal } from "@/components/profitability/COGSEditModal";
import { ProductDetailPanel } from "@/components/profitability/ProductDetailPanel";
import { ProductTrendsModal } from "@/components/profitability/ProductTrendsModal";
import { ProductsOrdersToggle } from "@/components/profitability/ProductsOrdersToggle";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { profitabilitySummaries, profitabilityProducts, trendData } from "@/data/mockProfitability";
import { ProfitabilitySummary, ProfitabilityProduct } from "@/types/profitability";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const accentColors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

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
  { id: "commissionShipping", label: "Comm. Shipping", visible: true },
  { id: "wfsFulfillmentFee", label: "WFS Fee", visible: true },
  { id: "shippingFees", label: "Shipping Fees", visible: true },
  { id: "cogs", label: "COGS", visible: true },
  { id: "netProfit", label: "Net Profit", visible: true },
  { id: "additionalFee", label: "Additional Fee", visible: true },
];

const FILTER_FIELDS = ["Product Name", "Item ID", "SKU", "Net Profit", "Ad Spend", "Units"];

export default function ProfitabilityDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("today");
  const [tableTab, setTableTab] = useState<"products" | "orders">("products");
  const [searchValue, setSearchValue] = useState("");
  const [columns, setColumns] = useState(COLUMN_DEFS);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [products, setProducts] = useState(profitabilityProducts);

  // Modal states
  const [cogsProduct, setCogsProduct] = useState<ProfitabilityProduct | null>(null);
  const [detailProduct, setDetailProduct] = useState<ProfitabilityProduct | null>(null);
  const [trendsProduct, setTrendsProduct] = useState<ProfitabilityProduct | null>(null);

  // KPI panel state
  const [openKPIPanel, setOpenKPIPanel] = useState<string | null>(null);

  const handleCogsSave = (productId: string, newCogs: number) => {
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, cogs: newCogs } : p));
  };

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) => prev.map((c) => c.id === columnId ? { ...c, visible: !c.visible } : c));
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.itemId.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Profitability Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your profit metrics and financial performance</p>
        </div>

        {/* KPI Period Blocks + Chart */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {profitabilitySummaries.map((summary, index) => (
              <div
                key={summary.period}
                onClick={() => setSelectedPeriod(summary.period)}
                className={cn(
                  "cursor-pointer rounded-lg transition-all",
                  selectedPeriod === summary.period && "ring-2 ring-primary/50"
                )}
              >
                <PeriodSummaryCard
                  summary={summary}
                  accentColor={accentColors[index % accentColors.length]}
                />
              </div>
            ))}
          </div>
          <div>
            <ProfitabilityTrendChart data={trendData} />
          </div>
        </div>

        {/* Products / Orders Table Section */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <ProductsOrdersToggle activeTab={tableTab} onTabChange={setTableTab} />
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload COGS
              </Button>
            </div>
            <DataTableToolbar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Search by Product Name / Item ID / SKU..."
              columns={columns}
              onColumnToggle={handleColumnToggle}
              onSelectAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: true })))}
              onClearAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: false })))}
              activeFilters={activeFilters}
              onFiltersChange={setActiveFilters}
              filterFields={FILTER_FIELDS}
              onDownload={() => {}}
            />
          </div>

          <ProductsPnLTable
            products={filteredProducts}
            visibleColumns={columns.filter((c) => c.visible).map((c) => c.id)}
            onCogsClick={(product) => setCogsProduct(product)}
            onTrendsClick={(product) => setTrendsProduct(product)}
            onMoreClick={(product) => setDetailProduct(product)}
          />
        </div>
      </div>

      {/* Modals */}
      <COGSEditModal
        product={cogsProduct}
        isOpen={!!cogsProduct}
        onClose={() => setCogsProduct(null)}
        onSave={handleCogsSave}
      />
      <ProductDetailPanel
        product={detailProduct}
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
      />
      <ProductTrendsModal
        product={trendsProduct}
        isOpen={!!trendsProduct}
        onClose={() => setTrendsProduct(null)}
      />
    </AppLayout>
  );
}
