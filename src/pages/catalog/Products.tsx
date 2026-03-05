import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { CatalogProductsTable } from "@/components/catalog/CatalogProductsTable";
import { catalogProducts } from "@/data/mockCatalog";

export default function CatalogProducts() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Products Catalog" subtitle="Manage your product catalog and inventory" />
        <CatalogProductsTable products={catalogProducts} />
      </div>
    </AppLayout>
  );
}
