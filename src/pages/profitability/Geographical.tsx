import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { GeographyMap } from "@/components/profitability/GeographyMap";
import { RegionStatsPanel } from "@/components/profitability/RegionStatsPanel";
import { RegionalTable } from "@/components/tables/RegionalTable";
import { RegionalProductTable } from "@/components/tables/RegionalProductTable";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { geographicalData } from "@/data/mockProfitability";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const regionLookup: Record<string, typeof geographicalData[0]> = {
  US: geographicalData[0],
  CA: geographicalData[0].children?.[0] || geographicalData[0],
  TX: geographicalData[0].children?.[1] || geographicalData[0],
  NY: geographicalData[0].children?.[2] || geographicalData[0],
  FL: geographicalData[0].children?.[3] || geographicalData[0],
};

const COLUMN_DEFS = [
  { id: "stocks", label: "Stocks", visible: true },
  { id: "orders", label: "Orders", visible: true },
  { id: "unitsSold", label: "Units Sold", visible: true },
  { id: "refunds", label: "Refunds", visible: true },
  { id: "sales", label: "Sales", visible: true },
  { id: "amazonFees", label: "Amazon Fees", visible: true },
  { id: "sellableReturns", label: "Sellable Returns", visible: true },
];

const FILTER_FIELDS = ["Region", "Sales", "Orders", "Stocks"];

export default function Geographical() {
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>("US");
  const [viewLevel, setViewLevel] = useState<"state" | "product">("state");
  const [searchValue, setSearchValue] = useState("");
  const [columns, setColumns] = useState(COLUMN_DEFS);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const selectedRegion = regionLookup[selectedRegionCode] || geographicalData[0];

  const handleColumnToggle = (id: string) => {
    setColumns((prev) => prev.map((c) => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  const handleDownload = () => toast.success("Exporting geographical data...");

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Geographical Data" subtitle="Regional performance breakdown across markets" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-full">
            <GeographyMap
              selectedRegion={selectedRegionCode}
              onRegionSelect={setSelectedRegionCode}
            />
          </div>
          <div className="h-full">
            <RegionStatsPanel
              region={selectedRegion}
              dateRange="Jan 1 - Jan 30, 2026"
            />
          </div>
        </div>

        <div className="space-y-3">
          <DataTableToolbar
            leftContent={
              <div className="flex rounded-md border border-border">
                <button
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition-colors",
                    viewLevel === "state" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                  )}
                  onClick={() => setViewLevel("state")}
                >
                  State Level
                </button>
                <button
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition-colors",
                    viewLevel === "product" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                  )}
                  onClick={() => setViewLevel("product")}
                >
                  Product Level
                </button>
              </div>
            }
            rightContent={
              <Button variant="outline" size="sm" onClick={() => toast.info("Upload COGS file...")}>
                <Upload className="mr-2 h-4 w-4" />Upload COGS
              </Button>
            }
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder={viewLevel === "state" ? "Search region..." : "Search by Product Name / Item ID..."}
            columns={columns}
            onColumnToggle={handleColumnToggle}
            onSelectAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: true })))}
            onClearAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: false })))}
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
            filterFields={FILTER_FIELDS}
            onDownload={handleDownload}
          />

          <div className="rounded-lg border border-border">
            {viewLevel === "state" ? (
              <RegionalTable data={geographicalData} searchValue={searchValue} />
            ) : (
              <RegionalProductTable searchValue={searchValue} />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
