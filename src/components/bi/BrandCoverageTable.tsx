import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Brand } from "@/types/bi";

interface BrandCoverageTableProps {
  brands: Brand[];
  onViewTrend?: (brandId: string) => void;
}

export function BrandCoverageTable({ brands, onViewTrend }: BrandCoverageTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-[60px]">SI No</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead className="text-right">Product Count</TableHead>
            <TableHead className="text-right">Appearance(%)</TableHead>
            <TableHead className="text-right">Organic SOV(%)</TableHead>
            <TableHead className="text-right">Sponsored SOV(%)</TableHead>
            <TableHead className="text-right">Total SOV(%)</TableHead>
            <TableHead className="text-center w-[100px]">View Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand, index) => (
            <TableRow key={brand.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell className="text-right">{brand.productCount}</TableCell>
              <TableCell className="text-right">{brand.appearance.toFixed(1)}%</TableCell>
              <TableCell className="text-right">{brand.organicSOV.toFixed(1)}%</TableCell>
              <TableCell className="text-right">{brand.sponsoredSOV.toFixed(1)}%</TableCell>
              <TableCell className="text-right font-medium">{brand.totalSOV.toFixed(1)}%</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewTrend?.(brand.id)}
                  className="h-8 text-primary hover:text-primary/80"
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
