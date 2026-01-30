import { AppLayout } from "@/components/layout/AppLayout";
import { ScatterPlotChart } from "@/components/profitability/ScatterPlotChart";
import { ProductsPnLTable } from "@/components/profitability/ProductsPnLTable";
import { scatterData, profitabilityProducts } from "@/data/mockProfitability";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Play } from "lucide-react";

export default function ProfitabilityTrends() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Profitability Trends</h1>
            <p className="text-sm text-muted-foreground">Analyze product performance quadrants</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by Item ID/Product Name/SKU" className="pl-10 w-[280px]" />
            </div>
            <Select defaultValue="quarter">
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="quarter">A Quarter / 3 months</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="sales">
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Total Sales</SelectItem>
                <SelectItem value="profit">Net Profit</SelectItem>
                <SelectItem value="units">Units</SelectItem>
              </SelectContent>
            </Select>
            <Button><Play className="mr-2 h-4 w-4" />Run</Button>
          </div>
        </div>
        <ScatterPlotChart data={scatterData} />
        <ProductsPnLTable products={profitabilityProducts} />
      </div>
    </AppLayout>
  );
}
