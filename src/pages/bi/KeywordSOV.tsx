import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SOVChart } from "@/components/bi/SOVChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { keywordSOVData, sovTrendData } from "@/data/mockBrandSOV";
import { cn } from "@/lib/utils";

export default function KeywordSOV() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("7days");

  const filteredKeywords = keywordSOVData.filter((k) =>
    k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Keyword Share of Voice</h1>
            <p className="text-sm text-muted-foreground">Track SOV performance by keyword</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg border border-border bg-card">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button>Run</Button>
        </div>

        {/* Chart */}
        <SOVChart
          data={sovTrendData}
          title="Keyword SOV Trend"
          subtitle="Hourly breakdown"
        />

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">Search Volume</TableHead>
                <TableHead className="text-right">Organic SOV</TableHead>
                <TableHead className="text-right">Sponsored SOV</TableHead>
                <TableHead className="text-right">Total SOV</TableHead>
                <TableHead className="text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeywords.map((kw) => (
                <TableRow key={kw.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{kw.keyword}</TableCell>
                  <TableCell className="text-right">
                    {kw.searchVolume.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{kw.organicSOV.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{kw.sponsoredSOV.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-medium">{kw.totalSOV.toFixed(1)}%</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(kw.trend)}
                      <span
                        className={cn(
                          "text-sm",
                          kw.trend === "up" && "text-success",
                          kw.trend === "down" && "text-destructive",
                          kw.trend === "stable" && "text-muted-foreground"
                        )}
                      >
                        {kw.trendValue > 0 ? "+" : ""}{kw.trendValue.toFixed(1)}%
                      </span>
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
