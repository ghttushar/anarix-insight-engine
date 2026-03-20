import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { PeriodSummaryCard } from "@/components/profitability/PeriodSummaryCard";
import { ProfitabilityTrendChart } from "@/components/profitability/ProfitabilityTrendChart";
import { ProductsPnLTable } from "@/components/profitability/ProductsPnLTable";
import { COGSEditModal } from "@/components/profitability/COGSEditModal";
import { ProductDetailPanel } from "@/components/profitability/ProductDetailPanel";
import { ProductTrendsModal } from "@/components/profitability/ProductTrendsModal";
import { ProductsOrdersToggle } from "@/components/profitability/ProductsOrdersToggle";
import { PeriodBreakdownPanel } from "@/components/profitability/PeriodBreakdownPanel";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { profitabilitySummaries, profitabilityProducts, trendDataByPeriod } from "@/data/mockProfitability";
import { ProfitabilityProduct, ProfitabilitySummary } from "@/types/profitability";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useActivePanel } from "@/contexts/ActivePanelContext";

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
{ id: "additionalFee", label: "Additional Fee", visible: true }];


const FILTER_FIELDS = ["Product Name", "Item ID", "SKU", "Net Profit", "Ad Spend", "Units"];

export default function ProfitabilityDashboard() {
  const { activePanel, setActivePanel, closePanel } = useActivePanel();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("today");
  const [tableTab, setTableTab] = useState<"products" | "orders">("products");
  const [searchValue, setSearchValue] = useState("");
  const [columns, setColumns] = useState(COLUMN_DEFS);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [products, setProducts] = useState(profitabilityProducts);

  // Panel data states
  const [cogsProduct, setCogsProduct] = useState<ProfitabilityProduct | null>(null);
  const [detailProduct, setDetailProduct] = useState<ProfitabilityProduct | null>(null);
  const [trendsProduct, setTrendsProduct] = useState<ProfitabilityProduct | null>(null);
  const [breakdownSummary, setBreakdownSummary] = useState<ProfitabilitySummary | null>(null);

  const handleOpenDetail = (product: ProfitabilityProduct) => {
    setBreakdownSummary(null);
    setDetailProduct(product);
    setActivePanel("productDetail");
  };

  const handleOpenBreakdown = (summary: ProfitabilitySummary) => {
    setDetailProduct(null);
    setBreakdownSummary(summary);
    setActivePanel("periodBreakdown");
  };

  const handleCloseRightPanel = () => {
    setDetailProduct(null);
    setBreakdownSummary(null);
    closePanel();
  };

  const handleCogsSave = (productId: string, newCogs: number) => {
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, cogs: newCogs } : p));
  };

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) => prev.map((c) => c.id === columnId ? { ...c, visible: !c.visible } : c));
  };

  const handleUploadCOGS = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlsx,.xls";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.info(`Analyzing ${file.name}...`);
        setTimeout(() => {
          toast.success("COGS uploaded successfully. Table refreshed.");
        }, 1500);
      }
    };
    input.click();
  };

  const handleDownload = () => {
    toast.success("Exporting data as CSV...");
  };

  const filteredProducts = products.filter((p) =>
  p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
  p.itemId.toLowerCase().includes(searchValue.toLowerCase()) ||
  p.sku.toLowerCase().includes(searchValue.toLowerCase())
  );

  const showProductDetail = activePanel === "productDetail" && detailProduct;
  const showBreakdown = activePanel === "periodBreakdown" && breakdownSummary;

  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 space-y-6 overflow-auto">
          <PageHeader title="Profitability Dashboard" subtitle="Track your profit metrics and financial performance" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              {profitabilitySummaries.map((summary, index) =>
              <div
                key={summary.period}
                onClick={() => setSelectedPeriod(summary.period)}
                className={cn(
                  "cursor-pointer rounded-lg transition-all",
                  selectedPeriod === summary.period && "ring-2 ring-primary/50"
                )}>
                
                  <PeriodSummaryCard
                  summary={summary}
                  accentColor={accentColors[index % accentColors.length]}
                  onViewMore={handleOpenBreakdown} />
                
                </div>
              )}
            </div>
            <div className="h-full">
              <ProfitabilityTrendChart
                data={trendDataByPeriod[selectedPeriod] || trendDataByPeriod.this_month}
                periodLabel={profitabilitySummaries.find((s) => s.period === selectedPeriod)?.dateLabel || ""} />
              
            </div>
          </div>

          <div className="space-y-3">
            <DataTableToolbar
              leftContent={<ProductsOrdersToggle activeTab={tableTab} onTabChange={setTableTab} />}
              rightContent={
              <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleUploadCOGS}>
                    <Upload className="mr-2 h-4 w-4" />Upload COGS
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDownload} title="Export CSV">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              }
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
              onDownload={handleDownload} />
            
            <div className="rounded-lg border border-border">
              <ProductsPnLTable
                products={filteredProducts}
                visibleColumns={columns.filter((c) => c.visible).map((c) => c.id)}
                onCogsClick={(product) => setCogsProduct(product)}
                onTrendsClick={(product) => setTrendsProduct(product)}
                onMoreClick={handleOpenDetail} />
              
            </div>
          </div>
        </div>

        {/* Right-side panels — only one at a time */}
        {showProductDetail &&
        <ProductDetailPanel product={detailProduct} isOpen={true} onClose={handleCloseRightPanel} />
        }
        {showBreakdown &&
        <PeriodBreakdownPanel summary={breakdownSummary} isOpen={true} onClose={handleCloseRightPanel} />
        }
      </div>

      <COGSEditModal
        product={cogsProduct}
        isOpen={!!cogsProduct}
        onClose={() => setCogsProduct(null)}
        onSave={handleCogsSave} />
      
      <ProductTrendsModal
        product={trendsProduct}
        isOpen={!!trendsProduct}
        onClose={() => setTrendsProduct(null)} />
      
    </AppLayout>);

}