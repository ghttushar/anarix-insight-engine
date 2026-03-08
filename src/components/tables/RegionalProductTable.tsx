import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { profitabilityProducts } from "@/data/mockProfitability";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

interface RegionalProductTableProps {
  searchValue?: string;
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

// Assign products to regions for the product-level geo view
const regionAssignments = [
  { region: "United States", flag: "🇺🇸", products: profitabilityProducts.slice(0, 3) },
  { region: "Canada", flag: "🇨🇦", products: profitabilityProducts.slice(3, 4) },
  { region: "Mexico", flag: "🇲🇽", products: profitabilityProducts.slice(4, 5) },
];

export function RegionalProductTable({ searchValue = "" }: RegionalProductTableProps) {
  const { formatCurrency } = useCurrency();
  const filtered = regionAssignments.map((ra) => ({
    ...ra,
    products: ra.products.filter((p) =>
      p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.itemId.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchValue.toLowerCase())
    ),
  })).filter((ra) => ra.products.length > 0);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="sticky left-0 z-20 bg-muted min-w-[300px] border-r border-border">Product Details</TableHead>
            <TableHead className="text-right">Units</TableHead>
            <TableHead className="text-right">GMV</TableHead>
            <TableHead className="text-right">Auth Sales</TableHead>
            <TableHead className="text-right">Ad Spend</TableHead>
            <TableHead className="text-right">Net Profit</TableHead>
            <TableHead className="text-right">Margin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((ra) => (
            <>
              <TableRow key={ra.region} className="bg-muted/30">
                <TableCell colSpan={7} className="sticky left-0 z-10 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{ra.flag}</span>
                    <span className="font-semibold text-foreground text-sm">{ra.region}</span>
                    <span className="text-xs text-muted-foreground">({ra.products.length} products)</span>
                  </div>
                </TableCell>
              </TableRow>
              {ra.products.map((product) => {
                const margin = product.gmv > 0 ? (product.netProfit / product.gmv) * 100 : 0;
                return (
                  <TableRow key={product.id} className="hover:bg-muted/30 group">
                    <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors border-r border-border">
                      <div className="flex items-center gap-3 pl-6">
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md border border-border object-cover flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{product.itemId}</span><span>•</span><span>{product.sku}</span><span>•</span><span>{formatCurrency(product.price)}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-foreground">{formatNumber(product.units)}</TableCell>
                    <TableCell className="text-right text-foreground">{formatCurrency(product.gmv)}</TableCell>
                    <TableCell className="text-right text-foreground">{formatCurrency(product.authSales)}</TableCell>
                    <TableCell className="text-right text-foreground">{formatCurrency(product.adSpend)}</TableCell>
                    <TableCell className="text-right font-medium text-foreground">{formatCurrency(product.netProfit)}</TableCell>
                    <TableCell className="text-right text-foreground">{margin.toFixed(1)}%</TableCell>
                  </TableRow>
                );
              })}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
