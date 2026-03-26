import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppLevelSelector } from "@/components/layout/AppLevelSelector";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { CatalogProductsTable } from "@/components/catalog/CatalogProductsTable";
import { catalogProducts } from "@/data/mockCatalog";
import { toast } from "sonner";

export default function CatalogProducts() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Products Catalog"
          subtitle="Manage your product catalog and inventory"
          appLevelSelector={<AppLevelSelector />}
        />
        <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing catalog...")} />
        <CatalogProductsTable products={catalogProducts} />
      </div>
    </AppLayout>
  );
}
