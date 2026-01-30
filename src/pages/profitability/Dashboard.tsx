import { AppLayout } from "@/components/layout/AppLayout";

export default function ProfitabilityDashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Profitability Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your profit metrics and financial performance
          </p>
        </div>
        
        {/* Placeholder for summary cards and table - to be built next */}
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Profitability Dashboard content will be implemented in the next step.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
