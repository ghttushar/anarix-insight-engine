import { AppLayout } from "@/components/layout/AppLayout";
import { PnLParameterTable } from "@/components/profitability/PnLParameterTable";
import { ProductsPnLTable } from "@/components/profitability/ProductsPnLTable";
import { pnlData, profitabilityProducts } from "@/data/mockProfitability";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Play } from "lucide-react";

export default function ProfitLoss() {
  const weeks = ["Week-05", "Week-04", "Week-02", "Week-01"];
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Profit & Loss</h1>
            <p className="text-sm text-muted-foreground">Detailed P&L breakdown by period</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">5 Product(s) Selected</Badge>
            <Select defaultValue="quarter">
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="quarter">A Quarter / 3 months</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button><Play className="mr-2 h-4 w-4" />Run</Button>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Download</Button>
          </div>
        </div>
        <PnLParameterTable data={pnlData} weeks={weeks} />
        <ProductsPnLTable products={profitabilityProducts} />
      </div>
    </AppLayout>
  );
}
