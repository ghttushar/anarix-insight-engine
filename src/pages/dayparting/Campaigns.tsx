import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, BarChart3, Eye } from "lucide-react";
import { dayPartingCampaigns } from "@/data/mockDayParting";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function DayPartingCampaigns() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = dayPartingCampaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Day Parting Campaigns"
          subtitle="View and manage campaigns with day parting schedules"
          actions={
            <Button onClick={() => navigate("/dayparting/scheduled/new")}>
              <Clock className="mr-2 h-4 w-4" />Create Schedule
            </Button>
          }
        />

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <DataTableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search campaigns..."
              onDownload={() => toast.success("Exporting campaigns...")}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[300px]">Campaign</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead className="text-center">Schedules</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("capitalize", campaign.status === "enabled" ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground")}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(campaign.budget)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(campaign.spend)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(campaign.revenue)}</TableCell>
                  <TableCell className="text-right">
                    <span className={cn(campaign.roas >= 3 ? "text-success" : "text-foreground")}>{campaign.roas.toFixed(2)}x</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {campaign.hasSchedule ? (
                      <Badge variant="secondary" className="gap-1"><Calendar className="h-3 w-3" />{campaign.scheduleCount}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/dayparting/campaigns/${campaign.id}`)} title="View Details"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/dayparting/hourly")} title="View Hourly Data"><BarChart3 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
