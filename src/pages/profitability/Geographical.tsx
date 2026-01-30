import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GeographyMap } from "@/components/profitability/GeographyMap";
import { RegionStatsPanel } from "@/components/profitability/RegionStatsPanel";
import { RegionalTable } from "@/components/tables/RegionalTable";
import { geographicalData } from "@/data/mockProfitability";

export default function Geographical() {
  const [selectedRegion] = useState(geographicalData[0]);
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Geographical Data</h1>
          <p className="text-sm text-muted-foreground">Regional performance breakdown</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2"><GeographyMap /></div>
          <div><RegionStatsPanel region={selectedRegion} dateRange="Jan 1 - Jan 30, 2026" /></div>
        </div>
        <RegionalTable data={geographicalData} />
      </div>
    </AppLayout>
  );
}
