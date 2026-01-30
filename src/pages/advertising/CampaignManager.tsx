import { AppLayout } from "@/components/layout/AppLayout";

export default function CampaignManager() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Campaign Manager
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and optimize your advertising campaigns
          </p>
        </div>
        
        {/* Placeholder for KPI cards, chart, and table - to be built next */}
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Campaign Manager content will be implemented in the next step.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
