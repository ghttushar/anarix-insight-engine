import { AppLayout } from "@/components/layout/AppLayout";
import { CatalogProductsTable } from "@/components/catalog/CatalogProductsTable";
import { catalogProducts } from "@/data/mockCatalog";

export default function CatalogProducts() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Products Catalog</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog and inventory</p>
        </div>
        <CatalogProductsTable products={catalogProducts} />
      </div>
    </AppLayout>
  );
}
