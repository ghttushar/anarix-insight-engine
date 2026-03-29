import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppLevelSelector } from "@/components/layout/AppLevelSelector";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { CatalogProductsTable } from "@/components/catalog/CatalogProductsTable";
import { catalogProducts } from "@/data/mockCatalog";
import { toast } from "sonner";

const COLUMN_DEFS = [
  { id: "status", label: "Status", visible: true },
  { id: "reviews", label: "Reviews", visible: true },
  { id: "inventoryCount", label: "Inventory", visible: true },
  { id: "inventoryValueCogs", label: "Value (COGS)", visible: true },
  { id: "inventoryValueRetail", label: "Value (Retail)", visible: true },
  { id: "price", label: "Price", visible: true },
  { id: "cogs", label: "COGS", visible: true },
  { id: "totalSales", label: "Total Sales", visible: true },
  { id: "gmv", label: "GMV", visible: true },
  { id: "totalUnits", label: "Units", visible: true },
  { id: "refundSales", label: "Refund Sales", visible: true },
  { id: "cancelledSales", label: "Cancelled", visible: true },
  { id: "advertised", label: "Advertised", visible: true },
  { id: "adSpend", label: "Ad Spend", visible: true },
];

const SORTABLE_FIELDS = [
  { id: "name", label: "Product Name" },
  { id: "inventoryCount", label: "Inventory" },
  { id: "price", label: "Price" },
  { id: "cogs", label: "COGS" },
  { id: "totalSales", label: "Total Sales" },
  { id: "gmv", label: "GMV" },
  { id: "totalUnits", label: "Units" },
  { id: "adSpend", label: "Ad Spend" },
];

const FILTER_FIELDS = ["Product Name", "Item ID", "SKU", "Status", "Price", "COGS"];

export default function CatalogProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState(COLUMN_DEFS);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [showDeltas, setShowDeltas] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Products Catalog"
          subtitle="Manage your product catalog and inventory"
          appLevelSelector={<AppLevelSelector />}
        />
        <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing catalog...")} />

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by Product Name / ID / SKU..."
          columns={columns}
          onColumnToggle={(id) => setColumns((prev) => prev.map((c) => c.id === id ? { ...c, visible: !c.visible } : c))}
          onSelectAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: true })))}
          onClearAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: false })))}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          filterFields={FILTER_FIELDS}
          onDownload={() => toast.success("Exporting catalog data...")}
          showDeltas={showDeltas}
          onShowDeltasChange={setShowDeltas}
          showUpload
          onUpload={(files) => toast.info(`Uploading ${files[0]?.name}...`)}
          uploadTitle="Upload COGS"
          sortableFields={SORTABLE_FIELDS}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={(field, dir) => { setSortField(field); setSortDirection(dir); }}
        />

        <CatalogProductsTable
          products={catalogProducts}
          searchQuery={searchQuery}
          showDeltas={showDeltas}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </div>
    </AppLayout>
  );
}
