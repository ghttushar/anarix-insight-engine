import { AppLayout } from "@/components/layout/AppLayout";
import { PeriodSummaryCard } from "@/components/profitability/PeriodSummaryCard";
import { ProfitabilityTrendChart } from "@/components/profitability/ProfitabilityTrendChart";
import { ProductsPnLTable } from "@/components/profitability/ProductsPnLTable";
import { profitabilitySummaries, profitabilityProducts, trendData } from "@/data/mockProfitability";

const accentColors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

export default function ProfitabilityDashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Profitability Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your profit metrics and financial performance</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {profitabilitySummaries.map((summary, index) => (
              <PeriodSummaryCard key={summary.period} summary={summary} accentColor={accentColors[index % accentColors.length]} />
            ))}
          </div>
          <div>
            <ProfitabilityTrendChart data={trendData} />
          </div>
        </div>

        <ProductsPnLTable products={profitabilityProducts} />
      </div>
    </AppLayout>
  );
}
