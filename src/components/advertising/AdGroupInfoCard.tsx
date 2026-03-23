import { StatusBadge } from "@/components/status/StatusBadge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AdGroup } from "@/types/advertising";
import { Pencil } from "lucide-react";

interface AdGroupInfoCardProps {
  adGroup: AdGroup;
}

export function AdGroupInfoCard({ adGroup }: AdGroupInfoCardProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-6 rounded-lg border border-border bg-card px-5 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Ad Group Name</span>
        <span className="text-sm font-medium text-foreground">{adGroup.name}</span>
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Status</span>
        <StatusBadge status={adGroup.status} />
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Keyword Targeting</span>
        <span className="text-sm text-foreground">Bidded Value</span>
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Min. Bid</span>
        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">{formatCurrency(adGroup.minBid)}</span>
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Max. Bid</span>
        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">{formatCurrency(adGroup.maxBid)}</span>
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">TRoAS</span>
        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">{formatCurrency(adGroup.targetRoas)}</span>
      </div>

      <div className="flex-1" />

      <Button variant="outline" size="sm" className="gap-1.5">
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
    </div>
  );
}
