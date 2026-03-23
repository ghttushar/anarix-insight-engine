import { StatusBadge } from "@/components/status/StatusBadge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Campaign } from "@/types/campaign";
import { Pencil } from "lucide-react";

interface CampaignInfoCardProps {
  campaign: Campaign;
}

export function CampaignInfoCard({ campaign }: CampaignInfoCardProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-6 rounded-lg border border-border bg-card px-5 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Campaign Name</span>
        <span className="text-sm font-medium text-foreground">{campaign.name}</span>
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Status</span>
        <StatusBadge status={campaign.status} />
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Type</span>
        <span className="text-sm text-foreground capitalize">{campaign.type}</span>
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Daily Budget</span>
        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">{formatCurrency(campaign.dailyBudget)}</span>
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Budget</span>
        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">{formatCurrency(campaign.totalBudget)}</span>
      </div>

      <div className="flex-1" />

      <Button variant="outline" size="sm" className="gap-1.5">
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
    </div>
  );
}
