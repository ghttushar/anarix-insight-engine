import { TableCell, TableRow } from "@/components/ui/table";
import { Campaign } from "@/types/campaign";

interface CampaignTableTotalRowProps {
  campaigns: Campaign[];
  showTotalBudget?: boolean;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function CampaignTableTotalRow({ 
  campaigns,
  showTotalBudget = true,
}: CampaignTableTotalRowProps) {
  const totals = {
    dailyBudget: campaigns.reduce((sum, c) => sum + c.dailyBudget, 0),
    totalBudget: campaigns.reduce((sum, c) => sum + (c.totalBudget || 0), 0),
    spend: campaigns.reduce((sum, c) => sum + c.spend, 0),
    sales: campaigns.reduce((sum, c) => sum + c.sales, 0),
    impressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
    clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
  };

  const derivedTotals = {
    roas: totals.spend > 0 ? totals.sales / totals.spend : 0,
    ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
    acos: totals.sales > 0 ? (totals.spend / totals.sales) * 100 : 0,
  };

  return (
    <TableRow className="bg-muted/30 font-medium">
      <TableCell colSpan={4} className="text-foreground">
        Total ({campaigns.length} campaigns)
      </TableCell>
      <TableCell className="text-right">{formatCurrency(totals.dailyBudget)}</TableCell>
      {showTotalBudget && (
        <TableCell className="text-right">{formatCurrency(totals.totalBudget)}</TableCell>
      )}
      <TableCell className="text-right">{formatCurrency(totals.spend)}</TableCell>
      <TableCell className="text-right">{formatCurrency(totals.sales)}</TableCell>
      <TableCell className="text-right">{derivedTotals.roas.toFixed(2)}</TableCell>
      <TableCell className="text-right">{formatNumber(totals.impressions)}</TableCell>
      <TableCell className="text-right">{formatNumber(totals.clicks)}</TableCell>
      <TableCell className="text-right">{formatPercent(derivedTotals.ctr)}</TableCell>
      <TableCell className="text-right">{formatPercent(derivedTotals.acos)}</TableCell>
    </TableRow>
  );
}
