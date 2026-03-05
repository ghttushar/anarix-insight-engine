import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { GeographyMap } from "@/components/profitability/GeographyMap";
import { RegionStatsPanel } from "@/components/profitability/RegionStatsPanel";
import { RegionalTable } from "@/components/tables/RegionalTable";
import { geographicalData } from "@/data/mockProfitability";

const regionLookup: Record<string, typeof geographicalData[0]> = {
  US: geographicalData[0],
  CA: geographicalData[0].children?.[0] || geographicalData[0],
  TX: geographicalData[0].children?.[1] || geographicalData[0],
  NY: geographicalData[0].children?.[2] || geographicalData[0],
  FL: geographicalData[0].children?.[3] || geographicalData[0],
};

export default function Geographical() {
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>("US");
  const selectedRegion = regionLookup[selectedRegionCode] || geographicalData[0];

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Geographical Data" subtitle="Regional performance breakdown across markets" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GeographyMap
              selectedRegion={selectedRegionCode}
              onRegionSelect={setSelectedRegionCode}
            />
          </div>
          <div>
            <RegionStatsPanel
              region={selectedRegion}
              dateRange="Jan 1 - Jan 30, 2026"
            />
          </div>
        </div>
        <div>
          <RegionalTable data={geographicalData} />
        </div>
      </div>
    </AppLayout>
  );
}
