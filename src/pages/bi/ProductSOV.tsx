import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SOVChart } from "@/components/bi/SOVChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { productSOVData, sovTrendData } from "@/data/mockBrandSOV";

export default function ProductSOV() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("7days");
  const [position, setPosition] = useState("all");

  const filteredProducts = productSOVData.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Product Share of Voice</h1>
            <p className="text-sm text-muted-foreground">Track SOV performance by product</p>
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
              placeholder="Search by product name or SKU..."
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
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              <SelectItem value="1-3">Top 3</SelectItem>
              <SelectItem value="1-10">Top 10</SelectItem>
              <SelectItem value="1-20">Top 20</SelectItem>
            </SelectContent>
          </Select>
          <Button>Run</Button>
        </div>

        {/* Chart */}
        <SOVChart
          data={sovTrendData}
          title="Product SOV Trend"
          subtitle="Hourly breakdown"
        />

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="min-w-[300px]">Product</TableHead>
                <TableHead className="text-right">Avg Position</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Organic SOV</TableHead>
                <TableHead className="text-right">Sponsored SOV</TableHead>
                <TableHead className="text-right">Total SOV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-md border border-border object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground line-clamp-1">
                          {product.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{product.sku}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">#{product.position}</TableCell>
                  <TableCell className="text-right">
                    {product.impressions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{product.organicSOV.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{product.sponsoredSOV.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-medium">{product.totalSOV.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
